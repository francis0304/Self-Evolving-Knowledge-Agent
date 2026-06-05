# Skill: [skill-name]

## Purpose
[One clear sentence describing what this skill accomplishes]

---

## When to Use

**Trigger Keywords**: [List keywords that should activate this skill]
**Task Patterns**: [Describe task structures that match this skill]
**Example Requests**:
- "[Example user request 1]"
- "[Example user request 2]"
- "[Example user request 3]"

---

## Inputs

**Required**:
- [Input 1] - [Description, format]
- [Input 2] - [Description, format]

**Optional**:
- [Input 3] - [Description, format, default value]

---

## Workflow

### Step 1: [Action Name]

**Purpose**: [What this step accomplishes]

**Delegate to**: @[subagent-name] OR handle directly

**Context to provide**:
```
- [Context item 1]
- [Context item 2]
- [Context item 3]
```

**Expected output**: [What format, what content]

**Time estimate**: [Typical duration]

---

### Step 2: [Action Name]

**Purpose**: [What this step accomplishes]

**Delegate to**: @[subagent-name]

**Context to provide**:
```
- [Context from step 1]
- [Additional context]
```

**Expected output**: [What format, what content]

**Time estimate**: [Typical duration]

---

### Step 3 (Parallel): [Action Name]

**Purpose**: [What this step accomplishes]

**Note**: This step runs simultaneously with [other step] to save time

**Delegate to**: @[subagent-name]

**Context to provide**:
```
- [Context items]
```

**Expected output**: [What format, what content]

**Time estimate**: [Typical duration]

---

### Step 4 (Conditional): [Action Name]

**Purpose**: [What this step accomplishes]

**Condition**: [What determines if this step runs]

**If**: [Condition true]
- **Then**: [Action A]
  - **Delegate to**: @[subagent-name]
  - **Context**: [...]
  - **Output**: [...]

**Else**: [Condition false]
- **Then**: [Action B]
  - **Delegate to**: @[subagent-name] OR handle directly
  - **Context**: [...]
  - **Output**: [...]

---

## Outputs

**Primary**:
- [Output 1] - [Description, location]
- [Output 2] - [Description, location]

**Side Effects**:
- [File modified]
- [State changed]
- [External system affected]

**User Notification**:
```
[Template for success message to user]
```

---

## Error Handling

### Error Type 1: [Error Name]

**Symptoms**: [How to recognize this error]

**Causes**: [Common root causes]

**Recovery Strategy**:
1. [Recovery step 1]
2. [Recovery step 2]
3. If still failing: [Escalation path]

**Example**:
```
Error: Validation fails with "row count mismatch"
Recovery:
  1. @fixer: "Analyze diff between expected vs actual"
  2. @fixer: "Propose fix"
  3. Retry validation
  4. If fails again: Report to user with detailed diff
```

### Error Type 2: [Error Name]

**Symptoms**: [...]
**Causes**: [...]
**Recovery Strategy**: [...]

---

## Memory Updates

### Update `.agent/memory/working.md`

**When**: [After step completion / On error / At end of workflow]

**Format**:
```markdown
## [YYYY-MM-DD]: [Task Title]
- Status: [In Progress / Complete / Failed]
- Actions Taken:
  - [Action 1]
  - [Action 2]
- Results:
  - [Metric 1]: [Value]
  - [Metric 2]: [Value]
- Next Steps: [If incomplete]
- Blockers: [If any]
```

### Update `.agent/learning/lessons.md`

**When**: [When new pattern discovered / Error resolved]

**Format**:
```markdown
## Lesson: [Title]
**Date**: [YYYY-MM-DD]
**Context**: [What task led to this discovery]
**Discovery**: [What we learned]
**Pattern**: [Reusable principle]
**Impact**: [How this improves future tasks]
```

### Update `.agent/learning/patterns.md`

**When**: [When reusable pattern emerges]

**Format**:
```markdown
## Pattern: [Name]
**Domain**: [Area this applies to]
**Problem**: [What problem this solves]
**Solution**: [How to apply]
**Example**: [Concrete instance]
```

---

## Examples

### Example 1: [Scenario Name]

**User Request**: "[Exact user input]"

**Flow**:
1. Step 1: [What happens]
   - Delegates to @[subagent]
   - Returns: [Output]
2. Step 2: [What happens]
   - Delegates to @[subagent]
   - Returns: [Output]
3. Result: [Final outcome]

