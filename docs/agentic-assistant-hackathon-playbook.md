# Autonomous Personal Assistant Agent — 24hr Hackathon Playbook
**Domain 4 · Problem Statement 1 · Prepared as a judge-eye strategy + build doc**

---

## 0. TL;DR — What actually wins this category

Every team in this track will build "an LLM that calls flight/hotel APIs and picks the cheapest one." That is table stakes, not a differentiator. Judges in 2026 agentic-AI hackathons have explicitly said they're scoring **trace logs, not vibes** — meaning the winning bar isn't "does it book a flight," it's "can you *show* how it decided, recover when a tool breaks mid-run, and prove it didn't blow past the user's budget or trust boundary."

Your edge, given your stack (Go / Rust / Python / web), is to build the parts almost no hackathon team has time or skill for:
1. A **transparent, replayable decision trace** (not a chat log — an actual execution graph with timestamps, confidence, cost).
2. A **policy/guardrail layer written in Rust** that mechanically enforces budget and permission boundaries before any action executes (not just prompted into the LLM).
3. **Real resilience** — retries, circuit breakers, graceful degradation, tool substitution — demoed live by deliberately breaking something.
4. A **standards-aware payment/booking simulation** modeled on the real Agentic Commerce Protocol (ACP) rather than a hardcoded `book_flight()` stub.

**And critically: don't build a travel bot.** The problem statement's example ("flight and hotel combo") is one instance of a general capability, not the product. Every other team at this hackathon will read that example literally and ship a travel bot — which means "travel bot" is the single most crowded, least differentiated thing you could demo. Build the generalist core (planner, Go tool gateway, Rust guardrails, trace UI) and prove it's actually domain-agnostic by running it against 2–3 unrelated task types live — trip planning, a price-comparison/research task, and a scheduling/coordination task. Same architecture, different tools, zero extra "intelligence" added per domain. That's the real thesis of an *autonomous personal assistant* agent, and it's a much harder thing for a judge to dismiss as "another booking bot."

Everything below justifies and operationalizes this.

---

## 1. Market Landscape — What exists, what it actually gives you, what it lacks

### 1.1 The three product categories judges will mentally compare you to

**A. Vertical travel-booking agents** (Expedia's Romie, Navan for corporate travel, Booking.com's AI layer, various OTA "agentic" bots)
- What they give: real inventory access, loyalty-point redemption, natural-language search-to-book flows, growing enterprise partnerships with hotel groups (Marriott, IHG) opening up real-time pricing feeds to AI agents in 2026.
- What they lack: they are **closed, single-vendor, and opaque**. You get a booking, not a reasoned trade-off. There's no visible "why this and not that," no user-controllable risk boundary, and no cross-platform comparison — Navan won't compare against Expedia's price.

**B. General-purpose computer-use / browser agents** (Claude Computer Use, OpenAI Operator, Google Project Mariner, Manus Desktop, open-source Stagehand/browser-use)
- What they give: the ability to actually click through *any* website without a dedicated API — Operator benchmarks around 87% on standard browser tasks, Mariner around 83.5% on WebVoyager. This is the "universal tool" approach.
- What they lack: reliability collapses on captchas, passkey/2FA flows, and unfamiliar enterprise-style UI. They're also single-model, single-vendor lock-in (Operator only inside ChatGPT, Mariner only inside Gemini/Chrome), and the emerging industry consensus (explicitly stated by multiple 2026 analyses) is that safe agentic browsing requires **every action logged, every permission declared in advance, and human approval on high-stakes steps** — a design goal almost nobody has actually shipped end-to-end yet. That gap is your opening.

**C. Multi-agent orchestration frameworks** (LangGraph, CrewAI, OpenAI Agents SDK, Google ADK, AutoGen/Microsoft Agent Framework)
- These are developer infrastructure, not consumer products — the layer you'd build *on top of*, not compete with. Useful context: LangGraph models everything as an explicit state graph with checkpointing and "time travel" rollback, which is powerful for auditability but heavier to write (roughly 3x the code of a simple ReAct loop). CrewAI is faster to prototype with (role-based "crews") but has measurable token overhead (~18% more than an equivalent LangGraph flow in 2026 benchmarks) and gets harder to debug as agent count grows. There's also a credible counter-argument circulating in 2026 research that heavy orchestration frameworks *reduce* reliability for procedural tasks compared to a well-designed single prompt loop with explicit tool contracts — worth knowing so you don't over-engineer this away in Rust/Go where you don't need to.
- **Verdict for a 24hr build: don't import a framework you have to fight. Hand-roll an explicit state machine.** It's more debuggable live, and — bonus — it reads as an intentional architecture decision to judges, not a library default.

