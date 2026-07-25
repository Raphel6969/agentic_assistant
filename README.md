# [Project Name]

> [One-sentence pitch — e.g. "An autonomous personal assistant agent that plans,
> compares, and executes multi-step tasks across domains — with a visible decision
> trace and a policy engine that can't be talked out of your budget."]

[Demo GIF/video link — add before final submission]

## What makes this different

Most agent demos are single-domain wrappers around an LLM. This one is built to prove
three things a judge can verify, not just take on faith:

1. **A replayable decision trace** — every plan step, tool call, and decision is logged
   and rendered live, not hidden in a chat log.
2. **A guardrail that's mechanically enforced, not prompted** — budget and permission
   limits are checked by a separate Rust service before any action executes.
3. **Genuine domain generality** — the same planner runs a trip-planning task and a
   scheduling/coordination task with zero new planner logic, only new registered tools.

See `ARCHITECTURE.md` for how, and `DEMO_SCRIPT.md` for the exact demo that proves it.

## Quick start

```bash
git clone <repo-url> && cd <repo>
cp .env.example .env   # add your LLM API key
docker compose up
```
Then open `http://localhost:3000`. Full setup details in `CONTRIBUTING.md`.

## What's mocked vs. real

- **Mocked, deterministically seeded:** flight/hotel inventory and pricing (kept mocked
  for demo reliability).
- **Real:** [fill in — e.g. weather API / calendar integration]
- **Simulated but standards-modeled:** the checkout/payment step follows the shape of
  the real Agentic Commerce Protocol (`Checkout` object + scoped token), without moving
  real money.

## Repo map

| File | What it's for |
|---|---|
| `AGENTS.md` | Orientation for AI coding agents and new contributors |
| `PHASES.md` | Live build status — what's done, blocked, remaining |
| `RULES.md` | Engineering rules + the agent's actual runtime policy |
| `ARCHITECTURE.md` | System diagram, components, trace schema |
| `CONTRIBUTING.md` | Local setup, branch/PR workflow |
| `DOCUMENTATION.md` | Index of all docs + standards |
| `DEMO_SCRIPT.md` | The exact demo run-of-show |

## Team
[names / roles]

## License
[MIT / other]
