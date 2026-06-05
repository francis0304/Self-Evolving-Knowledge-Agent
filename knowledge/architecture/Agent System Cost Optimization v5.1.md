---
tags: [agent-system, cost-optimization, workflow, subagent, v51]
created: 2026-06-05
updated: 2026-06-05
status: active
version: v5.1
---

# Agent System Cost Optimization (v5.1)

## Version: v5.1 (2026-06-05)

**Major Upgrade**: Workflow Tool Prohibition + Subagent-First Strategy

## TL;DR

Workflow tool is 10-20× more expensive than subagents (50-200K tokens vs 5-15K). v5.1 enforces strict prohibition: **DEFAULT never use Workflow** unless user says "ultracode". When capability gap detected, create new subagent instead (template-guided, 10min from 0). **Average token savings: 85-90%**.

---

## Problem Statement

**User Feedback** (2026-06-05):
> "workflow的token消耗太大了...尽量只委派subagent做事情...如果没有对应的subagent就create"

**Root Cause**: Agent was using Workflow tool (50-200K tokens) for tasks that could be handled by subagents (5-15K tokens) — **10-20× cost difference**. Workflow should be ultra-rare (only for "ultracode" or genuinely needing 10+ parallel subagents).

---

## Cost Comparison

| Approach | Token Cost | Wall Time | When to Use |
|----------|-----------|-----------|-------------|
| **Direct execution** | 2-5K | 10-30s | Trivial (<5 lines, no logic) |
| **Subagent (Agent tool)** | 5-15K | 20-60s | **Default for 95% of tasks** ⭐ |
| **Workflow (Workflow tool)** | 50-200K | 2-10min | User approval required ⚠️ |

**Savings**: Subagent vs Workflow = **85-90% token reduction**

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
            Pattern seen 2-3×? OR clearly non-trivial (≥5 tool calls)?
            ├─ YES → Propose NEW subagent creation
            │         User approves → Create from template → Delegate
            └─ NO → User said "use a workflow" or "ultracode"?
                ├─ YES → Workflow tool OK (warn about 50-200K cost)
                └─ NO → Ask: "Need workflow (50K+) or new subagent (5-15K)?"
```

**Key Principle**: If you catch yourself about to call Workflow → **STOP** → Ask: "Can I create a subagent instead?" → Almost always YES.

---

## Workflow Tool Prohibition (CRITICAL Rules)

### DEFAULT: Never Use Workflow Tool

**From CLAUDE.md §Agent Architecture**:

> **DO NOT use the Workflow tool** unless explicitly approved by user with "ultracode" keyword or user types "use a workflow".
>
> **Why**: Workflows consume massive tokens (50K-200K per run) and are expensive. Subagents are 10-20× more efficient.

### ONLY Use Workflow When

1. User explicitly says "use a workflow", "ultracode", or "+500k budget"
2. Task genuinely requires 10+ parallel subagents (extremely rare — e.g., "audit ALL 50 SPs")
3. After creating appropriate subagent, still insufficient (must explain why to user first)

### Enforcement Pattern

High-cost tools (Workflow, opus model, graphify full refresh) need **EXPLICIT GATEKEEPING**:

1. **Explicit prohibition**: "DO NOT use X unless Y"
2. **Cost-visible decision tree**: Show token costs at every decision point
3. **STOP checkpoint**: Force agent to pause before expensive call
4. **Cheap-alternative template**: Make it easy to choose the efficient path

**Why This Matters**: Vague guidance ("prefer subagents") doesn't work — agent will rationalize using the expensive path. Enforcement requires hard stops + explicit costs.

---

## Subagent Creation (When Gap Detected)

### Trigger Conditions

**Capability gap** = Task doesn't match any existing subagent AND is non-trivial:

- Pattern seen 2-3× before (confirmed need)
- OR clearly non-trivial (≥5 tool calls expected)
- OR complex multi-step process (5+ steps)
- OR domain-specific knowledge required
- OR time-consuming (>5 minutes per occurrence)

### Creation Process (10 Minutes)

**1. Detect gap**:
```
"No subagent handles X"
+ (Occurred 2-3× OR Expected ≥5 tool calls)
→ Capability gap
```

**2. Propose to user**:
```
🤖 Subagent Creation Proposal: {name}

**Gap**: No existing subagent handles {task type}
**Frequency**: {1× new | 2× emerging | 3× confirmed pattern}
**Estimated cost**: Subagent (~5-10K tokens) vs Workflow (~50-200K tokens)

**Proposed subagent**:
- Name: {name}
- Purpose: {one-line}
- Tools: {Read, Edit, Bash, etc.}
- Process: {3-5 steps}

