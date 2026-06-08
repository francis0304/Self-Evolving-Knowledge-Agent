# Changelog - Agent System Edits

> Audit trail of all changes to `.agent/` files and knowledge/wiki pages.
> Append-only. Sections: Added, Changed, Proposed, Exported.

## Recent Changes

### [2026-06-08] Added
- Root `.agent/` dogfood deployment copied from `templates/.agent-template/`.
- `AGENTS.md`: provider-neutral entrypoint for the repository.
- Repo-specific runtime router in `.agent/index.md`.
- Repo-specific project facts in `.agent/memory/facts.md`.
- Vault maintenance skills: `maintain-links`, `update-index`, `add-frontmatter`, `sync-patterns`, `create-moc`, `optimize-system`.
- Agent system metrics in `.agent/monitoring/metrics.md`.
- Public generic subagent prompts in `.claude/agents/`.
- Active graphify refresh helper at `scripts/graphify_refresh_manager.py`.

- ### [2026-06-08] Changed
- `.agent/index.md`: converted from provider-specific delegation router to provider-neutral skill router.
- `.agent/memory/facts.md`: marked `.claude/agents/` as compatibility/reference, not a runtime dependency.
- `.agent/README.md`: changed load order from `CLAUDE.md` to `AGENTS.md`.
- `.gitignore`: root `.agent/` is now tracked; only `.agent/local/` and `.agent/tmp/` remain ignored.
- `.claude/settings.json`: added `mcp__knowledge-vault__write_note` permission for documented vault write workflows.
- `.agent/skills/README.md`: replaced template guidance with active runtime skill inventory.
- `.agent/memory/archive.md`: initialized the active archive.
- `.agent/memory/README.md` and `.agent/learning/README.md`: replaced template docs with active deployment docs.
- `.agent/learning/feedback.md`: initialized with the root deployment correction.

### [2026-06-08] Removed
- Duplicate copied `.agent/skills/universal/` files from the active deployment. Runtime universal skills now live directly in `.agent/skills/`; reusable originals remain in `templates/.agent-template/skills/universal/`.
- Copied active-only skill template and example files from the root runtime directory.

### [2026-06-08] Proposed
- Review whether root `.agent/` improvements should be mirrored into `templates/.agent-template/` for the next public release.
