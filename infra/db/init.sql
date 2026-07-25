-- Agentic Assistant — Database Init
-- Runs once when Postgres container first boots (via docker-entrypoint-initdb.d)

-- ── Trace Events ──────────────────────────────────────────────────────────────
-- Every tool call, plan step, and decision emits one row here.
-- This is both the episodic memory AND the Flight Recorder data source.
CREATE TABLE IF NOT EXISTS trace_events (
    event_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id         UUID NOT NULL,
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT now(),
    type            TEXT NOT NULL,          -- plan_step | tool_call | guardrail_check | human_approval | error | fallback
    tool            TEXT,
    input           JSONB,
    output          JSONB,
    cost_estimate   NUMERIC(10, 4),
    latency_ms      INTEGER,
    confidence      NUMERIC(4, 3),
    reasoning       TEXT,
    risk_tier       TEXT,                   -- read_only | reversible | irreversible
    guardrail_result TEXT                   -- allowed | blocked | requires_approval | null
);

CREATE INDEX IF NOT EXISTS idx_trace_task_ts ON trace_events (task_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_trace_type    ON trace_events (type);

-- ── Tasks ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
    task_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    status          TEXT NOT NULL DEFAULT 'idle',   -- idle | planning | running | done | failed
    domain          TEXT NOT NULL DEFAULT 'trip',   -- trip | scheduling | research
    description     TEXT NOT NULL,
    budget_ceiling  NUMERIC(10, 2) NOT NULL,
    budget_spent    NUMERIC(10, 2) NOT NULL DEFAULT 0,
    result          JSONB
);

-- ── User Preferences (semantic store) ────────────────────────────────────────
-- Lightweight structured JSON store — no vector DB needed at hackathon scale
CREATE TABLE IF NOT EXISTS user_preferences (
    id              SERIAL PRIMARY KEY,
    key             TEXT NOT NULL UNIQUE,
    value           JSONB NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Consent / Data-sharing Ledger (Phase 4 stretch) ─────────────────────────
CREATE TABLE IF NOT EXISTS consent_log (
    id              SERIAL PRIMARY KEY,
    task_id         UUID NOT NULL,
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT now(),
    data_shared     JSONB NOT NULL,
    vendor          TEXT NOT NULL,
    reason          TEXT NOT NULL
);
