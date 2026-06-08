# Skill: maintain-links

## Purpose
Maintain Obsidian wiki-link health, backlinks, and orphan status without damaging manual navigation.

## When to use
Triggers: check links, broken links, find orphans, backlinks, link health, maintain links.

## Steps
1. Use MCP link tools when available: `get_links`, `get_backlinks`, `search_notes`, and `list_notes`.
2. Identify broken wiki-links, orphan candidates, duplicate aliases, and notes with weak backlinks.
3. Exclude `Index.md`, `.agent/*`, `.obsidian/*`, templates, and daily notes from orphan detection.
4. For each issue, classify confidence as high/medium/low.
5. Auto-fix only high-confidence internal wiki-link issues. For medium/low confidence, report candidates.
6. Preserve existing manual links and descriptions.
7. Log notable patterns to `learning/lessons.md`.

## Execution Notes
For broad scans, first gather candidates with MCP/search tools, then make only high-confidence edits. Treat `.claude/agents/link-checker.md` as optional prompt reference, not a required worker.

## Anti-patterns
- Do not delete notes during link cleanup.
- Do not rewrite external URLs.
- Do not auto-fix links below 90% confidence.
- Do not remove `Index.md` entries unless the user explicitly asks.

## Confidence
0.9
