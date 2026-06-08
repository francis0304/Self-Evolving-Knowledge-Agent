# Skill: create-moc

## Purpose
Create or update Map of Content notes that organize a topic through bidirectional wiki-links.

## When to use
Triggers: create MOC, map topic, topic overview, content map, organize notes.

## Steps
1. Search for existing notes related to the topic.
2. Group notes into clear sections based on actual relationships.
3. Create or update a topic MOC with frontmatter, a short overview, and wiki-link entries.
4. Add backlinks from key child notes when appropriate and high-confidence.
5. Add the MOC to `Index.md` under the correct section.
6. Avoid over-linking low-quality or unrelated notes.

## Execution Notes
For broad topic scans, use search/MCP results to build the MOC incrementally. Treat `.claude/agents/moc-builder.md` as optional prompt reference, not a required worker.

## Anti-patterns
- Do not create decorative index pages with no useful navigation.
- Do not force every note into a MOC.
- Do not remove existing hand-curated structure.

## Confidence
0.9