**Time**: [Duration]

**Outputs**:
- [File created/modified]
- [State changed]

---

### Example 2: [Scenario Name - Error Case]

**User Request**: "[Exact user input]"

**Flow**:
1. Step 1: [What happens]
   - Delegates to @[subagent]
   - Returns: [Output]
2. Step 2: [What happens]
   - Delegates to @[subagent]
   - ERROR: [What fails]
3. Error Handling:
   - Recovery: [What recovery action]
   - Retry: [Result]
4. Result: [Final outcome]

**Time**: [Duration]

**Lesson Learned**: [What was captured in memory]

---

### Example 3: [Scenario Name - Complex Case]

**User Request**: "[Exact user input]"

**Notes**: [What makes this complex - e.g., god node, >5 files]

**Flow**:
1. Pre-Flight: @researcher analyzes
   - Returns: [Analysis, recommendations]
2. Step 1: [What happens based on analysis]
3. Step 2: [What happens]
4. Steps 3a & 3b (Parallel): [Simultaneous actions]
5. Result: [Final outcome]

**Time**: [Duration]

**Context Used**: [How much - verify efficiency]

---

## Performance Metrics

**Target Metrics** (adjust based on your domain):
- **Success Rate**: >90% completion without errors
- **Time**: [Expected duration range]
- **Context Usage**: 
  - Main orchestrator: <10K tokens
  - Subagents combined: <30K tokens
- **Parallel Savings**: [Time saved by parallel execution]

**Actual Metrics** (update monthly):
- **Success Rate**: [%]
- **Average Time**: [Duration]
- **Context Usage**: [Actual]
- **Parallel Savings**: [Actual]

---

## Optimization Opportunities

### Fast-Path for Simple Cases

**When**: [Condition for simple case]
**Action**: [Skip steps, take shortcut]
**Saves**: [Time saved]

**Example**:
```
If task involves <100 lines AND no dependencies:
  Skip @researcher pre-flight
  Go directly to @worker
  Saves: 15-20 seconds
```

### Caching

**What to cache**: [Data that doesn't change often]
**Where**: [.agent/memory/ or session variable]
**Invalidate when**: [Condition for refresh]

### Batch Processing

**When**: [Multiple similar tasks]
**Action**: [Combine into single delegation]
**Saves**: [Overhead reduction]

---

## Dependencies

**Subagents Required**:
- @[subagent-1] - [Why needed]
- @[subagent-2] - [Why needed]

**Files Required**:
- [File path 1] - [Purpose]
- [File path 2] - [Purpose]

**External Tools**:
- [Tool 1] - [What it does]
- [Tool 2] - [What it does]

**Knowledge Base**:
- [Wiki page 1] - [What knowledge]
- [Wiki page 2] - [What knowledge]

---

## Integration Points

### With Graphify

**Uses topology for**: [How graph informs this skill]

**Example**:
```
Checks graphify-out/GRAPH_REPORT.md for god nodes
If entity is god node (>15 edges):
  Trigger @researcher pre-flight
```

### With Obsidian MCP

**Uses vault for**: [What knowledge from Obsidian]

**Example**:
```
@wiki-keeper reads patterns from Obsidian vault
Applies to current task
Writes results back to vault
```

---

## Testing Checklist

Before deploying this skill:

- [ ] Tested on 3+ real scenarios
- [ ] Simple case works (fast path)
- [ ] Complex case works (full workflow)
- [ ] Error handling tested (simulated failures)
- [ ] Parallel execution verified (timing improvement)
- [ ] Memory updates happen correctly
- [ ] Subagents receive sufficient context
- [ ] Outputs are in expected format
- [ ] User notifications are clear
- [ ] Metrics tracked and documented

---

## Maintenance

**Review Frequency**: [Weekly / Monthly / Quarterly]

**Review Checklist**:
- [ ] Check success rate - Still >90%?
- [ ] Review failure cases - Common patterns?
- [ ] Verify time estimates - Still accurate?
- [ ] Check context usage - Any bloat?
- [ ] Look for optimization opportunities
- [ ] Update examples with new learnings
- [ ] Refactor if logic gets complex

**Last Reviewed**: [DATE]

**Next Review**: [DATE]

---

## Notes

[Additional context, gotchas, special considerations]

---

**Version**: 1.0
**Created**: [DATE]
**Last Updated**: [DATE]
**Maintainer**: [Name or "See .agent/index.md"]
