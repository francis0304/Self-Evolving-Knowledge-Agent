# Skill: update-index

## Purpose
Maintain Index.md by adding new notes, ensuring proper categorization, and avoiding duplicates.

---

## When to Use

**Trigger Keywords**: "update Index.md", "add to index", "index new notes", "organize navigation"

**Example Requests**:
- "Add the new Agent System note to Index.md"
- "Update Index.md with recent notes"
- "Check if any notes are missing from Index.md"

---

## Inputs

**Required**:
- Note to add (specific note path) OR "scan for unindexed"

**Optional**:
- Target section hint (e.g., "add to Areas section")

---

## Workflow

### Step 1: Identify Unindexed Notes

**Tools**: MCP Obsidian

**Actions**:
1. `read_note("Index.md")` - Get current Index.md
2. Extract all wiki-links from Index.md
3. `list_notes()` - Get all vault notes
4. Compare: Find notes not in Index.md
5. Exclude: daily/, templates/, .agent/

**Expected output**: List of unindexed notes with paths

---

### Step 2: Categorize Notes

**Purpose**: Determine which Index.md section each note belongs to

**Logic**:
```
Path-based categorization:
- areas/*.md → "## Areas" section
- projects/*.md → "## Project Repositories" section  
- wikis/*.md → "## Wiki Quick Reference" section
- .agent*.md or Agent System topics → "## Agent System" section
- MCP/tools topics → "## Tools & Integration" section
- daily/*.md → "## Daily Notes" section (recent only)

Content-based (if path ambiguous):
- Read note content
- Check frontmatter tags
- Scan for key phrases
- Use folder location as tie-breaker
```

**Expected output**: `{note_path: section_name}` mapping

---

### Step 3: Generate Index.md Updates

**Purpose**: Create wiki-link entries with descriptions

**Actions**:
1. For each unindexed note:
   - `read_note(path)` - Get title, first paragraph, frontmatter
   - Extract description (first sentence or frontmatter description field)
   - Format: `- [[Note Title]] - Description`
2. Find insertion point in target section
3. Maintain alphabetical order (optional) or append to section

**Expected output**: Diff of Index.md changes

---

### Step 4: Preview Changes

**Purpose**: Show user proposed changes before applying

**Handle directly**: Main agent

**Output**:
```diff
## Project Repositories
+ - [[New Project]] - Description of new project
+ - [[SAP Analysis]] - Analysis of SAP system

## Agent System
+ - [[Agent System Optimization]] - v5 meta-optimizer guide
```

**Ask user**: "Apply these changes to Index.md?"

---

### Step 5 (Conditional): Apply Updates

**Purpose**: Write changes to Index.md

**Condition**: IF user approves

**Tools**: MCP Obsidian

**Actions**:
1. Read current Index.md (re-read to avoid conflicts)
2. Apply updates from Step 3
3. `write_note("Index.md", updated_content)`
4. Verify write succeeded

**Recovery**: If write fails, report error with backup content

---

### Step 6: Update Memory

**Purpose**: Record index maintenance

**Actions**:
Update `.agent/memory/working.md`:
```markdown
## 2026-06-03: Index.md Maintenance
- Status: Complete
- Notes Added: 3
- Sections Updated: Project Repositories, Agent System
- Time: 45 seconds
```

---

## Outputs

**Primary**:
- Updated Index.md (with new wiki-links)
- Change preview (diff)

**Side Effects**:
- `.agent/memory/working.md` updated

**User Notification**:
```
✅ Index.md updated

Added:
- [[New Project]] to Project Repositories
- [[SAP Analysis]] to Project Repositories  
- [[Agent System Optimization]] to Agent System

Total notes indexed: 3
```

---

## Error Handling

### Error Type 1: Duplicate Entry

**Symptoms**: Note already in Index.md

**Recovery**:
1. Detect duplicate (case-insensitive match)
2. Compare sections
3. If same section: Skip
4. If different sections: Ask user "Found in X, move to Y?"

### Error Type 2: Ambiguous Categorization

**Symptoms**: Note could fit multiple sections

**Recovery**:
1. List potential sections
2. Ask user: "Add [[Note]] to: 1) Areas 2) Projects 3) Other?"
3. Apply user choice

### Error Type 3: Index.md Structure Changed

**Symptoms**: Expected sections not found

**Recovery**:
1. Report: "Index.md structure changed, cannot auto-update"
2. Show proposed entry
3. User manually places it

---

## Examples

### Example 1: Add Single Note

**User**: "Add Agent System Optimization.md to Index.md"

**Flow**:
1. Read Index.md
2. Check: Not currently indexed
3. Categorize: "Agent System" section (from filename pattern)
4. Generate entry: `- [[Agent System Optimization]] - v5 meta-optimizer guide`
5. Preview change
6. User approves
7. Apply update

**Time**: 30 seconds

---

### Example 2: Scan for Unindexed

**User**: "Check for notes not in Index.md"

**Flow**:
1. Read Index.md (extract 45 existing links)
2. List vault notes (127 total)
3. Exclude: daily/ (52), templates/ (3)
4. Compare: Find 3 unindexed
5. Categorize all 3
6. Preview: Show proposed additions
7. User approves
8. Add all 3 to Index.md

**Time**: 60 seconds

---

## Performance Metrics

**Target**:
- Single note: <30 seconds
- Bulk scan: <90 seconds
- Accuracy: >95% correct categorization

---

## Dependencies

**MCP Tools**:
- mcp__obsidian__read_note
- mcp__obsidian__write_note
- mcp__obsidian__list_notes

**Files**:
- Index.md (target file)
- `.agent/memory/facts.md` (vault structure)

---

## Integration Points

### With Link Checker

**Pattern**: After fixing orphaned files, add them to Index.md

### With MOC Builder

**Pattern**: After creating MOC, add it to Index.md automatically

---

## Notes

- Always maintain existing Index.md structure (sections, formatting)
- Preserve user comments and custom entries
- Alphabetical order within sections is optional (user preference)
- Never remove existing entries (only add)
- Daily notes: Only add most recent (last 5) to index

---

**Version**: 1.0
**Created**: 2026-06-03
