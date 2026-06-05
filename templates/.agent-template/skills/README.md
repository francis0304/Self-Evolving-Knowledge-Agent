# Skills Directory (v5.1)

## Quick Start

**New to this?** Copy the universal skills from `universal/` into your `.agent/skills/` directory. They work in any repo. Then create domain-specific skills for your recurring workflows.

## What are Skills?

**Skills** are high-level workflow entry points that orchestrate multiple subagents to accomplish complex tasks. They sit between the user request and subagent execution.

### Skills vs Subagents

| Aspect | Skills | Subagents |
|--------|--------|-----------|
| **Purpose** | Workflow orchestration | Specialized execution |
| **Scope** | Multi-step process | Single capability |
| **Calls** | Delegates to subagents | Uses tools (Read, Edit, etc.) |
| **Context** | Minimal (routing logic) | Rich (domain expertise) |
| **Example** | "convert-sp-block" | "sql-worker" |

### When to Create a Skill

Create a skill when:
- You have a **recurring multi-step workflow**
- Steps involve **2+ different subagents**
- Process has **conditional logic** (if X then Y else Z)
- You want a **named shortcut** for users (e.g., `/convert-block`)

Don't create a skill when:
- Task is single-step (just delegate directly)
- Process varies too much case-by-case
- Overhead of loading skill > benefit

---

## Skill Structure

Every skill file should follow this structure:

```markdown
# Skill: [skill-name]

## Purpose
[One sentence: what this skill accomplishes]

## When to Use
[Trigger conditions, keywords, task patterns]

## Inputs
- [Required input 1]
- [Required input 2]
- [Optional input 3]

## Workflow

### Step 1: [Action]
**Delegate to**: @subagent-name
**Context**:
- [Context item 1]
- [Context item 2]

**Expected output**: [What subagent returns]

### Step 2: [Action]
**Delegate to**: @subagent-name OR handle directly
**Context**: [...]
**Expected output**: [...]

### Step 3 (Parallel): [Action]
[Can run simultaneously with other steps]

### Step 4 (Conditional): [Action]
**If**: [Condition]
**Then**: [Action A]
**Else**: [Action B]

## Outputs
- [Output 1 - e.g., files written]
- [Output 2 - e.g., test results]
- [Output 3 - e.g., docs updated]

## Error Handling
- [Error type 1] → [Recovery strategy]
- [Error type 2] → [Recovery strategy]

## Memory Updates
- Update `.agent/memory/working.md` with [what]
- Update `.agent/learning/lessons.md` if [when]

## Examples

### Example 1: [Scenario]
**User**: "[Example request]"
**Flow**: [Step-by-step what happens]
**Result**: [Outcome]

### Example 2: [Scenario]
...

## Notes
[Additional context, gotchas, optimization tips]
```

---

## Creating Your First Skill

### Step 1: Identify the Workflow

Pick a frequent task that involves multiple steps:

**Example** (from redshift-reporting):
- Task: "Convert MSSQL stored procedure block to Redshift"
- Steps:
  1. Pre-flight check (if complex)
  2. Convert SQL code
  3. Validate conversion
  4. Fix if validation fails
  5. Update documentation

### Step 2: Map to Subagents

Which subagents handle each step?

**Example**:
1. Pre-flight → @researcher
2. Convert → @sql-worker
3. Validate → @validator
4. Fix → @fixer
5. Update docs → @wiki-keeper

### Step 3: Define Conditional Logic

What are the decision points?

**Example**:
- IF (entity is god node) → researcher first
- IF (validation fails) → fixer
- ALWAYS → wiki-keeper (parallel)

### Step 4: Copy Template

```bash
cp .agent/skills/_template.md .agent/skills/your-skill-name.md
```

Fill in:
- Purpose
- Inputs/Outputs
- Workflow steps
- Error handling

### Step 5: Test the Skill

Run through 3-5 real scenarios:
- Simple case (fast path)
- Complex case (full workflow)
- Error case (validation fails)

