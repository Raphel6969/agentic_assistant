# DOCUMENTATION.md

An index of what every doc in this repo is for, plus the two standards worth keeping
consistent under time pressure: the trace-event schema and the decision-log format.

## Doc map

| File | Audience | Purpose | Update cadence |
|---|---|---|---|
| `README.md` | Anyone (judges first) | Quick-start, one-liner, links out | Final pass at Phase 7 |
| `AGENTS.md` | AI coding agents + new contributors | Fast orientation, conventions, do-not-list | Rarely, if conventions change |
| `PHASES.md` | The team | Live status: done/in-progress/blocked/remaining | **Every checkpoint gate** |
| `RULES.md` | The team + judges reading code | Engineering rules + the agent's runtime policy spec | When a rule actually changes |
| `ARCHITECTURE.md` | Judges + contributors | System diagram, component responsibilities, data flow, trace schema | When the architecture changes |
| `CONTRIBUTING.md` | Team members | Local setup, branch/PR workflow | Rarely |
| `DEMO_SCRIPT.md` | The team, presenting | Slide-by-slide + minute-by-minute run of show | Locked by Phase 6 |
| `DOCUMENTATION.md` | This file | What everything above is for | Rarely |

**Rule of thumb:** if you're not sure where something goes, it goes in `PHASES.md` as a
note under the current phase, not into a new file. Don't let doc sprawl outpace what
you're actually building.

## Trace event schema

Every tool call and planner decision must emit an event matching this shape (adjust
field names to your actual implementation, but keep this shape — the Flight Recorder UI
and the episodic memory table both depend on it):

```json
{
  "event_id": "uuid",
  "task_id": "uuid",
  "timestamp": "ISO-8601",
  "type": "plan_step | tool_call | guardrail_check | human_approval | error | fallback",
  "tool": "string | null",
  "input": { "...": "..." },
  "output": { "...": "..." },
  "cost_estimate": 0.0,
  "latency_ms": 0,
  "confidence": 0.0,
  "reasoning": "one-sentence explanation the agent generates for this step",
  "risk_tier": "read_only | reversible | irreversible",
  "guardrail_result": "allowed | blocked | requires_approval | null"
}
```

If a code change adds a new kind of step the agent takes, add its `type` here in the
same PR — an undocumented event type is a debugging trap at hour 20.

## Decision log (lightweight ADR)

For any non-obvious architectural choice (e.g. "hand-rolled state machine instead of
LangGraph," "Rust for the guardrail instead of enforcing it in Python"), add a short
entry to a `DECISIONS.md` using this template — it's the fastest way to have a real
answer ready when a judge asks "why did you build it this way":

```markdown
## ADR-00X: <decision>
Date: <date>
Status: accepted

**Context:** what problem forced this decision
**Decision:** what you chose
**Why not the alternative:** one sentence
**Consequence:** what this makes easier or harder later
```

Three or four of these by the end of the hackathon is plenty — don't write one for
every commit, only for choices you'd actually have to defend out loud.
