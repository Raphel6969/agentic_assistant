## ADR-001: Hand-rolled state machine instead of LangGraph/CrewAI
Date: 2026-07-25
Status: accepted

**Context:** The planner needs an orchestration layer. LangGraph, CrewAI, and AutoGen are the common choices.
**Decision:** Hand-roll an explicit `IDLE → PLANNING → DISPATCHING → AWAITING → VERIFYING → DONE` state machine in Python.
**Why not the alternative:** Heavy frameworks add 3x boilerplate, opaque routing that's hard to explain live to a judge, and documented reliability costs for single-agent systems. We need to be able to walk through any transition in real-time during a demo.
**Consequence:** More initial code, but every state transition is a named function we fully control and can test discretely.

---

## ADR-002: Rust for the guardrail engine (not Python enforcement)
Date: 2026-07-25
Status: accepted

**Context:** Budget and permission enforcement could live in the Python planner as a guard clause, or as a separate service.
**Decision:** Separate Rust service (`solver/`) that every reversible/irreversible action must call before execution.
**Why not the alternative:** A guard clause in the planner can be bypassed by a prompt-injection or a model mistake — enforcing it in a separate, type-safe, statically compiled service makes it mechanically impossible to route around. This is the central trust claim of the product.
**Consequence:** One extra network hop per action. Acceptable: the hop is localhost Docker network, latency is <5ms.

---

## ADR-003: Deterministic mocked flight/hotel data for demo path
Date: 2026-07-25
Status: accepted

**Context:** Demo stability requires that judging never depends on a third-party API being up.
**Decision:** Flight and hotel data is seeded with a fixed random seed — same inputs always produce the same outputs.
**Why not the alternative:** Live API dependencies during a timed judging session are a single point of failure with no recovery. The goal is to demo the *agent's reasoning*, not real inventory.
**Consequence:** Demo is not live-market data; must be clearly labeled in README and verbally during the pitch.

---

## ADR-004: Go gateway as MCP server for tool exposure
Date: 2026-07-25
Status: accepted

**Context:** Tools need to be exposed to the planner over a standard protocol.
**Decision:** Go gateway hosts an MCP (Model Context Protocol) server that exposes all registered tools. Planner discovers tools by querying the registry, not by hardcoded imports.
**Why not the alternative:** Hardcoding tool definitions in the planner couples domains to planner logic — which breaks the core "domain generality" claim. MCP is the emerging standard; using it signals real domain research.
**Consequence:** Adds MCP server boilerplate in Go, but makes the "same planner, new tools" demo moment provably true.
