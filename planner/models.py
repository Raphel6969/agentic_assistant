from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class RiskTier(str, Enum):
    READ_ONLY = "read_only"
    REVERSIBLE = "reversible"
    IRREVERSIBLE = "irreversible"


class GuardrailResult(str, Enum):
    ALLOWED = "allowed"
    BLOCKED = "blocked"
    REQUIRES_APPROVAL = "requires_approval"


class TaskStatus(str, Enum):
    IDLE = "idle"
    PLANNING = "planning"
    DISPATCHING = "dispatching"
    AWAITING = "awaiting"
    VERIFYING = "verifying"
    DONE = "done"
    FAILED = "failed"


class Domain(str, Enum):
    TRIP = "trip"
    SCHEDULING = "scheduling"
    RESEARCH = "research"


class TraceEventType(str, Enum):
    PLAN_STEP = "plan_step"
    TOOL_CALL = "tool_call"
    GUARDRAIL_CHECK = "guardrail_check"
    HUMAN_APPROVAL = "human_approval"
    ERROR = "error"
    FALLBACK = "fallback"


class TraceEvent(BaseModel):
    event_id: str
    task_id: str
    timestamp: str
    type: TraceEventType
    tool: Optional[str] = None
    input: Optional[Dict[str, Any]] = None
    output: Optional[Dict[str, Any]] = None
    cost_estimate: Optional[float] = 0.0
    latency_ms: Optional[int] = 0
    confidence: Optional[float] = 1.0
    reasoning: Optional[str] = None
    risk_tier: Optional[RiskTier] = RiskTier.READ_ONLY
    guardrail_result: Optional[GuardrailResult] = GuardrailResult.ALLOWED


class ToolDefinition(BaseModel):
    name: str
    description: str
    input_schema: Dict[str, Any]
    output_schema: Dict[str, Any]
    cost_estimate: float = 0.0
    risk_tier: RiskTier = RiskTier.READ_ONLY


class TaskCreateRequest(BaseModel):
    description: str
    domain: Domain = Domain.TRIP
    budget_ceiling: float = 500.0


class TaskState(BaseModel):
    task_id: str
    status: TaskStatus = TaskStatus.IDLE
    domain: Domain = Domain.TRIP
    description: str
    budget_ceiling: float = 500.0
    budget_spent: float = 0.0
    current_step: int = 0
    plan_steps: List[str] = Field(default_factory=list)
    results: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None
