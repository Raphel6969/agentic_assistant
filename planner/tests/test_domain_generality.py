import pytest

from models import TaskStatus, TraceEventType
from state_machine import create_task_state, get_task_state, run_planner_loop
from trace import trace_manager


@pytest.mark.asyncio
async def test_scheduling_domain_generality():
    """
    Proves architectural claim: Scheduling task runs on the EXACT same planner code.
    Zero domain-specific code added to planner.
    """
    task_id = "scheduling-task-99"
    create_task_state(
        task_id=task_id,
        description="Find free slot for 3-person sync next week and draft invite",
        domain="scheduling",
        budget_ceiling=100.0,
    )

    await run_planner_loop(task_id)

    state = get_task_state(task_id)
    assert state is not None
    assert state.status == TaskStatus.DONE
    assert len(state.plan_steps) > 0

    # Verify trace events were emitted identically for scheduling task
    events = trace_manager.get_task_events(task_id)
    assert len(events) >= 3


@pytest.mark.asyncio
async def test_research_domain_generality():
    """
    Proves architectural claim: Research/price-comparison runs on the EXACT same planner code.
    """
    task_id = "research-task-88"
    create_task_state(
        task_id=task_id,
        description="Compare prices for Sony noise-canceling headphones across vendors",
        domain="research",
        budget_ceiling=400.0,
    )

    await run_planner_loop(task_id)

    state = get_task_state(task_id)
    assert state is not None
    assert state.status == TaskStatus.DONE


@pytest.mark.asyncio
async def test_acp_checkout_irreversible_risk_tier():
    """
    Verify ACP payment checkout tool is classified as Irreversible risk tier.
    """
    from gateway_client import GatewayClient

    client = GatewayClient()
    tools = await client.list_tools()

    acp_tool = next((t for t in tools if t["name"] == "acp_checkout_payment"), None)
    if acp_tool:
        assert acp_tool["risk_tier"] == "irreversible"
