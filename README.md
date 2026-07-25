# Agentic Assistant

> An autonomous personal assistant agent that decomposes high-level instructions into sub-tasks, orchestrates tools across 3 domains (Trip Planning, Scheduling, Price Research), and executes with a replayable decision trace and a mechanically enforced policy engine that can't be talked out of your budget.

---

## Technical Highlights & Differentiators

Most agent demos are single-domain wrappers around an LLM. This project proves three core claims:

1. **A Replayable Decision Trace (Flight Recorder)** — Every planning step, tool call (input/output/latency/cost), guardrail decision, and confidence score is logged and rendered live via WebSockets.
2. **Mechanically Enforced Policy Engine (Rust Core)** — Budget ceiling rules and permission tiers (`read_only`, `reversible`, `irreversible`) are checked by a separate Rust service before execution. A model mistake or jailbreak prompt cannot breach the budget ceiling.
3. **Genuine Domain Generality** — The exact same Python planner state machine executes Trip Planning, Scheduling/Coordination, and Price Research tasks with **zero domain-specific code added to the planner** — only new registered Go Gateway tools.

---

## Real vs. Mocked Integrations

| Feature | Type | Source / Protocol |
|---|---|---|
| **Destination Weather** | Real Live REST API | [Open-Meteo REST API](https://open-meteo.com) (zero auth) |
| **Public Holidays** | Real Live REST API | [Nager.Date REST API](https://date.nager.at) (zero auth) |
| **Currency Exchange** | Real Live REST API | [Frankfurter REST API](https://frankfurter.app) (zero auth) |
| **Merchant Checkout** | ACP Standard Simulation | Agentic Commerce Protocol (`Checkout` object + `SharedPaymentToken`) |
| **Flight & Hotel Search** | Seeded Deterministic Mock | Seeded reproducible data for demo reliability |

---

## Quick Start

### 1. Environment Setup
```bash
cp .env.example .env
# Fill in GROQ_API_KEY (from https://console.groq.com) or OPENROUTER_API_KEY
```

### 2. Boot All Services via Docker
```bash
docker compose up
```

Open `http://localhost:3000` to access the Flight Recorder UI.

### 3. Ports Map

| Service | Language / Stack | Port | Endpoint |
|---|---|---|---|
| **Frontend** | Next.js 14 / React 18 | `3000` | `http://localhost:3000` |
| **Planner** | Python / FastAPI | `8000` | `http://localhost:8000` |
| **Gateway** | Go 1.23 | `8080` | `http://localhost:8080` |
| **Solver** | Rust 1.79 / Axum | `8090` | `http://localhost:8090` |
| **Database** | Postgres 16 | `5432` | `postgresql://postgres:postgres@localhost:5432/agent` |

---

## Live Failure-Injection & Resilience Demo

To demonstrate real-time fault recovery during judging:

```bash
# Trigger failure mode on primary flight search API
curl -X POST http://localhost:8080/debug/fail-tool -H "Content-Type: application/json" -d '{"tool": "search_flights", "fail": true}'
```

Watch the Flight Recorder UI:
1. Primary `search_flights` tool retries 3 times with exponential backoff.
2. Gateway trips the Circuit Breaker for `search_flights`.
3. Gateway automatically invokes the registered Fallback Tool (`fallback_flight_cache`).
4. Trace node marks `fallback_used: true` and continues execution without crashing!

---

## Testing

```bash
# Python Planner Tests
cd planner && pytest

# Go Gateway Tests
cd gateway && go test ./...

# Rust Solver Tests
cd solver && cargo test

# Frontend TypeScript Type Check
cd frontend && npm run type-check
```

---

## Architecture Diagram

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for data flow and trace schemas, [PHASES.md](docs/PHASES.md) for phase history, and [DECISIONS.md](DECISIONS.md) for architectural decision records.
