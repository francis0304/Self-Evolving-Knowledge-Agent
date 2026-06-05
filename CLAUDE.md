# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Repository Overview

**Knowledge-Vault** is an Obsidian knowledge vault for personal knowledge management, designed to be portable across companies and projects. It combines:
- **Universal knowledge** (portable patterns, architecture, tools)
- **Company-specific work** (Data Platform implementations)
- **AI-powered maintenance** (.agent system for vault operations)

**Key Technologies**: Obsidian, MCP (Model Context Protocol), Markdown, Node.js/TypeScript

---

## Architecture

### Three-Layer Knowledge Structure

1. **knowledge/** - Universal, portable patterns (architecture, tools, concepts)
2. **companies/** - Company-specific implementations (Data Platform)
3. **journal/** - Daily notes and reflections

The separation ensures knowledge portability: universal patterns in `knowledge/` can move to any company, while `companies/` contains full working implementations with company-specific details.

### .agent System (v5 Delegation-First)

The vault uses an AI agent system for automated maintenance tasks. Key components:

**`.agent/index.md`** - Main routing logic, delegates to skills based on user intent  
**`.agent/skills/*.md`** - 6 specialized skills (link checking, indexing, metadata, sync, MOC creation, system optimization)  
**`.agent/memory/`** - facts.md (project conventions), working.md (active tasks), archive.md  
**`.agent/learning/`** - lessons.md (experience), patterns.md (reusable solutions), feedback.md (corrections)  
**`.agent/monitoring/`** - metrics.md (system health tracking)

The system is self-optimizing: `/optimize-system` runs monthly to compact lessons, promote patterns to facts, and maintain context efficiency.

### MCP Integration

All vault operations MUST use MCP tools, never direct file I/O:

```typescript
// CORRECT - Use MCP tools
mcp__obsidian__list_notes(path="projects/")
mcp__obsidian__read_note("projects/Airflow.md")
mcp__obsidian__write_note("projects/Airflow.md", content)
mcp__obsidian__search_notes("agent system")
mcp__obsidian__get_links("Index.md")
mcp__obsidian__get_backlinks("Agent System Introduction.md")

// WRONG - Do not use direct file I/O
Glob("projects/*.md")
Read("projects/Airflow.md")
Write("projects/Airflow.md", content)
```

**Rationale**: MCP understands Obsidian's vault structure (wiki-links, backlinks, graph), keeps the app in sync, and prevents broken link issues.

### External Repository Mapping

The vault syncs wiki patterns from 5 external Data Platform repositories:

```
Airflow:        ${EXTERNAL_REPOS}/example-repo-airflow
Glue:           ${EXTERNAL_REPOS}/example-repo-glue
Redshift:       ${EXTERNAL_REPOS}/example-repo-redshift
Infrastructure: ${EXTERNAL_REPOS}/example-repo-infra
SRE:            ${EXTERNAL_REPOS}/example-repo-sre
```

When syncing patterns, use section-level merge (preserve manual vault edits while updating external sections).

---

## Core Conventions

### File Naming & Links

- **Filenames**: Spaces allowed (`Data Platform Overview.md`, not `data-platform-overview.md`)
- **Note titles**: Match filename (file: `Airflow.md` → H1: `# Airflow`)
- **Wiki-links**: Always use `[[Note Title]]` for vault notes, not markdown links
- **Aliases**: `[[Note Title|Display Text]]`
- **Sections**: `[[Note Title#Section]]`

### Frontmatter Format

All notes should have frontmatter:

```yaml
---
tags: [tag1, tag2, tag3]
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: active
---
```

**Tag conventions**: lowercase-hyphenated (`data-platform`, `agent-system`)  
**Status values**: `active`, `draft`, `archived`, `deprecated`

### Index.md Structure

Index.md has 6 sections in this order:
1. **Wiki Quick Reference** - Curated pattern summaries
2. **Project Repositories** - Per-repo documentation
3. **Areas** - Knowledge areas and overviews
4. **Agent System** - Agent system documentation
5. **Tools & Integration** - MCP, tools, integrations
6. **Daily Notes** - Recent daily entries

When adding notes to Index.md:
- Keep sections in order
- Add descriptions: `- [[Note]] - Description`
- Avoid duplicates (check existing entries first)

### Exclusions

**From orphan detection**: Index.md, daily/*.md, templates/*.md, .agent/*, .obsidian/*  
**From Index.md**: Daily notes (only recent 5-7 days), templates, system files  
**From link checking**: External URLs (http://, https://), local file links (file:///)

---

## Common Development Tasks

### MCP Server

**Build TypeScript MCP server**:
```bash
cd obsidian-mcp-server
npm run build
```

**Run MCP server** (for testing):
```bash
cd obsidian-mcp-server
npm start
# or for dev with auto-reload:
npm run dev
```

**Configure MCP server path** in `.mcp.json` (update paths to match your machine):
```json
{
  "mcpServers": {
    "knowledge-vault": {
      "command": "node",
      "args": ["<absolute-path>/obsidian-mcp-server/dist/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "<absolute-path-to-vault>"
      }
    }
  }
}
```

### Agent System Maintenance

**Run system optimization** (monthly or when lessons.md >8K):
```
/optimize-system
```
or just say: "optimize system"

This compacts lessons, promotes 3× patterns to facts, distills skills, and updates metrics.

**Check system health**:
```bash
# View metrics
cat .agent/monitoring/metrics.md

# Check file sizes
wc -c .agent/learning/lessons.md .agent/memory/facts.md
```

**Weekly monitoring** (quick check):
1. Check lessons.md size (threshold: 8K tokens)
2. Scan patterns.md for 3× occurrences
3. If approaching threshold, run optimization

### Vault Operations

**Check for broken links**:
```
"Check for broken links"
```
Delegates to @link-checker skill

**Update Index.md with new note**:
```
"Add [Note Name] to Index.md"
```
Delegates to @indexer skill

**Batch add frontmatter**:
```
"Add frontmatter to notes in knowledge/"
```
Delegates to @metadata-keeper skill (shows preview, requires approval for >5 files)

**Sync wiki patterns from external repos**:
```
"Sync Airflow patterns"
```
Delegates to @sync-keeper skill (section-level merge, preserves manual edits)

**Create Map of Content (MOC)**:
```
"Create MOC for agent system"
```
Delegates to @moc-builder skill

---

## Critical Rules

### Always
- Use MCP tools for vault operations (never direct file I/O)
- Preserve user manual edits (never blindly overwrite)
- Ask approval for batch operations (>5 files)
- Create frontmatter for new notes
- Maintain bidirectional links in MOCs
- Update Index.md when adding significant notes

### Never
- Delete notes without user confirmation
- Remove existing Index.md entries (only add)
- Overwrite existing frontmatter fields (merge instead)
- Use direct file I/O (Read/Write/Edit) on vault markdown files
- Auto-fix links without high confidence (>90%)
- Ignore MCP errors (report to user)

---

## Routing Logic

The .agent system routes requests to specialized skills:

| User Intent | Skill | Example |
|-------------|-------|---------|
| Link health | @link-checker → maintain-links | "check links", "find orphans" |
| Index maintenance | @indexer → update-index | "update Index.md", "add note" |
| Metadata | @metadata-keeper → add-frontmatter | "add frontmatter", "tag notes" |
| Wiki sync | @sync-keeper → sync-patterns | "sync patterns", "update from repo" |
| MOC creation | @moc-builder → create-moc | "create MOC", "map topic" |
| System optimization | optimize-system | "/optimize-system", "optimize system" |

See `.agent/index.md` for complete routing rules and decision tree.

---

## Learning System

The agent learns from experience through a three-tier memory system:

**`.agent/learning/lessons.md`** - Recent experiences (append-only, compact when >8K)  
**`.agent/learning/patterns.md`** - Reusable patterns (promoted from lessons when seen 3×)  
**`.agent/memory/facts.md`** - Hardened rules (promoted from patterns, project conventions)

**Promotion flow**: lessons (1×) → patterns (3×) → facts (hardened)

When patterns appear 3× with high confidence, they are promoted to facts.md and removed from lessons.md to maintain context efficiency.

---

## Data Platform Context

This vault documents a production AWS data platform:

**Stack**: MWAA (Airflow 2.9+), AWS Glue (PySpark), Redshift, Kinesis, S3, Terraform  
**Environments**: QA, Production  
**Repositories**: 8 repos (Airflow, Glue, Infrastructure, SRE, Redshift, DataGen, API, DB)

The vault contains:
- **Universal patterns** in `knowledge/tools/` (Airflow DAG patterns, Spark job patterns, Terraform IaC, AWS IAM)
- **Company implementations** in `companies/current-company/reference/` (complete working examples with company-specific details)

When documenting patterns: Universal patterns go in `knowledge/`, company-specific implementations go in `companies/current-company/`.

---

## References

**Main navigation**: Index.md  
**Agent system docs**: knowledge/architecture/Agent System Introduction.md  
**Meta-optimizer**: knowledge/architecture/Agent System Meta-Optimizer.md  
**Self-iteration status**: knowledge/architecture/Agent System Self-Iteration - Current Status.md  
**Complete ecosystem guide**: knowledge/architecture/The Complete AI Ecosystem - Architecture.md

**External repos**: See `.agent/memory/facts.md` for complete external repository paths
