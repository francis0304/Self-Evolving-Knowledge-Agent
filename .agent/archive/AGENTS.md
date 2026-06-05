# Knowledge-Vault Agent System Documentation

## Repository Overview

### Project Description
**Knowledge-Vault** is an Obsidian knowledge vault for personal knowledge management, designed to be portable across companies and projects. The project combines:

- **Universal Knowledge**: Portable patterns (`knowledge/`), architecture templates applicable anywhere  
- **Company-Specific Work**: Current Company (DP) Data Platform implementations with full context in `companies/current-company/`
- **AI-Powered Maintenance**: `.agent/` system for automated vault optimization and maintenance

**Primary Goals:**
1. Maintain a living, self-improving knowledge base  
2. Separate portable patterns from company-specific implementations  
3. Use AI agents to handle routine upkeep (link checking, metadata generation) eliminating manual overhead  

### Key Technologies Used
| Technology | Purpose | Notes |
|--|--|--|
| **Obsidian** | Vault format & graph visualization | Markdown-based PKM tool with backlinks/wiki-links and graph view |
| **MCP Tools** | Standardized LLM interface to vault file operations, search, link analysis - Prevents brittle direct I/O hooks enabling cross-platform compatibility regardless of model provider |  
| **Markdown + YAML Frontmatter**: All content portable across platforms/LLMs with optional metadata (tags dates status)

### Architecture Summary
A **"delegation-first"** architecture where:


1. User requests → Agent router (`.agent/index.md`) dispatches task to appropriate subagent  
2. Router delegates via manifest.json registry lookup matching intent keywords against known patterns routing rules | 
3- Subagents execute tasks and report back; results stored in lessons/facts memory layers  
4 - MCP tools abstract Obsidian API into standard JSON schemas enable seamless interoperability across different AI model implementations

---

## Directory Structure

```
.agent/
├── index.md                          # Main routing orchestrator
├── manifest.json                     # Subagent registry & configuration
├── AGENTS.md                         # This file - system documentation
│
├── skills/                           # Workflow entry points
│   ├── maintain-links.md             # Link health check & repair
│   ├── update-index.md               # Index.md maintenance
│   ├── add-frontmatter.md            # Metadata batch operations
│   ├── sync-patterns.md              # Wiki pattern synchronization
│   ├── create-moc.md                 # Map of Content generation
│   └── optimize-system.md            # System self-optimization
│
├── memory/                           # Agent knowledge base
│   ├── facts.md                      # Project conventions (stable)
│   ├── working.md                    # Active tasks & progress
│   └── archive.md                    # Completed tasks history
│
├── learning/                         # Self-improvement system
│   ├── lessons.md                    # Recent experiences (experiential)
│   ├── patterns.md                   # Reusable patterns (seen 3× or more)
│   └── feedback.md                   # User corrections & adjustments
│
├── monitoring/                       # System health tracking
│   ├── metrics.md                    # Health metrics & performance stats
│   └── activity-log.md               # Agent activity timeline
│
└── agents/                           # Subagent definitions (v5)
    ├── link-checker.md               # Link validation specialist
    ├── indexer.md                    # Index navigation specialist
    ├── metadata-keeper.md            # Metadata & tagging specialist
    ├── sync-keeper.md                # External repo sync specialist
    └── moc-builder.md                # Map of Content specialist
```

### Key Entry Points

