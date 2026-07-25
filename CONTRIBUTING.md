# CONTRIBUTING.md

For anyone (teammate, or a judge who clones the repo) getting this running locally.

## Setup

```bash
git clone <repo-url> && cd <repo>
cp .env.example .env          # fill in API keys — see below
docker compose up             # boots frontend, planner, gateway, solver, postgres
```

Frontend: `http://localhost:3000`
Planner API: `http://localhost:8000`
Gateway: `http://localhost:8080`
Solver: `http://localhost:8090`

### Required environment variables
```
LLM_API_KEY=            # your Anthropic/OpenAI key
BUDGET_CEILING_DEFAULT= # e.g. 500 — the default user budget for demo purposes
POSTGRES_URL=
```
Never commit a real `.env` — `.env.example` documents the shape only.

## Working on a piece of it

1. Pick up a task from the current phase in `PHASES.md` — don't start something outside
   the current phase without flagging it; the phases are ordered for a reason (later
   phases depend on earlier ones being real, not just started).
2. Branch: `feat/<short-description>` or `fix/<short-description>`.
3. Commit using Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`) —
   see `RULES.md`.
4. If your change touches a cross-service contract (planner↔gateway or planner↔solver),
   update the schema stub first and say so in the PR description.
5. Open a PR. CI must be green (lint + test + docker build) before merging.
6. Update `PHASES.md` — check off what you finished, note what's blocked, update status.
   **This step is not optional.** A PR that finishes work without updating `PHASES.md`
   is incomplete.

## Definition of done for any PR
See `RULES.md §Testing — definition of done`. In short: tests for anything touching
state machine / guardrail / retry logic, `docker compose up` still works, CI green,
contracts updated if changed.

## If you're blocked
Post it in the team channel with what you tried, and note the blocker in `PHASES.md`
under the relevant phase so it doesn't get lost. Don't silently sit on a blocker for
more than ~30 minutes in a 24h window — ask.

## Adding a new tool / domain
This is the one workflow worth knowing cold, since it's the project's core claim
(see `ARCHITECTURE.md §Tool Registry`):
1. Register the tool in `gateway/tools/` with its input/output schema, cost estimate,
   and risk tier.
2. Do **not** add domain-specific branching to `planner/` — if the planner needs to
   change to support your new tool, something is wrong with the tool's schema, not
   with the planner.
3. Confirm the trace UI picks it up automatically (it should, if the trace-event
   schema in `DOCUMENTATION.md` was followed).
