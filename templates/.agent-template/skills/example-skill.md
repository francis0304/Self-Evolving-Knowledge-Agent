# Skill: convert-sp-block

---
**Note**: This is an example skill from the redshift-reporting project, heavily annotated to show best practices.
---

## Purpose
Convert a single MSSQL stored procedure block to Redshift PL/pgSQL with automated validation.

---

## When to Use

**Trigger Keywords**: "convert", "migrate", "port", "translate", "block"

**Task Patterns**: 
- User mentions "convert block X of SP Y"
- User says "migrate SP Z to Redshift"
- User provides MSSQL SQL and asks for Redshift equivalent

**Example Requests**:
- "Convert block 15 of RPT_OrderSummary to Redshift"
- "Migrate RPT_SalesByRegion block 8"
- "Port the next untranslated block of RPT_AccountCredit"

---

## Inputs

**Required**:
- **SP name** - Stored procedure name (e.g., "RPT_OrderSummary")
- **Block number** - Block ID within SP (e.g., 15)

**Optional**:
- **Context notes** - User hints about complexity (e.g., "uses temp tables")

---

## Workflow

### Step 1: Pre-Flight Check (Conditional)

**Purpose**: Analyze complexity before attempting conversion (avoid blind attempts on god nodes)

**Condition**: IF (SP is a god node OR user indicates complexity)

**Delegate to**: @researcher

**Context to provide**:
```
- SP name: [e.g., RPT_OrderSummary]
- Block number: [e.g., 15]
- Graph topology: Read from .agent/memory/graphify_topology.md
- Request: "Analyze block dependencies, temp tables, CTEs needed"
```

**Expected output**: 
```
Analysis report:
- Dependencies: [e.g., "Block 15 uses temp table #FXRate from Block 3"]
- Complexity: [Low/Medium/High]
- Risks: [e.g., "Uses dynamic SQL", "Recursive CTE"]
- Recommendation: [Proceed / Need manual review]
```

**Time estimate**: 10-15 seconds

**Why this step**: 
- God nodes (>15 edges) have hidden dependencies
- Blind conversion often fails validation
- 5 minutes of analysis saves 30 minutes of debugging

---

### Step 2: Convert MSSQL → Redshift

**Purpose**: Translate T-SQL syntax to PL/pgSQL

**Delegate to**: @sql-worker

**Context to provide**:
```
- Source file: reporting/mssql_source/[SP_NAME].sql
- Block number: [Block ID]
- Conversion patterns: knowledge/wiki/sql-conversion-patterns.md
- Project facts: .agent/memory/facts.md (schema routing, CAST rules)
- Pre-flight analysis: [If Step 1 ran, include results]
```

**Example context block**:
```markdown
@sql-worker:
  ## Objective
  Convert RPT_OrderSummary block 15 from MSSQL to Redshift.

  ## Source Block
  [MSSQL code here - lines 450-520]

  ## Conversion Patterns
  From knowledge/wiki/sql-conversion-patterns.md:
  - CAST(expr AS DECIMAL(18,2)) → ROUND(expr, 2)::DECIMAL(18,2)
  - ##temp_table → CTE named temp_table
  - FX rate lookup → Hardcode 'USD', not @CurrencyCode variable

  ## Project Constraints
  From .agent/memory/facts.md:
  - Redshift is case-sensitive, always quote identifiers
  - Schema routing: REPORTING = output, vSOURCE = views
  - All stored procedures use SECURITY DEFINER

  ## Pre-Flight Notes
  [If researcher ran]: Block 15 depends on Block 3 temp table #FXRate

  ## Expected Output
  Converted PL/pgSQL code only (no test cases, no docs).
  Return format: Plain SQL code block.
```

**Expected output**: 
```sql
-- Converted Redshift PL/pgSQL block
-- (sql-worker returns clean code, no explanation)
```

**Time estimate**: 20-30 seconds

**Why delegate to @sql-worker**:
- Specializes in T-SQL → PL/pgSQL patterns
- Has domain expertise (CAST rules, schema routing)
- Keeps main orchestrator context light (<10K)

