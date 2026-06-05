# Learning System (v5.1)

## TL;DR

Four files that form an autonomous improvement loop:

| File | What it captures | Triggers |
|------|-----------------|----------|
| **lessons.md** | What worked/failed (append-only) | After tasks with errors, pitfalls, or corrections |
| **feedback.md** | User corrections & praise | Any time user redirects or confirms approach |
| **patterns.md** | Recurring insights (3x threshold) | Automatic from lessons.md scan |
| **changelog.md** | Audit trail of all .agent/ edits | After any skill/routing/memory change |

**Key mechanism**: When a lesson appears 3 times → promote to pattern → if universal, promote to `memory/facts.md`.

**Who writes**: Only the **main agent** (post-task loop). Subagents don't touch learning files.

---

## What is the Learning System?

The `.agent/learning/` directory captures **discoveries, patterns, and feedback** that emerge from day-to-day work. Unlike memory (which tracks tasks), learning captures **knowledge evolution**.

---

## Learning Files

### 1. lessons.md - Lessons Learned

**Purpose**: Document specific discoveries from tasks that completed/failed.

**Contents**:
- Root cause analysis of failures
- Successful approaches to challenges
- "Aha!" moments during debugging
- Workarounds for limitations

**When to Add**:
- Task fails → fixed → capture why
- Unexpected behavior discovered
- Better approach found
- Mistake avoided

**Who Updates**: Agents automatically (when errors resolved) or humans (explicit lessons)

---

### 2. feedback.md - User Corrections

**Purpose**: Track when users correct agent behavior to avoid repeating mistakes.

**Contents**:
- User says "no, actually do X"
- Agent misunderstood intent
- Wrong routing decisions
- Incorrect assumptions

**When to Add**:
- User provides corrective guidance
- Agent made wrong choice
- Delegation went to wrong subagent

**Who Updates**: Agents automatically (when user corrects)

---

### 3. patterns.md - Reusable Patterns

**Purpose**: Extract reusable principles from lessons after 3+ confirmations.

**Contents**:
- General solutions to common problems
- Proven approaches across domains
- Best practices that emerged organically
- Anti-patterns to avoid

**When to Add**:
- Lesson repeats 3+ times
- Pattern applies across task types
- Team agrees it's a best practice

**Who Updates**: Humans (promotes from lessons.md) or agents (with approval)

---

## File Templates

### lessons.md Template

```markdown
# Lessons Learned

---

## [YYYY-MM-DD]: [Lesson Title]

**Context**: [What task/situation led to this discovery]

**Problem**: [What went wrong or was challenging]

**Discovery**: [Root cause or key insight]

**Solution**: [How it was resolved]

**Impact**: [How this helps future tasks]

**Applies To**: [Which tasks/domains benefit from this lesson]

**Confidence**: [Low / Medium / High] - [Based on N occurrences]

**Related**:
- [Link to other lessons if applicable]
- [Link to pattern if promoted]

---

**Example** (from redshift-reporting):

## 2026-06-03: Block 12 Required ROUND Before CAST

**Context**: Converting RPT_SalesByRegion block 12, validation failed with column value diffs

**Problem**: 12 rows had Amount column off by 0.001

**Discovery**: Missing ROUND before CAST to DECIMAL(18,2) caused floating-point precision loss

**Solution**: Changed `CAST(Amount AS DECIMAL(18,2))` to `ROUND(Amount, 2)::DECIMAL(18,2)`

**Impact**: Prevents similar precision errors in future conversions. Pattern now applied automatically.

**Applies To**: All SQL conversions with narrowing CAST to DECIMAL

**Confidence**: High - 12 occurrences across RPT_OrderSummary and RPT_SalesByRegion

**Related**:
- Pattern: [ROUND Before CAST](patterns.md#round-before-cast)
```

---

### feedback.md Template

```markdown
# User Feedback & Corrections

---

## [YYYY-MM-DD]: [Correction Title]

**Context**: [What task was being done]

**Agent Action**: [What agent did/planned]

**User Correction**: [What user said instead]

**Reason**: [Why agent was wrong - misunderstanding, wrong assumption]

**Learning**: [What to do differently next time]

**Applied To**: [Which routing rule/subagent/skill updated]

**Status**: [Fixed / Pending / Cannot Fix]

---

**Example** (hypothetical):

## 2026-06-03: "Validate" Means Code Review, Not Tests

**Context**: User said "Validate the API endpoint changes"

**Agent Action**: Routed to @validator to run test suite

**User Correction**: "No, I meant review the code quality, not run tests"

**Reason**: "Validate" is ambiguous - can mean testing OR review

**Learning**: 
- Ask clarification when "validate" appears without context
- Add routing rule: "validate code" → @reviewer, "validate tests" → @validator

**Applied To**: .agent/index.md routing rules (added clarification prompt)

**Status**: Fixed
```

---

### patterns.md Template