| Entry Point | Type | Purpose | Location |
|---|---|---|---|
| **index.md** | Router | Main orchestrator - matches user intent to subagents | `.agent/index.md` |
| **manifest.json** | Registry | Subagent registry with metadata (tokens, confidence, tags) | `.agent/manifest.json` |
| **facts.md** | Knowledge | Project conventions & guardrails (hardened from patterns) | `.agent/memory/facts.md` |
| **/optimize-system** | Skill | Self-optimization: compact lessons, distill patterns → facts | `.agent/skills/optimize-system.md` |
| **skills/*.md** | Skills | Workflow entry points (called by subagents) | `.agent/skills/` |

---

## Development Workflow

### Building and Running (Obsidian Vault)

**For Vault Maintenance:**

1. **Check System Health** (Monthly or when approaching token limits)
   ```
   Check metrics.md: lessons.md size, pattern count, subagent hit rates
   If lessons.md > 8K tokens or patterns > 10 entries → run optimization
   ```

2. **Run System Optimization** (Self-improvement)
   ```
   Say: "optimize system" or "/optimize-system"
   
   Process:
   - Compacts lessons.md (remove duplicates, consolidate themes)
   - Promotes patterns: if seen 3×+ with high confidence → promote to facts.md
   - Distills subagent prompts (reduce redundancy)
   - Updates monitoring/metrics.md
   - Archives completed work
   ```

3. **Run Vault Maintenance Tasks**
   ```
   Link Health:       "Check for broken links"
   Index Update:      "Add [Note] to Index.md"
   Metadata:          "Add frontmatter to notes in knowledge/"
   Pattern Sync:      "Sync Airflow patterns from external repo"
   MOC Creation:      "Create MOC for [topic]"
   ```

### Testing Approach

**Manual Testing** (For new skills or changes):

1. **Unit Test** - Test a single skill:
   ```
   "Run: Check for broken links"
   
   Verify:
   - @link-checker returns report
   - Output includes: broken links, orphans, external URLs
   - No false positives
   ```

2. **Integration Test** - Test routing + subagent delegation:
   ```
   "Update Index.md with new notes"
   
   Verify:
   - index.md routes to @indexer correctly
   - @indexer reads vault structure
   - New notes added to appropriate sections
   - No duplicate entries
   ```

3. **System Health Check** (Weekly):
   ```
   Review:
   - manifest.json hit_counts (which subagents are used)
   - learning/lessons.md growth rate
   - monitoring/metrics.md performance
   - Identify unused skills → candidate for archival
   ```

### Development Environment Setup

**Prerequisites**:
- Obsidian with MCP plugin configured (see `knowledge/tools/mcp/`)
- `.claude/settings.json` or equivalent LLM endpoint configured
  - Local: Ollama (Qwen recommended for Chinese support)
  - Cloud: OpenAI, Anthropic, or other provider
- Git repository with vault structure initialized

**Quick Start**:

1. **Clone or Initialize Vault**
   ```bash
   # If new vault:
   mkdir my-vault
   cd my-vault
   git init
   
   # Copy .agent/ directory structure
   cp -r /path/to/template/.agent .
   ```

2. **Configure MCP Connection**
   ```json
   {
     "mcpServers": {
       "obsidian-vault": {
         "command": "node",
         "args": ["/path/to/obsidian-mcp-server/dist/index.js"],
         "env": {
           "OBSIDIAN_VAULT_PATH": "/absolute/path/to/vault"
         }
       }
     }
   }
   ```

3. **Initialize Agent System**
   ```
   Tell Claude Code:
   "Initialize agent system - verify all directories and files present"
   
   Verifies:
   - .agent/skills/*.md exist
   - .agent/memory/facts.md with project conventions
   - .agent/manifest.json properly formatted
   - All subagents in manifest have corresponding .md files
   ```

4. **Run First Command**
   ```
   "Check for broken links"
   
   Should:
   - Trigger routing to @link-checker
   - Scan vault for orphaned files
   - Return clean report
   ```

### Agent Commands Reference

#### System Orchestration

| Command | Trigger | Routing | Subagent | Purpose |
|---------|---------|---------|----------|---------|
| **Optimize System** | `/optimize-system`, "optimize system" | Direct skill call | None | Compact lessons, promote patterns → facts, distill prompts |
| **Initialize System** | "initialize agent system", "setup vault agents" | Direct skill call | None | Create .agent structure, verify files |
| **Check System Health** | "system health", "check metrics", "vault status" | Direct skill call | None | Report on lessons.md, patterns.md, metrics.md |

#### Link Management

| Command | Trigger | Routing | Subagent | Purpose |
|---------|---------|---------|----------|---------|
| **Check Links** | "check links", "find orphans", "check broken links" | → @link-checker | link-checker | Validate wiki-links, find orphaned files, report dead URLs |
| **Fix Links** | "fix broken links", "repair links" | → @link-checker | link-checker | Auto-repair renameable links, suggest manual fixes for ambiguous cases |

#### Index Management

| Command | Trigger | Routing | Subagent | Purpose |
|---------|---------|---------|----------|---------|
| **Add to Index** | "add [note] to index", "add note to Index.md" | → @indexer | indexer | Add wiki-link to appropriate section, avoid duplicates |
| **Update Index** | "update Index.md", "organize Index.md" | → @indexer | indexer | Reorganize sections, remove dead links, update navigation |
| **Create Index Section** | "create section for [topic]", "new Index category" | → @indexer | indexer | Add new section with description and organization rules |

#### Metadata Management

| Command | Trigger | Routing | Subagent | Purpose |
|---------|---------|---------|----------|---------|
| **Add Frontmatter** | "add frontmatter", "add metadata", "batch tag" | → @metadata-keeper | metadata-keeper | Add YAML frontmatter to notes missing it |
| **Tag Notes** | "tag [notes]", "add tags to knowledge/" | → @metadata-keeper | metadata-keeper | Add topic tags following vault conventions |
| **Update Frontmatter** | "update frontmatter in [folder]" | → @metadata-keeper | metadata-keeper | Batch update created/updated timestamps, status fields |

#### Wiki Synchronization

| Command | Trigger | Routing | Subagent | Purpose |
|---------|---------|---------|----------|---------|
| **Sync Patterns** | "sync [tool] patterns", "sync airflow", "sync from repo" | → @sync-keeper | sync-keeper | Pull patterns from external repos, merge into vault (section-level) |
| **Check External Repos** | "check external repos", "list repo status" | → @sync-keeper | sync-keeper | Verify connectivity to external repositories |
| **Update Wiki** | "update wiki from [repo]", "pull latest patterns" | → @sync-keeper | sync-keeper | Fetch latest patterns, show diff before merging |

#### Map of Content

| Command | Trigger | Routing | Subagent | Purpose |
|---------|---------|---------|----------|---------|
| **Create MOC** | "create MOC", "map [topic]", "build topic map" | → @moc-builder | moc-builder | Generate Map of Content for topic cluster |
| **Update MOC** | "update MOC for [topic]", "refresh topic map" | → @moc-builder | moc-builder | Regenerate MOC with latest notes |
| **Link Cluster** | "cluster [topic] links", "find related notes" | → @moc-builder | moc-builder | Find and link semantically related notes |

---

## Learning System

The agent system learns from experience through a three-tier feedback loop:

### Tier 1: Lessons (Experiential)
- **File**: `.agent/learning/lessons.md`
- **Content**: Recent experiences, what worked/failed, edge cases
- **Promotion**: Entries appearing 3× or more → promoted to patterns.md
- **Compaction**: When lessons.md > 8K tokens, compact and archive

### Tier 2: Patterns (Validated)
- **File**: `.agent/learning/patterns.md`
- **Content**: Reusable solutions, proven approaches, recurring themes
- **Promotion**: Patterns with 90%+ confidence → promoted to facts.md
- **Maintenance**: Regular distillation to remove low-confidence entries

### Tier 3: Facts (Hardened)
- **File**: `.agent/memory/facts.md`
- **Content**: Project conventions, immutable guardrails, proven best practices
- **Stability**: Rarely changes; represents ground truth for vault operations

**Flow**: Experience (1×) → Lessons → Pattern (3×) → Facts (hardened)

---

## Vault Configuration

### Project Conventions (facts.md)

Key conventions stored in `.agent/memory/facts.md`:

- **Filename Format**: Spaces allowed (e.g., `Airflow Patterns.md`)
- **Note Titles**: Must match filename (file: `Airflow.md` → H1: `# Airflow`)
- **Wiki-Links**: Always use `[[Note Title]]`, not markdown links
- **Tags**: lowercase-hyphenated (e.g., `data-platform`, `agent-system`)
- **Frontmatter**: All notes require YAML frontmatter with tags, created, updated, status
- **Index.md Structure**: 6 sections in specific order (see Index.md)

### External Repository Mapping

Sync sources for wiki patterns (from facts.md):

| Repository | Path | Patterns |
|---|---|---|
| **Airflow** | `C:/Users/.../example-repo-airflow` | DAG factory, operators, connections |
| **Glue** | `C:/Users/.../example-repo-glue` | BaseSparkJob, Spark patterns, RDBMS |
| **Redshift** | `C:/Users/.../example-repo-redshift` | Redshift SQL, reporting patterns |
| **Infrastructure** | `C:/Users/.../example-repo-infra` | Terraform, IaC, provisioning |
| **SRE** | `C:/Users/.../example-repo-sre` | IAM, monitoring, operational patterns |

---

## Version History

### Version 1.1 (2026-06-04)
- **Added**: Initial delegation-first architecture (6 subagents)
- **Features**:
  - Routing logic in index.md
  - Manifest registry for subagent metadata
  - Memory tiers: facts, working, archive
  - Learning system: lessons → patterns → facts
- **Status**: Production ready

### Version 1.0 (2026-06-03)
- **Foundation**: Basic .agent directory structure
- **Components**: skills/, memory/, learning/, monitoring/
- **Status**: Archived (superseded by v1.1)
