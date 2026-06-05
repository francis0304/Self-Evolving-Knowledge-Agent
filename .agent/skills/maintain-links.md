# Skill: maintain-links

## Purpose
Check vault link health, identify broken links and orphaned files, and generate fix suggestions.

---

## When to Use

**Trigger Keywords**: "check links", "broken links", "find orphans", "link health", "dead links"

**Task Patterns**: 
- User wants to audit vault link integrity
- Periodic maintenance (weekly)
- After bulk file moves/renames

**Example Requests**:
- "Check for broken links in the vault"
- "Find orphaned files that aren't linked anywhere"
- "Fix all broken wiki-links"

---

## Inputs

**Required**:
- Vault scope (entire vault OR specific directory)

**Optional**:
- Auto-fix mode (default: report only)

---

## Workflow

### Step 1: Scan for Broken Links

**Purpose**: Identify all wiki-links pointing to non-existent notes

**Tools**: MCP Obsidian

**Actions**:
1. `list_notes()` - Get all notes in vault
2. For each note:
   - `read_note(path)` - Get content
   - `get_links(path)` - Extract outgoing links
   - Check if each linked note exists
3. Collect broken links

**Expected output**: 
```
Broken Links Report:
- areas/Data Platform Overview.md:
  - [[Missing Note 1]] (line 45)
  - [[Old File Name]] (line 78)
- projects/Airflow.md:
  - [[Deprecated Pattern]] (line 23)
```

**Time estimate**: 30-60 seconds (depends on vault size)

---

### Step 2: Find Orphaned Files

**Purpose**: Identify notes with zero incoming links (not referenced anywhere)

**Tools**: MCP Obsidian

**Actions**:
1. `list_notes()` - Get all notes
2. For each note:
   - `get_backlinks(path)` - Check incoming links
   - If backlinks == 0: Mark as orphan
