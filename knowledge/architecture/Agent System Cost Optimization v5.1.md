---
tags: [agent-system, cost-optimization, workflow, subagent, v51]
created: 2026-06-05
updated: 2026-06-08
status: active
version: v5.1-5.2
---

# Agent System Cost Optimization (v5.1 → v5.2)

**Core Rule**: DEFAULT never use Workflow tool. Subagents are 10-20x cheaper (5-15K vs 50-200K tokens). Average savings: 85-90%.

---

## Decision Tree

```
Task received
    ↓
Trivial? (<5 lines, no logic)
    ├─ YES → Execute directly (2-5K tokens)
    └─ NO → Existing subagent handles this?
        ├─ YES → Delegate with Agent tool (5-15K tokens)
        └─ NO → Capability gap detected
            ↓
            Pattern seen 2-3× OR ≥5 tool calls expected?
            ├─ YES → Propose NEW subagent creation (user approves → create from template)
            └─ NO → User said "ultracode" or "use a workflow"?
                ├─ YES → Workflow OK (warn about 50-200K cost)
                └─ NO → Ask user: "Need workflow (50K+) or new subagent (5-15K)?"
```

---

## Workflow Prohibition

**ONLY use Workflow when**:
1. User explicitly says "use a workflow" / "ultracode" / "+500k budget"
2. Task genuinely requires 10+ parallel subagents (extremely rare)
3. After creating subagent, still insufficient (must explain why first)

**Enforcement pattern** for any high-cost tool:
1. Explicit prohibition with exceptions
2. Cost-visible decision tree
3. STOP checkpoint before expensive call
4. Template for cheap alternative

---

## Subagent Creation (10 min from gap to working)

**Trigger**: Task doesn't match any subagent AND (seen 2-3x OR ≥5 tool calls OR domain-specific)

**Process**: Copy `_TEMPLATE.md` → fill Purpose/Process/Return/Errors → save to `.claude/agents/` → update `.agent/index.md` → test

**Return format** (standard):
```json
{
  "confidence": 0.85,
  "files_touched": ["path1"],
  "outcome": "success|partial|fail",
  "next_action": "user decision|retry|delegate to X",
  "summary": "What was done"
}
```

---

## Existing Subagents (Redshift Reporting v5.2)

| Subagent | Purpose | Typical Cost |
|----------|---------|--------------|
| sql-worker | MSSQL → Redshift SP conversion | 8-12K |
| validator | Run validation, report PASS/FAIL | 5-8K |
| fixer | Diagnose diffs, apply fixes | 6-10K |
| wiki-keeper | Update wiki, maintain cross-links | 5-12K |
| researcher | Pre-flight checks, pattern mining | 10-15K |
| **agent-doctor** | **Self-repair .agent/ system** | **10-15K** |

Coverage: ~95% of Redshift Reporting tasks (up from 90% with agent-doctor added).

---

## v5.2 Cost Optimization: Skill Slimming

**Problem (v5.1)**: Skills that delegate to subagents contained full inline prompts (100+ lines each), duplicating the subagent definition in `.claude/agents/*.md`.

**Fix (v5.2)**: Rewrote 4 workflow skills as dispatch-only guides:
- `convert-sp-block.md`: 96 → 26 lines
- `validate-migration.md`: 104 → 25 lines
- `fix-validation-diff.md`: 138 → 27 lines
- `update-wiki.md`: 129 → 27 lines

**Principle**: A skill that delegates should only contain:
1. Purpose (1 line)
2. Triggers (keywords)
3. Dispatch instruction (subagent name + inputs to provide)
4. Post-dispatch checklist (2-3 items)
5. Anti-patterns (1-2 items)

The subagent `.md` file IS the prompt. The skill is just a routing decision.

**Token impact**: ~360 lines removed from skill loading = ~4K tokens saved per session that loads all 4 skills.

---

## System Hygiene (agent-doctor)

**Monthly maintenance cost**: ~10-15K tokens (one agent-doctor run)

**What it saves**: Prevents gradual bloat that would eventually cost 50K+ per session in wasted context loading.

**ROI**: 10-15K invested monthly → saves ~4K per session × ~30 sessions = ~120K tokens/month net savings.

---

## Cross-Repo Rollout

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Redshift Reporting stabilization | Done (v5.2) |
| 2 | RGDH API upgrade | Next |
| 3 | DataGen + Glue + Airflow | Planned |
| 4 | Infrastructure + SRE (bootstrap from v2) | Planned |
| 5 | Hub consolidation + canonical subagent library | Future |

---

## Related

- [[knowledge/architecture/Agent System Self-Iteration - Current Status]] — v5.0 autonomous learning
- [[knowledge/architecture/Agent System Meta-Optimizer]] — agent-doctor details
- [[companies/razer-gold/projects/Redshift Reporting]] — primary deployment
- [[Data Platform Repos - Agent System Status]] — cross-repo status
