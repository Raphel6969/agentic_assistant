## What does this PR do?
<!-- One sentence: what problem does it solve or what feature does it add -->

## Type of change
- [ ] `feat:` New feature
- [ ] `fix:` Bug fix
- [ ] `refactor:` Refactor (no behaviour change)
- [ ] `test:` Tests only
- [ ] `docs:` Documentation only
- [ ] `chore:` Build / infra / config

## Checklist
- [ ] CI is green (lint + test + docker build)
- [ ] If this touches a cross-service contract (planner↔gateway or planner↔solver), the schema stub is updated first
- [ ] If this touches `solver/` (guardrail engine) or the trace-event schema — flagged in team channel before merging
- [ ] If this adds a new step type the agent can take, `type` is added to the schema in `DOCUMENTATION.md`
- [ ] `PHASES.md` updated (check off what's done, note what's blocked)
- [ ] Tests added for any changes to: state machine transitions, guardrail logic, retry/circuit-breaker, trace-event emission

## How to test
<!-- Steps a reviewer can follow to verify this works -->
