"""
Agentic Assistant — Planner Service
FastAPI entry point with explicit state machine execution and live WebSocket trace streaming.
"""

import asyncio
import uuid
import logging
from typing import Dict, List

from fastapi import FastAPI, BackgroundTasks, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import TaskCreateRequest, TaskState
from state_machine import create_task_state, get_task_state, run_planner_loop
from trace import trace_manager

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("planner")

app = FastAPI(
    title="Agentic Assistant — Planner",
    version="0.1.0",
    description="Planner/executor state machine + LLM tool-calling service.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict:
    """Health check endpoint."""
    return {"status": "ok", "service": "planner", "phase": "1-core-loop"}


@app.post("/tasks")
async def create_task(req: TaskCreateRequest, background_tasks: BackgroundTasks) -> dict:
    """
    Create a new autonomous task and launch state machine planner loop in background.
    """
    task_id = str(uuid.uuid4())
    state = create_task_state(
        task_id=task_id,
        description=req.description,
        domain=req.domain,
        budget_ceiling=req.budget_ceiling,
    )

    # Launch background state machine execution
    background_tasks.add_task(run_planner_loop, task_id)

    return {
        "task_id": task_id,
        "status": state.status,
        "description": state.description,
        "budget_ceiling": state.budget_ceiling,
        "message": "Task initialized and planner loop started.",
    }


@app.get("/tasks/{task_id}")
async def get_task(task_id: str) -> dict:
    """Get current status and budget of a task."""
    state = get_task_state(task_id)
    if not state:
        raise HTTPException(status_code=404, detail="Task not found")
    return state.model_dump()


@app.get("/tasks/{task_id}/trace")
async def get_trace(task_id: str) -> List[dict]:
    """Return historical trace events for a task."""
    events = trace_manager.get_task_events(task_id)
    return [e.model_dump() for e in events]


@app.websocket("/ws/tasks/{task_id}/trace")
async def task_trace_websocket(websocket: WebSocket, task_id: str):
    """
    WebSocket endpoint for real-time live trace event streaming to Flight Recorder UI.
    """
    await trace_manager.register_websocket(websocket, task_id=task_id)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        trace_manager.unregister_websocket(websocket, task_id=task_id)
    except Exception as e:
        logger.warning(f"WebSocket error for task {task_id}: {e}")
        trace_manager.unregister_websocket(websocket, task_id=task_id)