3. Exclude from orphans:
   - Index.md
   - Daily notes (daily/*.md)
   - Template files (templates/*.md)
   - Recently created (<7 days)

**Expected output**:
```
Orphaned Files:
- areas/Old SAP Analysis.md (no incoming links)
- projects/Deprecated Tool.md (no incoming links)
```

**Time estimate**: 30-45 seconds

---

### Step 3: Detect Link Patterns

**Purpose**: Identify common issues (typos, renamed files)

**Actions**:
1. For broken links, search for similar filenames:
   - Fuzzy match (edit distance)
   - Case variations
   - Common typos
2. Group by likely fix

**Expected output**:
```
Fix Suggestions:
- [[Data Platform Overveiw]] → Did you mean [[Data Platform Overview]]?
- [[Airflow Pattern]] → Did you mean [[Airflow Patterns]]?
- [[Agent System v4]] → Did you mean [[.agent-system-introduction]]?
```

**Time estimate**: 10-15 seconds

---

### Step 4: Generate Report

**Purpose**: Compile findings into actionable report

**Handle directly**: Main agent

**Actions**:
1. Combine results from Steps 1-3
2. Categorize by severity:
   - **Critical**: Index.md has broken links
   - **High**: Project notes have broken links
   - **Medium**: Area notes have broken links
   - **Low**: Daily notes have broken links
3. Add fix recommendations
4. Calculate metrics

**Expected output**:
```markdown
# Link Health Report - 2026-06-03

## Summary
- Total notes: 127
- Broken links: 5
- Orphaned files: 3
- Fix suggestions: 4

## Critical Issues (0)
None

## High Priority (2)
- projects/Redshift Reporting.md: [[Old Wiki]] → Suggest: [[Redshift Patterns]]
- projects/Airflow.md: [[Deprecated DAG]] → Suggest: Remove or create stub

## Medium Priority (3)
- areas/Data Platform Overview.md: [[Missing Link]]
- areas/Database Architecture.md: [[Old Diagram]]

## Orphaned Files (3)
- areas/Old SAP Analysis.md (created 2026-05-01, no links)
- projects/Deprecated Tool.md (created 2025-12-15, no links)

## Recommendations
1. Fix broken links in project notes (high priority)
2. Review orphaned files for deletion/archival
3. Consider creating redirect stubs for renamed notes
```

**Time estimate**: 5-10 seconds

---

### Step 5 (Conditional): Apply Fixes

**Purpose**: Automatically fix obvious issues (if user approves)

**Condition**: IF user says "fix" or "apply"

**Tools**: MCP Obsidian

**Actions**:
1. For each high-confidence fix suggestion:
   - `read_note(path)` - Get current content
   - Replace broken link with suggested link
   - `write_note(path, updated_content)` - Save
2. Log changes to `.agent/memory/working.md`

**Recovery strategy**:
- Only auto-fix if confidence >90% (exact case-insensitive match)
- For uncertain fixes: Ask user confirmation
- Create backup list before applying

**Time estimate**: 20-40 seconds (depends on fix count)

---

### Step 6 (Parallel): Update Memory

**Purpose**: Record link health status for incremental checks

**Actions**:
1. Write link health snapshot to `.agent/memory/link_status.md`:
   ```markdown
   # Link Health Snapshot
   **Date**: 2026-06-03
   **Broken Links**: 5
   **Orphaned Files**: 3
   **Last Full Scan**: 2026-06-03
   
   ## Known Issues
   - [[Missing Link]] in Data Platform Overview
   - [[Old Diagram]] in Database Architecture
   ```

2. Update `.agent/memory/working.md` with task record

**Time estimate**: 5 seconds

---

## Outputs

**Primary**:
- **Link Health Report** (markdown format, shown to user)
- **Fix suggestions** (actionable list)

**Side Effects**:
- `.agent/memory/link_status.md` updated
- `.agent/memory/working.md` updated with task record
- (If auto-fix): Notes updated with fixed links

**User Notification**:
```
✅ Link health check complete

Summary:
- 5 broken links found
- 3 orphaned files detected
- 4 fix suggestions generated

High priority issues: 2
See full report above.

Apply fixes? (Say "apply fixes" to auto-fix high-confidence issues)
```

---

## Error Handling

### Error Type 1: MCP Connection Failure

**Symptoms**: Cannot connect to Obsidian MCP server

**Recovery**:
1. Check MCP server status
2. Retry connection (max 2 attempts)
3. If still failing: Report to user "MCP server unavailable"

### Error Type 2: Large Vault Timeout

**Symptoms**: Scan takes >2 minutes

**Recovery**:
1. Switch to incremental mode (check only changed files)
2. Use link_status.md cache for unchanged files
3. Report: "Vault large, running incremental scan"

### Error Type 3: Ambiguous Fix Suggestions

**Symptoms**: Multiple potential fixes for one broken link

**Recovery**:
1. List all options
2. Ask user to choose
3. Don't auto-fix (confidence <90%)

---

## Memory Updates

### Update `.agent/memory/working.md`

**When**: After Step 4 (report generated)

**Format**:
```markdown
## 2026-06-03: Link Health Check
- Status: Complete
- Broken Links: 5
- Orphaned Files: 3
- Fixes Applied: [0 or count]
- Time: 90 seconds
- Notes: [Any special circumstances]
```

### Update `.agent/memory/link_status.md`

**When**: After Step 6

**Purpose**: Enable incremental checks (next time scan only changed files)

---

## Examples

### Example 1: Full Link Check

**User Request**: "Check for broken links"

**Flow**:
1. Scan vault (127 notes)
2. Find 5 broken links
3. Find 3 orphaned files
4. Generate 4 fix suggestions
5. Report to user

**Time**: 90 seconds

**Outputs**: Report (see Step 4 example)

---

### Example 2: Auto-Fix Mode

**User Request**: "Check links and fix any obvious issues"

**Flow**:
1. Scan vault
2. Find 5 broken links
3. Analyze: 3 high-confidence fixes (case variations)
4. Ask user: "Found 3 auto-fixable issues. Apply?"
5. User: "Yes"
6. Apply fixes to 3 files
7. Report: "Fixed 3/5 broken links, 2 require manual review"

**Time**: 110 seconds

**Outputs**: 3 files updated + report

---

### Example 3: Incremental Check

**User Request**: "Check links" (2nd time this week)

**Flow**:
1. Read link_status.md (last scan: 2 days ago)
2. Check only files modified since last scan (5 files)
3. Find 1 new broken link
4. Report: "Incremental check: 1 new issue found"

**Time**: 20 seconds

**Outputs**: Updated report

---

## Performance Metrics

**Target Metrics**:
- Full scan: <120 seconds for vaults <200 notes
- Incremental scan: <30 seconds
- Fix accuracy: >95% for high-confidence suggestions

**Actual Metrics** (update after usage):
- Full scan: [TBD]
- Incremental scan: [TBD]
- Fix accuracy: [TBD]

---

## Optimization Opportunities

### 1. Incremental Scanning

**Pattern**: Cache link health, only check changed files

**Saves**: 60-70 seconds on repeat scans

### 2. Parallel Checks

**Pattern**: Check multiple notes simultaneously (MCP allows)

**Saves**: 20-30 seconds on large vaults

### 3. Smart Orphan Detection

**Pattern**: Exclude known "intentionally unlinked" files (daily notes, templates)

**Saves**: False positives, user time reviewing

---

## Dependencies

**MCP Tools Required**:
- mcp__obsidian__list_notes
- mcp__obsidian__read_note
- mcp__obsidian__write_note
- mcp__obsidian__get_links
- mcp__obsidian__get_backlinks
- mcp__obsidian__search_notes (for fix suggestions)

**Files Required**:
- `.agent/memory/link_status.md` (for incremental mode)
- `.agent/memory/facts.md` (vault structure info)

---

## Integration Points

### With Index.md Maintenance

**Pattern**: After link fixes, check if Index.md needs updates

**Example**:
```
Link check finds orphaned "SAP Analysis.md"
User decides to link it from Index.md
→ Trigger @indexer: "Add SAP Analysis.md to Index.md under Areas"
```

### With Metadata Keeper

**Pattern**: Orphaned files may lack proper tags/frontmatter

**Example**:
```
Link check finds 3 orphaned files
→ Suggest: "Run metadata check on orphaned files"
→ @metadata-keeper: Add frontmatter to orphans (easier to search/link)
```

---

## Testing Checklist

- [ ] Full vault scan (all notes)
- [ ] Incremental scan (only changed files)
- [ ] Broken link detection (wiki-links)
- [ ] Orphan detection (exclude daily/, templates/)
- [ ] Fix suggestions (fuzzy matching)
- [ ] Auto-fix mode (high-confidence only)
- [ ] MCP error handling (connection failure)
- [ ] Large vault optimization (>200 notes)

---

## Notes

- Always exclude daily notes from orphan detection (expected to be unlinked)
- Index.md itself should never be marked as orphaned
- Template files are intentionally unlinked (don't flag)
- Consider file age: orphans <7 days may be work-in-progress
- External links (http://, https://) not checked (out of scope)

---

**Version**: 1.0
**Created**: 2026-06-03
**Last Updated**: 2026-06-03
