# Active `.agent` Deployment

This directory is the working provider-neutral `.agent` system for `Knowledge-Vault-OSS`.

The reusable public template still lives in `templates/.agent-template/`. This root deployment exists so the open-source repo can dogfood the same architecture it publishes.

## Load Order

1. `AGENTS.md`
2. `.agent/index.md`
3. `.agent/memory/facts.md`
4. Matching skill file under `.agent/skills/`
5. Direct execution with the tools available in the current environment

## Runtime Layout

```text
.agent/
|-- index.md                 router and skill table
|-- skills/                  runtime skill playbooks
|-- memory/                  durable facts, working buffer, archive
|-- learning/                lessons, feedback, patterns, changelog
|-- monitoring/metrics.md    agent health snapshot
```

`.claude/agents/` is retained for Claude Code compatibility and prompt reference, but root `.agent/` does not depend on provider-specific subagent spawning.

## Runtime Skills

Repo-specific skills:

- `maintain-links`
- `update-index`
- `add-frontmatter`
- `sync-patterns`
- `create-moc`
- `optimize-system`

Universal skills:

- `git-ops`
- `debug`
- `refactor`
- `pr-review`
- `meta`
- `skill-creator`
- `routing-optimizer`
- `graphify-check`

## Tracking Rules

- Track root `.agent/` in git.
- Keep local-only state in `.agent/local/` or `.agent/tmp/`.
- Mirror reusable improvements back to `templates/.agent-template/` when they should ship to other repos.
