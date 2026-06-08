# Skill: meta

## Purpose
Audit and improve the active `.agent` system.

## When to use
- Weekly or monthly retrospective.
- After user feedback contradicts a skill.
- Triggers: audit skills, agent health, improve agent, retrospective.

## Steps

1. Audit skill health.
   - Flag runtime skills with unclear triggers.
   - Flag skills over roughly 1500 tokens.
   - Check whether `.agent/index.md` routes to real files.
2. Analyze learning.
   - Count repeated lessons by topic.
   - Check `learning/feedback.md` for corrections.
   - Trigger `skill-creator` for confirmed 3x patterns.
3. Resolve open questions.
   - Review `memory/facts.md` open questions.
   - Move answered questions into the relevant facts section.
4. Check runtime fit.
   - Prefer `AGENTS.md`, `.agent/skills/`, MCP, hooks, plugins, and direct tool execution.
   - Keep `.claude/agents/` as compatibility/reference only.
5. Export reusable improvements.
   - If a local skill becomes broadly useful, propose promotion to a shared skill or plugin.
   - Record proposed export-back work in `learning/changelog.md`.
6. Record findings.
   - Update `monitoring/metrics.md`.
   - Log `.agent/` edits in `learning/changelog.md`.

## Anti-patterns

- Auto-applying broad system changes without a changelog entry.
- Deleting lessons instead of compacting them.
- Treating compatibility prompts as required runtime workers.
- Editing reusable Codex skills silently without a scoped review path.

## Confidence
1.0
