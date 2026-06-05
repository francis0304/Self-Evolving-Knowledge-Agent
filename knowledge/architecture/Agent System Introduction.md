# The .agent System: Delegation-First AI Architecture

## What is the .agent System?

The `.agent/` system is a **delegation-first AI architecture** that transforms how Claude Code works on complex codebases. Instead of a single monolithic agent trying to handle everything, it uses a **main orchestrator + specialized subagents** pattern to achieve:

- **80% context reduction** (10K main + 5-8K subagent vs 40-50K monolithic)
- **Parallel execution** (multiple subagents working simultaneously)
- **Failure isolation** (subagent errors don't pollute main session)
- **Session continuity** (main agent maintains state across delegations)

## Architecture Overview

```
Repository Root
├── .agent/                      # Agent system core
│   ├── index.md                 # Routing rules & delegation logic
│   ├── skills/                  # Workflow skills (entry points)
│   │   ├── convert-sp-block.md
│   │   ├── validate-migration.md
│   │   └── fix-validation-diff.md
│   ├── memory/                  # Session memory
│   │   ├── facts.md             # Project conventions
│   │   ├── working.md           # Active tasks
│   │   └── archive.md           # Completed work
│   └── learning/                # Meta-learning
│       ├── lessons.md           # What worked/failed
│       ├── feedback.md          # User corrections
│       └── patterns.md          # Reusable patterns
│
├── .claude/agents/              # Subagent definitions (v4)
│   ├── sql-worker.md            # Specialized for SQL conversion
│   ├── validator.md             # Test execution specialist
│   ├── fixer.md                 # Debugging specialist
│   ├── wiki-keeper.md           # Documentation specialist
│   └── researcher.md            # Analysis specialist
│
└── knowledge/                   # Knowledge base
    ├── raw/                     # Immutable source documents
    └── wiki/                    # LLM-maintained wiki pages
        ├── index.md             # Wiki catalog
        └── *.md                 # Domain knowledge pages
```

📖 **Related**: See [[obsidian-mcp-server/README|Obsidian MCP Server]] for vault integration details

## How It Works: Delegation Flow

### Traditional (Monolithic) Approach
```
User Request → Claude Code (50K context)
  ├─ Reads 10+ files
  ├─ Analyzes code
  ├─ Converts SQL
  ├─ Writes tests
  ├─ Runs validation
  ├─ Debugs failures
  └─ Updates docs
  
Result: Context overwhelmed, slow, prone to errors
```

### .agent System (Delegation-First)
```
User Request → Main Orchestrator (10K context)
  ↓ routes to
  ├─→ @sql-worker (8K context)      [Converts SQL]
  ├─→ @validator (6K context)        [Runs tests] ⚡ parallel
  ├─→ @fixer (7K context)            [Debugs issues]
  └─→ @wiki-keeper (5K context)      [Updates docs] ⚡ parallel
  
Result: Clean, fast, isolated, scalable
```

### Example: Converting a Stored Procedure

**User**: "Convert block 15 of RPT_OrderSummary to Redshift"

**Main Orchestrator** (`index.md`):
1. Reads routing rules
2. Identifies: "This is a conversion task"
3. Delegates to: `@sql-worker` with context

**@sql-worker Subagent**:
1. Receives: Block 15 source code + conversion patterns
2. Converts: MSSQL T-SQL → Redshift PL/pgSQL
3. Returns: Converted code + notes
4. Main agent writes the file

**Main Orchestrator** (parallel execution):
- Spawns `@validator` → runs test cases
- Spawns `@wiki-keeper` → updates documentation
- Both run simultaneously (saves 30-45 seconds)

## Component Deep Dive

### 1. Routing Rules (`.agent/index.md`)

The main orchestrator uses routing rules to delegate tasks:

```markdown
## Routing Rules

### SQL Conversion Tasks
**Triggers**: "convert", "migrate", "port", "translate"
**Delegate to**: @sql-worker
**Context**: Source code + conversion patterns

### Validation Tasks
**Triggers**: "validate", "test", "verify", "compare"
**Delegate to**: @validator
**Context**: Test cases + validation framework

### Debugging Tasks
**Triggers**: "fix", "debug", "diagnose", "why is"
**Delegate to**: @fixer
**Context**: Error logs + relevant code
```

### 2. Workflow Skills (`.agent/skills/`)

Skills are **high-level entry points** for common workflows:

**Example: `convert-sp-block.md`**
```markdown
# Skill: convert-sp-block

## Purpose
Convert a MSSQL stored procedure block to Redshift PL/pgSQL

## Workflow
1. Delegate to @researcher (if >5 files involved)
2. Delegate to @sql-worker for conversion
3. Delegate to @validator for validation
4. If failures: delegate to @fixer
5. Delegate to @wiki-keeper for documentation

## Usage
User: "/convert-sp-block RPT_OrderSummary 15"
```

### 3. Subagents (`.claude/agents/*.md`)

Each subagent is a **specialist** with:
- Narrow scope
- Specific tools
- Domain expertise

**Example: `sql-worker.md`**
```markdown
# SQL Worker Subagent

## Role
Expert in MSSQL → Redshift SQL conversion

## Expertise
- T-SQL → PL/pgSQL dialect translation
- CAST/ROUND/CONVERT handling
- Temp table → CTE conversion
- Schema routing (REPORTING vs vSOURCE)

## Tools Available
- Read (SQL files)
- Edit (SQL files only)
- Grep (pattern search)
- Bash (syntax validation)

## Constraints
- CANNOT write test cases (validator's job)
- CANNOT run validations (validator's job)
- CANNOT update wiki (wiki-keeper's job)
```

### 4. Memory System (`.agent/memory/`)

**`facts.md`** - Project conventions (immutable during session):
```markdown
- Redshift is case-sensitive, always quote identifiers
- FX rate lookups must hardcode 'USD', not use @CurrencyCode
- All narrowing CASTs need ROUND first
- Schema routing: REPORTING = output, vSOURCE = views
```

**`working.md`** - Active task tracking:
```markdown
## 2026-06-03: Converting RPT_SalesByRegion Block 8
- Status: In Progress
- Current: Fixing timezone conversion
- Blocker: vSOURCE.OrderTime has mixed UTC/local
- Next: Add CONVERT_TIMEZONE wrapper
```

### 5. Knowledge Wiki (`knowledge/wiki/`)

**LLM-maintained** pages that evolve with the project:

**Example: `knowledge/wiki/rpt-ordersummary-validation.md`**
```markdown
# RPT_OrderSummary Validation

## Status: 19/19 Cases PASS ✅

## Validation Cases
1. OrderSummary (8432 rows) - PASS
2. AccountCreditBalance (1234 rows) - PASS
...

## Common Pitfalls
- Block 7: Must ROUND before CAST to DECIMAL(18,2)
- Block 12: FX rate must use 'USD', not p_CurrencyCode
```

## Integration: Graphify

**Graphify** transforms your codebase into a **knowledge graph** that the agent system uses for context-aware routing.

### How It Works

```bash
# Generate knowledge graph
/graphify .
```

**Output**:
```
graphify-out/
├── graph.html              # Interactive visualization
├── graph.json              # Raw graph data
├── GRAPH_REPORT.md         # Analysis report
└── topology_summary.md     # Community structure
```

**Example Output** (redshift-reporting):
- **117 nodes** (files, functions, concepts)
- **208 edges** (relationships)
- **14 communities** (logical groupings)

### God Nodes (High-Centrality Entities)

The graph identifies **god nodes** - entities with many connections:

**redshift-reporting example**:
1. **RPT_OrderSummary** (19 edges) - Core SP
2. **comparator.py** (14 edges) - Validation framework
3. **schema-routing** (12 edges) - Critical concept

### Agent System Integration

**Routing uses god nodes**:
```markdown
## Routing Rule: SP Conversion
If task mentions "RPT_OrderSummary":
  → High complexity (god node)
  → Delegate to @researcher first (pre-flight analysis)
  → Then @sql-worker
```

**Auto-export to memory**:
- PreToolUse hook exports `graphify_topology.md` to `.agent/memory/`
- Main agent always has topology context
- Subagents receive relevant subgraphs

### Benefits

1. **Context-aware routing**: High-centrality nodes trigger researcher pre-flight
2. **Dependency tracking**: Graph shows what breaks if you change X
3. **Knowledge discovery**: Communities reveal logical boundaries
4. **Onboarding**: New developers see structure instantly

## Integration: Obsidian MCP

**Obsidian MCP (Model Context Protocol)** gives Claude Code **direct access** to your Obsidian vault for documentation and knowledge management.

### Architecture

```
Claude Code ←→ MCP Server ←→ Obsidian Vault
              (Node.js)      (Markdown files)
```

**Configuration** (`.mcp.json`):
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["obsidian-mcp-server/dist/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/vault"
      }
    }
  }
}
```

### Available Tools

| Tool | Purpose | Example |
|------|---------|---------|
| `search_notes` | Full-text search | "Search for notes about SQL conversion" |
| `read_note` | Read note content | "Read projects/Redshift Reporting.md" |
| `write_note` | Create/update notes | "Create a note about this bug" |
| `get_links` | Extract wiki-links | "What does this note link to?" |
| `get_backlinks` | Find references | "What notes link to this?" |
| `list_notes` | Inventory all notes | "List all project notes" |

### Agent System Integration

**wiki-keeper subagent uses MCP**:

```markdown
# wiki-keeper.md

