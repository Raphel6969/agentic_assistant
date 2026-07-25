# PHASES.md — Live Execution Plan & Status

**This file is edited throughout the hackathon, not written once.** Update it at every
checkpoint gate. If you're stuck deciding whether to proceed, cut scope, or reorder,
this is the file to bring back for a second opinion.

Last updated: `<timestamp>` by `<name>`

---

## Phase 0 — Scaffold (Hour 0–1)
**Goal:** repo, Docker Compose skeleton, CI shell, contract stubs, docs skeleton.
**Checkpoint:** all four services boot empty and talk over stub endpoints.

- [x] Repo initialized, remote connected to `Raphel6969/agentic_assistant`, PR template added
- [x] `docker-compose.yml` with frontend/planner/gateway/solver/postgres, all boot with health checks
- [x] GitHub Actions: lint+test per language (Python/Go/Rust/Next.js) on PR, docker build check
- [x] OpenAPI stub (`planner/contracts/gateway_openapi.yaml`) + JSON schema (`planner/contracts/solver_schema.json`)
- [x] All doc skeletons exist; `DECISIONS.md` created with 4 ADRs; `.env.example` with all keys

Status: **DONE**
Approach: Docker Compose with health checks + depends_on ordering, CI matrix jobs per language, contract-first stubs before any implementation, `DECISIONS.md` created upfront so ADRs are ready for judge questions.
Blockers: None.

---

## Phase 1 — Core loop (Hour 1–4)
**Goal:** one working end-to-end request on the trip domain.
**Checkpoint:** "find cheapest flight" completes end-to-end; UI connected to live WebSocket trace.

- [x] Python planner: explicit state machine (plan → dispatch → verify → replan-or-continue)
- [x] 2–3 mocked tools wired (deterministic seeded flight/hotel data + 1 real Open-Meteo REST weather API)
- [x] Go gateway: fan-out to tool APIs, tool registry interface, tool invocation endpoint
- [x] Next.js chat UI & Flight Recorder timeline connected to Python planner via WebSocket trace stream

Status: **DONE**
Approach notes: Hand-rolled state machine in FastAPI (`planner/state_machine.py`), LLM client with Groq/OpenRouter & heuristic fallbacks (`planner/llm.py`), Go gateway tool registry with 3 tools (`gateway/tools/`), Next.js 14 glassmorphism Flight Recorder timeline UI with live WS stream (`frontend/src/hooks/useTraceStream.ts`).
Blockers: None.

---

## Phase 2 — Determinism layer (Hour 4–9)
**Goal:** the guardrail and solver actually enforce something, not just log it.
**Checkpoint:** agent physically cannot exceed the declared budget; a forced tool failure gets retried, circuit-broken, and logged.

- [x] Rust policy engine: budget ceiling + permission-tier enforcement (see `RULES.md`)
- [x] Rust ranking/constraint solver wired into the planner's tool selection (`solver/src/ranking.rs`)
- [x] Episodic trace logging to Postgres (`planner/db.py` & `infra/db/init.sql`)
- [x] Retry + circuit breaker in Go gateway, with fallback tool substitution (`gateway/middleware/circuit_breaker.go`)

Status: **DONE**
Approach notes: Rust policy engine (`solver/src/policy.rs`) with budget ceiling hard blocks & irreversible approval gating; Rust multi-objective constraint ranking solver (`solver/src/ranking.rs`); Go circuit breaker middleware with exponential backoff & fallback tool substitution (`gateway/middleware/`); async Postgres persistence layer (`planner/db.py`).
Blockers: None.

---

## Phase 3 — Legibility layer (Hour 9–14)
**Goal:** a judge unfamiliar with the code can watch the trace and understand it.
**Checkpoint:** trace UI is clickable/scrubbable and self-explanatory.

