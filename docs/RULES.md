# RULES.md

Two kinds of rules live here: the rules the **team** follows when writing code, and the
rules the **agent itself** must obey at runtime. Keep them in the same file — the second
set is a product spec as much as an engineering one, and judges may read this file
directly to understand your guardrail system.

---

## Part 1 — Engineering & collaboration rules

### Git & commits
- Trunk-based development, short-lived feature branches (`feat/trace-ui`, `fix/retry-loop`)
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- No direct pushes to `main` — even solo, open a PR so CI runs and history stays readable
- Squash-merge preferred; keep `main` history linear and legible

### Code style per language
| Language | Formatter/linter | Non-negotiable |
|---|---|---|
| Go (gateway) | `gofmt`, `go vet` | errors are always handled, never `_`-discarded on tool calls |
| Rust (solver) | `cargo fmt`, `cargo clippy` | no `unwrap()`/`expect()` on any path that touches user budget or permissions — real error handling only |
| Python (planner) | `ruff`, `black` | type hints on all public functions; no bare `except:` |
| TypeScript (frontend) | `eslint`, `prettier` | no `any` on trace-event types — the trace schema is the contract, keep it typed |

### Testing — definition of done
A change is **not done** until:
- [ ] It has a test if it touches: state machine transitions, guardrail logic, retry/circuit-breaker behavior, or trace-event emission
- [ ] `docker compose up` still boots cleanly
- [ ] CI is green
- [ ] If it changes a cross-service contract, the schema stub and the other side's owner are both updated

### Review
Given the 24h window: self-merge is fine once CI is green, but flag any change to
`solver/` (the guardrail engine) or the trace-event schema in the team channel before
merging — those two are load-bearing for the whole demo and a silent break there is the
worst possible failure mode to discover at hour 22.

---

## Part 2 — Agent operating rules (the actual runtime policy)

These are enforced mechanically by `solver/` (Rust), not by prompting — see
`ARCHITECTURE.md`. This section is the spec that code should match; if code and this
section disagree, this section wins and the code is the bug.

### Permission tiers
Every tool is registered with a risk tier. The planner may call read-only tools freely;
everything above that requires a passing guardrail check, and irreversible actions
additionally require explicit human approval regardless of guardrail outcome.

| Tier | Examples | Requires |
|---|---|---|
| **Read-only** | search flights, check calendar availability, price lookup | nothing — always allowed |
| **Reversible** | hold a reservation, draft (unsent) an email/invite | guardrail check only |
| **Irreversible** | confirm a booking, send a payment token, send a message to a third party | guardrail check **and** explicit human approval |

### Budget enforcement
- The user declares a hard budget ceiling at task start.
- Before any reversible or irreversible action, `solver` checks the action's cost
  against remaining budget. **A ceiling breach is a hard block, not a warning** — the
  planner receives a rejection, not a suggestion, and must replan or ask the user.
- This check happens in `solver`, independent of what the LLM "remembers" from the
  system prompt — the whole point is that a prompt-injection or a model mistake cannot
  talk the system past this line.

### Retry & failure handling
- Max 3 retries per tool call, exponential backoff.
- On the 3rd failure: trip circuit breaker → attempt one registered fallback tool if
  one exists, clearly labeled as a fallback in the trace → if no fallback exists, flag
  the step for human review. **Never silently substitute a guess for a failed tool call.**

### Human-in-the-loop triggers
Ask the user before proceeding when:
- An action is tier **Irreversible** (always, no exceptions)
- A decision genuinely branches with high-consequence trade-offs (e.g. cheapest option
  requires a 6am departure vs. a $40-more option that doesn't) — not for every minor
  ambiguity; log the "cost of asking vs. cost of guessing wrong" reasoning in the trace
  either way, so the choice not to ask is also visible and explainable

### Data-sharing / consent
Every simulated external call logs: what data was sent, to which mock vendor, and why —
visible in the consent ledger (Phase 4 stretch goal). This isn't decoration — it's the
direct answer to the trust-gap problem this project is built around (see the strategy
doc's Section 1.2).

### Cost guardrail on the agent itself (stretch)
If implemented: the agent tracks its own running LLM/API spend against a declared
ceiling and pauses before a step that would exceed it — same mechanism as the user's
travel budget, applied reflexively.