Create this subagent? (y/n/modify)
```

**3. If approved** (10-minute workflow):
1. Copy `.claude/agents/_TEMPLATE.md`
2. Replace `{Name}`, `{Purpose}`, etc.
3. Fill 3-5 step Process
4. Define Return format details
5. Add 2-3 common error handlers
6. Write 1-2 Examples
7. Save to `.claude/agents/{name}.md`
8. Update `.agent/index.md`
9. Test with delegation
10. Log in `.agent/learning/changelog.md`

---

## Subagent Template Structure

**12 Sections** (from `.claude/agents/_TEMPLATE.md`, 1200+ lines):

1. **Purpose** - One-line description
2. **When to spawn** - Trigger conditions
3. **Tools available** - Subset (Read, Edit, Bash, Grep, Glob, Write)
4. **Context on spawn** - What main agent provides
5. **Process** - 3-5 steps (What/How/Tools/Output)
6. **Return format** - JSON schema:
   ```json
   {
     "confidence": 0.85,
     "files_touched": ["path1", "path2"],
     "outcome": "success|partial|fail",
     "next_action": "user decision|retry|delegate to X",
     "summary": "What was done",
     "details": { /* optional structured data */ }
   }
   ```
7. **Error Handling** - Symptom → Cause → Fix → Return
8. **Anti-patterns** - Wrong vs Right with reasons
9. **Examples** - Success case + Error case
10. **Integration** - How main agent delegates
11. **Confidence Scoring Guidelines** - 0.0-1.0 scale
12. **Metadata** - Created date, usage count, success rate

---

## Confidence Scoring (For Subagents)

| Range | Meaning | Main Agent Action |
|-------|---------|-------------------|
| 0.9-1.0 | High (all steps succeeded, validated) | Present as "done", offer next step |
| 0.7-0.8 | Medium-high (succeeded, some assumptions) | Present as "done", mention assumptions |
| 0.5-0.6 | Medium (novel approach, needs review) | Present as "draft, please review" |
| 0.3-0.4 | Low (partial completion, uncertain) | Present as "attempted, needs your input" |
| 0.0-0.2 | Very low (failed, don't know how to proceed) | Present as "failed", explain issue |

**Main agent uses confidence to set user expectations**.

---

## Existing Subagents (Redshift Reporting)

**5 specialists** in `.claude/agents/`:

| Subagent | Purpose | Tools | Typical Cost |
|----------|---------|-------|--------------|
| **sql-worker** | MSSQL → Redshift SP conversion | Read, Write, Edit | 8-12K |
| **validator** | Run validation cases, report PASS/FAIL | Read, Bash | 5-8K |
| **fixer** | Diagnose validation diffs, apply fixes | Read, Edit, Bash | 6-10K |
| **wiki-keeper** | Update wiki pages, maintain cross-links | Read, Write, Edit, Grep | 5-12K |
| **researcher** | Pre-flight checks, pattern mining (>5 files) | Read, Grep, Glob | 10-15K |

**Coverage**: These 5 subagents handle ~90% of Redshift Reporting tasks.

**When to create 6th subagent**: Task doesn't fit any of the above AND meets trigger conditions.

---

## Cost Savings Examples

### Scenario 1: SP Migration Task
- **Before** (Workflow): 50-80K tokens
- **After** (sql-worker subagent): 8-12K tokens
- **Savings**: **85-90%**

### Scenario 2: Validation Fix
- **Before** (Workflow): 60-100K tokens
- **After** (validator + fixer subagents): 11-18K tokens (sequential)
- **Savings**: **82-85%**

### Scenario 3: Wiki Update
- **Before** (Workflow): 40-60K tokens
- **After** (wiki-keeper subagent): 5-12K tokens
- **Savings**: **80-88%**

### Scenario 4: Research Task
- **Before** (Workflow): 70-120K tokens
- **After** (researcher subagent): 10-20K tokens
- **Savings**: **83-86%**

**Average savings across all task types**: ~85%

---

## Usage Distribution (Predicted)

### After v5.1 Enforcement

- **Direct execution**: 5% (trivial <5 lines)
- **Subagent delegation**: **90%** (vast majority) ⭐
- **Subagent creation**: 4% (new capability gaps, reusable)
- **Workflow**: 1% (ultracode only, 10+ parallel) ⚠️

### Before v5.1 (No Enforcement)

- Workflow usage was ~15-20% (too high)
- Many tasks used Workflow when subagent would suffice

### Impact

- **14-19% shift** from Workflow → Subagent
- **Massive token savings** across the board

---

## Enforcement Mechanisms

### 1. CLAUDE.md (System Instructions)

**§Agent Architecture** includes:

```markdown
### CRITICAL: Workflow Tool Prohibition ⚠️

**DO NOT use the Workflow tool** unless explicitly approved by user 
with "ultracode" keyword or user types "use a workflow".

**Why**: Workflows consume massive tokens (50K-200K per run) and are 
expensive. Subagents are 10-20× more efficient.

**Decision tree**: [full tree shown in file]

**ONLY use Workflow when**:
- User explicitly says "use a workflow" or "ultracode"
- Task genuinely requires 10+ parallel subagents (extremely rare)
- After creating appropriate subagent still insufficient (must explain why)

**Default to subagent creation** when capability gap detected.
```

### 2. .agent/index.md (Routing Rules)

**§Routing rules #13** (new):

```markdown
## ⚠️ CRITICAL: Workflow Tool Prohibition

**DEFAULT: Never use Workflow tool** — 10-20× more expensive than subagents.

**Decision tree for ANY task**: [full tree]

