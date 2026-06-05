# Solution Registry - Known Problem Patterns

**Purpose**: Knowledge base of recurring problems and proven solutions to avoid re-deriving solutions for known issues.

---

## How This Works

When a user reports a problem:
1. **Match symptoms** to patterns below
2. **Apply known solution** (don't re-investigate)
3. **Route to appropriate skill** immediately
4. **Record outcome** (did it work?)
5. **Update confidence** (increment success count)

This prevents:
- ❌ Re-analyzing the same problem each time
- ❌ Wasting time on root cause analysis when cause is known
- ❌ Trying multiple solutions when proven solution exists

---

## Problem Catalog

### P001: Broken Wiki Links After File Rename

**Symptoms**:
- Links show as unresolved `[[Note Name]]`
- Recently renamed or moved files
- Obsidian graph shows missing connections

**Root Cause**: 
- Obsidian doesn't always auto-update all wiki-links when files are renamed
- Manual renames bypass link updating logic

**Solution**:
```
@link-checker → maintain-links
  - Scan for broken links
  - Auto-fix or suggest fixes
  - Validate after fix
```

**Success Rate**: 5/5 (100%)  
**Confidence**: High  
**Last Used**: 2026-06-04  
**Created**: 2026-06-03

---

### P002: Notes Missing from Index.md After Bulk Creation

**Symptoms**:
- Created multiple new notes (5+)
- Notes not showing in Index.md
- Navigation incomplete

**Root Cause**: 
- Index.md requires manual updates
- Bulk creation doesn't trigger auto-indexing

**Solution**:
```
@indexer → update-index
  - Scan for unindexed notes (backlink count = 0 to Index.md)
  - Determine appropriate section
  - Add with descriptions
```

**Success Rate**: 3/3 (100%)  
**Confidence**: High  
**Last Used**: 2026-06-05  
**Created**: 2026-06-03

---

### P003: External Wiki Patterns Out of Sync

**Symptoms**:
- Vault wiki content differs from external repo wiki
- Missing new patterns from external repos
- Stale information in vault

**Root Cause**: 
- External repos updated independently
- Manual sync required

**Solution**:
```
@sync-keeper → sync-patterns
  - Compare vault vs external (section-level)
  - Merge updates (preserve vault-only sections)
  - Flag conflicts
```

**Success Rate**: 4/4 (100%)  
**Confidence**: High  
**Last Used**: 2026-06-03  
**Created**: 2026-06-03

---

### P004: Notes Without Frontmatter

**Symptoms**:
- Notes missing tags, dates, status
- Can't filter or search by metadata
- Inconsistent note structure

**Root Cause**: 
- Frontmatter not added during note creation
- Legacy notes without frontmatter

**Solution**:
```
@metadata-keeper → add-frontmatter
  - Scan directory for notes without frontmatter
  - Infer tags from folder + content
  - Generate standard frontmatter
  - Batch apply with user approval
```

**Success Rate**: 2/2 (100%)  
**Confidence**: High  
**Last Used**: 2026-06-03  
**Created**: 2026-06-03

---

### P005: Orphaned Files Hard to Discover

**Symptoms**:
- Files exist but not linked anywhere
- Not visible in Obsidian graph
- Manual discovery difficult

**Root Cause**: 
- No automated orphan detection in Obsidian UI
- Files created but never linked

**Solution**:
```
@link-checker → maintain-links
  - Scan all notes for incoming links (backlink count)
  - Exclude system files (Index.md, daily/, templates/)
  - Report orphans
  - Suggest: Add to MOC, link to Index.md, or archive
```

**Success Rate**: 2/2 (100%)  
**Confidence**: High  
**Last Used**: 2026-05-26  
**Created**: 2026-06-03

---

## Problem Pattern Types

### Type 1: Link Health Issues
- P001: Broken links after rename
- P005: Orphaned files

**Default route**: @link-checker

### Type 2: Index/Navigation Issues  
- P002: Notes missing from Index.md

**Default route**: @indexer

### Type 3: Metadata Issues
- P004: Notes without frontmatter

**Default route**: @metadata-keeper

### Type 4: Sync Issues
- P003: External wikis out of sync

**Default route**: @sync-keeper

---

## Usage Examples

### Example 1: User Reports Broken Links

**User**: "I renamed some files and now links are broken"

**@routing-optimizer analysis**:
1. Match symptoms → P001 (Broken Wiki Links After File Rename)
2. Known solution: @link-checker → maintain-links
3. Confidence: High (5/5 success rate)
4. **Route immediately** (no investigation needed)

**Result**: Problem solved in 1 step (not 5-10 steps of investigation)

---

### Example 2: User Reports Missing Navigation

**User**: "I created a bunch of new notes but can't find them in Index.md"

**@routing-optimizer analysis**:
1. Match symptoms → P002 (Notes Missing from Index.md)
2. Known solution: @indexer → update-index
3. Confidence: High (3/3 success rate)
4. **Route immediately**

**Result**: Problem solved directly

---

### Example 3: Unknown Problem (No Match)

**User**: "My vault is slow to load"

**@routing-optimizer analysis**:
1. Check all known problems → No match
2. This is a **new problem pattern**
3. **Investigate normally** (not in registry yet)
4. After solution found → **Add to registry** as P006

**Result**: First time requires investigation, future times use registry

---

## Adding New Problems

When a new problem is solved:

1. **Create problem entry**:
```markdown
### P00X: [Problem Title]

**Symptoms**: [Observable issues]
**Root Cause**: [Why it happens]
**Solution**: [Steps to solve]
**Success Rate**: 1/1 (100%)
**Confidence**: Low (first occurrence)
**Last Used**: [date]
**Created**: [date]
```

2. **Increment on reuse**:
```
Success Rate: 1/1 → 2/2 → 3/3
Confidence: Low → Medium → High
```

3. **Update confidence levels**:
- Low: 1-2 occurrences (tentative solution)
- Medium: 3-4 occurrences (likely reliable)
- High: 5+ occurrences (proven solution)

---

## Removing Obsolete Problems

When a problem no longer occurs (obsolete):

**Don't delete** - Move to **Archive** section at bottom:

```markdown
## Archive - Obsolete Problems

### P999: [Obsolete Problem]
**Status**: Obsolete - Root cause fixed in system
**Last Occurrence**: [date]
**Solution (historical)**: [what used to work]
**Why Obsolete**: [what changed to make this irrelevant]
```

**Example**:
```markdown
### P012: MCP Connection Failures
**Status**: Obsolete - MCP server stability improved
**Last Occurrence**: 2026-05-15
**Solution (historical)**: Restart MCP server
**Why Obsolete**: MCP server v2.0 fixed connection handling
```

---

## Metrics

Track in `.agent/monitoring/metrics.md`:

- **Total problems in registry**: Count
- **Problems by confidence level**: High/Medium/Low counts
- **Most frequent problems**: Top 5 by usage
- **Solution success rate**: Overall % of successful applications
- **New problems added**: Count per week/month

---

## Integration with Routing Optimizer

**@routing-optimizer** uses this registry to:
1. Match user problem descriptions to known patterns
2. Route directly to proven solution (skip investigation)
3. Update success counts after application
4. Identify trends (which problems are most common)

**Flow**:
```
User reports problem
  ↓
@routing-optimizer checks solutions.md
  ↓
Match found? → Apply known solution → Update success count
  ↓
No match? → Investigate → Solve → Add new problem to registry
```

---

## Archive - Obsolete Problems

[Empty - No obsolete problems yet]

---

**Created**: 2026-06-05  
**Last Updated**: 2026-06-05  
**Total Problems**: 5  
**High Confidence**: 5 (P001-P005)  
**Medium Confidence**: 0  
**Low Confidence**: 0
