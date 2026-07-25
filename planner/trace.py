import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Dict, List, Optional, Set
import uuid
from fastapi import WebSocket

from models import GuardrailResult, RiskTier, TraceEvent, TraceEventType

logger = logging.getLogger(__name__)


class TraceManager:
    """
    Manages trace event creation, memory persistence, and WebSocket broadcasting.
    Every step/tool-call emits an event conforming to DOCUMENTATION.md §Trace Event Schema.
    """

    def __init__(self):
        self._events_by_task: Dict[str, List[TraceEvent]] = {}
        self._websockets_by_task: Dict[str, Set[WebSocket]] = {}
        self._global_websockets: Set[WebSocket] = set()

    def create_event(
        self,
        task_id: str,
        event_type: TraceEventType,
        tool: Optional[str] = None,
        input_data: Optional[Dict] = None,
        output_data: Optional[Dict] = None,
        cost_estimate: float = 0.0,
        latency_ms: int = 0,
        confidence: float = 1.0,
        reasoning: Optional[str] = None,
        risk_tier: Optional[RiskTier] = RiskTier.READ_ONLY,
        guardrail_result: Optional[GuardrailResult] = GuardrailResult.ALLOWED,
    ) -> TraceEvent:
        event = TraceEvent(
            event_id=str(uuid.uuid4()),
            task_id=task_id,
            timestamp=datetime.now(timezone.utc).isoformat(),
            type=event_type,
            tool=tool,
            input=input_data,
            output=output_data,
            cost_estimate=cost_estimate,
            latency_ms=latency_ms,
            confidence=confidence,
            reasoning=reasoning,
            risk_tier=risk_tier,
            guardrail_result=guardrail_result,
        )

        if task_id not in self._events_by_task:
            self._events_by_task[task_id] = []
        self._events_by_task[task_id].append(event)

        # Broadcast event asynchronously & persist to DB
        asyncio.create_task(self.broadcast(event))
        try:
            from db import save_trace_event_db
            asyncio.create_task(save_trace_event_db(event))
        except Exception:
            pass
        return event

    def get_task_events(self, task_id: str) -> List[TraceEvent]:
        return self._events_by_task.get(task_id, [])

    async def register_websocket(self, websocket: WebSocket, task_id: Optional[str] = None):
        await websocket.accept()
        if task_id:
            if task_id not in self._websockets_by_task:
                self._websockets_by_task[task_id] = set()
            self._websockets_by_task[task_id].add(websocket)
            # Replay existing events for this task
            for event in self.get_task_events(task_id):
                await websocket.send_text(event.model_dump_json())
        else:
            self._global_websockets.add(websocket)

    def unregister_websocket(self, websocket: WebSocket, task_id: Optional[str] = None):
        if task_id and task_id in self._websockets_by_task:
            self._websockets_by_task[task_id].discard(websocket)
        self._global_websockets.discard(websocket)

    async def broadcast(self, event: TraceEvent):
        json_data = event.model_dump_json()

        # Send to specific task listeners
        task_ws = self._websockets_by_task.get(event.task_id, set())
        for ws in list(task_ws):
            try:
                await ws.send_text(json_data)
            except Exception as e:
                logger.warning(f"Error broadcasting to task websocket: {e}")
                task_ws.discard(ws)

        # Send to global listeners
        for ws in list(self._global_websockets):
            try:
                await ws.send_text(json_data)
            except Exception as e:
                logger.warning(f"Error broadcasting to global websocket: {e}")
                self._global_websockets.discard(ws)


trace_manager = TraceManager()
