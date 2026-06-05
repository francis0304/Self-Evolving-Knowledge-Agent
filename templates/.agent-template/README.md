# .agent Template System

## What is the .agent System?

The `.agent/` system is a **delegation-first AI architecture** that transforms how Claude Code works on complex codebases. Instead of a single monolithic agent trying to handle everything, it uses a **main orchestrator + specialized subagents** pattern.

### Key Benefits
- **80% context reduction** (10K main + 5-8K subagent vs 40-50K monolithic)
- **Parallel execution** (multiple subagents working simultaneously)
- **Failure isolation** (subagent errors don't pollute main session)
- **Session continuity** (main agent maintains state across delegations)

## When to Use This Template

Use this template when:
- Your repository has **>5 distinct workflows** (e.g., convert, validate, fix, deploy)
- You're dealing with **>10K LOC** in a single domain
- Tasks require **multiple sequential steps** that could be parallelized
- You need **consistent patterns** across similar operations
- You want **accumulated knowledge** from past tasks

Don't use for:
- Simple scripts (<1K LOC)
- One-off projects
- Pure documentation repos (unless you need smart maintenance like link checking)

## Reference Implementation

See **[Redshift Reporting](file:///${EXTERNAL_REPOS}/example-repo-redshift)** for a production-ready v4 implementation:
- 5 subagents (sql-worker, validator, fixer, wiki-keeper, researcher)
- 4 workflow skills (convert, validate, fix, update-wiki)
- 8 wiki pages in knowledge base
- Graphify integration (117 nodes, 208 edges)
- 80% context reduction verified

## Setup Guide

### Step 1: Copy Template to Your Repo

```bash
# From your repository root
cp -r /path/to/Knowledge-Vault/templates/.agent-template .agent

# Or manually:
# 1. Copy templates/.agent-template/ → your-repo/.agent/
# 2. Rename *.template files → remove .template extension
```

### Step 2: Customize Core Files

**Edit `.agent/index.md`** (remove .template):
1. Update `## Repository Context` with your domain
2. Define routing rules for your workflows
3. List your planned subagents

**Edit `.agent/memory/facts.md`**:
1. Document your project conventions (naming, structure, tech stack)
2. Add critical constraints (e.g., "always use X", "never use Y")
3. List key file paths and patterns

**Edit `.agent/skills/_template.md`**:
1. Copy for each major workflow in your repo
2. Define delegation flow
3. Specify expected inputs/outputs

### Step 3: Design Subagents

**Identify specializations** (3-5 subagents recommended):
- What are your main task categories? (convert, validate, deploy, etc.)
- Which tasks need deep expertise? (SQL conversion, API integration)
- What can run in parallel? (tests + docs, build + deploy)

**Create subagent files** in `.claude/agents/`:
```markdown
# Example: .claude/agents/converter.md

# Converter Subagent

## Role
Expert in X → Y conversion

## Expertise
- Pattern A handling
- Edge case B
- Convention C

## Tools Available
- Read, Edit, Grep, Bash
- Custom tools: [list]

## Constraints
- CANNOT run tests (tester's job)
- CANNOT update docs (doc-keeper's job)
```

### Step 4: Integrate with Graphify

```bash
# Generate knowledge graph
/graphify .
```

This creates `graphify-out/` with:
- `graph.html` - Interactive visualization
- `graph.json` - Raw graph data
- `GRAPH_REPORT.md` - God node analysis
- `topology_summary.md` - Community structure

**Update routing rules** based on god nodes:
- High-centrality entities → trigger researcher pre-flight
- Communities → inform subagent boundaries
- Cross-cutting concerns → shared context

**Export topology to memory**:
```bash
# Add to .claude/settings.json PreToolUse hook
cp graphify-out/topology_summary.md .agent/memory/graphify_topology.md
```

### Step 5: Integrate with Obsidian (Optional)

If you have an Obsidian vault for cross-repo knowledge:

**Configure MCP** (`.mcp.json`):
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["path/to/obsidian-mcp-server/dist/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/path/to/vault"
      }
    }
  }
}
```

**Create wiki-keeper subagent**:
```markdown
# .claude/agents/wiki-keeper.md

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
4. Maintain wiki-links
5. Verify backlinks
```

### Step 6: Test and Iterate

**Run 5 representative tasks**:
1. Measure context usage (check session logs)
2. Verify delegation works correctly
3. Confirm parallel execution
4. Check memory updates
5. Review wiki accuracy

**Optimize**:
- Too many delegations? Merge subagents
- Context still high? Split responsibilities
- Slow routing? Add fast-path rules
- Inconsistent results? Tighten constraints

## File Structure Reference

```
.agent/                          # Main system
├── index.md                     # Routing logic
├── skills/                      # Workflow entry points
│   ├── workflow-1.md
│   ├── workflow-2.md
│   └── workflow-3.md
├── memory/                      # Session memory
│   ├── facts.md                 # Immutable conventions
│   ├── working.md               # Active tasks
│   └── archive.md               # Completed work
└── learning/                    # Meta-learning
    ├── lessons.md               # What worked/failed
    ├── feedback.md              # User corrections
    └── patterns.md              # Reusable patterns

