# Agent System Metrics

> Lightweight health snapshot for the root `.agent/` dogfood deployment.

## Current Snapshot

| Metric | Value |
|---|---|
| Deployment status | active Codex-first root `.agent/` |
| Template source | `templates/.agent-template/` |
| Repo-specific skills | 6 |
| Universal runtime skills | 8 |
| Claude compatibility prompt files | 7 |
| Last optimization | 2026-06-08 |
| Next review | 2026-07-08 |

## Health Checks

| Check | Status | Notes |
|---|---|---|
| `.agent/index.md` exists | pass | Repo-specific router installed |
| `memory/facts.md` exists | pass | Repo-specific facts installed |
| Universal skills available at runtime root | pass | Copied from `skills/universal/` |
| Repo-specific vault skills available | pass | Link, index, metadata, sync, MOC, optimize |
| `.claude/agents/` compatibility prompts exist | pass | Reference prompts retained; not required by Codex runtime |
| Graphify refresh script | pass | Mirrored to `scripts/graphify_refresh_manager.py` |

## Review Notes

- Root `.agent/` is tracked intentionally for dogfooding.
- Runtime scratch state should stay under ignored `.agent/local/` or `.agent/tmp/`.
- Backport template-worthy improvements to `templates/.agent-template/`.