### 1.2 The structural gap nobody has closed

Across every category, three consistent gaps recur in 2026 coverage:
1. **The trust gap.** Industry surveys show ~90% of consumers are aware AI can plan/book travel, but only ~38% have actually used it — the blocker cited repeatedly is *lack of visible accountability*, not lack of capability. People don't distrust the booking; they distrust not knowing why it happened.
2. **The vendor-silo gap.** Every agent above is scoped to one company's ecosystem. Nobody's shipped a personal orchestrator that treats "search flights," "search hotels," "check calendar," "pay" as swappable, standards-based tools it can route across.
3. **The commerce-standardization gap.** A real open standard for agent-driven purchases now exists — the **Agentic Commerce Protocol (ACP)**, jointly built by OpenAI, Stripe, and (more recently) Meta, already live with Etsy/Shopify merchants, defining a `Checkout` object, scoped `SharedPaymentToken`s, and OAuth-based delegated authorization so an agent never touches raw card data. Almost no hackathon team will know this exists, let alone model their booking flow after it. You can.

### 1.3 Who you're actually building for

Not the enterprise travel-ops buyer (Navan/Copilot already own that, and you can't out-integrate them in 24 hours), and not a single-vertical traveler either — the problem statement is explicitly general ("planning a trip, comparing options across services, coordinating a schedule"). Your realistic, defensible user is:

> **The individual, moderately tech-savvy user who wants one agent for the tedious multi-step busywork that spans their whole digital life** — not three different single-purpose bots (one for travel, one for shopping, one for scheduling), but one that wants autonomy *with a leash*: it sees the reasoning, can't cross a hard budget/permission ceiling, and asks before anything irreversible.

That framing — "one general-purpose agent, autonomy with an audit trail" — is also exactly what plugs into the trust-gap finding above, and it's a genuine architectural claim, not a vague "AI is cool" pitch: the demo has to prove generality, so build the tool layer as pluggable from day one (new domain = register new tools against the same planner/guardrail/trace stack, not new logic).

---

## 2. How judges actually score agentic AI projects (and how to read as "winner material")

### 2.1 The rubric pattern, synthesized across 2026 hackathons (Devpost agent tracks, AngelHack's agent hackathon playbook, GitLab/Google Cloud/Anthropic's 2026 hackathon)

Consistently scored on some blend of:
- **Innovation & originality** — does it push past the obvious approach, or is it the first idea everyone has?
- **Technical execution** — does it *work*, is the code quality real, did the team actually finish what they scoped?
- **Genuine agentic design** — is AI/agency load-bearing, or "bolted on" (an LLM wrapper around a static form)?
- **Presentation & demo clarity** — storytelling, not just polish.
- **Real-world impact / completeness** — would this survive contact with a real user?

The sharpest 2026 guidance explicitly warns organizers: *without a shared evaluation framework, judges end up scoring the demo video and vibes, not whether the agent actually works* — and the fix top hackathons are adopting is to reward teams who can show **trace logs and eval harnesses**, not just a polished walkthrough. Assume your judges have absorbed this. Build for it.

### 2.2 What separates a winner from a "nice demo" — patterns from real 2026 winners

From a recent large-scale AI agent hackathon (GitLab × Google Cloud × Anthropic, ~7,000 developers, 600+ submissions):
- The Anthropic Grand Prize winner mapped code relationships with visible, explorable state over time — a judge's own words captured the whole bar: it read as a finished product, not a hackathon side-project.
- A runner-up's differentiator was explaining *every decision it made*, not just producing an output — explainability-as-a-feature, exactly the direction this playbook pushes you toward.
- Another winner used a router agent across 8 sub-agents with explicit cycle-prevention logic, a visual dashboard, and **43 automated tests** written during the hackathon — a level of engineering discipline that's rare enough at 24-48h events that it becomes a differentiator by itself.
- A three-agent Detector → Writer → Reviewer pipeline won specifically for having clean separation of responsibility, not sheer agent count.

**Takeaway:** volume of AI (more agents, longer prompts) doesn't win. **Legibility of the system** — architecture a judge can understand in 90 seconds, decisions the agent can explain, tests that prove it wasn't a one-shot demo — wins.

### 2.3 Concrete things to do differently than 90% of the room

1. **Open with a failure, not a success.** Most demos show the happy path first. Open your live demo by triggering a tool failure (kill a mock API, or force a price-change mid-flow) and show the agent detect it, retry, degrade gracefully, and *tell the user what happened*. This single moment does more to prove "this is real" than five minutes of a clean run.
2. **Show the trace, not just the chat.** A side panel or second screen showing the actual execution graph (plan → tool calls → costs → decisions → confidence) as it happens is the single most judge-legible artifact you can build, because it directly answers "is this really agentic, or an LLM wrapper?"
3. **Write tests and say so out loud.** Judges have explicitly called out test count as a signal of seriousness in a 24h build. Even 15-20 targeted tests (state machine transitions, guardrail enforcement, retry logic) is a strong signal.
4. **Bring a one-sentence, defensible market thesis** (Section 1.3), not "travel is a $9T industry." Specific beats big.
5. **Have an answer ready for "what happens if the agent is wrong about something expensive."** This is the adversarial question a strong judge will ask. Your Rust guardrail layer (Section 3) is the answer — have it rehearsed.

---

## 3. Innovation — features that would catch a judge off guard

Ranked by signal-to-effort for a 24h build. Items 1–3 are the **must-build core differentiators**; treat everything after as stretch goals to layer on if time allows, in order.

### Tier 1 — Build these no matter what

**0. A domain-agnostic tool registry — the feature that makes "generalist" a real claim, not a slogan**
Every tool (search flights, search hotels, check calendar, price-compare a product, draft an email) registers against the same interface: name, input/output schema, cost estimate, risk tier (read-only vs. irreversible). The planner never has domain-specific logic — it only ever sees "a list of available tools" and reasons about which apply. Concretely, this means adding your second and third demo domains (Section 5.4 below) should mostly be *new Go-gateway tool registrations*, not new planner code — and you can prove that live by showing how little changed in the planner when you point it at a scheduling task instead of a travel one. This is the single feature that turns "autonomous personal assistant" from a claim in your pitch into something a judge can verify by reading the diff.

**1. The Flight Recorder: a replayable, explorable execution trace**
Every planning step, tool call (input/output/latency/cost), decision, and confidence score is logged as a structured event and rendered as a live timeline in the UI — clickable, scrubbable, with a "why did you do this" annotation per node generated by the agent itself. This is your single highest-leverage feature: it's the literal, physical proof of "agentic," and it directly mirrors what won the GitLab/Anthropic hackathon above.

**2. A Rust-enforced policy/guardrail engine (not a prompt — a mechanism)**
Every proposed agent action passes through a small Rust service that checks it against declared permissions and a hard budget ceiling *before* execution is allowed — independent of whether the LLM "remembers" the constraint. This is the exact architecture the industry is converging toward for accountable agentic browsing (permissions declared up front, high-stakes actions requiring approval), and almost no hackathon team will have a real enforcement layer instead of a system-prompt instruction. It's also a natural showcase for your Rust skills: type-safe, deterministic, fast, and it visibly can't be talked out of its rules by a jailbreak attempt — which you can demonstrate live as a party trick.

**3. Multi-objective constraint solving instead of "cheapest wins"**
Real trip decisions trade off price, layovers, cancellation flexibility, and time. Build a small scoring/ranking engine (Rust, since it's a good excuse to use it and it's fast enough to re-rank live as constraints change) that takes a weighted multi-objective function instead of a single sort-by-price. Let the user drag a "price vs. convenience" slider mid-demo and watch the ranking re-solve instantly — a visually strong, technically real moment.

### Tier 2 — High-impact if time allows

**4. Standards-based simulated checkout (ACP-modeled)**
Instead of a `book_flight()` stub, model your booking step after the real Agentic Commerce Protocol: a `Checkout` object, a scoped one-time payment token, an explicit delegated-authorization step the user approves. Even fully simulated, this signals real domain research to any judge who knows the space — and given how new ACP is (its latest spec update, April 2026, added MCP integration), almost nobody at the hackathon will have heard of it.

**5. Resilience-by-design: circuit breakers, fallback tools, human handoff**
When a tool times out or fails N times, the system trips a circuit breaker and either substitutes a fallback tool (e.g., switch from a "live" price API to a cached/estimated one, clearly labeled as such) or explicitly flags the step for human review rather than guessing. This directly answers the most-cited real-world failure modes of 2026 browser agents (captchas, passkey flows, unfamiliar UI) with an honest, visible fallback instead of pretending they don't happen.

**6. Cost/token economics guardrail**
The agent tracks its own running LLM spend and API cost against a declared budget for *itself* (not just the user's travel budget) and will pause and ask before a step that would blow past it. Almost nobody demos the meta-question of "what does it cost to run this agent," and it's a great answer to a judge asking about production viability.

**7. A consent/data-sharing ledger**
Since the agent touches multiple simulated services, keep a visible log of what data was shared with which "vendor" and why. This is a direct, concrete answer to the trust-gap problem documented in Section 1.2 — most users don't distrust AI booking because it's incapable, they distrust it because it's opaque about what it's doing with their information.

### Tier 3 — Showpiece stretch goals (only if core is rock-solid early)

**8. Live mid-run interruption.** Let the user type a correction mid-execution ("actually, no red-eyes") and show the state machine re-plan from the current checkpoint rather than restarting — a strong demonstration of real state tracking, not just a single request/response loop.

**9. Agent-to-agent micro-negotiation.** A tiny mock "hotel agent" endpoint your assistant negotiates with over a structured protocol (loosely modeled on the emerging x402 per-call payment pattern for agent economies). High wow-factor, high risk — only attempt if Tiers 1–2 are done with hours to spare.

---

## 4. Technical Deep Dive — architecture matched to your stack

### 4.1 Proposed architecture (mirrors the contract-first, polyglot split you already run well)

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
                         │  - LLM tool-calling        │
                         │  - Explicit state machine │
                         └──────┬─────────────┬──────┘
                                │             │
                 ┌──────────────▼───┐   ┌─────▼─────────────┐
                 │  Go Tool Gateway  │   │  Rust Core          │
                 │  - Fan-out to N   │   │  - Policy/guardrail │
                 │    tool APIs      │   │    enforcement      │
                 │    concurrently   │   │  - Constraint solver│
                 │  - MCP server     │   │    / ranking engine │
                 │    for tools      │   │  - Deterministic,   │
                 │  - Retry/circuit  │   │    fast, type-safe  │
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
         │ + simple semantic store (user prefs,    │
         │ budget, constraints as structured JSON) │
         └────────────────────────────────────────┘
```

**Why this split, and why it's defensible to a judge:**
- **Python/FastAPI** owns the planner-executor loop and LLM tool-calling — this is genuinely the fastest language to iterate agent logic in, and defending "we didn't write our LLM orchestration in Rust" is an easy, correct answer.
- **Go** is your concurrency workhorse: fanning out to multiple tool APIs (flights, hotels, calendar, weather) in parallel goroutines is exactly the "multi-tool orchestration" the problem statement asks for, and Go is a strong, idiomatic fit for hosting a lightweight **MCP server** that exposes your tools over the actual Model Context Protocol standard — instantly proving you're not just chaining `if/else` prompts.
- **Rust** owns the two places where correctness and determinism matter more than LLM flexibility: the policy/guardrail engine (a budget ceiling should never be "vibes-enforced" by a prompt) and the multi-objective ranking/constraint solver (a real algorithmic component, not another LLM call). This is also your strongest personal differentiator — almost no hackathon team ships real Rust, and it visibly signals engineering maturity to judges who read code.
- **Next.js** frontend is where the Flight Recorder trace UI and human-in-the-loop approval modals live — this is the artifact judges will actually look at for 90% of your score, so don't under-invest here relative to backend cleverness.

### 4.2 Memory design (keep it pragmatic for 24h)

The mature 2026 taxonomy is **episodic / semantic / procedural** memory. For a 24h build:
- **Episodic** (build this — it's your trace log): every tool call, decision, and outcome, timestamped, in Postgres. This *is* the Flight Recorder feature — you get memory and your headline UI feature from the same table.
- **Semantic** (build a light version): a structured JSON preference store — budget ceiling, must-avoid constraints, loyalty accounts — extracted once at task start and referenced throughout. Don't build a vector DB for this; it's overkill at hackathon scale and a structured schema is *more* legible to a judge anyway.
- **Procedural** (skip): learned workflows over time need real usage data you won't have in 24h. Mentioning that you scoped it out deliberately, and why, is itself a mature answer if a judge asks about it.

### 4.3 Failure handling / orchestration pattern

Hand-roll an explicit state machine (plan → dispatch → await → verify → replan-or-continue) rather than importing LangGraph/CrewAI wholesale. Reasons:
- You fully control and can explain every transition live — critical when a judge asks "walk me through what just happened."
- You avoid the real, documented reliability costs of heavy orchestration abstractions (cascading errors, opaque routing) that 2026 research has flagged.
- It's genuinely less code for a single-agent-with-tools system like this one; frameworks pay off at higher agent counts you won't need in 24h.

Each tool call gets: timeout → N retries with backoff → circuit breaker trip → fallback tool or human-flag. Wire this early; it's cheap to build and is your Tier-1/Tier-2 resilience story.

### 4.4 LLM usage pattern

- Two-tier model routing: a small/cheap model for classification and routing decisions (does this need clarification? which tool applies?), a larger model for the actual multi-step planning reasoning. This is both cost-sensible and a real engineering talking point.
- Tool-calling via structured function definitions, not free-text parsing.
- For clarification, don't build a generic chatty back-and-forth — use structured elicitation: only interrupt the user when a decision genuinely branches with real consequence (budget-breaking trade-off, ambiguous date range), and log the "cost of asking vs. cost of guessing wrong" as a visible decision in the trace. This is a direct, buildable answer to the problem statement's "ask for clarification only when truly necessary."

### 4.5 What to mock vs. what to make real

- **Mock, deterministically seeded:** flight/hotel inventory and pricing (for demo reliability — never depend on a live third-party API during judging).
- **Make genuinely real, if time allows:** one live integration (a real weather API or a real calendar/ICS feed) — proves the system isn't fully hollow.
- **Simulate but standards-model:** the payment/checkout step, using ACP's `Checkout` object + scoped-token pattern (Section 3, Tier 2).

---

## 5. Phase-Wise Execution Plan (24 hours)

### 5.1 Enterprise-grade setup (do this in the first hour, not as an afterthought)

- **Repo:** trunk-based, short-lived feature branches, Conventional Commits (`feat:`, `fix:`, `chore:`), PR template requiring a one-line "what/why."
- **Docker Compose skeleton** (fill in as services come online):
```yaml
services:
  frontend:
    build: ./frontend        # Next.js
    ports: ["3000:3000"]
  planner:
    build: ./planner         # Python/FastAPI
    ports: ["8000:8000"]
    depends_on: [postgres, gateway, solver]
  gateway:
    build: ./gateway         # Go — tool fan-out + MCP server
    ports: ["8080:8080"]
  solver:
    build: ./solver          # Rust — policy engine + ranking
    ports: ["8090:8090"]
  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: agent
    ports: ["5432:5432"]
```
- **CI (GitHub Actions), minimal but real:** one workflow, matrix jobs per language — `lint+test` on every PR, `docker build` to catch breakage early. Don't build full CD (no deploy target needed for a demo); the point is to *demonstrate the practice*, not gold-plate it.
- **Docs scaffold on hour 1:** `ARCHITECTURE.md` (the diagram above, adapted), `PHASES.md` (template below), `DEMO_SCRIPT.md` (fill in later).
- **Contract-first stubs:** define the Go↔Python and Python↔Rust API contracts (OpenAPI or simple JSON schemas) before writing implementation, so team members can build in parallel against a fixed interface — the same pattern you already use effectively.

### 5.2 Phase table

| Phase | Hours | Goal | Owner focus | Checkpoint gate |
|---|---|---|---|---|
| 0 — Scaffold | 0–1 | Repo, Docker Compose skeleton, CI shell, contract stubs, docs skeleton | Whole team | All services boot empty and talk over stub endpoints |
| 1 — Core loop | 1–4 | Python planner/executor with 2–3 mocked tools; Go gateway with one real fan-out call; bare-bones Next.js chat UI | Python + Go + FE | A single "find cheapest flight" request completes end-to-end, ugly UI is fine |
| 2 — Determinism layer | 4–9 | Rust policy engine (budget enforcement) + Rust ranking/constraint solver wired in; episodic trace logging to Postgres; retry/circuit-breaker in Go gateway | Rust + Go + Python | Agent physically cannot exceed declared budget; a forced tool failure gets retried and logged |
| 3 — Legibility layer | 9–14 | Flight Recorder trace UI (timeline, clickable nodes); human-in-the-loop approval modal; structured clarification/elicitation flow | Frontend + Python | A judge unfamiliar with the code can watch the trace and understand what happened |
| 4 — Differentiators | 14–18 | ACP-style simulated checkout; consent/data-sharing ledger; cost-guardrail; polish whichever Tier-2/3 items time allows | Whole team, split by feature | Each differentiator demoable in isolation |
| 5 — Hardening | 18–21 | Test pass (state machine transitions, guardrail enforcement, retry logic — aim for 15–20+ real tests); scripted failure-injection demo scenario; finalize docs | Whole team | `PHASES.md` fully updated; failure demo rehearsed twice |
| 6 — Storytelling | 21–23 | Pitch deck, demo video recording, dry-run pitch | Whole team | Full run-through under time, video exported |
| 7 — Buffer/submit | 23–24 | Bug triage, submission upload, repo README final pass | Whole team | Submitted with time to spare |

### 5.4 The three demo domains (build in this order)

Pick three tasks that deliberately touch different tool categories, so the demo itself is the proof of generality:

1. **Trip + budget** (anchor example, keeps you literally answering the problem statement) — flight/hotel search tools, price ranking, guardrail on budget.
2. **Price-comparison/research task**, unrelated to travel — e.g. "find the best price on [a product] across three sources and summarize the trade-offs." New tool category (product search/scrape), no booking, no payment — proves the planner isn't travel-specific.
3. **Scheduling/coordination task** — e.g. "find a slot three people are free next week and draft the invite." Touches calendar + messaging tools, zero overlap with the other two, and is the cleanest live demonstration of multi-tool orchestration without any commerce complexity.

Build domain 1 fully (it's your Tier-1/Tier-2 feature showcase). Build 2 and 3 *thin* — a handful of new tool registrations against the existing planner/guardrail/trace stack, deliberately kept simple, so the demo can show "same brain, new tools" in under 90 seconds without needing new architecture. If you only have time to fully finish one extra domain beyond travel, pick the scheduling task — it's the fastest to build (no pricing/ranking logic needed) and the most visually distinct from "another travel bot."

**On "ask before execution":** since this is a static plan, treat each checkpoint gate above as a self-administered pause — before moving to the next phase, the team should confirm the checkpoint is actually met (not "80% there"). If you want a second opinion at any gate, bring me your current `PHASES.md` status and I'll help you decide whether to proceed, cut scope, or reprioritize — that's a much more useful checkpoint than a rule I can't actually enforce from here.

### 5.3 Living status doc — `PHASES.md` template

```markdown
# Project Status

Last updated: <timestamp> by <name>

## Phase 0 — Scaffold: DONE
Approach: Docker Compose w/ 4 services, GH Actions lint+test, contract-first OpenAPI stubs.

## Phase 1 — Core loop: IN PROGRESS (70%)
Approach: FastAPI planner using hand-rolled state machine (plan/dispatch/verify).
Blockers: Go gateway mock data schema not finalized.
Next: finalize mock flight schema, wire first end-to-end request.

## Phase 2 — Determinism layer: NOT STARTED
## Phase 3 — Legibility layer: NOT STARTED
## Phase 4 — Differentiators: NOT STARTED
## Phase 5 — Hardening: NOT STARTED
## Phase 6 — Storytelling: NOT STARTED

## Cut list (if time runs short, in order of what to drop first)
1. Agent-to-agent micro-negotiation (Tier 3)
2. Mid-run interruption (Tier 3)
3. Consent ledger (Tier 2)
4. ACP-style checkout (fall back to a plain "book" stub if truly out of time)
```

Keep every phase update short and factual — status, approach in one line, blockers, next step. This doc doubles as your best defense if a judge asks "how did you actually spend 24 hours."

---

## 6. Pitch Deck, Repo, and Demo Video

### 6.1 Slide-by-slide (10–12 slides, ~5 min pace)

1. **Title** — project name, one-line pitch, team.
2. **The problem, made specific** — not "planning trips is hard," but: people don't trust autonomous booking because it's opaque, not because it's incapable (cite the 90%-aware/38%-used trust gap).
3. **Why now** — real industry momentum: agentic commerce standards (ACP) shipping live with real merchants, major browser/computer-use agents hitting production-grade benchmarks in 2026 — the infrastructure exists, the *trust layer* doesn't.
4. **What we built, one sentence** — the autonomy-with-a-leash framing from Section 1.3.
5. **Architecture** — the diagram from Section 4.1, presented cleanly.
6. **What makes it different** — your Tier-1 trio: transparent trace, hard-enforced guardrails, real constraint solving. Name them explicitly; don't bury them in the demo.
7. **Live demo** (or embedded clip if presenting live is risky) — happy path on the trip domain, the induced-failure recovery moment, then the domain-switch to scheduling/research to prove it's genuinely general-purpose, not a travel bot.
8. **The trace, zoomed in** — a screenshot of the Flight Recorder UI, annotated.
9. **Reliability story** — what happens when a tool fails, in one diagram (retry → circuit breaker → fallback/human-flag).
10. **What's technically hard here** (for judges who read code) — the Rust guardrail enforcement and the ACP-modeled checkout, briefly.
11. **What's next / impact** — honest, not hand-wavy: what you'd build with another week.
12. **Team + ask.**

### 6.2 GitHub repo checklist

- `README.md`: architecture diagram, setup instructions (`docker compose up`), what's mocked vs. real, stated up front.
- `ARCHITECTURE.md`, `PHASES.md` (final state), `DEMO_SCRIPT.md`.
- A demo GIF or short clip embedded at the top of the README — judges skim repos fast.
- Clean commit history (Conventional Commits pays off here — it reads as process, not chaos).
- License file (even MIT is fine — completeness signal).

### 6.3 5-minute demo video structure

- **0:00–0:30** — the trust-gap hook, stated plainly, one sentence of "why this matters."
- **0:30–1:00** — architecture, fast, visual, not a code walkthrough.
- **1:00–3:00** — live demo, trip domain: issue the task, show the trace populating in real time, then **deliberately break a tool mid-run** and show retry → fallback → user notification. Close by showing the guardrail refuse an over-budget action.
- **3:00–3:45** — the generality proof: switch to the scheduling (or research) task live and point out, explicitly, that it's the same planner and trace UI with new tools registered — this is the moment that separates you from every other travel bot in the room, say so directly.
- **3:45–4:30** — the "what's technically hard" moment: 30 seconds each on the Rust policy engine and the ACP-modeled checkout, framed as "here's what we built that a prompt alone couldn't do."
- **4:30–5:00** — impact, what's next, close.

---

## Sources checked (for your own reference — not for citation in the deck)
- Travel & agentic commerce landscape: travelandtourworld.com, thunderbit.com, gimmonix.com, todays-woman.net, skift.com
- Computer-use / browser agents: agentic.ai, zylos.ai, tech-insider.org, aihelperdesk.com, bosio.digital, shareuhack.com, xelionlabs.com, jobsbyculture.com
- Orchestration frameworks: medium.com (@atnoforgenai), arxiv.org/abs/2604.27891, langchain.com, langfuse.com, nxcode.io, openagents.org, gurusup.com, arxiv.org/abs/2603.27299
- Hackathon judging: techtimes.com (AITEX Summit), medium.com (DoraHacks), angelhack.com, devpost.com (UC Berkeley AI Hackathon, The Great Agent Hackathon), datahub.com, about.gitlab.com
- Agentic Commerce Protocol: github.com/agentic-commerce-protocol, docs.stripe.com, eco.com, stripe.com, metarouter.io, paz.ai, agenticcommerce.dev, xpay.sh
- Agent memory architecture: atlan.com, github.com (Shichun-Liu/Agent-Memory-Paper-List), zylos.ai, mem0.ai, arxiv.org/abs/2607.04433, bigaiagent.tech, hidekazu-konishi.com
