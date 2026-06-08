# Agent Index
> Provider-neutral runtime router. Load after `AGENTS.md` for non-trivial work.

## Repository Context

**Domain**: Open-source reference implementation for a portable `.agent` knowledge-work system and Obsidian knowledge vault.
**Primary Languages**: Markdown, TypeScript, JavaScript, Python.
**Key Technologies**: AGENTS.md, MCP, Obsidian, graphify, Node.js/TypeScript.

## Skills

Skills are workflow playbooks for the current agent to read and execute directly with available tools. Load at most 2 skills per task.

| Skill | File | Triggers |
|---|---|---|
| maintain-links | skills/maintain-links.md | check links, broken links, orphans, backlinks |
| update-index | skills/update-index.md | update Index.md, add note, navigation |
| add-frontmatter | skills/add-frontmatter.md | frontmatter, tags, metadata, status |
| sync-patterns | skills/sync-patterns.md | sync patterns, update from repo, external repo |
| create-moc | skills/create-moc.md | create MOC, map topic, topic overview |
| optimize-system | skills/optimize-system.md | optimize system, compact lessons, monthly maintenance |
| graphify-check | skills/graphify-check.md | session start, graph status, graphify freshness |
| git-ops | skills/git-ops.md | commit, branch, merge, rebase, push |
| debug | skills/debug.md | error, stack trace, crash, bug, fail |
| refactor | skills/refactor.md | rename, extract, split, simplify, clean |
| pr-review | skills/pr-review.md | review, PR, diff, merge request |
| meta | skills/meta.md | improve agent, audit skills, retrospective |
| skill-creator | skills/skill-creator.md | create skill, repeated workflow, capability gap |
| routing-optimizer | skills/routing-optimizer.md | optimize routing, learn synonyms, routing failure |
| agent-doctor | skills/agent-doctor.md | clean up agent, prune dead skills, archive lessons |

## Memory

- `memory/facts.md`: durable repo conventions and system rules.
- `memory/working.md`: rotating buffer of the last 5 non-trivial tasks.
- `memory/archive.md`: compacted task history.
- `learning/lessons.md`: notable discoveries and workarounds.
- `learning/feedback.md`: user corrections.
- `learning/patterns.md`: recurring lessons being evaluated for promotion.
- `learning/changelog.md`: audit log for `.agent/` edits.

## Routing Rules

4|1. Start from `AGENTS.md`; consult `CLAUDE.md` only for compatibility or historical template context.
5|2. For non-trivial work, read this file before proceeding; always sync with `memory/facts.md`.
6|3. If the request is vault maintenance, load the matching repo-specific skill (e.g., llm-wiki).
7|4. For complex tasks requiring >1 tool call or multiple files, you MUST first generate a structured plan and populate the `todo` list.
8|5. Execution must be atomic: each turn should focus on completing exactly one item from the current todo.
9|6. If a task is large (e.g., refactoring), split it into several distinct turns to prevent timeout/cutoff.
10|7. For vault markdown operations, use MCP tools when available; otherwise, report that and use direct file I/O only for requested local changes.
11|8. After completing a sequence of interrelated steps, perform the standard post-task loop to update logs and learning repository.

## Execution Hierarchy

| Approach | When to Use |
|---|---|
| Direct edit/check | Trivial changes and narrow reads |
| Skill-guided execution | Default for substantial repeatable work |
| Parallel tool reads/checks | Independent inspections, searches, or validations |
| Goal/automation/plugin | Long-running, scheduled, or installable workflows |

Do not model routine work as provider-specific subagent delegation. If a repeated workflow becomes valuable, improve a skill or promote it into a reusable workflow or plugin outside this repo.

## Compatibility Notes

- `.claude/agents/` remains available for Claude Code users and as prompt reference material.
- Root `.agent/` is provider-neutral and should not depend on `.claude/agents/` to function.
- `templates/.agent-template/` remains the public distribution copy and may preserve provider-specific examples until a template migration is planned.

## Notes

- `.agent/` is tracked in this repo because this repository publishes and dogfoods the system.
- Runtime scratch files belong in `.agent/local/` or `.agent/tmp/`, which are ignored.

**Version**: 5.3 provider-neutral runtime (v5.2 self-repair features included)
**Last Updated**: 2026-06-08
