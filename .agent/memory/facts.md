# Project Facts

> Durable conventions and constraints. Updated rarely.
> Promotion path: lessons (1x) -> patterns (3x) -> facts (hardened here).

## Stack

- **Repository type**: Open-source Obsidian knowledge vault plus `.agent` system template.
- **Primary content**: Markdown documentation and templates.
- **Runtime component**: `obsidian-mcp-server/` Node.js/TypeScript MCP server.
- **Support scripts**: Python scripts under `scripts/` and `templates/scripts/`.
- **Agent system**: Root `.agent/` is the active provider-neutral dogfood deployment; `templates/.agent-template/` is the reusable bootstrap copy.

## Conventions

### Naming

- Vault notes may use spaces in filenames; note H1 should match the filename.
- Tags use lowercase hyphenated names, for example `agent-system` and `data-platform`.
- Template files may use `.template` in `templates/`; active `.agent/` files must not.

### Structure

- `knowledge/` contains portable, public knowledge.
- `templates/` contains reusable bootstrap assets for other repos.
- `.agent/` contains the active agent system for this repo.
- `.claude/agents/` contains Claude Code compatibility/reference prompt definitions, not required runtime workers.
- `obsidian-mcp-server/` contains the MCP server source, build output, and package files.
- `scripts/` contains active helper scripts used by this repo.

### Git

- Do not overwrite user edits or private local content.
- Keep `.agent/` tracked in this open-source repo.
- Keep runtime scratch state under `.agent/local/` or `.agent/tmp/`.
- Do not commit `.env`, `.env.local`, private company notes, or daily journal content.

## Critical Rules

### Always

- Start non-trivial work from `AGENTS.md`, then `.agent/index.md`, then `.agent/memory/facts.md`.
- Use MCP tools for Obsidian vault operations when available.
- Preserve manual vault edits; prefer merge-style updates.
- Ask approval before batch operations over more than 5 vault notes.
- Add frontmatter to new substantial notes.
- Update `Index.md` when adding significant public notes.
- Update `.agent/learning/changelog.md` after changes to `.agent/` files.

### Never

- Do not delete notes without explicit user confirmation.
- Do not remove existing `Index.md` entries unless explicitly requested.
- Do not overwrite existing frontmatter fields; merge instead.
- Do not model routine work as provider-specific subagent delegation.
- Do not put private company/journal content into the open-source repo.

## Architecture

### Key Paths

```text
Knowledge-Vault-OSS/
|-- AGENTS.md                provider-neutral repo instructions
|-- .agent/                  active dogfood agent system
|-- .claude/                 Claude Code compatibility settings and prompts
|-- .obsidian/               Obsidian vault config
|-- knowledge/               public architecture and tool notes
|-- learning/                public learning notes
|-- obsidian-mcp-server/     TypeScript MCP server
|-- scripts/                 active helper scripts
|-- templates/               reusable `.agent` and CLAUDE.md bootstrap assets
|-- CLAUDE.md                Claude Code compatibility instructions
|-- Index.md                 vault navigation
|-- README.md                public project overview
```

## Domain-Specific Facts

- This repo documents the `.agent` system as a product and also runs it locally.
- The root `.agent/` may intentionally differ from `templates/.agent-template/` because root is dogfood configuration.
- Root `.agent/` is optimized for provider-neutral use. Provider-specific assets are compatibility/reference unless needed by a matching tool surface.
- Template improvements that should ship to users must be mirrored into `templates/.agent-template/`.
- Graphify integration is optional but supported through `scripts/graphify_refresh_manager.py`.
- `.mcp.json` uses placeholder absolute paths in the open-source repo; users must customize it locally.

## Forbidden Patterns

- Do not treat placeholder paths in `.mcp.json` as real configured paths.
- Do not edit `node_modules/` or generated `dist/` unless explicitly requested.
- Do not use direct filesystem edits for vault content when MCP is available and configured.
- Do not require `.claude/agents/` for runtime execution.

## Open Questions

| Question | Context | Likely resolver |
|---|---|---|
| Should root `.agent/` changes always be backported to `templates/.agent-template/`? | Dogfood and distributable template may evolve separately. | Next template release task |
| Should the public template become provider-neutral, or keep provider-specific examples? | Root runtime is now provider-neutral, but templates still document Claude-style delegation. | Next template migration task |

---

**Last Updated**: 2026-06-08
**Next Review**: 2026-09-08
