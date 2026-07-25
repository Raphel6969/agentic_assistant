"""Phase 0 planner smoke test — verifies the app boots and health endpoint returns 200."""

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health() -> None:
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_create_task_returns_task_id() -> None:
    resp = client.post("/tasks", json={"description": "test task", "budget": 100})
    assert resp.status_code == 200
    data = resp.json()
    assert "task_id" in data
