import pytest

from models import TaskStatus, TraceEventType
from solver_client import SolverClient
from state_machine import create_task_state, get_task_state, run_planner_loop
from trace import trace_manager


@pytest.mark.asyncio
async def test_guardrail_budget_overrun_hard_block():
    solver = SolverClient()
    # Test checking action that exceeds budget
    resp = await solver.check_guardrail(
        task_id="overrun-task",
        action_name="confirm_booking",
        risk_tier="reversible",
        cost_estimate=200.0,
        budget_ceiling=500.0,
        budget_spent=400.0,
        input_payload={"flight_id": "FL-101"},
    )

    assert resp["result"] == "blocked"
    assert "Hard block" in resp["reason"] or "exceeds" in resp["reason"]


@pytest.mark.asyncio
async def test_guardrail_irreversible_approval_trigger():
    solver = SolverClient()
    resp = await solver.check_guardrail(
        task_id="irreversible-task",
        action_name="confirm_booking",
        risk_tier="irreversible",
        cost_estimate=100.0,
        budget_ceiling=500.0,
        budget_spent=100.0,
        input_payload={"payment_token": "acp_token_123"},
    )

    assert resp["result"] == "requires_approval"
    assert "requires explicit human approval" in resp["reason"]


@pytest.mark.asyncio
async def test_planner_stops_on_guardrail_block():
    task_id = "blocked-planner-task"
    # Create task with $10 budget ceiling
    state = create_task_state(
        task_id=task_id,
        description="Book luxury suite in Paris",
        domain="trip",
        budget_ceiling=10.0,
    )
    # Set spent to $9
    state.budget_spent = 9.0

    await run_planner_loop(task_id)

    updated = get_task_state(task_id)
    assert updated is not None
    # Planner should fail due to guardrail block on expensive tool
    assert updated.status == TaskStatus.FAILED
    assert "Guardrail" in (updated.error or "")

    # Verify guardrail check event exists in trace
    events = trace_manager.get_task_events(task_id)
    g_events = [e for e in events if e.type == TraceEventType.GUARDRAIL_CHECK]
    assert len(g_events) > 0
    assert g_events[0].guardrail_result == "blocked"
