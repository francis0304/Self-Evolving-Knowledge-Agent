# Memory System (v5.1)

## TL;DR

Three files, three cadences:

| File | What it holds | Updated when |
|------|---------------|-------------|
| **facts.md** | Hardened rules, conventions, constraints | Rarely (when project fundamentals change) |
| **working.md** | Active tasks (rotating 5-item buffer) | After every non-trivial task |
| **archive.md** | Completed tasks (grep-searchable by tag) | When working.md buffer exceeds 5 |

**Promotion flow**: `learning/lessons (1x) → learning/patterns (3x) → memory/facts (hardened)`

**Who writes**: Only the **main agent** writes to memory. Subagents return results but never touch these files.

---

## What is the Memory System?

The `.agent/memory/` directory contains **session-persistent knowledge** that helps the agent system maintain context, avoid repeating mistakes, and improve over time.

### Memory vs Learning

| Directory | Purpose | Lifespan | Update Frequency |
|-----------|---------|----------|------------------|
| **memory/** | Project facts, active tasks | Permanent | Rarely (facts), often (working) |
| **learning/** | Lessons, patterns, feedback | Permanent | After discoveries |

---

## Memory Files

### 1. facts.md - Project Conventions

**Purpose**: Immutable truths about your project that agents must always respect.

**Contents**:
- Code conventions (naming, structure, style)
- Tech stack constraints (versions, compatibility)
- Critical rules (always/never patterns)
- File locations and patterns
- External dependencies

**Lifespan**: Permanent (updated only when project fundamentals change)

**When to Update**:
- Tech stack upgrade (e.g., Python 3.9 → 3.11)
- Architecture change (e.g., monolith → microservices)
- New critical rule discovered (e.g., "always validate inputs")

**Who Updates**: Humans (project maintainers) or agents with explicit user approval

---

### 2. working.md - Active Tasks

**Purpose**: Track current tasks, blockers, and next steps.

**Contents**:
- Today's tasks
- In-progress work
- Blockers and dependencies
- Recent completions (last 7 days)
- Metrics and outcomes

**Lifespan**: Rolling (recent 7 days active, older moved to archive.md)

**When to Update**:
- Task starts
- Task completes
- Blocker encountered
- Status changes

**Who Updates**: Agents automatically (main orchestrator or @keeper)

---

### 3. archive.md - Completed Work

**Purpose**: Historical record of completed tasks for reference.

**Contents**:
- Completed tasks (older than 7 days)
- Outcomes and metrics
- Major milestones
- Links to relevant commits/PRs

**Lifespan**: Permanent (append-only)

**When to Update**:
- Weekly rollover from working.md
- Major milestone reached
- Project phase completed

**Who Updates**: Agents automatically (weekly cleanup) or humans (milestones)

---

## File Templates

### facts.md Template

```markdown
# Project Facts

## Repository Information
**Name**: [Repository name]
**Purpose**: [One-line description]
**Tech Stack**: [Languages, frameworks, tools]
**Version**: [Current version]

---

## Code Conventions

### Naming
- [Convention 1 - e.g., "camelCase for variables"]
- [Convention 2 - e.g., "PascalCase for classes"]
- [Convention 3 - e.g., "UPPER_SNAKE for constants"]

### Structure
- [Convention 1 - e.g., "One class per file"]
- [Convention 2 - e.g., "Tests in __tests__ directory"]
- [Convention 3 - e.g., "Utils in src/utils/"]

### Style
- [Convention 1 - e.g., "2-space indentation"]
- [Convention 2 - e.g., "Max 80 chars per line"]
- [Convention 3 - e.g., "JSDoc comments required"]

---

## Critical Rules

### Always
- [Rule 1 - e.g., "Always validate user inputs"]
- [Rule 2 - e.g., "Always use parameterized queries"]
- [Rule 3 - e.g., "Always catch async errors"]

### Never
- [Rule 1 - e.g., "Never commit secrets"]
- [Rule 2 - e.g., "Never use eval()"]
- [Rule 3 - e.g., "Never ignore TypeScript errors"]

---

## File Locations

**Source code**: [Path]
**Tests**: [Path]
**Configs**: [Path]
**Documentation**: [Path]
**Build output**: [Path]

---

## Dependencies

**Required**:
- [Dependency 1 - e.g., "Node.js >= 18"]
- [Dependency 2 - e.g., "PostgreSQL 14"]

**Optional**:
- [Dependency 3 - e.g., "Redis (for caching)"]

---

## Domain-Specific Facts

[Add sections specific to your domain]

**Example** (SQL migration project):
### Schema Routing
- REPORTING = output schema (store procedures, tables)
- vSOURCE = views schema (read-only)

### Type Conversion
- Always ROUND before narrowing CAST to DECIMAL
- Use ::TYPE syntax, not CAST(x AS TYPE)

---

**Last Updated**: [DATE]
**Next Review**: [DATE + 3 months]
```

---

### working.md Template

```markdown
# Active Tasks

---

## Today: [YYYY-MM-DD]

### In Progress

#### [Task Name 1]
- **Started**: [TIME]
- **Status**: [In Progress / Blocked / Waiting]
- **Actions Taken**:
  - [Action 1]
  - [Action 2]
- **Next Steps**:
  - [Step 1]
  - [Step 2]
- **Blocker**: [If any - description + dependency]

---

### Completed Today

#### [Task Name 2]
- **Completed**: [TIME]
- **Duration**: [Minutes]
- **Outcome**: [Description]
- **Metrics**:
  - [Metric 1]: [Value]
  - [Metric 2]: [Value]
- **Files Changed**:
  - [File 1]
  - [File 2]
- **Notes**: [Any important details]

---

## Recent (Last 7 Days)

### [YYYY-MM-DD]

#### [Task Name]
- **Status**: [Complete / Failed / Deferred]
- **Outcome**: [Summary]
- **Key Learnings**: [If any]

---

## Upcoming

### Planned
- [Task 1 - Priority: High]
- [Task 2 - Priority: Medium]
- [Task 3 - Priority: Low]

### Deferred
- [Task 1 - Reason: [Why deferred]]
- [Task 2 - Reason: [Why deferred]]

---

## Blockers & Dependencies

### Active Blockers
- **[Blocker 1]**: [Description] - Waiting on [Dependency]
- **[Blocker 2]**: [Description] - Blocked by [Issue]

### Resolved
- ~~[Blocker 1]~~ - Resolved [DATE]: [How]

---

**Last Updated**: [YYYY-MM-DD HH:MM]
```

---

### archive.md Template

```markdown
# Task Archive

---

## 2026-06

### Week 1 (Jun 1-7)

#### [Task Name 1]
- **Date**: 2026-06-03
- **Type**: [Feature / Bug Fix / Refactor]
- **Outcome**: [Description]
- **Metrics**:
  - [Metric 1]: [Value]
  - [Metric 2]: [Value]
- **Link**: [PR #123](link)

#### [Task Name 2]
- **Date**: 2026-06-05
- **Type**: [Feature / Bug Fix / Refactor]
- **Outcome**: [Description]
- **Link**: [Commit abc123](link)

---

### Week 2 (Jun 8-14)

[Similar format]

---

## 2026-05

### Milestones
- **v1.0 Released** (2026-05-30)
  - 40 features completed
  - 95% test coverage
  - Production deployment successful

### Summary
- Total tasks: 127
- Success rate: 92%
- Average task time: 15 minutes
- Key achievements: [List]

---

## 2026-04

[Similar format]

---

**Archive Start**: [First task date]
**Total Tasks Archived**: [Count]
```

---

## Usage Patterns

### For Main Orchestrator

**At session start**:
1. Load `facts.md` - Get project constraints
2. Load `working.md` - Understand current state
3. Check for blockers - Plan around them

**During task**:
1. Reference facts.md when delegating (include critical rules)
2. Update working.md as task progresses
3. Log outcomes to working.md on completion

**At session end**:
1. Ensure working.md is up-to-date
2. Move completed tasks >7 days old to archive.md

---

### For Subagents

**Receive from main**:
- Relevant excerpts from facts.md (not entire file)
- Current task context from working.md

**Don't directly access**:
- Subagents don't read/write memory files
- Main orchestrator provides curated context
- Keeps subagent context light

---

## Best Practices

### 1. Keep facts.md Lean

**Good**: 50-100 lines of essential facts
**Bad**: 500 lines of every detail ever

**Guideline**: If it changes more than once per quarter, it's not a fact (move to learning/)

---

### 2. Update working.md Frequently

**Pattern**:
```
Task starts → Create entry (In Progress)
Task progresses → Update actions taken
Task completes → Update outcome + metrics
```

**Frequency**: Every significant state change (not every 5 minutes)

---

### 3. Archive Regularly

**Pattern**: Weekly rollover
```
Every Monday:
  Move completed tasks >7 days from working.md → archive.md
  Keep working.md focused on current/recent
```

**Automation**: Add to .claude/settings.json hook:
```json
{
  "hooks": {
    "SessionStart": "bash .agent/scripts/archive_old_tasks.sh"
  }
}
```

---

### 4. Version Facts

**When making major changes to facts.md**:
```markdown
## Change Log

### 2026-06-03
- Added: Schema routing rules (REPORTING vs vSOURCE)
- Changed: CAST convention (now requires ROUND first)
- Removed: Obsolete temp table pattern

### 2026-05-15
- Initial version
```

---

## Integration with Learning

### Flow: Memory → Learning

When a pattern emerges from repeated tasks:

**Example**:
```
working.md shows:
  - 2026-06-01: Convert block 5 - Required ROUND before CAST
  - 2026-06-02: Convert block 8 - Required ROUND before CAST
  - 2026-06-03: Convert block 12 - Required ROUND before CAST

Pattern detected (3+ occurrences):
  → Extract to learning/patterns.md
  → Potentially promote to facts.md (if universal)
```

---

### Flow: Learning → Memory

When a lesson becomes a universal rule:

**Example**:
```
learning/lessons.md contains:
  - Lesson: Always ROUND before DECIMAL cast (12 instances)

Becomes universal:
  → Promote to facts.md under "Critical Rules"
  → Keep lesson in learning/ for historical context
```

---

## Common Pitfalls

### Pitfall 1: Stale Facts

**Problem**: facts.md outdated, agents use wrong conventions

**Solution**: Quarterly review, version changes, notify team

---

### Pitfall 2: Bloated working.md

**Problem**: working.md has 6 months of history, slow to parse

**Solution**: Weekly archival, keep only last 7 days active

---

### Pitfall 3: No Memory Updates

**Problem**: Tasks complete but working.md not updated, no learning

**Solution**: Make memory update mandatory in skill workflows (Step 7)

---

### Pitfall 4: Facts vs Learning Confusion

**Problem**: Putting one-off lessons in facts.md, cluttering

**Solution**:
- facts.md = Universal, permanent truths
- learning/lessons.md = Specific discoveries
- Promote after 3+ confirmations

---

## Metrics to Track

In archive.md, track these monthly:

```markdown
## 2026-06 Summary
- **Total Tasks**: 127
- **Success Rate**: 92% (117 successful, 10 failed)
- **Average Time**: 15 minutes per task
- **Top Task Types**:
  1. Conversion (40 tasks)
  2. Validation (35 tasks)
  3. Bug Fix (25 tasks)
- **Top Blockers**:
  1. External API down (3 tasks blocked)
  2. Missing test data (2 tasks blocked)
```

Use for:
- Spotting trends
- Identifying bottlenecks
- Measuring improvement over time

---

## Example: Real-World Memory (redshift-reporting)

### facts.md (Excerpt)

```markdown
# Project Facts

## Repository Information
**Name**: example-repo-redshift
**Purpose**: Migrate MSSQL stored procedures to Redshift with validation
**Tech Stack**: Redshift PL/pgSQL, Python 3.9, PostgreSQL drivers

---

## Critical Rules

### Always
- ROUND before narrowing CAST to DECIMAL(18,2)
- Quote all identifiers (case-sensitive Redshift)
- Use SECURITY DEFINER for all stored procedures

### Never
- Use dynamic SQL (hard to validate)
- Deploy without validation passing
- Commit MSSQL source code changes

---

## Schema Routing
- **REPORTING** = output schema (store procedures, tables)
- **vSOURCE** = views schema (read-only)

## FX Rate Lookups
- Always hardcode 'USD' currency
- Never use @CurrencyCode variable (causes validation diffs)
```

---

### working.md (Excerpt)

```markdown
# Active Tasks

## Today: 2026-06-03

### Completed Today

#### Convert RPT_OrderSummary Block 15
- **Completed**: 14:23
- **Duration**: 90 seconds
- **Outcome**: Conversion successful, validation PASS
- **Metrics**:
  - Lines: 70 MSSQL → 45 Redshift
  - Validation: 8432 rows, 0 diffs
  - Context: 36K tokens (vs 50K+ monolithic)
- **Files Changed**:
  - reporting/store_procedures/RPT_OrderSummary.sql
  - knowledge/wiki/rpt-ordersummary-validation.md
- **Notes**: Required pre-flight (god node), used Block 3 CTE pattern

#### Convert RPT_SalesByRegion Block 12
- **Completed**: 15:10
- **Duration**: 120 seconds
- **Outcome**: Conversion successful after fix, validation PASS
- **Metrics**:
  - Lines: 50 MSSQL → 35 Redshift
  - Validation: 2345 rows, 0 diffs (after fix)
  - Fix: Added ROUND before CAST (line 34)
- **Files Changed**:
  - reporting/store_procedures/RPT_SalesByRegion.sql
  - .agent/learning/lessons.md (added ROUND pattern)
- **Notes**: Validation failed first try (12 column diffs), fixer resolved

---

## Blockers & Dependencies

### Active Blockers
- **RPT_AccountRefund migration**: Waiting on MSSQL schema change (ETA: Jun 5)
```

---

## Learn More

- [[facts.md.template]] - Blank facts template
- [[working.md.template]] - Blank working template
- [[archive.md.template]] - Blank archive template
- [[../learning/README]] - Learning system guide

---

**Version**: 1.0
**Last Updated**: 2026-06-03
