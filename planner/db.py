import os
import json
import logging
from typing import List, Optional
import asyncpg

from models import TraceEvent, TaskState

logger = logging.getLogger(__name__)

POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:postgres@localhost:5432/agent")
_pool: Optional[asyncpg.Pool] = None


async def get_db_pool() -> Optional[asyncpg.Pool]:
    global _pool
    if _pool is not None:
        return _pool

    try:
        _pool = await asyncpg.create_pool(POSTGRES_URL, min_size=1, max_size=10, timeout=3.0)
        logger.info(f"Connected to Postgres pool ({POSTGRES_URL})")
        return _pool
    except Exception as e:
        logger.warning(f"Postgres connection unavailable ({e}). Operating in in-memory mode.")
        return None


async def save_trace_event_db(event: TraceEvent):
    """Save trace event into Postgres trace_events table if DB pool is available."""
    pool = await get_db_pool()
    if not pool:
        return

    try:
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO trace_events (
                    event_id, task_id, timestamp, type, tool, input, output,
                    cost_estimate, latency_ms, confidence, reasoning, risk_tier, guardrail_result
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                ON CONFLICT (event_id) DO NOTHING
                """,
                event.event_id,
                event.task_id,
                event.timestamp,
                event.type.value if hasattr(event.type, "value") else str(event.type),
                event.tool,
                json.dumps(event.input) if event.input else None,
                json.dumps(event.output) if event.output else None,
                event.cost_estimate,
                event.latency_ms,
                event.confidence,
                event.reasoning,
                event.risk_tier.value if event.risk_tier and hasattr(event.risk_tier, "value") else str(event.risk_tier or ""),
                event.guardrail_result.value if event.guardrail_result and hasattr(event.guardrail_result, "value") else str(event.guardrail_result or ""),
            )
    except Exception as e:
        logger.error(f"Failed to persist trace event {event.event_id} to DB: {e}")


async def save_task_db(task: TaskState):
    """Save/update task state into Postgres tasks table."""
    pool = await get_db_pool()
    if not pool:
        return

    try:
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO tasks (
                    task_id, status, domain, description, budget_ceiling, budget_spent, result
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (task_id) DO UPDATE SET
                    status = EXCLUDED.status,
                    budget_spent = EXCLUDED.budget_spent,
                    result = EXCLUDED.result,
                    updated_at = now()
                """,
                task.task_id,
                task.status.value if hasattr(task.status, "value") else str(task.status),
                task.domain.value if hasattr(task.domain, "value") else str(task.domain),
                task.description,
                task.budget_ceiling,
                task.budget_spent,
                json.dumps(task.results) if task.results else None,
            )
    except Exception as e:
        logger.error(f"Failed to persist task {task.task_id} to DB: {e}")