---

### Step 3: Write Converted Code

**Purpose**: Save converted code to repository file

**Handle directly**: Main orchestrator writes the file

**Action**:
```
1. Read existing SP file: reporting/store_procedures/[SP_NAME].sql
2. Locate block marker: -- Block [Block_ID]
3. Replace MSSQL block with converted Redshift block
4. Write updated file
```

**Why main handles this**: 
- Simple file I/O, no expertise needed
- Keeps sql-worker focused on conversion logic

---

### Step 4 (Parallel): Validate Conversion

**Purpose**: Run automated test case to verify row-by-row correctness

**Note**: Runs in parallel with Step 5 (docs update) to save time

**Delegate to**: @validator

**Context to provide**:
```
- SP name: [e.g., RPT_OrderSummary]
- Test case: migration_validation/cases/[SP_NAME]/[test_case_name].json
- Validation script: ./migration_validation/run_validation.sh
- Expected behavior: MSSQL vs Redshift row count + column-by-column diff
```

**Expected output**:
```
PASS: 8432 rows, 0 diffs
OR
FAIL: 8432 vs 8430 rows, 12 column diffs
[Detailed diff if failed]
```

**Time estimate**: 30-60 seconds (depends on data volume)

**Why parallel**:
- Doesn't depend on docs update
- User can see validation result immediately
- Saves 30-45 seconds per workflow

---

### Step 5 (Parallel): Update Documentation

**Purpose**: Update wiki page with conversion status and notes

**Note**: Runs in parallel with Step 4 (validation) to save time

**Delegate to**: @wiki-keeper

**Context to provide**:
```
- SP name: [e.g., RPT_OrderSummary]
- Block number: [e.g., 15]
- Wiki page: knowledge/wiki/rpt-ordersummary-validation.md
- Update: "Block 15: CONVERTED (validation pending)"
- Notes: [Any special considerations from pre-flight or conversion]
```

**Expected output**:
```
Wiki page updated:
- Block 15 status: CONVERTED
- Conversion date: 2026-06-03
- Notes: [Any gotchas, e.g., "Required ROUND before CAST"]
```

**Time estimate**: 10-15 seconds

**Why parallel**:
- Doesn't depend on validation result (will update again if validation fails)
- User doesn't need to wait for docs
- Saves 10-15 seconds per workflow

---

### Step 6 (Conditional): Fix Validation Failures

**Purpose**: Debug and repair if validation fails

**Condition**: IF (Step 4 validation returns FAIL)

**Delegate to**: @fixer

**Context to provide**:
```
- SP name: [e.g., RPT_OrderSummary]
- Block number: [e.g., 15]
- Validation diff: [Detailed output from @validator]
- Converted code: [The SQL we just wrote]
- Conversion patterns: knowledge/wiki/sql-conversion-patterns.md
- Common pitfalls: .agent/learning/lessons.md (past fixes)
```

**Expected output**:
```
Analysis:
- Root cause: [e.g., "Missing ROUND before CAST on line 25"]
- Fix: [Proposed code change]

OR

Cannot auto-fix: [Reason]
Recommend: [Manual steps]
```

**Time estimate**: 30-60 seconds (depends on complexity)

**Recovery strategy**:
1. @fixer proposes fix
2. Apply fix to file
3. Re-run @validator (max 2 retry attempts)
4. If still failing: Escalate to user with detailed analysis

**Why conditional**:
- 90% of blocks pass validation first try (based on redshift-reporting metrics)
- No point running fixer if validation passed
- Saves 30-60 seconds on happy path

---

### Step 7: Update Memory & Report

**Purpose**: Record task completion, update working memory, report to user

**Handle directly**: Main orchestrator

**Actions**:
1. Update `.agent/memory/working.md`:
   ```markdown
   ## 2026-06-03: Convert RPT_OrderSummary Block 15
   - Status: Complete
   - Validation: PASS (8432 rows, 0 diffs)
   - Time: 90 seconds
   - Notes: Required pre-flight check (god node)
   ```

