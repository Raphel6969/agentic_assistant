import pytest
from fastapi.testclient import TestClient

from main import app
from models import TaskStatus
from state_machine import create_task_state, get_task_state, run_planner_loop

client = TestClient(app)


def test_health():
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_state_machine_execution():
    task_id = "test-task-123"
    state = create_task_state(
        task_id=task_id,
        description="Find cheapest flight from BOM to CDG",
        domain="trip",
        budget_ceiling=600.0,
    )

    assert state.status == TaskStatus.IDLE

    # Run state machine loop directly
    await run_planner_loop(task_id)

    updated_state = get_task_state(task_id)
    assert updated_state is not None
    assert updated_state.status == TaskStatus.DONE
    assert len(updated_state.plan_steps) > 0
    assert updated_state.budget_spent <= 600.0
