# Reusable Patterns - Knowledge Vault

---

## Pattern: MCP-First for Obsidian Integration

**Domain**: Obsidian vault operations

**Problem**: Need to interact with Obsidian vault (read, write, link management)

**Solution**: Always use MCP tools (mcp__obsidian__*) rather than direct file I/O

**Rationale**:
- MCP understands vault structure (links, backlinks, graph)
- Keeps Obsidian app in sync
- Handles wiki-link resolution automatically
- Provides backlink tracking out of the box

**Example**:
```
Good:
1. mcp__obsidian__list_notes(path="projects/")
2. mcp__obsidian__read_note("projects/Airflow.md")
3. mcp__obsidian__write_note("projects/Airflow.md", content)

Bad:
1. Glob("projects/*.md")
2. Read("projects/Airflow.md")
3. Write("projects/Airflow.md", content)
```

**When to Use**:
- Any vault read/write operation
- Link analysis
- Note discovery
- Metadata queries

**When NOT to Use**:
- External repo files (not in vault) - use Read/Write
- Binary files
- Non-Obsidian markdown files

**Related Lessons**:
- MCP Tools Required for Vault Operations (2026-06-03)

**Confidence**: High - Design principle

**Usage**: Applied in all 5 vault skills

**Promoted From**: lessons.md (2026-06-03)

---

## Pattern: Preview Before Batch Apply

**Domain**: Batch operations (any domain)

**Problem**: Batch operations can affect many files, risky to apply without review

**Solution**: Generate preview/diff, show to user, require explicit approval before applying

**Process**:
1. Identify affected files
2. Generate proposed changes (diff format when possible)
3. Show sample (all if <10, first 10 if >10)
4. Ask: "Apply these changes? y/n"
5. If approved: Apply all
6. Report results (success count, failures)

**Example**:
```markdown
Batch update preview:

projects/Airflow.md:
  + tags: [project, data-platform]
  + created: 2026-05-15
  
projects/Glue.md:
  + tags: [project, data-platform]
  + created: 2026-05-20

Showing 2/5 files. Apply to all 5? y/n
```

**When to Use**:
- >5 files affected
- Destructive operations (delete, major edits)
- Irreversible changes
- User trust building

**When NOT to Use**:
- Single file operations
- Read-only queries
- Explicitly requested auto-apply mode

**Related Lessons**:
- Batch Operations Need User Approval (2026-06-03)

**Confidence**: High - UX best practice

**Usage**: Applied in add-frontmatter, maintain-links (auto-fix mode)

**Promoted From**: lessons.md (2026-06-03)

---

## Pattern: Section-Level Merge for Sync

**Domain**: Content synchronization

**Problem**: Need to sync content from external source while preserving manual local edits

**Solution**: Merge at section level (## headings), not file level

**Process**:
1. Parse both sources into sections (by ## headings)
2. Compare sections:
   - In external only → Add to local
   - In both → Use newer (by timestamp/content hash)
   - In local only → Preserve (manual addition)
3. Reconstruct file with merged sections
4. Flag conflicts for manual review

**Example**:
```
External wiki has:
  ## Pattern A (updated 2026-06-01)
  ## Pattern B (unchanged)

Vault wiki has:
  ## Pattern A (older 2026-05-15)
  ## Pattern B (unchanged)
  ## Local Note (vault-only)

Merge result:
  ## Pattern A (from external, newer)
  ## Pattern B (unchanged)
  ## Local Note (preserved from vault)
```

**When to Use**:
- Wiki pattern sync
- Documentation updates
- Any two-way sync scenario
- Preserving manual edits

**When NOT to Use**:
- Binary files
- Source-of-truth overwrite (no local edits)
- Completely different content (not incremental update)

**Related Lessons**:
- Preserve Manual Edits When Syncing (2026-06-03)

**Confidence**: High - Merge strategy best practice

**Usage**: Applied in sync-patterns skill

**Promoted From**: lessons.md (2026-06-03)

---

## Pattern: Exclude System Files from Content Operations

**Domain**: Vault/repo maintenance

**Problem**: System files get flagged in content operations (orphan detection, indexing, etc.)

**Solution**: Define exclusion list for system/infrastructure files

**Exclusion categories**:
- Navigation hubs (Index.md, MOCs)
- Daily/journal entries (independent by design)
- Templates (blueprints, not content)
- System directories (.agent/, .obsidian/, .git/)
- Recent files (<7 days, may be work-in-progress)

**Example**:
```python
def is_orphan_candidate(note_path, backlink_count, created_date):
    # Exclude system files
    if note_path in ["Index.md", "README.md"]:
        return False
    if note_path.startswith("daily/"):
        return False
    if note_path.startswith("templates/"):
        return False
    if note_path.startswith(".agent/"):
        return False
    # Exclude recent (WIP)
    if days_since(created_date) < 7:
        return False
    # Check backlinks
    return backlink_count == 0
```

**When to Use**:
- Orphan detection
- Link health checks
- Auto-indexing
- Content queries

**When NOT to Use**:
- Explicit "check all files" requests
- System file maintenance tasks
- Debug/audit operations

**Related Lessons**:
- Orphan Detection Must Exclude System Files (2026-06-03)

**Confidence**: High - Prevents false positives

**Usage**: Applied in maintain-links (orphan detection)

**Promoted From**: lessons.md (2026-06-03)

---

**Created**: 2026-06-03
**Last Updated**: 2026-06-03