- [x] Flight Recorder timeline UI (plan → tool calls → costs → decisions → confidence)
- [x] Human-in-the-loop approval modal for irreversible/high-risk actions (`frontend/src/components/modals/ApprovalModal.tsx`)
- [x] Structured clarification/elicitation flow (only asks when a decision truly branches)
- [x] Rust solver multi-objective constraint slider (`frontend/src/components/solver/ConstraintSlider.tsx`)

Status: **DONE**
Approach notes: Flight Recorder timeline UI with live WS stream; Human-in-the-loop approval modal with spring physics animation and parameter edit support (`ApprovalModal.tsx`); Rust solver multi-objective constraint optimization slider (`ConstraintSlider.tsx`); async approval signal waiting in Python planner state machine (`POST /tasks/{task_id}/approval`).
Blockers: None.

---

## Phase 4 — Differentiators + second/third domain (Hour 14–18)
**Goal:** prove generality; layer on the standout features.
**Checkpoint:** each item demoable in isolation.

- [x] Scheduling/coordination task registered as new gateway tools (`check_calendar_availability` + Nager.Date REST API public holidays) — **zero new planner logic**
- [x] Price-comparison/research task as a third domain (`search_product_prices` + Frankfurter REST API live currency exchange)
- [x] ACP-style simulated checkout (`acp_checkout_payment` tool + `Checkout` object + `SharedPaymentToken` pattern)
- [x] Consent/data-sharing ledger (`consent_log` table in Postgres + audit trail)

Status: **DONE**
Approach notes: Registered Domain 2 (Scheduling: `check_calendar_availability`, `draft_invite`, `send_invite`) and Domain 3 (Research: `search_product_prices`, `summarize_tradeoffs`) tools in Go gateway (`gateway/tools/`). Integrated Nager.Date REST API for live public holidays & Frankfurter REST API for currency rates. ACP-standard payment checkout producing `Checkout` objects with scoped `SharedPaymentToken`s (`acp_spt_...`). Proved domain generality by running all 3 domain tasks over the exact same planner FSM without modifying planner code.
Blockers: None.

---

## Phase 5 — Hardening (Hour 18–21)
**Goal:** prove it wasn't a one-shot demo.
**Checkpoint:** `PHASES.md` fully updated; failure demo rehearsed twice.

- [ ] Unit tests: state machine transitions, guardrail enforcement, retry logic (target 15–20+)
- [ ] Scripted failure-injection scenario for the live demo, rehearsed
- [ ] All docs in this repo reflect actual current state (not the plan — what's real)

Status: **NOT STARTED**
Approach notes:
Blockers:

---

## Phase 6 — Storytelling (Hour 21–23)
**Goal:** pitch deck, demo video, dry run.
**Checkpoint:** full run-through under time, video exported.

- [ ] Pitch deck (see `DEMO_SCRIPT.md` for slide-by-slide)
- [ ] Demo video recorded per `DEMO_SCRIPT.md`
- [ ] Live pitch rehearsed at least twice, under time

Status: **NOT STARTED**
Approach notes:
Blockers:

---

## Phase 7 — Buffer / submit (Hour 23–24)
- [ ] Bug triage on anything demo-breaking
- [ ] `README.md` final pass — someone who's never seen this should be able to run it
- [ ] Submission uploaded with time to spare

Status: **NOT STARTED**

---

## Cut list — if time runs short, drop in this order

1. Agent-to-agent micro-negotiation (never in scope unless everything else is done early)
2. Mid-run interruption / live correction
3. Third demo domain (price-comparison/research) — keep only scheduling as domain #2
4. Consent/data-sharing ledger
5. ACP-style checkout — fall back to a plain, clearly-labeled "simulated booking" stub
6. Cost/token budget guardrail — keep the budget guardrail on the *user's* money, drop
   the meta one on the agent's own spend

**Never cut:** the Rust guardrail enforcement, the trace UI, and the domain-generality
proof. Those three are the actual thesis of the project — see `PHASES.md`'s sibling
strategy doc for why.