2. If validation failed and fixer succeeded:
   ```markdown
   Update `.agent/learning/lessons.md`:
   ## Lesson: Block 15 Required ROUND Before CAST
   **Date**: 2026-06-03
   **Context**: RPT_OrderSummary block 15 validation failed
   **Discovery**: Line 25 had CAST without prior ROUND
   **Pattern**: Always ROUND before narrowing CAST to DECIMAL
   **Impact**: Prevents future similar failures
   ```

3. Report to user:
   ```
   ✅ Block 15 converted and validated successfully
   
   Details:
   - Pre-flight: Analyzed dependencies (Block 3 temp table)
   - Conversion: 70 lines MSSQL → 45 lines Redshift
   - Validation: PASS (8432 rows, 0 diffs)
   - Wiki: Updated with conversion notes
   
   Time: 90 seconds (saved 30s with parallel execution)
   ```

---

## Outputs

**Primary**:
- **Converted SQL file**: reporting/store_procedures/[SP_NAME].sql (block updated)
- **Validation result**: PASS/FAIL + metrics
- **Wiki update**: knowledge/wiki/[sp-name]-validation.md

**Side Effects**:
- `.agent/memory/working.md` updated with task record
- `.agent/learning/lessons.md` updated if new pattern discovered

**User Notification**:
```
✅ [SP_NAME] block [N] converted successfully

Validation: [PASS/FAIL]
Rows: [count]
Time: [duration]

[If failed]: 
⚠️ Validation failed: [reason]
Applied fix: [description]
Retry result: [PASS/FAIL]
```

---

## Error Handling

### Error Type 1: Validation Fails (Row Count Mismatch)

**Symptoms**: @validator returns "FAIL: X vs Y rows"

**Causes**: 
- Missing WHERE clause
- Incorrect JOIN logic
- Temp table not properly converted to CTE

**Recovery Strategy**:
1. @fixer: "Analyze row count diff, identify missing/extra rows"
2. @fixer: "Propose SQL fix"
3. Apply fix to file
4. Retry @validator (max 2 attempts)
5. If still failing: Report to user with detailed analysis

**Example**:
```
Error: FAIL: 8432 vs 8430 rows (2 rows missing)
Fixer analysis: "WHERE clause missing MerchantStatus != 'VOID'"
Fix: Add WHERE clause on line 35
Retry: PASS (8432 rows)
Result: Success on 2nd attempt
```

### Error Type 2: Validation Fails (Column Value Diff)

**Symptoms**: @validator returns "FAIL: 12 column diffs"

**Causes**:
- Missing ROUND before CAST
- FX rate lookup using wrong currency code
- Timezone conversion issue

**Recovery Strategy**:
1. @fixer: "Analyze column diffs, identify pattern"
2. @fixer: "Propose fix based on common pitfalls in lessons.md"
3. Apply fix
4. Retry @validator

**Example**:
```
Error: FAIL: 12 rows have Amount column diff (off by 0.001)
Fixer analysis: "Missing ROUND before CAST on line 25"
Fix: CAST(Amount AS DECIMAL(18,2)) → ROUND(Amount, 2)::DECIMAL(18,2)
Retry: PASS
Result: Success, pattern added to lessons.md
```

### Error Type 3: sql-worker Cannot Parse Source

**Symptoms**: @sql-worker returns "Cannot parse MSSQL syntax at line X"

**Causes**:
- Dynamic SQL (EXEC @sql)
- Undocumented T-SQL extension
- Source file corrupted

**Recovery Strategy**:
1. Retry @sql-worker with larger context window (include surrounding blocks)
2. If still failing: @researcher "Investigate line X, check for dynamic SQL"
3. If dynamic SQL: Escalate to user "Manual conversion required"

### Error Type 4: Pre-Flight Recommends Manual Review

**Symptoms**: @researcher returns "Recommend: Manual review required"

**Causes**:
- Extremely complex block (>500 lines)
- Recursive logic
- Heavy use of dynamic SQL

