# Project Facts - Knowledge Vault

## Repository Information
**Name**: Knowledge-Vault
**Purpose**: Obsidian knowledge vault for Data Platform documentation and cross-repo knowledge management
**Tech Stack**: Markdown, Obsidian, MCP (Model Context Protocol)
**Version**: Active (rolling)
**Vault Path**: C:\Users\your-user\Desktop\Knowledge-Vault

---

## Vault Structure

### Directories
- **areas/**: Knowledge areas (Data Platform, Infrastructure, Agent System concepts)
- **projects/**: Per-repository documentation (Airflow, Glue, Redshift, etc.)
- **wikis/**: Pattern summaries from external repos
- **daily/**: Daily notes (rolling, date-stamped)
- **templates/**: Reusable templates (.agent-template, project templates)
- **.agent/**: Agent system for vault maintenance (this system)
- **.obsidian/**: Obsidian app configuration
- **obsidian-mcp-server/**: MCP server for Claude Code integration

---

## Naming Conventions

### Filenames
- **Spaces allowed**: "Data Platform Overview.md" (not "data-platform-overview.md")
- **No special chars**: Avoid @, #, :, / in filenames
- **Case sensitive** (on some systems): Use consistent casing

### Note Titles
- Title case for main words: "Agent System Architecture"
- Match filename: If file is "Airflow.md", H1 should be "# Airflow"

---

## Frontmatter Format

### Standard frontmatter:
```yaml
---
tags: [tag1, tag2, tag3]
created: YYYY-MM-DD
updated: YYYY-MM-DD
status: active
---
```

### Tag conventions:
- **Lowercase, hyphenated**: `data-platform`, `agent-system`
- **Hierarchical (optional)**: `data-platform/airflow`, `data-platform/glue`
- **Common tags**: `project`, `area`, `wiki`, `patterns`, `agent-system`, `moc`, `daily`

### Status values:
- `active`: Current, maintained
- `draft`: Work in progress
- `archived`: Historical, no longer maintained
- `deprecated`: Replaced by newer content

---

## Link Style

### Preferred: Wiki-links
- Format: `[[Note Title]]`
- With alias: `[[Note Title|Display Text]]`
- With header: `[[Note Title#Section]]`

### External links:
- Full URL: `[Display Text](https://example.com)`
- Local file: `[File](file:///C:/path/to/file)`

### Cross-references:
- Always use wiki-links for vault notes
- Use full URLs for external resources
- Maintain bidirectional links where possible

---

## Index.md Structure

### Current sections (in order):
1. **Wiki Quick Reference** - Curated pattern summaries
2. **Project Repositories** - Per-repo documentation
3. **Areas** - Knowledge areas and overviews
4. **Agent System** - Agent system documentation
5. **Tools & Integration** - MCP, tools, integrations
6. **Daily Notes** - Recent daily entries

### Maintenance rules:
- Keep sections in this order
- Alphabetize within sections (optional)
- Add descriptions for all entries: `- [[Note]] - Description`
- Recent items at top of section OR alphabetical (user preference)

---

## Critical Rules

### Always
- Preserve user manual edits (never blindly overwrite)
- Ask approval for batch operations (>5 files)
- Create frontmatter for new notes
- Maintain bidirectional links in MOCs
- Update Index.md when adding significant notes
- Use MCP tools (mcp__knowledge-vault__*) for all vault read/write — Edit/Write tools error on first use without prior Read

### Never
- Delete notes without user confirmation
- Remove existing Index.md entries (only add)
- Overwrite existing frontmatter fields (merge instead)
- Ignore MCP errors (report to user)
- Auto-fix links without high confidence (>90%)

---

## External Repository Paths

### Data Platform Repos
- **Airflow**: ${EXTERNAL_REPOS}/example-repo-airflow
- **Glue**: ${EXTERNAL_REPOS}/example-repo-glue
- **Redshift**: ${EXTERNAL_REPOS}/example-repo-redshift
- **Infrastructure**: ${EXTERNAL_REPOS}/example-repo-infra
- **SRE**: ${EXTERNAL_REPOS}/example-repo-sre
- **DataGen**: ${EXTERNAL_REPOS}/example-repo-datagen

### Wiki Sync Mapping
```
Repo → Vault Wiki:
airflow/knowledge/wiki/ → wikis/Airflow Patterns.md
glue/knowledge/wiki/ → wikis/Glue Patterns.md
redshift-reporting/knowledge/wiki/ → (multiple wikis/)
infrastructure/docs/ → wikis/Infrastructure Patterns.md
sre/docs/ → wikis/SRE Patterns.md
```

### External Repo Agent System Status (snapshot 2026-06-05)
| Repo | Agent Version | Skills | Wiki Pages | Graphify | Cost-Opt |
|------|---------------|--------|------------|----------|----------|
| redshift-reporting | **v5.1** ⭐ | 14 (5 workflow + 4 utility + 5 meta) | 11 | 193 nodes | ✅ |
| Reporting API | v4.0 | 3 workflow | 4 | ❌ | ❌ |
| DataGen | v3.5 | 2 workflow | 2 | ❌ | ❌ |
| Glue | v3.0 | 1 workflow | 1 | ❌ | ❌ |
| Airflow | v3.0 | 1 workflow | 1 | ❌ | ❌ |
| Infrastructure | v2.0 | 0 | 0 | ❌ | ❌ |
| SRE | v1.0 | 0 | 0 | ❌ | ❌ |

**Note**: This snapshot reflects what vault tracks. Source-of-truth is each repo's own `.agent/manifest.json` + `.agent/index.md`. Re-sync when major version changes (e.g. when Reporting API jumps to v5.1).

---

## MCP Integration

### MCP Server
- **Location**: obsidian-mcp-server/dist/index.js
- **Vault Path Env**: OBSIDIAN_VAULT_PATH
- **Port**: Default (configured in .mcp.json)

### Available MCP Tools
- `mcp__knowledge-vault__list_notes` - List notes (all or by path)
- `mcp__knowledge-vault__read_note` - Read note content
- `mcp__knowledge-vault__write_note` - Create/update note
- `mcp__knowledge-vault__search_notes` - Full-text search
- `mcp__knowledge-vault__get_links` - Extract outgoing links
- `mcp__knowledge-vault__get_backlinks` - Find incoming links

### Usage Pattern
All vault operations MUST use MCP tools (no direct file I/O via Edit/Write/Read on vault files).

---

## Exclusions

### From Orphan Detection
- Index.md (never orphaned)
- Daily notes (daily/*.md) - expected to be unlinked
- Templates (templates/*.md) - intentionally unlinked
- .agent/ system files
- .obsidian/ config files

### From Index.md
- Daily notes (only recent 5-7 days)
- Template files
- System files (.agent/, .obsidian/)

### From Link Checking
- External URLs (http://, https://)
- Local file links (file:///)
- Anchors (#section-only links)

---

## Folder-to-Tag Mapping

Infer tags from folder location:

- **areas/**: [area, {topic}] - e.g., [area, data-platform]
- **projects/**: [project, data-platform] - e.g., [project, airflow]
- **wikis/**: [wiki, patterns] - e.g., [wiki, airflow-patterns]
- **daily/**: [daily, journal]
- **.agent/**: [agent-system, documentation]

Additional tags inferred from content keywords.

---

## Domain-Specific Facts

### Data Platform Context
- **Primary domain**: Data engineering, ETL, data warehousing
- **Tech stack**: Airflow, Glue, Redshift, Terraform, Python
- **Cloud**: AWS (S3, Redshift, Glue, Lambda, ECS)
- **JIRA prefixes**: PROJ-* (e.g. PROJ-622, PROJ-645, PROJ-667 for Current Company Data Engineering)
- **Schema convention**: REPORTING (SP outputs), vSOURCE (read-only views from external sources)

### Agent System Context
- **Architecture**: v5.1 (Workflow prohibition + subagent-first + autonomous learning)
- **Key concepts**: Subagents, skills, routing, memory, learning, cost-optimization
- **Integration**: Graphify (knowledge graphs), MCP (Obsidian)

---

## Self-Evolution System (v5)

### Skill Creation (@skill-creator)
- **Purpose**: Autonomously generate new specialized skills when capability gaps detected
- **Triggers**: Gap detection, recurring patterns (3+×), explicit request
- **Process**: Gap analysis → Design spec → Generate markdown → Integrate → Test
- **Lifecycle**: draft → active (after testing) → deprecated (if obsolete)
- **Location**: `.agent/skills/{skill-name}.md`

### Routing Optimization (@routing-optimizer)
- **Purpose**: Learn from experience to improve routing accuracy
- **Data sources**: lessons.md (corrections), feedback.md (user corrections), working.md (success/failure)
- **Optimization types**:
  - Synonym expansion (add user's natural phrases)
  - Composite routes (multi-skill parallel execution)
  - Problem-solution registry (known issue → proven fix)
  - Gap detection (trigger skill creation)
- **Schedule**: Weekly (every Monday) + background learning
- **Metrics**: Routing success rate (target: >90%)

### Solution Registry
- **File**: `.agent/memory/solutions.md`
- **Purpose**: Known problem patterns → Proven solutions mapping
- **Structure**: P00X: Problem → Symptoms → Root Cause → Solution → Success Rate
- **Usage**: When user reports problem, check registry first (skip investigation if known)
- **Confidence levels**: 
  - Low (1-2×): Tentative solution
  - Medium (3-4×): Likely reliable
  - High (5+×): Proven solution

### Integration Rules
- **New skill**: skill-creator.md → index.md (routing) → facts.md (conventions) → metrics.md (tracking)
- **Routing update**: routing-optimizer.md → index.md (rules) → solutions.md (problems)
- **Problem solved**: Record in lessons.md → Next occurrence: Check solutions.md → Apply proven fix
- **Pattern detected (3+×)**: Promote to skill via @skill-creator

---

## v5.1 Cost Optimization (NEW 2026-06-05)

### Workflow Tool Prohibition
- **DEFAULT**: Never use Workflow tool — 10-20× more expensive than subagents (50-200K vs 5-15K)
- **Subagent-first**: 95% of tasks via Agent tool
- **Workflow gating**: Only when user says "ultracode" or "+500k budget"
- **Subagent gap → Create from `_TEMPLATE.md`** (10-min creation, 1200+ lines, 12 sections)

### Decision Tree (memorize)
```
Task → Trivial? (<5 lines)
  ├─ YES → Direct (2-5K tokens)
  └─ NO → Existing subagent? 
        ├─ YES → Agent tool (5-15K) ← DEFAULT 95%
        └─ NO → Create from template OR ask user
```

### Three-Layer Enforcement
1. CLAUDE.md §Workflow Tool Prohibition (per-repo)
2. .agent/index.md routing rule #13 (STOP checkpoint)
3. .claude/agents/_TEMPLATE.md (10-minute alternative)

### Reusable Pattern (for future high-cost tools)
1. Identify high-cost tool
2. Measure cost difference vs cheap alternative
3. Add explicit prohibition ("DEFAULT: Never use X")
4. Cost-visible decision tree
5. STOP checkpoint
6. Cheap-alternative template
7. Monitor: <5% expensive path usage

---

## Recent Improvements (2026-05-26 to 2026-06-05)

### Completed (2026-05-26 to 2026-06-03)
- Orphaned file cleanup (SAP folder structure)
- Index.md reorganization (added Agent System section)
- .agent-system-introduction.md creation
- Agent System Meta-Optimizer documentation
- Added .agent/ system for vault maintenance (2026-06-03)
- Added templates/.agent-template/ (2026-06-03)

### Completed (2026-06-05)
- Added @skill-creator for autonomous skill generation
- Added @routing-optimizer for self-learning routing
- Created solutions.md registry for known problems
- Updated routing rules to support self-evolution
- Implemented gap detection and pattern promotion (3× rule)
- **Synced redshift-reporting v5.1 status to vault**: 14 skills, 11 wiki pages, PROJ-645/622 work
- Updated external repo agent system status snapshot

---

## Change Log

### 2026-06-05
- v5.1 Workflow Prohibition pattern documented in vault
- External repo status snapshot table added (tracks 7 repos)
- Redshift Reporting note synced from v5.0 → v5.1 (14 skills, 11 wiki pages, PROJ-645 V10-V12)
- Index.md updated with v5.1 highlights

### 2026-06-03
- Created .agent/ system for vault maintenance
- Added 5 skills: maintain-links, update-index, add-frontmatter, sync-patterns, create-moc
- Created templates/.agent-template/ for reusable agent system

---

**Last Updated**: 2026-06-05
**Next Review**: 2026-09-03 (quarterly) or when redshift-reporting hits v5.2+
