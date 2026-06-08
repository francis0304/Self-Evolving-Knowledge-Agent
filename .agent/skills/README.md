# Runtime Skills

Skills are workflow playbooks loaded by `.agent/index.md` when user intent matches their triggers.

## Repo-Specific Skills

| Skill | Purpose |
|---|---|
| `maintain-links.md` | Check wiki-links, backlinks, and orphan candidates |
| `update-index.md` | Maintain `Index.md` navigation |
| `add-frontmatter.md` | Normalize note metadata |
| `sync-patterns.md` | Merge reusable patterns from external repos |
| `create-moc.md` | Build Map of Content notes |
| `optimize-system.md` | Maintain `.agent/` memory, learning, and metrics |

## Universal Skills

| Skill | Purpose |
|---|---|
| `git-ops.md` | Safe git operations |
| `debug.md` | Evidence-first diagnosis |
| `refactor.md` | Scoped simplification and extraction |
| `pr-review.md` | Diff review |
| `meta.md` | Agent health audit and export-back |
| `skill-creator.md` | Propose new skills from repeated patterns |
| `routing-optimizer.md` | Improve routing triggers |
| `graphify-check.md` | Knowledge graph freshness checks |

## Rules

- Keep runtime skills concise and actionable.
- Every skill should include purpose, triggers, steps, anti-patterns, and confidence.
- Backport reusable improvements to `templates/.agent-template/skills/` when they should ship publicly.
- The current agent owns memory and learning updates during the post-task loop.
