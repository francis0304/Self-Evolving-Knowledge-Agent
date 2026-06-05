# Knowledge Vault - Index

<!-- Note: [[wiki-links]] are Obsidian's native link format. In standard markdown viewers, navigate manually to the referenced path. -->

Last Updated: 2026-06-05 | v5.1 (Current)

---

## Current Status

| Component | Version | Status |
|-----------|---------|--------|
| Agent System | v5.1 | Latest |
| Template System | v2.0 | Ready for any repo |
| Knowledge Graph | 193 nodes | Growing |
| MCP Server | v1.0 | Production |

**Latest Release**: 2026-06-05 - Agent Template v2.0 (universal skills, graphify refresh, cost hierarchy)

---

## Core Structure

**Universal Knowledge** → `/knowledge/`
- Architecture patterns (agent system deep dives)
- Tool guides (MCP, Airflow, Spark, Terraform, AWS)
- Best practices

**Templates** → `/templates/`
- `.agent-template/` — Drop-in agent system for any repo
- `CLAUDE.md.template` — Wire agent system into Claude Code
- `scripts/` — Graphify refresh manager and utilities

**MCP Server** → `/obsidian-mcp-server/`
- Node/TypeScript MCP server
- Vault operations (read, write, search, links, backlinks)

---

## Essential Links

### Getting Started (New to this?)
- [[README]] - Project overview and quick start
- [[templates/.agent-template/README]] - Drop-in setup guide (5 minutes)
- [[templates/CLAUDE.md.template]] - Claude Code integration template

### Architecture Deep Dives
- [[knowledge/architecture/Agent System Architecture]] - Complete system guide
- [[knowledge/architecture/Agent System Cost Optimization v5.1]] - Cost hierarchy and patterns
- [[knowledge/architecture/Complete Ecosystem Overview]] - Full ecosystem review
- [[knowledge/architecture/The Complete AI Ecosystem - Diagrams]] - Visual architecture

### MCP Integration
- [[knowledge/tools/mcp/README - Start Here]] - Setup guide
- [[knowledge/tools/mcp/core/MCP Quick Reference]] - Cheat sheet
- [[knowledge/tools/mcp/core/MCP Tutorial]] - Step-by-step tutorial

---

## Vault Stats
- Notes: 78+ | Architecture docs: 6 | Tool guides: 30+ | Templates: 15+
- Graph: 193 nodes, 326 edges, 14 communities

---

## Template Coverage

| Use Case | Included? | Where |
|----------|-----------|-------|
| Agent routing (index.md) | Yes | `.agent-template/index.md.template` |
| Memory system (3-tier) | Yes | `.agent-template/memory/` |
| Learning loop | Yes | `.agent-template/learning/` |
| Universal skills (8) | Yes | `.agent-template/skills/universal/` |
| CLAUDE.md integration | Yes | `templates/CLAUDE.md.template` |
| Graphify refresh | Yes | `templates/scripts/graphify_refresh_manager.py` |
| MCP server | Yes | `obsidian-mcp-server/` |
| Domain skill examples | Yes | `.agent-template/skills/README.md` |

---

## Quick Tasks

See [[CLAUDE.md#Common-Development-Tasks]] for:
- Building MCP server
- Running system optimization
- Checking system health
- Agent skill routing

---

Maintained by: Francis
Vault Created: 2026-05-26
