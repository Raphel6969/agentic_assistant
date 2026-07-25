# AGENTS.md

Instructions for AI coding agents (Claude Code, Cursor, or any assistant working in this
repo) and a fast-orientation doc for any human joining mid-hackathon. Read this before
touching code.

## What this project is
[One-line pitch — fill in]. A general-purpose autonomous assistant agent that decomposes a
high-level instruction into sub-tasks, orchestrates tools across domains (trip planning,
scheduling, research/comparison), and executes with a visible decision trace and a
mechanically enforced policy layer. See `ARCHITECTURE.md` for the full system diagram.

## Stack & directory layout
```
frontend/   Next.js — chat UI, Flight Recorder trace timeline, approval modals
planner/    Python/FastAPI — planner/executor state machine, LLM tool-calling
gateway/    Go — tool fan-out, MCP server exposing tools, retry/circuit-breaker
solver/     Rust — policy/guardrail engine, multi-objective ranking/constraint solver
infra/      docker-compose.yml, GitHub Actions workflows
*.md        AGENTS.md, PHASES.md, RULES.md, DOCUMENTATION.md, CONTRIBUTING.md,
            ARCHITECTURE.md, DEMO_SCRIPT.md
```

## Running things
```bash
docker compose up              # all services + Postgres
cd planner && uvicorn main:app --reload --port 8000
cd gateway && go run ./cmd/gateway
cd solver  && cargo run
cd frontend && npm run dev
```

## Testing
```bash
cd planner && pytest
cd gateway && go test ./...
cd solver  && cargo test
cd frontend && npm test
```
No PR merges without the relevant service's tests passing — see `RULES.md`.

## Conventions an agent (AI or human) must follow in this repo

- **Contract-first.** Never change a service's exposed API/schema without updating its
  OpenAPI/JSON-schema stub first and flagging it — the other side's owner is building
  against that contract in parallel.
- **New domain = new tool, never new planner logic.** Adding a capability (e.g. a
  scheduling task) means registering a new tool in `gateway/tools/` against the existing
  interface (name, input/output schema, cost estimate, risk tier). If you find yourself
  adding an `if domain == "travel"` branch inside `planner/`, stop — that breaks the
  core architectural claim of this project. See `ARCHITECTURE.md §Tool Registry`.
- **Never bypass the guardrail.** Every code path in `planner/` that results in an
  action being executed must call `solver`'s policy check first and honor its verdict.
  This is not optional and not something to "fix later" — it's the product's central
  differentiator. See `RULES.md §Agent Operating Rules`.
- **Every tool call emits a trace event.** Schema and required fields are in
  `DOCUMENTATION.md §Trace Event Schema`. If a tool call doesn't produce a trace event,
  the Flight Recorder UI has nothing to show — treat a missing trace event as a bug,
  not a cosmetic gap.
- **Conventional Commits** (`feat:`, `fix:`, `chore:`, `docs:`, `test:`) — see
  `CONTRIBUTING.md`.

## Explicitly do not

- Hardcode budget ceilings, API keys, or mock payment tokens in application code —
  configuration only, via `.env` (see `.env.example`).
- Add a fourth backend language. Four is already a lot for 24 hours.
- Import a heavy orchestration framework (LangGraph/CrewAI/AutoGen) mid-hackathon — the
  planner is a hand-rolled state machine on purpose (see `ARCHITECTURE.md` for why).
- Silently swallow a tool failure. Every failure either retries, falls back, or
  surfaces a human-approval prompt — never a hallucinated "success."

## Where to look for X

| Question | File |
|---|---|
| What's done, in progress, blocked, right now | `PHASES.md` |
| Why did we decide X instead of Y | `PHASES.md` cut-list / commit history |
| What are the hard rules the agent obeys | `RULES.md` |
| System diagram, component responsibilities, data flow | `ARCHITECTURE.md` |
| How to set up locally and submit a PR | `CONTRIBUTING.md` |
| What every doc in this repo is for | `DOCUMENTATION.md` |
| The actual demo run-of-show | `DEMO_SCRIPT.md` |
