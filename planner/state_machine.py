import asyncio
import logging
from typing import Dict, Optional, Tuple

from gateway_client import GatewayClient
from llm import generate_plan_steps, select_tool_call
from models import (
    GuardrailResult,
    RiskTier,
    TaskState,
    TaskStatus,
    TraceEventType,
)
from solver_client import SolverClient
from trace import trace_manager

logger = logging.getLogger(__name__)

# Active running tasks & pending approval signals
_active_tasks: Dict[str, TaskState] = {}
_pending_approvals: Dict[str, Tuple[asyncio.Event, Dict[str, bool]]] = {}

gateway = GatewayClient()
solver = SolverClient()


def get_task_state(task_id: str) -> Optional[TaskState]:
    return _active_tasks.get(task_id)


def create_task_state(task_id: str, description: str, domain: str = "trip", budget_ceiling: float = 500.0) -> TaskState:
    state = TaskState(
        task_id=task_id,
        status=TaskStatus.IDLE,
        domain=domain,
        description=description,
        budget_ceiling=budget_ceiling,
        budget_spent=0.0,
    )
    _active_tasks[task_id] = state
    return state


def submit_approval_decision(task_id: str, approved: bool, modified_args: Optional[Dict] = None) -> bool:
    """Submit user approval response for a pending action."""
    if task_id in _pending_approvals:
        event, result_holder = _pending_approvals[task_id]
        result_holder["approved"] = approved
        if modified_args and task_id in _active_tasks and _active_tasks[task_id].pending_action:
            _active_tasks[task_id].pending_action["arguments"] = modified_args
        event.set()
        return True
    return False