```markdown
# Reusable Patterns

---

## Pattern: [Pattern Name]

**Domain**: [Area this applies to - e.g., SQL, API, Frontend]

**Problem**: [What problem this pattern solves]

**Solution**: [General approach - not task-specific]

**Example**:
```
[Concrete code/command example]
```

**When to Use**:
- [Situation 1]
- [Situation 2]

**When NOT to Use**:
- [Anti-pattern scenario 1]
- [Anti-pattern scenario 2]

**Related Lessons**:
- [Lesson 1 that led to this pattern]
- [Lesson 2 that confirmed it]

**Confidence**: [High / Medium] - Based on [N] confirmations

**Promoted From**: lessons.md ([Date])

---

**Example** (from redshift-reporting):

## Pattern: ROUND Before Narrowing CAST

**Domain**: SQL Type Conversion

**Problem**: Floating-point values lose precision when cast to DECIMAL without rounding

**Solution**: Always apply ROUND to target precision before casting to DECIMAL type

**Example**:
```sql
-- Bad
CAST(Amount AS DECIMAL(18,2))

-- Good
ROUND(Amount, 2)::DECIMAL(18,2)
```

**When to Use**:
- Any CAST to DECIMAL with fewer decimal places than source
- Calculations involving division
- Currency/monetary amounts

**When NOT to Use**:
- CAST to more precise type (e.g., DECIMAL(18,2) → DECIMAL(18,4))
- Integer casts
- Already-rounded values

**Related Lessons**:
- Block 12 CAST precision error (2026-06-03)
- Block 15 Amount diff (2026-05-28)
- Block 7 narrowing CAST issue (2026-05-20)

**Confidence**: High - 12+ confirmations across multiple SPs

**Promoted From**: lessons.md (2026-06-03)
```

---

## Usage Patterns

### Flow: Task → Lesson → Pattern

**Step 1: Task Completes with Discovery**
```
Task: Convert block 12
Error: Validation fails (column diffs)
Fix: Add ROUND before CAST
Result: Validation passes

→ Add to lessons.md
```

**Step 2: Lesson Repeats**
```
Task: Convert block 15
Error: Same issue (column diffs)
Fix: Add ROUND before CAST (recall lesson)
Result: Validation passes

→ Update lesson (now 2 occurrences)
```

**Step 3: Pattern Emerges (After 3+)**
```
Task: Convert block 7
Same issue, same fix (3rd occurrence)

→ Extract to patterns.md
→ Add to .agent/memory/facts.md (if universal)
→ Update subagent context (apply automatically)
```

---

### Flow: User Feedback → Routing Fix

**Step 1: User Corrects Agent**
```
User: "Validate the API changes"
Agent: Routes to @validator (test suite)
User: "No, I meant code review"

→ Add to feedback.md
```

**Step 2: Update Routing**
```
Edit .agent/index.md:
  Add clarification: IF "validate" without context, ASK:
    "Do you want to:
     1. Run tests (@validator)
     2. Review code (@reviewer)"

→ Test with next "validate" request
```

**Step 3: Verify Fix**
```
Next time: User says "validate"
Agent: Asks clarification
User: Confirms meaning
Agent: Routes correctly

→ Update feedback.md: Status = Fixed
```

---

## Best Practices

### 1. Write Lessons Immediately

**Good**: Write lesson as soon as discovery is made (context fresh)

**Bad**: Wait until end of day (details forgotten)

**Pattern**: Add lesson-writing to skill workflows (Step 7: Update Memory & Learning)

---

### 2. Promote Patterns Only After 3+ Confirmations

**Why**: One-off solutions aren't patterns

**Process**:
1. First time: Add to lessons.md
2. Second time: Note in lesson "2nd occurrence"
3. Third time: Extract to patterns.md

---

### 3. Keep Patterns General

**Good**:
```markdown
## Pattern: Input Validation

Validate all user inputs before processing.

Example:
if (!isValid(input)) throw new Error("Invalid input");
```

**Bad**:
```markdown
## Pattern: Validate Username Field

Check if username is 3-20 chars on line 42 of UserController.ts
```

---

### 4. Link Lessons to Patterns

**In lessons.md**:
```markdown
## Lesson: Block 12 CAST Error
...
**Related**: Pattern [ROUND Before CAST](patterns.md#round-before-cast)
```

**In patterns.md**:
```markdown
## Pattern: ROUND Before CAST
...
**Related Lessons**:
- Block 12 CAST Error (2026-06-03)
- Block 15 Amount Diff (2026-05-28)
```

**Benefit**: Trace pattern evolution

---

## Integration with Memory

### When to Promote Lesson → Fact

**Criteria**:
- Pattern confirmed 5+ times
- Applies universally across project
- No exceptions found
- Team consensus

**Process**:
```
patterns.md: "ROUND Before CAST" (12 confirmations)
  ↓
memory/facts.md: Add to "Critical Rules - Always"
  → "Always ROUND before narrowing CAST to DECIMAL"
  
Keep in patterns.md: Full context and examples
```

---

## Common Pitfalls

### Pitfall 1: Logging Everything