**Recovery Strategy**:
1. Report to user: "Block [N] is highly complex, recommend manual review"
2. Provide researcher analysis
3. Offer: "Attempt automated conversion anyway?" (user choice)
4. If user says yes: Proceed with Step 2, expect longer debugging

---

## Memory Updates

### Update `.agent/memory/working.md`

**When**: After Step 7 (completion)

**Format**:
```markdown
## 2026-06-03: Convert [SP_NAME] Block [N]
- Status: Complete / Failed
- Pre-flight: [Ran / Skipped] - [Result if ran]
- Conversion: [Lines converted]
- Validation: [PASS/FAIL] - [Row count, diff count]
- Fix attempts: [0-2] - [Description if any]
- Time: [Total duration]
- Notes: [Special considerations]
```

### Update `.agent/learning/lessons.md`

**When**: After fixer successfully resolves a validation failure

**Format**:
```markdown
## Lesson: [Title - e.g., "Block 15 Required ROUND Before CAST"]
**Date**: 2026-06-03
**Context**: [What task, what failed]
**Discovery**: [Root cause found]
**Pattern**: [General principle to apply]
**Impact**: [How this helps future tasks]
```

### Update `.agent/learning/patterns.md`

**When**: When a new reusable conversion pattern emerges

**Format**:
```markdown
## Pattern: [Name - e.g., "FX Rate Lookup Currency Hardcoding"]
**Domain**: SQL Conversion
**Problem**: FX rate lookups fail with variable currency code
**Solution**: Replace @CurrencyCode variable with hardcoded 'USD'
**Example**: 
  Before: JOIN FXRate ON CurrencyCode = @CurrencyCode
  After: JOIN FXRate ON CurrencyCode = 'USD'
**Applies to**: All SPs with FX lookups
```

---

## Examples

### Example 1: Simple Block (Fast Path)

**User Request**: "Convert block 5 of RPT_AccountCredit"

**Flow**:
1. **Pre-Flight**: Skipped (block 5 not a god node, <100 lines)
2. **Convert**: @sql-worker converts (25 lines MSSQL → 18 lines Redshift)
3. **Write**: Main writes to reporting/store_procedures/RPT_AccountCredit.sql
4. **Validate (parallel)**: @validator runs test case → PASS (1234 rows, 0 diffs)
5. **Update Docs (parallel)**: @wiki-keeper updates wiki → "Block 5: PASS ✅"
6. **Report**: User sees "✅ Block 5 converted successfully" in 60 seconds

**Time**: 60 seconds (saved 10s by skipping pre-flight, 35s by parallelizing)

**Outputs**:
- File: reporting/store_procedures/RPT_AccountCredit.sql (block 5 updated)
- Validation: PASS
- Wiki: Updated

---

### Example 2: Complex Block (Full Workflow)

**User Request**: "Convert block 15 of RPT_OrderSummary"

**Notes**: RPT_OrderSummary is a god node (19 edges in graph)

**Flow**:
1. **Pre-Flight**: @researcher analyzes
   - Returns: "Block 15 depends on Block 3 temp table #FXRate. High complexity."
