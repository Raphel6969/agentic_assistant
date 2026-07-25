# DEMO_SCRIPT.md

Locked by Phase 6 (see `PHASES.md`). This is the actual run of show — for the live
pitch and for the 5-minute video, same beats.

## Pitch deck — slide by slide

1. **Title** — project name, one-line pitch, team.
2. **The problem, made specific** — not "planning is hard," but: people don't trust
   autonomous agents to act for them because the process is opaque, not because the
   agents are incapable (the awareness-vs-usage trust gap).
3. **Why now** — agentic commerce standards (ACP) already live with real merchants,
   browser/computer-use agents at production-grade benchmarks — the infrastructure
   exists, the trust layer doesn't.
4. **What we built, one sentence** — general-purpose agent, autonomy with an audit
   trail, not a travel bot.
5. **Architecture** — the diagram from `ARCHITECTURE.md`.
6. **What makes it different** — name the three explicitly: trace, guardrail, generality.
7. **Live demo** — trip domain happy path → induced failure recovery → domain switch
   to scheduling to prove generality.
8. **The trace, zoomed in** — annotated screenshot of the Flight Recorder UI.
9. **Reliability story** — retry → circuit breaker → fallback/human-flag, one diagram.
10. **What's technically hard here** — 20 seconds each: Rust guardrail, ACP-modeled
    checkout, hand-rolled state machine over a framework.
11. **What's next / impact** — honest, specific.
12. **Team + ask.**

## Video / live demo — minute by minute

**0:00–0:30 — Hook.** State the trust gap in one sentence. Don't open with "we built an
AI agent" — everyone in the room did that.

**0:30–1:00 — Architecture, fast.** Point at the diagram, name the four services and
why each language, 5 seconds each. Don't code-walkthrough.

**1:00–3:00 — Live demo, trip domain.**
- Issue the task with a hard budget ceiling stated out loud.
- Let the trace populate live — narrate one or two entries ("here's the planner
  choosing between two flights, here's why").
- **Deliberately break a tool** (kill the mock flight API, or force a timeout).
  Show: retry attempts appear in the trace → circuit breaker trips → fallback tool
  substitution (clearly labeled) OR human-flag if no fallback exists.
- Trigger an over-budget action on purpose. Show the guardrail **hard-block** it —
  this is the single most important 15 seconds of the whole demo.

**3:00–3:45 — The generality proof.** Switch live to the scheduling task. Say
explicitly: "same planner, same guardrail, same trace UI — the only thing that
changed is two new tools got registered in the gateway." Show the trace UI populate
identically for a completely different kind of task.

**3:45–4:30 — What's technically hard.** 20–30 seconds each:
- The Rust guardrail can't be prompt-injected past the budget rule — optionally
  demonstrate by trying to talk the agent into an over-budget action via chat, and
  show it still gets blocked at the solver layer regardless of what the LLM "agreed" to.
- The checkout step follows the real ACP shape, not a hardcoded stub.

**4:30–5:00 — Close.** Impact, what you'd build next with a week, thank you.

## Backup plan if live demo breaks

Have the recorded video ready to switch to immediately — don't debug live in front of
judges. Practice the handoff line ("let's switch to the recorded run so we don't burn
your time") so it doesn't feel like a failure when it happens.

## Adversarial questions to have answers ready for

- "What happens if the agent is wrong about something expensive?" → the guardrail
  hard-blocks before execution; walk through the check in `RULES.md §Part 2`.
- "Is this actually general-purpose or just a travel bot with a system prompt?" →
  point at the tool registry in `ARCHITECTURE.md` and the live domain-switch moment.
- "Why not use LangGraph/CrewAI?" → see `DECISIONS.md` — debuggability and control for
  a single-agent system at this scale, not unfamiliarity.
- "What's mocked?" → answer honestly and immediately, per `README.md §What's mocked vs
  real`. Don't get caught overselling — judges respect a clear line more than a vague one.
