-- Database schema for Maestro Platform (PostgreSQL)

CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_sessions (
    session_id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    domain VARCHAR(64) DEFAULT 'trip',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trace_events (
    event_id VARCHAR(64) PRIMARY KEY,
    task_id VARCHAR(64) NOT NULL,
    session_id VARCHAR(64),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(32) NOT NULL,
    tool VARCHAR(64),
    input JSONB,
    output JSONB,
    cost_estimate NUMERIC(10, 4) DEFAULT 0.0,
    latency_ms INT DEFAULT 0,
    confidence NUMERIC(3, 2) DEFAULT 1.0,
    reasoning TEXT,
    risk_tier VARCHAR(16) DEFAULT 'read_only',
    guardrail_result VARCHAR(32) DEFAULT 'allowed'
);

CREATE INDEX IF NOT EXISTS idx_trace_events_task_id ON trace_events(task_id);
CREATE INDEX IF NOT EXISTS idx_trace_events_timestamp ON trace_events(timestamp);

CREATE TABLE IF NOT EXISTS tasks (
    task_id VARCHAR(64) PRIMARY KEY,
    session_id VARCHAR(64),
    user_id VARCHAR(64),
    domain VARCHAR(64) NOT NULL,
    status VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    budget_ceiling NUMERIC(10, 2) NOT NULL,
    budget_spent NUMERIC(10, 2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
    user_id VARCHAR(64) PRIMARY KEY,
    preferences JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consent_log (
    consent_id VARCHAR(64) PRIMARY KEY,
    task_id VARCHAR(64) NOT NULL,
    tool VARCHAR(64) NOT NULL,
    params JSONB NOT NULL,
    action VARCHAR(16) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