## Tools Available
- mcp__obsidian__search_notes
- mcp__obsidian__read_note
- mcp__obsidian__write_note
- mcp__obsidian__get_links
- mcp__obsidian__get_backlinks

## Workflow
1. Search for existing note
2. Read current content
3. Update with new information
4. Maintain [[wiki-links]]
5. Verify backlinks are correct
```

**Example Delegation**:

```
Main: "Update wiki after fixing block 15"
  ↓ delegates to
@wiki-keeper:
  1. search_notes("RPT_OrderSummary block 15")
  2. read_note("knowledge/wiki/rpt-ordersummary-validation.md")
  3. Update validation status: "Block 15: PASS ✅"
  4. Add pitfall: "Must ROUND before CAST(expr AS DECIMAL)"
  5. write_note(...updated content...)
  6. get_backlinks() → update related pages
```

### Vault Structure for Agent System

```
Obsidian Vault/
├── areas/                       # Knowledge areas
│   ├── Data Platform Overview.md
│   └── Database Architecture.md
│
├── projects/                    # Repository documentation
│   ├── Redshift Reporting.md    # Repo overview
│   ├── Airflow.md
│   └── Glue.md
│
├── wikis/                       # Pattern summaries
│   ├── Airflow Patterns.md
│   ├── Glue Patterns.md
│   └── SQL Conversion Patterns.md
│
├── Index.md                     # Main navigation hub
├── Quick Start Guide.md         # Onboarding
└── MCP Tutorial.md              # MCP setup guide
```

**Cross-Repository Knowledge**:
- Each repo's `.agent/` system is self-contained
- Obsidian vault provides **cross-repo knowledge layer**
- MCP lets agents pull from vault as needed
- wiki-keeper pushes updates back to vault

### Benefits

1. **Centralized knowledge**: One vault for all repos
2. **Cross-repo patterns**: Share learnings across projects
3. **Onboarding docs**: New team members read vault
4. **Agent memory**: Long-term organizational memory
5. **Bi-directional sync**: Agents read AND write

## Real-World Example: redshift-reporting

### Repository Stats
- **Agent**: v4 (delegation-first)
- **Subagents**: 5 (sql-worker, validator, fixer, wiki-keeper, researcher)
- **Wiki pages**: 8 (knowledge/wiki/)
- **Graphify**: 117 nodes, 208 edges
- **Obsidian**: Documented in projects/Redshift Reporting.md

### Migration Workflow

**Task**: "Convert RPT_OrderSummary block 15 to Redshift"

**Step 1: Main Orchestrator** (10K context)
- Reads `.agent/index.md` routing rules
- Identifies: "SQL conversion task, god node (high complexity)"
- Delegates to `@researcher` for pre-flight

**Step 2: @researcher** (5K context)
- Checks graphify: RPT_OrderSummary = 19 edges
- Reads `knowledge/wiki/rpt-ordersummary-block-map.md`
- Identifies dependencies: Block 15 uses temp table from Block 3
- Returns: "Safe to convert, depends on Block 3 CTE"

**Step 3: @sql-worker** (8K context)
- Receives: Block 15 source + conversion patterns
- Converts: T-SQL → PL/pgSQL
- Applies: ROUND before CAST, fixes FX lookup
- Returns: Converted code

**Step 4: Main writes file** (2K context)
- Writes converted SQL to `reporting/store_procedures/RPT_OrderSummary.sql`

**Step 5: Parallel execution** ⚡
- Main spawns `@validator` → runs test case
- Main spawns `@wiki-keeper` → updates docs
- Both run simultaneously

**Step 6: @validator** (6K context)
- Runs `./run_validation.sh -c OrderSummary`
- Compares: MSSQL vs Redshift row-by-row
- Returns: "PASS: 8432 rows, 0 diffs"

**Step 7: @wiki-keeper** (5K context)
- Via MCP: `search_notes("RPT_OrderSummary")`
- Via MCP: `read_note("knowledge/wiki/rpt-ordersummary-validation.md")`
- Updates: "Block 15: PASS ✅"
- Via MCP: `write_note(...)`
- Via MCP: `read_note("projects/Redshift Reporting.md")` in Obsidian vault
- Updates repo status in Obsidian

**Result**:
- ✅ Block 15 converted (sql-worker)
- ✅ Validation passed (validator)
- ✅ Wiki updated (wiki-keeper)
- ✅ Obsidian vault updated (wiki-keeper via MCP)
- ⏱️ Time: 90 seconds (vs 3+ minutes monolithic)
- 📊 Context: 10K main + 24K subagents = 34K total (vs 50K+ monolithic)

## Benefits Summary

### Performance
- **80% context reduction**: Cleaner, faster responses
- **Parallel execution**: 30-45s saved per workflow
- **Failure isolation**: Retries don't pollute main session

### Quality
- **Specialization**: Each subagent is an expert
- **Consistency**: Routing rules enforce patterns
- **Knowledge accumulation**: Wiki + Obsidian capture learnings

### Scalability
- **Composable**: Skills compose subagents
- **Reusable**: Subagents work across workflows
- **Maintainable**: Update subagent = update all workflows using it

### Team Collaboration
- **Obsidian vault**: Shared knowledge base
- **Graphify**: Visual codebase map
- **Wiki pages**: Self-documenting system
- **MCP integration**: Bi-directional knowledge sync

## Migration Path: v1 → v4

Based on redshift-reporting experience:

### Phase 1: Knowledge Foundation (1 week)
1. Create 5-8 wiki pages documenting architecture
2. Run `/graphify .` to build knowledge graph
3. Identify god nodes (inform subagent boundaries)
4. Set up Obsidian vault with repo documentation

### Phase 2: Workflow Analysis (1 week)
1. Review last 10 tasks in working.md
2. Identify 3-4 repetitive workflows
3. Draft workflow skills

### Phase 3: Subagent Design (1 week)
1. Design 3-5 subagents based on workflows + god nodes
2. Create `.claude/agents/*.md` files
3. Update `.agent/index.md` with delegation rules

### Phase 4: MCP Integration (1 week)
1. Configure MCP server for Obsidian
2. Update wiki-keeper to use MCP tools
3. Create cross-repo knowledge pages in Obsidian

### Phase 5: Testing & Polish (1 week)
1. Test delegation on 5 real tasks
2. Measure context reduction, speedup
3. Document lessons in `.agent/learning/`
4. Export graphify topology to memory

## Conclusion

The **.agent system + graphify + Obsidian MCP** creates a **self-improving AI architecture**:

1. **Delegation-first** reduces cognitive load
2. **Graphify** maps codebase structure
3. **Obsidian MCP** provides cross-repo knowledge
4. **Wiki system** captures learnings
5. **Subagents** specialize and compose

**Result**: Faster, smarter, more consistent AI assistance that gets better with every task.

---

## References

- **Redshift Reporting**: Reference implementation in Obsidian vault
- **MCP Tutorial**: Obsidian vault setup guide
- **Data Platform Repos - Agent System Status**: Cross-repo maturity comparison
- **Graphify Skill**: `~/.claude/skills/graphify/`

## Learn More

- Try `/graphify .` in any repo
- Read [[companies/current-company/projects/Redshift Reporting]] in Obsidian vault
- Explore `.agent/` system in redshift-reporting repo
- Check [[MCP Tutorial]] for Obsidian integration

---

## Advanced Topics

### System Optimization

For advanced users looking to analyze and optimize the .agent system itself:

- [[Enhancement Of .agent System|Meta-Optimizer Agent]] - Sophisticated meta-optimization prompt for diagnosing bottlenecks, improving routing accuracy, and reducing failure rates. Use this to periodically audit and enhance your .agent architecture.
