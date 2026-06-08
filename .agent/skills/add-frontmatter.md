# Skill: add-frontmatter

## Purpose
Normalize note frontmatter while preserving existing fields and user edits.

## When to use
Triggers: frontmatter, metadata, tags, status, add tags, batch metadata.

## Steps
1. Inspect target notes and existing frontmatter.
2. For each note, merge missing fields only: `tags`, `created`, `updated`, and `status`.
3. Use lowercase hyphenated tags and valid statuses: `active`, `draft`, `archived`, `deprecated`.
4. For more than 5 notes, show a preview and ask for approval before editing.
5. Keep note H1 aligned with filename when creating new notes.
6. Update `Index.md` only when metadata work creates or materially changes a significant note.

## Execution Notes
For batch work, prepare a preview before editing more than 5 notes. Treat `.claude/agents/metadata-keeper.md` as optional prompt reference, not a required worker.

## Anti-patterns
- Do not overwrite existing frontmatter values.
- Do not infer sensitive/company-specific tags for public notes.
- Do not add frontmatter to generated package files or code files.

## Confidence
0.9