Verify:
- Correct subagent delegation
- Context passed properly
- Outputs as expected
- Memory updated

---

## Skill Examples

### Example 1: Simple Linear Workflow

**File**: `convert-module.md`

```markdown
# Skill: convert-module

## Purpose
Convert a module from language X to language Y

## Workflow

### Step 1: Convert Code
**Delegate to**: @converter
**Context**: Source module path, target language
**Output**: Converted code

### Step 2: Validate Syntax
**Delegate to**: @validator
**Context**: Converted code, language spec
**Output**: PASS/FAIL + errors

### Step 3: Update Docs (Parallel)
**Delegate to**: @doc-keeper
**Context**: Module name, changes made
**Output**: Updated documentation

## Error Handling
- Syntax errors → Retry with @converter (provide error context)
- Validation fails > 2 times → Escalate to user
```

### Example 2: Conditional Workflow

**File**: `deploy-service.md`

```markdown
# Skill: deploy-service

## Purpose
Deploy service to staging or production

## Workflow

### Step 1: Pre-Flight Checks
**Delegate to**: @validator
**Context**: Service name, target environment
**Output**: Checks PASS/FAIL

### Step 2 (Conditional): Deploy
**If**: Checks PASS
**Then**: 
  **Delegate to**: @deployer
  **Context**: Service name, environment, version
  **Output**: Deployment result

**Else**: Stop and report issues

### Step 3 (Conditional): Smoke Tests
**If**: Deploy succeeded
**Then**:
  **Delegate to**: @tester
  **Context**: Deployment URL, test suite
  **Output**: Test results

### Step 4 (Parallel): Update Docs
**Delegate to**: @doc-keeper
**Context**: Deployment details, version
**Output**: Updated deployment log
```

### Example 3: Parallel-Heavy Workflow

**File**: `run-all-tests.md`

```markdown
# Skill: run-all-tests

## Purpose
Run all test suites in parallel

## Workflow

### Step 1: Launch Test Suites (All Parallel)

**Delegate to**: @tester (instance 1)
**Context**: Unit test suite
**Output**: Unit test results

**Delegate to**: @tester (instance 2)
**Context**: Integration test suite
**Output**: Integration test results

**Delegate to**: @tester (instance 3)
**Context**: E2E test suite
**Output**: E2E test results

### Step 2: Aggregate Results
**Handle directly**: Collect all results, generate summary

### Step 3 (Parallel): Update Dashboards
**Delegate to**: @reporter
**Context**: Aggregated results
**Output**: Dashboard updated
```

---

## Best Practices

### 1. Keep Skills Focused

**Good**: `convert-sp-block` (converts one stored procedure block)
**Bad**: `do-everything` (converts, deploys, monitors, optimizes)

### 2. Make Steps Explicit

**Good**:
```markdown
### Step 3: Validate Conversion
**Delegate to**: @validator
**Context**: 
- Converted SQL file path
- Test case name
- Expected row count
```

**Bad**:
```markdown
### Step 3: Validate
Do validation stuff
```

### 3. Handle Errors Gracefully

**Good**:
```markdown
## Error Handling
- Validation fails → @fixer attempts repair (max 2 tries)
- Still fails → Log to lessons.md, report to user with clear error
- Network error → Retry with exponential backoff (max 3 tries)
```

**Bad**:
```markdown
## Error Handling
Hope it works
```

### 4. Use Parallel Execution

**Good** (saves 30-45s):
```markdown
### Step 3a (Parallel): Run Tests
**Delegate to**: @validator

### Step 3b (Parallel): Update Docs
**Delegate to**: @doc-keeper
```

**Bad** (sequential when not needed):
```markdown
### Step 3: Run Tests
### Step 4: Update Docs
```

### 5. Update Memory

