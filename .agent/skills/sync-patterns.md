# Skill: sync-patterns

## Purpose
Synchronize wiki pattern summaries from external repository knowledge bases, preserving manual vault edits.

---

## When to Use

**Triggers**: "sync patterns", "update wikis", "pull latest patterns", "check external repos"

**Examples**:
- "Sync Airflow patterns from the Airflow repo"
- "Update all wiki summaries from external repos"
- "Check if wikis/ are up to date"

---

## Workflow

### Step 1: Identify External Repos

**Source**: `.agent/memory/facts.md`

**External repo paths**:
```
Airflow: ${EXTERNAL_REPOS}/example-repo-airflow
Glue: ${EXTERNAL_REPOS}/example-repo-glue
Redshift: ${EXTERNAL_REPOS}/example-repo-redshift
Infrastructure: ${EXTERNAL_REPOS}/example-repo-infra
SRE: ${EXTERNAL_REPOS}/example-repo-sre
```

**Mapping**:
```
Repo → Vault wiki:
airflow/knowledge/wiki/ → wikis/Airflow Patterns.md
glue/knowledge/wiki/ → wikis/Glue Patterns.md
redshift-reporting/knowledge/wiki/ → wikis/Redshift Patterns.md (custom)
infrastructure/docs/ → wikis/Infrastructure Patterns.md
sre/docs/ → wikis/SRE Patterns.md
```

---

### Step 2: Read External Wiki Content

**Tools**: Read (file system, not MCP - external to vault)

**Actions**:
1. For target repo(s):
   - Check if path exists
   - Read relevant wiki files (e.g., airflow/knowledge/wiki/*.md)
   - Parse pattern content
   - Extract key sections

**Output**: External wiki content + timestamps

---

### Step 3: Read Vault Wiki

**Tools**: MCP

**Actions**:
1. `read_note("wikis/Airflow Patterns.md")`
2. Parse current content
3. Identify manual edits (sections not in external wiki)

**Output**: Vault wiki content + manual edit regions

---

### Step 4: Compare & Merge

**Purpose**: Identify what changed, preserve manual edits

**Logic**:
```
For each pattern:
  If in external but not in vault:
    → Add to vault
  If in both:
    → Compare timestamps/content
    → If external newer: Update vault section
    → If vault has manual edits: Preserve those sections
  If in vault but not in external:
    → Keep (manual addition)
```

**Output**: Merged content

---

### Step 5: Generate Sync Report

**Purpose**: Show user what will change

**Output**:
```
Sync Report: Airflow Patterns

Updates from external repo:
+ New Pattern: "DAG Factory v2" (added 2026-06-01)
~ Updated Pattern: "Dynamic Task Generation" (modified 2026-05-28)

Preserved vault-only content:
✓ Custom notes in "Usage Examples" section
✓ Local variations in "Best Practices"

Apply sync? y/n
```

---

### Step 6: Apply Sync

**Condition**: User approves

**Tools**: MCP

**Actions**:
1. `write_note("wikis/Airflow Patterns.md", merged_content)`
2. Update frontmatter (updated: today)
3. Log to memory

**Output**: Updated wiki file

---

### Step 7: Update Memory

```markdown
## 2026-06-03: Wiki Pattern Sync
- Status: Complete
- Repos Synced: Airflow, Glue
- Patterns Updated: 3
- Patterns Added: 1
- Manual Edits Preserved: 2 sections
- Time: 75 seconds
```

---

## Outputs

- Updated wiki files in wikis/
- Sync report
- Memory record

**Notification**:
```
✅ Patterns synced from external repos

Airflow Patterns:
  + 1 new pattern
  ~ 2 updated patterns
  ✓ 2 vault sections preserved

Glue Patterns:
  ~ 1 updated pattern

Time: 75 seconds
```

---

## Error Handling

### External Repo Not Found

**Recovery**: Report missing repo, continue with others

### Merge Conflict

**Recovery**: Preserve both versions, flag for manual review

### Write Failure

**Recovery**: Show merged content to user, ask for manual intervention

---

## Examples

### Example: Sync Single Repo

**User**: "Sync Airflow patterns"

**Flow**:
1. Read airflow/knowledge/wiki/*.md (external)
2. Read wikis/Airflow Patterns.md (vault)
3. Compare: 1 new, 2 updated, 2 vault-only sections
4. Merge: Preserve vault sections, add new, update changed
5. Preview sync report
6. User approves
7. Write to vault
8. Report success

**Time**: 45 seconds

---

### Example: Sync All Repos

**User**: "Update all wikis from external repos"

**Flow**:
1. Iterate through all 5 repos
2. For each: Read external, read vault, compare, merge
3. Generate combined report
4. User approves all
5. Write all updated wikis
6. Report summary

**Time**: 120 seconds

---

## Dependencies

**Tools**:
- Read (file system for external repos)
- MCP (vault wikis)

**Files**:
- `.agent/memory/facts.md` (repo paths)
- wikis/*.md (vault wikis)

---

## Notes

- Always preserve manual vault edits (section-level preservation)
- If unsure about merge: Ask user
- Sync frequency: Weekly recommended
- External repos must have knowledge/wiki/ or docs/ structure
- Timestamps help determine "newer" version

---

**Version**: 1.0
**Created**: 2026-06-03
