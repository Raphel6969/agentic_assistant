# ARCHITECTURE.md

## System diagram

```
                         ┌─────────────────────────┐
                         │   Next.js Frontend       │
                         │  - Chat / task input     │
                         │  - Flight Recorder UI    │
                         │  - Approval modals       │
                         └────────────┬─────────────┘
                                      │ REST/WS
                         ┌────────────▼─────────────┐
                         │  Python (FastAPI)         │
                         │  Planner / Executor loop  │
                         │  - Task decomposition     │
                         │  - LLM tool-calling       │
                         │  - Explicit state machine │
                         └──────┬─────────────┬──────┘
                                │             │
                 ┌──────────────▼───┐   ┌─────▼─────────────┐
                 │  Go Tool Gateway  │   │  Rust Core          │
                 │  - Fan-out to N   │   │  - Policy/guardrail │
                 │    tool APIs      │   │    enforcement      │
                 │    concurrently   │   │  - Constraint solver│
                 │  - MCP server     │   │    / ranking engine │
                 │    for tools      │   │                     │
                 │  - Retry/circuit  │   │                     │
                 │    breaker layer  │   │                     │
                 └──────┬────────────┘   └─────────────────────┘
                        │
              ┌─────────▼──────────┐
              │ Mocked/real tool    │
              │ APIs: flights,      │
              │ hotels, calendar,   │
              │ weather, payments   │
              └─────────────────────┘

         ┌────────────────────────────────────────┐
         │ Postgres: episodic memory (trace log,   │
         │ tool-call history, decisions, costs)    │
         │ + semantic store (user prefs, budget,   │
         │ constraints, as structured JSON)        │
         └────────────────────────────────────────┘
```

## Component responsibilities

**Frontend (Next.js)** — task input, the Flight Recorder trace timeline (clickable,
scrubbable), and human-in-the-loop approval modals for irreversible actions. This is
what a judge looks at for most of the demo — see `DEMO_SCRIPT.md`.

**Planner (Python/FastAPI)** — owns the plan → dispatch → verify → replan-or-continue
state machine and LLM tool-calling. Hand-rolled, not built on LangGraph/CrewAI — see
`DECISIONS.md` for why. Contains **zero domain-specific logic**; it only ever reasons
over the list of tools currently registered in the gateway.

**Gateway (Go)** — fans out to tool APIs concurrently (goroutines), hosts an MCP server
exposing those tools over the standard protocol, and owns retry/circuit-breaker/fallback
logic. This is also where new domains get added — see `CONTRIBUTING.md §Adding a new
tool / domain`.

**Solver (Rust)** — the deterministic core, in two parts:
- **Policy/guardrail engine**: checks every reversible/irreversible action against
  budget and permission rules before it's allowed to execute. See `RULES.md §Part 2`
  for the exact spec this enforces.
- **Constraint solver**: multi-objective ranking (price, layovers, flexibility, etc.)
  instead of a naive "sort by price" — re-solves live if the user adjusts trade-off
  weights mid-demo.

**Postgres** — episodic memory (the trace log, keyed by task) doubles as the data
source for the Flight Recorder UI. A lightweight semantic store (structured JSON: user
preferences, budget, constraints) is read once per task. Procedural memory is
deliberately out of scope — see `DECISIONS.md`.

## Tool registry (the core architectural claim)

Every tool — `search_flights`, `check_calendar`, `compare_prices`, `draft_invite`,
whatever gets added — registers against one interface:

```json
{
  "name": "string",
  "input_schema": { "...": "..." },
  "output_schema": { "...": "..." },
  "cost_estimate": 0.0,
  "risk_tier": "read_only | reversible | irreversible"
}
```

The planner never branches on domain. It only ever sees "here are the currently
available tools" and reasons about which apply to the current sub-task. This is what
makes the domain-generality demo (trip planning → scheduling task, same planner) true
rather than aspirational — see `DEMO_SCRIPT.md` for exactly how that's demonstrated.

## Data flow for one action

1. User submits a task → planner decomposes into sub-tasks (trace event: `plan_step`)
2. Planner selects a tool via the gateway's registry → gateway dispatches, with
   retry/circuit-breaker (trace event: `tool_call`)
3. Before any reversible/irreversible result is acted on, solver checks it against
   budget/permission rules (trace event: `guardrail_check`)
4. If irreversible and guardrail-passed → frontend shows an approval modal (trace
   event: `human_approval`)
5. Every step above writes a row to Postgres matching the schema in
   `DOCUMENTATION.md §Trace Event Schema`, which the frontend polls/subscribes to for
   the live Flight Recorder view.

## What's intentionally not built

- No heavy multi-agent orchestration framework — see `DECISIONS.md`.
- No procedural memory (learned workflows over time) — needs real usage data this
  project won't have in 24 hours.
- No live third-party API dependency for the demo path — flight/hotel data is
  deterministically mocked so judging never depends on an external service being up.
