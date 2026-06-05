# Knowledge Vault — Self-Optimizing `.agent` System

An Obsidian knowledge vault paired with a **self-optimizing AI agent system** (`.agent/`) and a
**Model Context Protocol (MCP) server** that lets Claude Code read, write, search, and traverse the
vault as a first-class graph.

This repo is shared as a **reference architecture** for building a delegation-first, self-improving
agent ecosystem on top of a personal knowledge base. The example/business content has been replaced
with generic placeholders — fork it and point it at your own vault.

## What's inside

| Component | Path | What it does |
|-----------|------|--------------|
| **`.agent` system** | `.agent/` | Delegation-first routing, skills, three-tier memory, and a monthly self-optimizer |
| **Agent template** | `templates/.agent-template/` | Drop-in starter to add the same agent system to any repo |
| **MCP server** | `obsidian-mcp-server/` | Node/TypeScript MCP server exposing vault operations to Claude Code |
| **Knowledge base** | `knowledge/` | Portable, vendor-neutral patterns (Airflow, Spark, Terraform, AWS, MCP) |
| **Architecture docs** | `knowledge/architecture/` | Deep dives on how the agent ecosystem is designed and evolves |

## The `.agent` system at a glance

A **delegation-first** design: a thin router (`.agent/index.md`) dispatches user intent to specialized
skills, backed by a learning loop that hardens experience into reusable rules.

```
Request → Router (.agent/index.md)
            ├─ link health      → maintain-links
            ├─ index upkeep      → update-index
            ├─ metadata/tagging  → add-frontmatter
            ├─ pattern sync      → sync-patterns
            ├─ topic maps (MOC)  → create-moc
            └─ self-optimization → optimize-system
```

**Three-tier memory / learning promotion flow:**

```
lessons (1×)  →  patterns (3×)  →  facts (hardened rules)
```

`optimize-system` runs monthly (or when `lessons.md` exceeds ~8K tokens) to compact lessons, promote
recurring patterns to facts, distill skills, and keep context lean. The system can also generate new
skills when it detects a capability gap (`skill-creator`) and tune its own routing (`routing-optimizer`).

See [`knowledge/architecture/Agent System Introduction.md`](knowledge/architecture/Agent%20System%20Introduction.md)
and the [Meta-Optimizer](knowledge/architecture/Agent%20System%20Meta-Optimizer.md) for the full design.

## Getting started

### 1. Open the vault

Open this folder in [Obsidian](https://obsidian.md). Install the community plugins listed in
`.obsidian/community-plugins.json` from within Obsidian (their binaries are not bundled here).

### 2. Build and run the MCP server

```bash
cd obsidian-mcp-server
npm install
npm run build      # compiles TypeScript → dist/
```

### 3. Point Claude Code at it

Copy `.mcp.json` and replace the placeholder paths with the **absolute path** to your clone:

```json
{
  "mcpServers": {
    "knowledge-vault": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/Knowledge-Vault/obsidian-mcp-server/dist/index.js"],
      "env": { "OBSIDIAN_VAULT_PATH": "/ABSOLUTE/PATH/TO/Knowledge-Vault" }
    }
  }
}
```

The server exposes: `list_notes`, `read_note`, `write_note`, `search_notes`, `get_links`,
`get_backlinks`.

### 4. (Optional) Configure environment

Copy `.env.example` → `.env.local` and set `VAULT_ROOT` / `EXTERNAL_REPOS` if you use the
pattern-sync skill against external source repositories.

## Reuse the agent system in your own repo

Copy `templates/.agent-template/` into any project as `.agent/`, then adapt `index.md` routing and
`memory/facts.md` conventions to your domain. See `templates/.agent-template/README.md`.

## Conventions

- **Wiki-links** (`[[Note Title]]`) for all internal references
- **Frontmatter** on every note (`tags`, `created`, `updated`, `status`)
- All vault operations go **through the MCP server**, never direct file I/O — so Obsidian's link graph
  stays consistent

## Note on private content

`companies/` and `journal/daily/` are intentionally **gitignored** — they hold private/work content in
the original vault and are not part of this open-source release. The shipped notes use generic example
identifiers (`Acme Corp`, `RPT_OrderSummary`, `PROJ-123`, etc.).

## License

MIT — see [LICENSE](LICENSE).
