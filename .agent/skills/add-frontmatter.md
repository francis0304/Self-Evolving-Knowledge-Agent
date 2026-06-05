# Skill: add-frontmatter

## Purpose
Batch add or update frontmatter metadata to notes, inferring appropriate tags and metadata from content and folder location.

---

## When to Use

**Triggers**: "add frontmatter", "tag notes", "update metadata", "batch tag"

**Examples**:
- "Add frontmatter to all notes in projects/ without it"
- "Tag all notes in areas/ folder"
- "Update metadata for recent notes"

---

## Workflow

### Step 1: Scan for Notes Without Frontmatter

**Tools**: MCP

**Actions**:
1. `list_notes(path)` - Get notes in target directory
2. For each note:
   - `read_note(path)` - Check for YAML frontmatter (---...---)
   - If missing or incomplete: Add to list

**Output**: List of notes needing frontmatter

---

### Step 2: Infer Metadata

**Purpose**: Generate appropriate tags and metadata

**Logic**:
```
Tags from folder:
- areas/*.md → [area, {topic}]
- projects/*.md → [project, data-platform]
- wikis/*.md → [wiki, patterns]
- .agent/*.md → [agent-system, documentation]

Additional tags from content:
- Scan first 500 chars for keywords
- Check title for domain hints
- Extract from existing inline tags

Metadata:
- created: File creation date (if available) or today
- updated: Today
- status: "active" (default)
```

**Output**: `{note_path: {tags: [...], created: date, updated: date, status: str}}`

---

### Step 3: Generate Frontmatter

**Purpose**: Format YAML frontmatter

**Format**:
```yaml
---
tags: [tag1, tag2, tag3]
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: active
---
```

**Actions**:
1. For each note, generate frontmatter block
2. Preserve existing content (insert frontmatter at top)
3. If frontmatter exists, merge (add missing fields, keep existing)

---

### Step 4: Preview Changes

**Purpose**: Show user what will be added

**Output**:
```
Frontmatter to be added to 3 notes:

projects/New Project.md:
  ---
  tags: [project, data-platform]
  created: 2026-06-03
  updated: 2026-06-03
  status: active
  ---

areas/SAP Analysis.md:
  ---
  tags: [area, sap, analysis]
  created: 2026-05-15
  updated: 2026-06-03
  status: active
  ---

[Show 3/12 notes - continue? y/n]
```

**Ask**: "Apply frontmatter to these notes?"

---

### Step 5: Apply Updates

**Condition**: User approves

**Tools**: MCP

**Actions**:
1. For each note:
   - `read_note(path)` - Get current content
   - Insert/merge frontmatter at top
   - `write_note(path, updated_content)`
2. Track successes/failures

**Output**: Count of updated notes

---

### Step 6: Update Memory

```markdown
## 2026-06-03: Batch Frontmatter Addition
- Status: Complete
- Notes Updated: 12
- Directories: projects/, areas/
- Tags Added: project, data-platform, area, sap, analysis
- Time: 90 seconds
```

---

## Outputs

- Updated notes with frontmatter
- Memory record

**Notification**:
```
✅ Frontmatter added to 12 notes

Breakdown:
- projects/: 5 notes
- areas/: 7 notes

Tags used: project, data-platform, area, sap, analysis
```

---

## Error Handling

### Existing Frontmatter

**Recovery**: Merge (add missing fields, preserve existing)

### Invalid YAML

**Recovery**: Skip note, report error, continue with others

### Permission Error

**Recovery**: Report inaccessible files, continue with rest

---

## Examples

### Example: Batch Add to projects/

**User**: "Add frontmatter to all notes in projects/"

**Flow**:
1. Scan projects/ - Find 5 notes without frontmatter
2. Infer tags (all get [project, data-platform])
3. Generate frontmatter for each
4. Preview changes
5. User approves
6. Apply to all 5
7. Report success

**Time**: 60 seconds

---

## Dependencies

**MCP Tools**:
- mcp__obsidian__list_notes
- mcp__obsidian__read_note
- mcp__obsidian__write_note

**Files**:
- `.agent/memory/facts.md` (tagging conventions)

---

## Notes

- Never overwrite user-added frontmatter fields
- Always merge, never replace
- Default status: "active" (user can change)
- Tags should be lowercase, hyphenated
- Batch size >10: Show preview every 10 notes

---

**Version**: 1.0
**Created**: 2026-06-03
