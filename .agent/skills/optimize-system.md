# Skill: optimize-system

## Purpose
Maintain `.agent/` health by compacting learning, promoting repeated patterns, and updating metrics.

## When to use
Triggers: optimize system, /optimize-system, compact lessons, monthly maintenance, agent health.

## Steps
1. Read `memory/facts.md`, `memory/working.md`, `learning/lessons.md`, `learning/patterns.md`, `learning/feedback.md`, and `monitoring/metrics.md`.
2. Compact old working-memory entries into `memory/archive.md` when the buffer exceeds 5 tasks.
3. Identify lessons repeated 3 or more times and propose promotion to `learning/patterns.md` or `memory/facts.md`.
4. Check skills for bloat, stale triggers, and routing gaps.
5. Update `monitoring/metrics.md` with routing accuracy, file sizes, open questions, and recommended next actions.
6. Log every `.agent/` edit to `learning/changelog.md`.

## Execution Notes
For broad audits, run a focused reconnaissance pass over `.agent/`, `AGENTS.md`, `CLAUDE.md`, and templates before editing. Use the `meta` skill for export-back or cross-repo skill improvement.

## Anti-patterns
- Do not delete lessons; compact them into archive form.
- Do not silently change hardened facts without evidence.
- Do not edit global/team skills without a proposed diff.

## Confidence
0.95
