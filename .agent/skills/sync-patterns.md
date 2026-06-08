# Skill: sync-patterns

## Purpose
Sync reusable patterns from external repositories into the vault with section-level merge discipline.

## When to use
Triggers: sync patterns, update from repo, external repo, Airflow patterns, Spark patterns, Terraform patterns.

## Steps
1. Confirm the source repository path from `.env.local`, user input, or `memory/facts.md`.
2. Read source material and target vault note.
3. Merge at section level: update source-derived sections while preserving manual commentary.
4. Put universal patterns in `knowledge/`; keep company-specific details out of the public repo.
5. Add or update frontmatter and `Index.md` entries for significant pattern notes.
6. Record any new reusable sync rule in `learning/lessons.md`.

## Execution Notes
For multi-file syncs, read source and target sections first, then perform section-level merges. Treat `.claude/agents/sync-keeper.md` as optional prompt reference, not a required worker.

## Anti-patterns
- Do not blindly overwrite full notes.
- Do not copy secrets, credentials, private names, or proprietary implementation details.
- Do not treat placeholder external repo paths as configured paths.

## Confidence
0.85