**ONLY use Workflow when**: [conditions]

**Cost comparison**: [table]

**If you catch yourself about to call Workflow** → STOP → 
Ask: "Can I create a subagent instead?" → Almost always YES.
```

### 3. Lessons.md (Learning Record)

**Entry** `[2026-06-05] system | Workflow Tool Prohibition`:

- Documents the problem (user feedback)
- Explains the solution (three-part enforcement)
- Shows cost comparison (memorize)
- Provides decision tree (reference)
- Describes enforcement pattern (reusable for other expensive tools)

**Lesson**: "High-cost tools need EXPLICIT GATEKEEPING. Vague guidance doesn't work."

---

## Integration with skill-creator.md

Subagent creation follows same **3× pattern detection** logic as skill creation:

1. **Pattern detected** (from lessons.md): Task type occurred 3×
2. **Check existing coverage**: Does any subagent/skill handle this?
3. **If NO match** → Capability gap
4. **Propose creation**: Subagent (for execution) OR Skill (for workflow routing)
5. **User approves** → Create from template
6. **Test** → Mark active if works

**Difference**:
- **Skill** (`.agent/skills/*.md`) = Workflow routing + delegation instructions
- **Subagent** (`.claude/agents/*.md`) = Execution specialist with tools

**Both use 3× rule**, but subagent is cheaper and more reusable.

---

## Lessons for Agent System Design

### High-Cost Tools Need Explicit Gatekeeping

**Pattern** (applies to any expensive tool):

1. **Explicit prohibition** + exceptions ("DO NOT use X unless Y")
2. **Cost-visible decision tree** (show token costs)
3. **STOP checkpoint** before expensive call
4. **Template for cheap alternative** (make easy choice obvious)

**Why Vague Guidance Fails**:
- "Prefer subagents" → Agent rationalizes Workflow as "necessary"
- No explicit costs → Can't make informed decision
- No template → Creating subagent seems hard, Workflow seems easy

**After Enforcement**:
- "DEFAULT: Never use Workflow" → Clear prohibition
- Cost table at every decision point → Informed choice
- STOP pattern → Forced pause before expensive call
- _TEMPLATE.md → 10-minute subagent creation

**Result**: 85-90% token savings

---

## Related

- [[Agent System Self-Iteration - Current Status]] - v5.0 autonomous learning (v5.1 builds on this)
- [[Redshift Reporting|companies/current-company/projects/Redshift Reporting]] - Primary deployment repo
- [[Data Platform Repos - Agent System Status]] - Cross-repo rollout status

---

## Sources

- `CLAUDE.md:87-176` (Agent Architecture + Subagent Creation sections)
- `.agent/index.md:47-72` (Routing rules + Workflow prohibition)
- `.agent/learning/lessons.md:9-32` (System lesson 2026-06-05)
- `.claude/agents/_TEMPLATE.md` (1200+ line subagent template)
- User feedback (2026-06-05): "workflow的token消耗太大了"
- `knowledge/wiki/agent-system-cost-optimization.md` (local wiki page)

---

## Version History

- **v5.1** (2026-06-05): Workflow tool prohibition + subagent-first enforcement
- **v5.0** (2026-06-05): Autonomous post-task loop + smart graphify refresh
- **v4.0** (2026-05-25): Delegation-first architecture (5 subagents baseline)
- **v3.0** (2026-04): LLM-Wiki pattern + graphify baseline
- **v2.0** (2026-03): Skill-based routing + memory system
- **v1.0** (2025-12): Monolithic agent + basic task tracking

---

## Next Steps (Cross-Repo Rollout)

### Phase 1: Stabilization (2 weeks)
**Focus**: Monitor Redshift Reporting v5.1
- Collect metrics: Workflow usage drop, subagent creation rate, token savings
- Validate 85-90% savings prediction
- Fine-tune enforcement language if needed

**Success Criteria**:
- Workflow usage <2% of all tasks
- 10+ tasks completed, all via subagents
- Zero user complaints about over-restriction

### Phase 2: Reporting API Upgrade (1 week)
**Reason**: Simpler structure, good second test

**Tasks**:
- Deploy v5.1 enforcement
- Create 2-3 API-specific subagents (api-worker, api-tester, api-doc)
- Test 5+ tasks, monitor behavior

### Phase 3: DataGen + Glue + Airflow (2 weeks)
**Parallel rollout**:
- Each repo gets v5.1 enforcement
- Create repo-specific subagents as gaps emerge
- Monitor for 1 week each

### Phase 4: Infrastructure + SRE (3 weeks)
**Bootstrap from v2.0 first**, then add v5.1:
- Infrastructure: terraform-worker, iac-reviewer, doc-writer
- SRE: iam-auditor, role-creator, security-scanner

### Phase 5: Hub Consolidation (ongoing)
**After all repos at v5.1**:
- Export common subagent patterns to hub
- Create canonical subagent library
- Cross-repo subagent reuse

---

**Maintained by**: Francis Lim  
**Deployed**: Redshift Reporting (2026-06-05)  
**Next Deployment**: Reporting API (2026-06-12 estimated)
