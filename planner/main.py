"""
Agentic Assistant — Planner Service
FastAPI entry point. Phase 0 scaffold: stubs boot and return 200s.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="Agentic Assistant — Planner",
    version="0.1.0",
    description="Planner/executor state machine + LLM tool-calling service.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict:
    """Health check — used by Docker Compose depends_on and CI."""
    return {"status": "ok", "service": "planner", "phase": "0-scaffold"}


@app.post("/tasks")
async def create_task(body: dict) -> dict:
    """
    Phase 1: Create a new task and start the planning loop.
    Stub: returns task_id immediately, planning is not yet wired.
    """
    import uuid
    task_id = str(uuid.uuid4())
    return {
        "task_id": task_id,
        "status": "idle",
        "message": "Task received — planner loop not yet wired (Phase 1)",
    }


@app.get("/tasks/{task_id}")
async def get_task(task_id: str) -> dict:
    """Phase 1: Get task status. Stub until DB is wired."""
    return {"task_id": task_id, "status": "idle"}


@app.get("/tasks/{task_id}/trace")
async def get_trace(task_id: str) -> dict:
    """Phase 2: Return trace events for a task. Stub until trace log is wired."""
    return {"task_id": task_id, "events": []}
