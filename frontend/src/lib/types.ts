/**
 * Strict TypeScript types for all trace events.
 * No `any` allowed here — this is the contract the Flight Recorder UI depends on.
 * If a new event type is added, add its literal here AND update DOCUMENTATION.md.
 */

export type TraceEventType =
  | "plan_step"
  | "tool_call"
  | "guardrail_check"
  | "human_approval"
  | "error"
  | "fallback";

export type RiskTier = "read_only" | "reversible" | "irreversible";

export type GuardrailResult = "allowed" | "blocked" | "requires_approval" | null;

export type TaskStatus = "idle" | "planning" | "running" | "done" | "failed";

export type Domain = "trip" | "scheduling" | "research" | "coding" | "general";

export interface TraceEvent {
  event_id: string;
  task_id: string;
  timestamp: string; // ISO-8601
  type: TraceEventType;
  tool: string | null;
  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;
  cost_estimate: number | null;
  latency_ms: number | null;
  confidence: number | null;
  reasoning: string | null;
  risk_tier: RiskTier | null;
  guardrail_result: GuardrailResult;
}

export interface Task {
  task_id: string;
  status: TaskStatus;
  domain: Domain;
  description: string;
  budget_ceiling: number;
  budget_spent: number;
  created_at: string;
}

export interface ToolDefinition {
  name: string;
  input_schema: Record<string, unknown>;
  output_schema: Record<string, unknown>;
  cost_estimate: number;
  risk_tier: RiskTier;
}