async def run_planner_loop(task_id: str):
    """
    Main explicit state machine execution loop:
    IDLE -> PLANNING -> DISPATCHING -> GUARDRAIL -> (AWAITING_APPROVAL) -> AWAITING -> VERIFYING -> DONE / FAILED
    """
    state = get_task_state(task_id)
    if not state:
        logger.error(f"Task state {task_id} not found")
        return

    try:
        # 1. State: PLANNING
        state.status = TaskStatus.PLANNING
        trace_manager.create_event(
            task_id=task_id,
            event_type=TraceEventType.PLAN_STEP,
            reasoning=f"Initializing planner for task: '{state.description}' (Budget: ${state.budget_ceiling:.2f})",
            risk_tier=RiskTier.READ_ONLY,
            guardrail_result=GuardrailResult.ALLOWED,
        )

        available_tools = await gateway.list_tools()
        steps = await generate_plan_steps(
            task_description=state.description,
            domain=state.domain,
            tools=available_tools,
            budget_ceiling=state.budget_ceiling,
        )
        state.plan_steps = steps

        trace_manager.create_event(
            task_id=task_id,
            event_type=TraceEventType.PLAN_STEP,
            output_data={"plan_steps": steps, "tools_count": len(available_tools)},
            reasoning=f"Decomposed task into {len(steps)} sub-task steps.",
            confidence=0.95,
        )

        # 2. Iterate through plan steps
        for step_idx, step_desc in enumerate(steps, 1):
            state.current_step = step_idx
            state.status = TaskStatus.DISPATCHING

            trace_manager.create_event(
                task_id=task_id,
                event_type=TraceEventType.PLAN_STEP,
                reasoning=f"Step {step_idx}/{len(steps)}: {step_desc}",
                input_data={"step": step_desc, "step_index": step_idx},
            )

            # Select tool call
            tool_selection = await select_tool_call(
                step_description=step_desc,
                available_tools=available_tools,
                budget_remaining=state.budget_ceiling - state.budget_spent,
            )

            if not tool_selection:
                logger.warning(f"No suitable tool found for step: {step_desc}")
                trace_manager.create_event(
                    task_id=task_id,
                    event_type=TraceEventType.ERROR,
                    reasoning=f"No tool selected for step '{step_desc}'. Continuing next step.",
                )
                continue

            tool_name = tool_selection["tool"]
            tool_args = tool_selection.get("arguments", {})
            reasoning = tool_selection.get("reasoning", f"Selected tool '{tool_name}' for step '{step_desc}'")

            # Determine tool risk tier and cost estimate
            tool_def = next((t for t in available_tools if t["name"] == tool_name), None)
            risk_tier = tool_def.get("risk_tier", RiskTier.READ_ONLY) if tool_def else RiskTier.READ_ONLY
            cost_est = tool_def.get("cost_estimate", 0.0) if tool_def else 0.0

            # 3. GUARDRAIL CHECK (Rust Solver)
            guardrail_resp = await solver.check_guardrail(
                task_id=task_id,
                action_name=tool_name,
                risk_tier=risk_tier,
                cost_estimate=cost_est,
                budget_ceiling=state.budget_ceiling,
                budget_spent=state.budget_spent,
                input_payload=tool_args,
            )

            g_result = guardrail_resp.get("result", "allowed")
            g_reason = guardrail_resp.get("reason", "Passed policy check")

            trace_manager.create_event(
                task_id=task_id,
                event_type=TraceEventType.GUARDRAIL_CHECK,
                tool=tool_name,
                input_data=tool_args,
                cost_estimate=cost_est,
                reasoning=f"Guardrail Check: {g_reason}",
                risk_tier=RiskTier(risk_tier) if risk_tier in RiskTier.__members__.values() else RiskTier.READ_ONLY,
                guardrail_result=GuardrailResult(g_result) if g_result in GuardrailResult.__members__.values() else GuardrailResult.ALLOWED,
            )

            if g_result == "blocked":
                logger.error(f"Guardrail blocked tool {tool_name}: {g_reason}")
                state.status = TaskStatus.FAILED
                state.error = f"Guardrail hard block: {g_reason}"
                trace_manager.create_event(
                    task_id=task_id,
                    event_type=TraceEventType.ERROR,
                    tool=tool_name,
                    reasoning=f"Execution halted by Guardrail Policy Engine: {g_reason}",
                    guardrail_result=GuardrailResult.BLOCKED,
                )
                return

            if g_result == "requires_approval":
                state.status = TaskStatus.AWAITING_APPROVAL
                state.pending_action = {
                    "tool": tool_name,
                    "arguments": tool_args,
                    "cost_estimate": cost_est,
                    "reasoning": reasoning,
                }

                trace_manager.create_event(
                    task_id=task_id,
                    event_type=TraceEventType.HUMAN_APPROVAL,
                    tool=tool_name,
                    input_data=tool_args,
                    cost_estimate=cost_est,
                    reasoning=f"Action '{tool_name}' is tier Irreversible and requires explicit human approval.",
                    risk_tier=RiskTier.IRREVERSIBLE,
                    guardrail_result=GuardrailResult.REQUIRES_APPROVAL,
                )

                # Setup approval event
                approval_event = asyncio.Event()
                result_holder = {"approved": False}
                _pending_approvals[task_id] = (approval_event, result_holder)

                try:
                    # Wait up to 60 seconds for user response via POST /tasks/{task_id}/approval
                    await asyncio.wait_for(approval_event.wait(), timeout=60.0)
                except asyncio.TimeoutError:
                    logger.warning(f"Task {task_id} approval timed out. Assuming rejected.")
                    result_holder["approved"] = False
                finally:
                    _pending_approvals.pop(task_id, None)

                if not result_holder["approved"]:
                    state.status = TaskStatus.FAILED
                    state.error = f"Human Approval Rejected: Action '{tool_name}' was rejected by user."
                    trace_manager.create_event(
                        task_id=task_id,
                        event_type=TraceEventType.ERROR,
                        tool=tool_name,
                        reasoning=f"Action '{tool_name}' rejected by human operator.",
                        guardrail_result=GuardrailResult.BLOCKED,
                    )
                    return

                # If user modified arguments in approval modal
                if state.pending_action and "arguments" in state.pending_action:
                    tool_args = state.pending_action["arguments"]

                state.pending_action = None

            # 4. State: AWAITING (Invoke Tool via Gateway)
            state.status = TaskStatus.AWAITING
            invoke_resp = await gateway.invoke_tool(
                tool_name=tool_name,
                task_id=task_id,
                tool_input=tool_args,
            )

            latency = invoke_resp.get("latency_ms", 0)
            cost_actual = invoke_resp.get("cost_actual", cost_est)
            output = invoke_resp.get("output", {})
            err_msg = invoke_resp.get("error")

            state.budget_spent += cost_actual

            if err_msg:
                trace_manager.create_event(
                    task_id=task_id,
                    event_type=TraceEventType.ERROR,
                    tool=tool_name,
                    input_data=tool_args,
                    latency_ms=latency,
                    reasoning=f"Tool invocation error: {err_msg}",
                )
            else:
                state.results[tool_name] = output
                # 5. State: VERIFYING
                state.status = TaskStatus.VERIFYING
                trace_manager.create_event(
                    task_id=task_id,
                    event_type=TraceEventType.TOOL_CALL,
                    tool=tool_name,
                    input_data=tool_args,
                    output_data=output,
                    cost_estimate=cost_actual,
                    latency_ms=latency,
                    reasoning=reasoning,
                    confidence=0.92,
                    risk_tier=RiskTier(risk_tier) if risk_tier in RiskTier.__members__.values() else RiskTier.READ_ONLY,
                    guardrail_result=GuardrailResult.ALLOWED,
                )

            await asyncio.sleep(0.3)

        # 6. State: DONE
        state.status = TaskStatus.DONE
        from llm import synthesize_friendly_response
        friendly_summary = await synthesize_friendly_response(
            task_description=state.description,
            results=state.results,
            budget_spent=state.budget_spent,
            budget_ceiling=state.budget_ceiling,
        )

        trace_manager.create_event(
            task_id=task_id,
            event_type=TraceEventType.PLAN_STEP,
            output_data={"summary": state.results, "total_spent": state.budget_spent, "friendly_summary": friendly_summary},
            reasoning=friendly_summary,
            confidence=1.0,
        )

    except Exception as e:
        logger.exception(f"Error in planner loop for task {task_id}: {e}")
        state.status = TaskStatus.FAILED
        state.error = str(e)
        trace_manager.create_event(
            task_id=task_id,
            event_type=TraceEventType.ERROR,
            reasoning=f"Unhandled exception in planner loop: {e}",
        )