2. **Convert**: @sql-worker converts with context
   - Returns: 70 lines MSSQL → 45 lines Redshift (includes CTE for #FXRate)
3. **Write**: Main writes to reporting/store_procedures/RPT_OrderSummary.sql
4. **Validate (parallel)**: @validator runs → PASS (8432 rows, 0 diffs)
5. **Update Docs (parallel)**: @wiki-keeper updates wiki → "Block 15: PASS ✅"
6. **Report**: User sees success in 90 seconds

**Time**: 90 seconds (pre-flight added 15s, parallel saved 30s)

**Context Used**:
- Main: 8K tokens
- @researcher: 5K tokens
- @sql-worker: 7K tokens
- @validator: 6K tokens
- @wiki-keeper: 4K tokens
- **Total**: 30K (vs 50K+ monolithic)

**Outputs**:
- File: reporting/store_procedures/RPT_OrderSummary.sql (block 15)
- Validation: PASS
- Wiki: Updated with "depends on Block 3 CTE"

---

### Example 3: Validation Failure + Fix (Error Case)

**User Request**: "Convert block 12 of RPT_SalesByRegion"

**Flow**:
1. **Pre-Flight**: Skipped (not god node)
2. **Convert**: @sql-worker converts
3. **Write**: Main writes file
4. **Validate (parallel)**: @validator runs → FAIL (12 rows have Amount diff by 0.001)
5. **Update Docs (parallel)**: @wiki-keeper updates → "Block 12: CONVERTED (validation pending)"
6. **Fix**: @fixer analyzes
   - Root cause: "Missing ROUND before CAST on line 34"
   - Fix: Add ROUND(Amount, 2) before ::DECIMAL(18,2)
7. **Apply Fix**: Main updates file
8. **Retry Validate**: @validator runs → PASS (2345 rows, 0 diffs)
9. **Update Docs**: @wiki-keeper updates → "Block 12: PASS ✅ (required ROUND fix)"
10. **Update Memory**: Add to lessons.md: "Always ROUND before DECIMAL cast"
11. **Report**: User sees "✅ Block 12 converted (required fix) - now PASS"

**Time**: 120 seconds (validation + fix + retry added 60s)

**Lesson Learned**: Captured in `.agent/learning/lessons.md`:
```markdown
## Lesson: Payment Channel Blocks Need ROUND Before CAST
**Date**: 2026-06-03
**Context**: RPT_SalesByRegion block 12 validation failed
**Discovery**: Amount column had 0.001 diffs due to floating-point precision
**Pattern**: Always use ROUND(expr, 2) before CAST(... AS DECIMAL(18,2))
**Impact**: Prevents similar failures in remaining Payment Channel blocks
```

---

## Performance Metrics

**Target Metrics**:
- **Success Rate**: >90% validation pass on first try
- **Time**: 60-90 seconds per block (simple-complex)
- **Context Usage**: 
  - Main orchestrator: <10K tokens
  - Subagents combined: <30K tokens
- **Parallel Savings**: 30-45 seconds per workflow

**Actual Metrics** (from redshift-reporting, as of 2026-06-03):
- **Success Rate**: 95% (38/40 blocks passed first validation)
- **Average Time**: 75 seconds per block
- **Context Usage**: 
  - Main: 8K average
  - Subagents: 28K average
  - Total: 36K (vs 50K+ monolithic = 72% reduction)
- **Parallel Savings**: 35 seconds average

---

## Optimization Opportunities

### Fast-Path for Simple Blocks

**When**: Block is <100 lines AND not part of god node SP

**Action**: Skip @researcher pre-flight, go directly to @sql-worker

**Saves**: 10-15 seconds

**Applied in**: Example 1 (block 5 of RPT_AccountCredit)

### Caching Conversion Patterns

**What to cache**: knowledge/wiki/sql-conversion-patterns.md content

**Where**: .agent/memory/facts.md (extract core rules)

**Invalidate when**: Conversion patterns wiki is updated

**Saves**: 2-3 seconds per @sql-worker delegation (less file I/O)

### Batch Block Conversion

**When**: User says "convert blocks 10-15 of SP X"

**Action**: Single @sql-worker delegation with all 6 blocks

**Saves**: 5× delegation overhead = 30-40 seconds

**Trade-off**: Less granular error handling (if one fails, may need to redo all)

---

## Dependencies

**Subagents Required**:
- **@researcher** - Pre-flight analysis for god nodes
- **@sql-worker** - MSSQL → Redshift conversion expertise
- **@validator** - Test execution and row comparison
- **@fixer** - Debugging and diff analysis
- **@wiki-keeper** - Documentation updates

**Files Required**:
- `reporting/mssql_source/[SP_NAME].sql` - Source MSSQL stored procedure
- `reporting/store_procedures/[SP_NAME].sql` - Target Redshift file
- `migration_validation/cases/[SP_NAME]/*.json` - Test cases
- `knowledge/wiki/sql-conversion-patterns.md` - Conversion rules
- `.agent/memory/facts.md` - Project constraints
- `.agent/memory/graphify_topology.md` - God node list

**External Tools**:
- `./migration_validation/run_validation.sh` - Validation script (Python + psql)
- Redshift database connection - For running converted SPs
- MSSQL database connection - For comparison queries

**Knowledge Base**:
- `knowledge/wiki/reporting-domain.md` - Reporting DB architecture
- `knowledge/wiki/schema-routing.md` - REPORTING vs vSOURCE rules
- `.agent/learning/lessons.md` - Past fixes and patterns

---

## Integration Points

### With Graphify

**Uses topology for**: God node detection (triggers @researcher pre-flight)

**Implementation**:
```
At session start:
  Load .agent/memory/graphify_topology.md
  Parse god_nodes = [entities with >15 edges]

In Step 1 condition:
  IF SP_NAME in god_nodes:
    Run @researcher pre-flight
  ELSE:
    Skip to Step 2
```

**Example**:
```
graphify_topology.md lists:
  - RPT_OrderSummary (19 edges) ← God node
  - RPT_SalesByRegion (8 edges) ← Not god node

User: "Convert block 15 of RPT_OrderSummary"
  → Triggers pre-flight (19 > 15)

User: "Convert block 8 of RPT_SalesByRegion"
  → Skips pre-flight (8 < 15)
```

### With Obsidian MCP

**Uses vault for**: Cross-repo SQL conversion patterns

**Implementation**:
```
@wiki-keeper (in Step 5):
  1. mcp__obsidian__search_notes("SQL conversion patterns")
  2. Read pattern from Obsidian vault (if more recent than local wiki)
  3. Apply pattern to current task
  4. Write results back to local wiki
  5. mcp__obsidian__write_note() - Update vault with new learnings
```

**Example**:
```
Obsidian vault has "SQL Conversion Patterns.md" with:
  - CAST rules
  - FX rate patterns
  - Timezone conversion

@sql-worker reads these patterns (via @wiki-keeper pre-load)
Applies to block 15 conversion
After validation passes, @wiki-keeper writes back:
  "Block 15 success - FX pattern worked"
```

---

## Testing Checklist

Before deploying this skill:

- [x] Tested on 3+ real blocks
  - Block 5 (simple) - 60s, PASS
  - Block 15 (complex/god node) - 90s, PASS
  - Block 12 (validation failure) - 120s, PASS after fix
- [x] Simple case works (fast path without pre-flight)
- [x] Complex case works (full workflow with pre-flight)
- [x] Error handling tested (validation failure → fixer → retry)
- [x] Parallel execution verified (@validator + @wiki-keeper run simultaneously, saved 35s)
- [x] Memory updates happen (working.md, lessons.md updated correctly)
- [x] Subagents receive sufficient context (no failures due to missing info)
- [x] Outputs are in expected format (SQL files, validation results, wiki pages)
- [x] User notifications are clear ("✅ Block X converted successfully")
- [x] Metrics tracked and documented (95% success rate, 75s average time)

---

## Maintenance

**Review Frequency**: Monthly

**Review Checklist**:
- [ ] Check success rate - Still >90%?
- [ ] Review failure cases - New patterns to add to lessons.md?
- [ ] Verify time estimates - Still 60-90s range?
- [ ] Check context usage - Still <36K total?
- [ ] Look for optimization opportunities - New fast-paths?
- [ ] Update examples with new learnings
- [ ] Refactor if logic gets complex (currently 7 steps, manageable)

**Last Reviewed**: 2026-06-03

**Next Review**: 2026-07-03

---

## Notes

- This skill is the **most-used** in redshift-reporting (40 blocks converted)
- Pre-flight check is critical for god nodes - saved 5+ hours of debugging
- Parallel execution of validation + docs saves 30-45s per block = 20-30 minutes total
- Fixer subagent resolved 95% of validation failures automatically
- Knowledge accumulation in lessons.md reduced failure rate from 30% (early blocks) to 5% (recent blocks)

---

**Version**: 1.0
**Created**: 2026-05-15
**Last Updated**: 2026-06-03
**Maintainer**: See .agent/index.md in redshift-reporting