**Good**:
```markdown
## Memory Updates
- Append to `.agent/memory/working.md`:
  - Task name
  - Status (complete/failed)
  - Key metrics (e.g., "8432 rows validated")
- If new pattern discovered:
  - Add to `.agent/learning/patterns.md`
```

**Bad**: No memory updates (system doesn't learn)

---

## Common Patterns

### Pattern 1: Pre-Flight + Work + Validate

```markdown
Step 1: @researcher - Analyze complexity
Step 2: @worker - Do the work
Step 3: @validator - Verify result
Step 4 (parallel): @keeper - Update docs
```

### Pattern 2: Try-Catch-Retry

```markdown
Step 1: @worker - Attempt task
Step 2 (conditional):
  If success → Done
  If failure → @fixer retry (max 2)
  If still failing → Escalate to user
```

### Pattern 3: Fan-Out + Aggregate

```markdown
Step 1 (parallel): Launch N workers for N items
Step 2: Wait for all to complete
Step 3: Aggregate results
Step 4: Report summary
```

---

## Skill Testing Checklist

Before committing a new skill:

- [ ] Run through 3+ real scenarios
- [ ] Verify all subagents delegate correctly
- [ ] Check context is sufficient (subagents don't fail from missing info)
- [ ] Confirm outputs are as expected
- [ ] Test error handling (simulate failures)
- [ ] Verify memory updates happen
- [ ] Check parallel steps actually run in parallel
- [ ] Document in skill file with examples
- [ ] Add to `.agent/index.md` routing rules

---

## Integration with Routing

Skills are loaded by the main orchestrator based on routing rules in `.agent/index.md`:

```markdown
## Routing Rule: Conversion Tasks
**Triggers**: "convert", "migrate", "port"
**Action**: Load skill "convert-module"
**Context**: Provide source path, target language

Pattern:
IF user_says("convert X to Y"):
    load_skill("convert-module")
    skill.execute(source=X, target=Y)
```

---

## Maintenance

### Monthly Review

1. Check skill usage logs - Which skills are used most?
2. Identify common failure points - Where do skills break?
3. Look for new recurring patterns - Should we add a skill?
4. Remove unused skills - Less than 5 uses in 3 months → deprecate

### When to Refactor a Skill

**Split** if:
- Skill handles >5 distinct scenarios
- File exceeds 200 lines
- Subagent delegation logic gets complex

**Merge** if:
- Two skills always used together
- Overlap >70% in steps
- Delegation overhead dominates

**Deprecate** if:
- Unused for 3+ months
- Replaced by better workflow
- Repo no longer needs this capability

---

## Examples from Real Projects

### redshift-reporting (v4)

**4 skills**:
1. `convert-sp-block.md` - MSSQL → Redshift conversion
2. `validate-migration.md` - Run validation cases
3. `fix-validation-diff.md` - Debug test failures
4. `update-wiki.md` - Sync knowledge base

**Most used**: `convert-sp-block` (40+ blocks converted)
**Success rate**: 95% (validation passes first try)
**Time saved**: 30-45s per workflow (parallel execution)

---

## Universal Skills (Bundled)

The `universal/` subdirectory contains 8 skills that work in any repo:
- `git-ops.md` — Safe git operations
- `debug.md` — Evidence-first error diagnosis
- `refactor.md` — Code restructuring
- `pr-review.md` — Diff analysis and review
- `meta.md` — Agent system health audit
- `skill-creator.md` — 3x pattern → new skill proposal
- `routing-optimizer.md` — Self-learning routing improvement
- `graphify-check.md` — Knowledge graph freshness monitoring

See `universal/README.md` for details on each.

## Learn More

- [[.agent-system-introduction]] - Overall architecture
- [[index.md.template]] - Routing logic
- [[_template.md]] - Blank skill template
- [[example-skill.md]] - Annotated example
- [[universal/README.md]] - Universal skill documentation

---

**Version**: 2.0 (v5.1 — added universal skills, changelog, cost hierarchy)
**Last Updated**: 2026-06-05
