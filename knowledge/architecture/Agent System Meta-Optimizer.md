---
tags: [agent-system, meta-optimizer, optimization, agent-doctor]
created: 2026-06-03
updated: 2026-06-08
status: active
---

# Agent System Meta-Optimizer

**Status**: Superseded by `agent-doctor` subagent (v5.2, 2026-06-08)

---

## Evolution: optimize-system.md → agent-doctor

The original `/optimize-system` skill (378 lines, aspirational, never executed) has been **replaced** by the `agent-doctor` subagent — a lean, actionable self-repair tool.

| Aspect | optimize-system (v5.0-5.1) | agent-doctor (v5.2) |
|--------|---------------------------|---------------------|
| Type | Skill (main agent executes) | Subagent (delegated) |
| Size | 378 lines | 80 lines |
| Execution time | ~60 min (aspirational) | ~15 min (actual) |
| Usage | 0 (never run) | 1st run: 2026-06-08 |
| Approach | 8-step protocol with reports | 6 targeted repair actions |
| Output | META_LESSONS + OPTIMIZATION_REPORT | JSON summary + direct file fixes |

---

## agent-doctor: What It Does

Self-repair specialist for `.agent/` system hygiene. Receives a **repair manifest** from main agent (which diagnoses), then executes targeted fixes.

### 6 Repair Actions

| Action | Trigger | What it does |
|--------|---------|--------------|
| prune-dead-skills | hit_count=0 + last_used >60d | Delete skill file + remove from index.md |
| archive-lessons | entries >30d old | Move to `lessons_archive_YYYY-MM-DD.md` |
| fix-working-memory | duplicate sections detected | Reconstruct clean structure (1 active + 5 recent) |
| sync-manifest | deleted/added skills out of sync | Bump version, add/remove entries |
| compact-solutions | templates with 0/0 success rate | Remove unused, keep proven |
| slim-skills | skill >40 lines AND delegates to subagent | Rewrite as dispatch-only guide |

### Dispatch Pattern

```
Main agent (meta.md skill) → diagnoses system health
    ↓
Identifies repair manifest (which actions needed)
    ↓
Delegates to agent-doctor (Agent tool, ~10-15K tokens)
    ↓
agent-doctor executes all actions, returns summary
    ↓
Main agent logs to lessons.md
```

### First Run Results (2026-06-08)

| Metric | Before | After |
|--------|--------|-------|
| Skills | 14 (6 dead) | 8 active |
| lessons.md | ~90 entries mixed | 6 active + archive |
| working.md | Corrupted (duplicates) | Clean structure |
| manifest.json | v2 (stale) | v3 (synced) |
| solutions.md | 329 lines (3 empty templates) | 122 lines |
| Workflow skills | 467 lines (4 files) | 105 lines (dispatch-only) |
| **Total reduction** | - | **~35%** |

---

## When to Run

| Trigger | Frequency | Who initiates |
|---------|-----------|---------------|
| lessons.md > 30 entries | Ad-hoc | Main agent auto-detects |
| Dead skills (hit_count=0, >60d) | Monthly check | meta.md retrospective |
| working.md corruption | On detection | Main agent |
| Monthly retrospective | Every 30 days | Main agent (scheduled) |
| User request | On-demand | "clean up agent system" |

---

## Key Design Decisions

1. **Subagent, not skill**: The original skill tried to do everything (diagnose + fix + report + deploy). Separating diagnosis (main agent) from execution (agent-doctor) follows delegation-first architecture.

2. **Repair manifest pattern**: Main agent decides WHAT to fix, agent-doctor decides HOW. This prevents autonomous deletion without oversight.

3. **Slim skills**: Skills that delegate to subagents don't need inline prompts — the subagent definition (`.claude/agents/*.md`) IS the prompt. Skill just needs: Purpose, Triggers, Dispatch inputs, Anti-patterns.

4. **Archived, not deleted**: Lessons move to `lessons_archive_*.md` (preserved history), never deleted. Skills with hit_count=0 DO get deleted (they can be recreated via skill-creator if needed again).

---

## Cross-Repo Applicability

**HIGH** — agent-doctor pattern works for any repo with `.agent/` v4+ architecture.

**Deploy to other repos**:
1. Copy `.claude/agents/agent-doctor.md` to target repo
2. Register in `.agent/index.md` subagents table
3. Main agent's `meta.md` skill already knows how to trigger it

**Adaptation needed**: Repair actions are generic. Only `slim-skills` needs domain knowledge (which skills delegate to which subagents), but that's discoverable from `index.md`.

---

## Related

- [[knowledge/architecture/Agent System Cost Optimization v5.1]] — workflow prohibition (v5.1)
- [[knowledge/architecture/Agent System Self-Iteration - Current Status]] — autonomous learning (v5.0)
- [[Data Platform Repos - Agent System Status]] — cross-repo status
- [[companies/razer-gold/projects/Redshift Reporting]] — primary deployment