.claude/agents/                  # Subagent definitions
├── worker-1.md
├── worker-2.md
└── keeper.md

knowledge/                       # Knowledge base (optional)
├── raw/                         # Source documents
└── wiki/                        # LLM-maintained pages

graphify-out/                    # Knowledge graph (optional)
├── graph.html
├── graph.json
└── GRAPH_REPORT.md
```

## Customization Examples

### For Code Migration Projects
- Subagents: converter, validator, fixer, doc-keeper
- Skills: convert-module, validate-all, fix-diff
- Memory: Migration patterns, API mappings, test cases

### For API Development
- Subagents: endpoint-builder, tester, doc-generator, deployer
- Skills: create-endpoint, run-tests, generate-openapi, deploy-stage
- Memory: API conventions, auth patterns, error handling

### For Data Pipelines
- Subagents: dag-builder, validator, monitor, optimizer
- Skills: create-dag, validate-schema, monitor-runs, optimize-cost
- Memory: Airflow patterns, data sources, SLA requirements

### For Documentation Repos
- Subagents: link-checker, indexer, formatter, publisher
- Skills: check-links, update-index, format-all, publish-site
- Memory: Style guide, link patterns, navigation structure

## Integration Points

### With Graphify
1. Run `/graphify .` to generate knowledge graph
2. Identify god nodes (high-centrality entities)
3. Update routing rules to trigger researcher for god nodes
4. Export topology to `.agent/memory/graphify_topology.md`
5. Use communities to inform subagent boundaries

### With Obsidian MCP
1. Configure MCP server in `.mcp.json`
2. Create wiki-keeper subagent with MCP tools
3. Maintain cross-repo knowledge in Obsidian vault
4. Use `search_notes` to pull patterns
5. Use `write_note` to push learnings

### With Claude Code Hooks
Add to `.claude/settings.json`:
```json
{
  "hooks": {
    "PreToolUse": "cp graphify-out/topology_summary.md .agent/memory/",
    "PostSession": "echo 'Review .agent/learning/lessons.md'"
  }
}
```

## Common Pitfalls

### 1. Over-Delegation
**Problem**: Too many subagent calls, overhead dominates
**Solution**: Merge related tasks, create fast-paths for simple cases

### 2. God Nodes in Subagents
**Problem**: Subagent tries to do too much, context bloat
**Solution**: Split into narrower specialists, add researcher pre-flight

### 3. Stale Memory
**Problem**: facts.md outdated, subagents use wrong patterns
**Solution**: Add memory review to skills, prompt updates after changes

### 4. Poor Routing Rules
**Problem**: Main agent uncertain, delegates incorrectly
**Solution**: Add more trigger keywords, use regex patterns, test edge cases

### 5. Missing Context
**Problem**: Subagent lacks critical info, fails mid-task
**Solution**: Enrich delegation context, add to facts.md, use graphify

## Success Metrics

Track these to validate your system:
- **Context Reduction**: Target 60-80% vs monolithic
- **Speed Improvement**: Parallel execution saves 20-40%
- **Failure Rate**: Should decrease as memory accumulates
- **Routing Accuracy**: >95% correct subagent selection
- **Knowledge Growth**: Wiki pages increase, facts.md stabilizes

## Next Steps

1. Copy this template to your repo
2. Customize `index.md` with your routing rules
3. Define 3-5 skills for your workflows
4. Create 3-5 subagents for specializations
5. Seed `memory/facts.md` with conventions
6. Run `/graphify .` for topology
7. Test with 5 real tasks
8. Iterate based on metrics

## Learn More

- [[knowledge/architecture/Agent System Introduction|.agent-system-introduction]] - Complete architecture guide
- [[companies/current-company/projects/Redshift Reporting]] - Production reference implementation
- [[knowledge/architecture/Agent System Meta-Optimizer]] - System optimization guide
- [[MCP Tutorial]] - Obsidian integration setup

---

**Version**: 1.0 (Based on redshift-reporting v4)
**Last Updated**: 2026-06-03
**Maintainer**: See Index.md in Knowledge-Vault
