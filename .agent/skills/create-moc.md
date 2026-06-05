# Skill: create-moc

## Purpose
Generate Map of Content (MOC) for a topic by finding related notes, organizing them into a structure, and creating bidirectional links.

---

## When to Use

**Triggers**: "create MOC", "map topic", "build topic index", "organize notes about X"

**Examples**:
- "Create MOC for Agent System"
- "Build topic map for Data Platform architecture"
- "Organize all notes about Airflow"

---

## Workflow

### Step 1: Find Related Notes

**Tools**: MCP

**Actions**:
1. `search_notes(query=topic)` - Full-text search
2. `list_notes()` - Check filenames for topic keyword
3. For each candidate:
   - `read_note(path)` - Check relevance
   - `get_links(path)` - Check if links to known topic notes
4. Score relevance (content match + link proximity)
5. Filter top N (typically 10-20 notes)

**Output**: List of related notes with relevance scores

---

### Step 2: Analyze Relationships

**Purpose**: Understand how notes connect

**Actions**:
1. For each related note:
   - `get_links(path)` - Outgoing links
   - `get_backlinks(path)` - Incoming links
2. Build relationship graph
3. Identify clusters (groups of tightly connected notes)

**Output**: Note clusters + connection strengths

---

### Step 3: Categorize Notes

**Purpose**: Organize into MOC sections

**Logic**:
```
Common MOC sections:
- Overview (introductory notes)
- Core Concepts (fundamental notes)
- Components/Parts (specific pieces)
- Patterns/Best Practices (how-to notes)
- Reference (detailed specs)
- Related Topics (adjacent areas)

Categorization:
- Check note type from frontmatter
- Infer from note structure (# headings)
- Use folder as hint
- Use filename patterns
```

**Output**: `{section: [notes]}`

---

### Step 4: Generate MOC Structure

**Purpose**: Create MOC markdown

**Format**:
```markdown
---
tags: [moc, {topic}]
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: active
---

# {Topic} MOC

## Overview
High-level introductory notes about {topic}.

- [[Note 1]] - Brief description
- [[Note 2]] - Brief description

## Core Concepts
Fundamental concepts and architecture.

- [[Note 3]] - Brief description
- [[Note 4]] - Brief description

## Components
Specific pieces and implementations.

- [[Note 5]] - Brief description
- [[Note 6]] - Brief description

## Patterns & Best Practices
How-to guides and proven approaches.

- [[Note 7]] - Brief description
- [[Note 8]] - Brief description

## Reference
Detailed specifications and documentation.

- [[Note 9]] - Brief description
- [[Note 10]] - Brief description

## Related Topics
Adjacent areas and cross-references.

- [[Related Topic 1]]
- [[Related Topic 2]]
```

**Actions**:
1. Generate MOC content from categorized notes
2. Add descriptions (first sentence from each note)
3. Format as above

**Output**: MOC markdown content

---

### Step 5: Create Bidirectional Links

**Purpose**: Link MOC to notes and notes back to MOC

**Actions**:
1. Write MOC file to vault
2. For each note in MOC:
   - `read_note(path)`
   - If note doesn't link to MOC: Add "See also: [[{Topic} MOC]]" at end
   - `write_note(path, updated_content)`

**Output**: MOC file + updated notes with backlinks

---

### Step 6: Add to Index.md

**Purpose**: Ensure MOC is discoverable

**Actions**:
1. Call `update-index` skill with MOC path
2. Typically goes in "## Areas" or topic-specific section

**Output**: Index.md updated with MOC entry

---

### Step 7: Generate Report

**Purpose**: Show user what was created

**Output**:
```
✅ MOC created: Agent System MOC

Structure:
- Overview: 2 notes
- Core Concepts: 4 notes
- Components: 3 notes
- Patterns: 2 notes
- Reference: 1 note

Total notes organized: 12
Bidirectional links added: 12
Added to Index.md: ✓

Location: areas/Agent System MOC.md
```

---

### Step 8: Update Memory

```markdown
## 2026-06-03: Create Agent System MOC
- Status: Complete
- Topic: Agent System
- Notes Organized: 12
- Sections: 5
- Location: areas/Agent System MOC.md
- Time: 90 seconds
```

---

## Outputs

- MOC file (new note)
- Updated notes (with backlinks)
- Index.md entry
- Memory record

**Notification**: (see Step 7)

---

## Error Handling

### Too Few Related Notes (<3)

**Recovery**: Report "Not enough notes to create MOC, found only X"

### Too Many Related Notes (>30)

**Recovery**: Show top 20, ask "Include all or focus on top 20?"

### Ambiguous Categorization

**Recovery**: Use "Uncategorized" section, user can manually reorganize

---

## Examples

### Example: Agent System MOC

**User**: "Create MOC for Agent System"

**Flow**:
1. Search vault for "agent system" (find 12 notes)
2. Analyze links between notes
3. Categorize:
   - Overview: 2 (intro, architecture)
   - Core Concepts: 4 (delegation, routing, memory, learning)
   - Components: 3 (subagents, skills, index)
   - Patterns: 2 (workflows, optimization)
   - Reference: 1 (meta-optimizer)
4. Generate MOC markdown
5. Create bidirectional links
6. Add to Index.md under "## Agent System"
7. Report success

**Time**: 90 seconds

---

## Performance Metrics

**Target**:
- Note discovery: <30 seconds
- MOC generation: <60 seconds
- Link creation: <30 seconds
- Total: <120 seconds

---

## Dependencies

**MCP Tools**:
- mcp__obsidian__search_notes
- mcp__obsidian__list_notes
- mcp__obsidian__read_note
- mcp__obsidian__write_note
- mcp__obsidian__get_links
- mcp__obsidian__get_backlinks

**Skills**:
- update-index (for Step 6)

---

## Integration Points

### With Index.md Updater

**Pattern**: After MOC creation, automatically add to Index.md

### With Link Checker

**Pattern**: Run link check after MOC creation to verify integrity

---

## Notes

- MOCs typically live in areas/ folder
- MOC filename: "{Topic} MOC.md"
- Keep MOCs focused (<30 notes per MOC)
- If topic too broad: Create multiple related MOCs
- Update MOCs periodically as new notes are added

---

**Version**: 1.0
**Created**: 2026-06-03
