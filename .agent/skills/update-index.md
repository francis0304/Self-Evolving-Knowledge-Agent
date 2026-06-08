# Skill: update-index

## Purpose
Keep `Index.md` useful as the main navigation surface for public vault content.

## When to use
Triggers: update Index.md, add note to index, navigation, main index, new note.

## Steps
1. Read `Index.md` and the target note.
2. Choose the correct section: Wiki Quick Reference, Project Repositories, Areas, Agent System, Tools & Integration, or Daily Notes.
3. Add a concise `- [[Note Title]] - Description` entry only if one does not already exist.
4. Preserve section order and existing descriptions.
5. Avoid adding templates, system files, private company notes, and old daily notes.
6. If the note is a major new topic, ensure it has frontmatter and at least two useful cross-links.

## Execution Notes
For multi-note indexing, inspect `Index.md` and candidate notes first, then apply a small structured edit. Treat `.claude/agents/indexer.md` as optional prompt reference, not a required worker.

## Anti-patterns
- Do not remove existing entries as part of a simple add.
- Do not add duplicate aliases.
- Do not convert wiki-links to markdown links for vault notes.

## Confidence
0.95