**Problem**: 100+ "lessons" that are actually just task notes

**Solution**: Only log when there's a **discovery** - something unexpected, a fix, or a better way

---

### Pitfall 2: Vague Lessons

**Bad**:
```markdown
## Lesson: Be Careful with Dates
Context: Something went wrong
Solution: Fixed it
```

**Good**:
```markdown
## Lesson: Timezone Conversion Required for Date Comparisons
Context: Validation failed - date mismatches
Problem: Redshift uses UTC, MSSQL uses local time
Solution: Wrap date columns in CONVERT_TIMEZONE()
Impact: Fixes all date comparison issues
```

---

### Pitfall 3: Not Reviewing Lessons

**Problem**: 50 lessons, never looked at again

**Solution**: Monthly review:
1. Scan lessons for patterns (3+ occurrences)
2. Extract to patterns.md
3. Archive old lessons (>6 months, no repeats)

---

### Pitfall 4: Ignoring User Feedback

**Problem**: User corrects agent, agent repeats same mistake

**Solution**: 
1. Log ALL corrections to feedback.md
2. Update routing immediately
3. Test fix with next similar request

---

## Metrics to Track

### In patterns.md

Track pattern effectiveness:

```markdown
## Pattern: [Name]
...
**Usage**: Applied in [N] tasks
**Success Rate**: [XX%]
**Time Saved**: [Estimated - e.g., "30 min per task"]
**Last Used**: [Date]
```

---

### Monthly Review

In learning/README.md or archive:

```markdown
## 2026-06 Learning Summary

**New Lessons**: 12
**Lessons Promoted to Patterns**: 3
**Patterns Applied**: 47 times
**User Corrections**: 2 (both fixed)

**Top Patterns**:
1. ROUND Before CAST - 12 uses
2. Hardcode USD in FX - 8 uses
3. Use CTE for Temp Tables - 6 uses

**Learning Velocity**: 
- Failure rate: 5% (down from 30% in May)
- Fix time: 60s avg (down from 5 min in May)
```

---

## Example: Real-World Learning (redshift-reporting)

### lessons.md (Excerpt)

```markdown
## 2026-06-03: Block 12 Required ROUND Before CAST

**Context**: Converting RPT_SalesByRegion block 12

**Problem**: Validation failed - 12 rows with 0.001 diff in Amount column

**Discovery**: CAST(Amount AS DECIMAL(18,2)) loses precision without prior ROUND

**Solution**: ROUND(Amount, 2)::DECIMAL(18,2)

**Impact**: Prevents precision errors. Now applied automatically in @sql-worker

**Applies To**: All narrowing CAST operations

**Confidence**: High (12th occurrence)

---

## 2026-05-28: FX Rate Lookup Must Hardcode 'USD'

**Context**: Converting RPT_OrderSummary block 8

**Problem**: Validation failed - different FX rates returned

**Discovery**: MSSQL uses @CurrencyCode parameter, Redshift validation uses 'USD'

**Solution**: Replace `CurrencyCode = @CurrencyCode` with `CurrencyCode = 'USD'`

**Impact**: Fixes all FX rate lookup validations

**Applies To**: Any join to FXRate table

**Confidence**: High (8 occurrences)
```

---

### patterns.md (Excerpt)

```markdown
## Pattern: ROUND Before Narrowing CAST

**Domain**: SQL Type Conversion

**Problem**: Floating-point precision loss

**Solution**: ROUND(expr, precision)::DECIMAL(precision)

**Example**:
```sql
ROUND(Amount, 2)::DECIMAL(18,2)
```

**When to Use**: Any narrowing CAST to DECIMAL

**Confidence**: High - 12 confirmations

**Promoted From**: lessons.md (2026-06-03)
```

---

### feedback.md (Excerpt)

```markdown
## 2026-05-20: "Convert" Means Full Workflow, Not Just Code

**Context**: User said "Convert block 5"

**Agent Action**: @sql-worker converted code, stopped

**User Correction**: "Also run validation and update docs"

**Reason**: Agent delegated to worker only, didn't use skill

**Learning**: 
- "Convert" should trigger "convert-sp-block" skill (full workflow)
- Update routing: "convert" → load skill, not direct delegation

**Applied To**: .agent/index.md routing rules

**Status**: Fixed
```

---

## Maintenance

### Weekly Review

1. Scan lessons.md for patterns (3+ occurrences)
2. Check feedback.md for recurring corrections (routing gaps)
3. Verify patterns.md is being applied (check usage counts)

---

### Monthly Cleanup

1. Archive lessons >6 months old with no repeats
2. Promote high-confidence patterns (5+) to facts.md
3. Generate learning summary (metrics above)
4. Share top patterns with team

---

## Learn More

- [[lessons.md.template]] - Blank lessons template
- [[feedback.md.template]] - Blank feedback template
- [[patterns.md.template]] - Blank patterns template
- [[../memory/README]] - Memory system guide

---

**Version**: 1.0
**Last Updated**: 2026-06-03
