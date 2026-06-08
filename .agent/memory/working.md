# Working Memory

> Active tasks: rotating 5-item buffer. When buffer exceeds 5, summarize oldest into archive.md.
> Updated by Codex after each qualifying non-trivial task.

## Active Task

| Field | Value |
|---|---|
| Goal | Provider-neutralize the active `.agent` system |
| Approach | Replace provider-specific runtime language with generic CLI/agent guidance while keeping compatibility notes separate |
| Status | idle |
| Confidence | 1.0 |
| Files touched | [] |

## Recent Completions

### 2026-06-08 - Deploy root `.agent` system
- **Goal**: Materialize the active `.agent` implementation in the open-source repo, starting from `CLAUDE.md`.
- **Outcome**: success
- **Confidence**: 0.9
- **Key learning**: Root `.agent/` must be tracked for dogfooding while scratch state stays ignored.
- **Files**: `.agent/index.md`, `.agent/memory/facts.md`, `.agent/skills/*.md`, `.agent/monitoring/metrics.md`, `.claude/agents/*.md`, `.claude/settings.json`, `.gitignore`, `scripts/graphify_refresh_manager.py`

### 2026-06-08 - Optimize `.agent` runtime for Codex
- **Goal**: Remove Claude-style subagent assumptions from the active runtime.
- **Outcome**: success
- **Confidence**: 0.9
- **Key learning**: Codex should use `AGENTS.md`, skills, MCP, hooks/plugins, and direct tool execution as primary surfaces.
- **Files**: `AGENTS.md`, `.agent/index.md`, `.agent/memory/facts.md`, `.agent/README.md`, `.agent/skills/*.md`

### 2026-06-08 - Provider-neutralize runtime
- **Goal**: Make the active `.agent` system usable by any CLI or AI provider.
- **Outcome**: success
- **Confidence**: 0.9
- **Key learning**: Keep provider-specific compatibility notes separate from the primary runtime instructions.
- **Files**: `AGENTS.md`, `.agent/index.md`, `.agent/README.md`, `.agent/memory/facts.md`, `.agent/skills/*.md`, `.agent/learning/*.md`

---

**Last Updated**: 2026-06-08
