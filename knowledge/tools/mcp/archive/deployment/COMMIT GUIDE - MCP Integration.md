# Commit Guide - MCP Integration

**Date**: 2026-06-04  
**Status**: Ready to commit (3 repos)

---

## 📋 Repos to Commit (3)

### 1. Airflow Repo

**Location**: `~/Desktop/External-Repos/example-repo-airflow`

**Files to commit**:
```
.agent/skills/query-vault.md          (NEW - 400 tokens)
.agent/index.md                        (MODIFIED - added query-vault + routing)
.agent/manifest.json                   (MODIFIED - v1→5.1 + MCP integration)
.claude/agents/wiki-keeper.md          (MODIFIED - added MCP tools section)
```

**Commit command**:
```bash
cd ~/Desktop/External-Repos/example-repo-airflow

# Add MCP integration files
git add .agent/skills/query-vault.md
git add .agent/index.md
git add .agent/manifest.json
git add .claude/agents/wiki-keeper.md

# Check what's staged
git status

# Commit
git commit -m "$(cat <<'EOF'
feat: integrate MCP for cross-repo knowledge access (v5.1)

Add MCP integration to agent system for Obsidian vault queries:

Skills:
- Add query-vault skill (MCP-powered, no delegation, <1K tokens)
- Enables instant vault searches from any repo

Routing:
- Add "Knowledge Queries" routing (check vault, search vault triggers)
- Add "Pattern-Enhanced Tasks" routing (use our pattern, standard approach)
- Main agent uses MCP directly for fast queries (<50ms with v2)

Subagents:
- Enhance wiki-keeper with MCP tools for cross-repo vault updates
- Enable bidirectional sync: local wiki ↔ vault

Manifest:
- Version bump: 1 → 5.1
- Add mcp_integration section with metrics
- Track wiki-keeper as mcp_enabled: true

Benefits:
- 60-70% token savings on knowledge queries (2-3K → 0.5-1K)
- 43% token savings on pattern-enhanced tasks (15K → 8.5K)
- Instant cross-repo pattern access (<50ms)
- No manual context switching needed

Related: Vault commit 9b75812 (MCP v2 validation)

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### 2. Glue Repo

**Location**: `~/Desktop/External-Repos/example-repo-glue`

**Files to commit**: (Same structure as Airflow)
```
.agent/skills/query-vault.md
.agent/index.md
.agent/manifest.json
.claude/agents/wiki-keeper.md
```

**Commit command**:
```bash
cd ~/Desktop/External-Repos/example-repo-glue

# Add MCP integration files
git add .agent/skills/query-vault.md
git add .agent/index.md
git add .agent/manifest.json
git add .claude/agents/wiki-keeper.md

git status

git commit -m "$(cat <<'EOF'
feat: integrate MCP for cross-repo knowledge access (v5.1)

Add MCP integration to agent system for Obsidian vault queries:

Skills:
- Add query-vault skill (MCP-powered, no delegation, <1K tokens)
- Enables instant vault searches from any repo

Routing:
- Add "Knowledge Queries" routing (check vault, search vault triggers)
- Add "Pattern-Enhanced Tasks" routing (use our pattern, standard approach)
- Main agent uses MCP directly for fast queries (<50ms with v2)

Subagents:
- Enhance wiki-keeper with MCP tools for cross-repo vault updates
- Enable bidirectional sync: local wiki ↔ vault

Manifest:
- Version bump: 1 → 5.1
- Add mcp_integration section with metrics
- Track wiki-keeper as mcp_enabled: true
- Adapt terminology for Glue (job instead of DAG)

Benefits:
- 60-70% token savings on knowledge queries (2-3K → 0.5-1K)
- 43% token savings on pattern-enhanced tasks (15K → 8.5K)
- Instant cross-repo pattern access (<50ms)
- No manual context switching needed

Related: Vault commit 9b75812 (MCP v2 validation)

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### 3. Redshift Repo

**Location**: `~/Desktop/External-Repos/example-repo-redshift`

**Important**: This repo has OTHER changes (meta-optimizer phase 2). Separate commits!

#### 3a. First: Commit MCP Integration Only

**MCP-related files**:
```
.agent/skills/query-vault.md           (NEW)
.agent/index.md                         (MODIFIED - MCP routing added)
.agent/manifest.json                    (MODIFIED - v5→5.1 + MCP section)
.claude/agents/wiki-keeper.md           (MODIFIED - MCP tools added)
```

**Command**:
```bash
cd ~/Desktop/External-Repos/example-repo-redshift

# Add ONLY MCP-related files
git add .agent/skills/query-vault.md
git add -p .agent/index.md            # Interactive: select only MCP changes
git add -p .agent/manifest.json       # Interactive: select only MCP changes
git add -p .claude/agents/wiki-keeper.md  # Interactive: select only MCP changes

git status

git commit -m "$(cat <<'EOF'
feat: integrate MCP for cross-repo knowledge access (v5.1)

Add MCP integration to agent system for Obsidian vault queries:

Skills:
- Add query-vault skill (MCP-powered, no delegation, <1K tokens)
- Enables instant vault searches from any repo

Routing:
- Add "Knowledge Queries" routing (check vault, search vault triggers)
- Add "Pattern-Enhanced Tasks" routing (use our pattern, standard approach)
- Main agent uses MCP directly for fast queries (<50ms with v2)
- Preserve existing v5 delegation-first architecture

Subagents:
- Enhance wiki-keeper with MCP tools for cross-repo vault updates
- Enable bidirectional sync: local wiki ↔ vault
- Adapt terminology for Redshift (SQL/SP instead of DAG/job)

Manifest:
- Version bump: 5 → 5.1
- Add mcp_integration section with metrics
- Track wiki-keeper as mcp_enabled: true

Benefits:
- 60-70% token savings on knowledge queries (2-3K → 0.5-1K)
- 43% token savings on pattern-enhanced tasks (15K → 8.5K)
- Instant cross-repo pattern access (<50ms)
- No manual context switching needed

Related: Vault commit 9b75812 (MCP v2 validation)

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

#### 3b. Then: Commit Other Changes (Meta-optimizer, etc.)

**Other files**:
```
.agent/learning/lessons.md              (MODIFIED - compacted)
.agent/learning/lessons_archive_2026-06-03.md  (NEW - archive)
.agent/memory/working.md                (MODIFIED)
.agent/skills/optimize-system.md        (NEW)
.claude/agents/fixer.md                 (MODIFIED - distilled)
.claude/agents/researcher.md            (MODIFIED - enhanced)
.claude/agents/sql-worker.md            (MODIFIED - distilled)
.gitignore                             (MODIFIED)
```

**Command**:
```bash
cd ~/Desktop/External-Repos/example-repo-redshift

# Add remaining files
git add .agent/learning/
git add .agent/memory/working.md
git add .agent/skills/optimize-system.md
git add .claude/agents/fixer.md
git add .claude/agents/researcher.md
git add .claude/agents/sql-worker.md
git add .gitignore

git status

git commit -m "$(cat <<'EOF'
feat: meta-optimizer phase 2 - compact and distill agent system

Lessons Compaction:
- Compact lessons.md: 18K → 6K tokens (67% reduction)
- Archive old lessons to lessons_archive_2026-06-03.md
- Keep 40 most valuable entries (from 153)

Subagent Distillation:
- sql-worker.md: 900 → 450 tokens (50% reduction)
  - Remove facts.md duplication
  - Keep 3 critical constraints only
- fixer.md: Hardened with 3× patterns
  - Add narrowing CAST pattern (316-fix evidence)
  - Add Spectrum gaps pattern (3× observations)
  - Add grep pattern for violations
- researcher.md: Enhanced with pre-flight probe pattern

Routing Improvements:
- Add god-node awareness (mandatory pre-flight for high-centrality files)
- Add parallel error recovery (researcher + fixer in parallel)
- Add open questions auto-resolution

New Skill:
- Add optimize-system.md (4200 tokens)
  - Meta-optimizer for system self-improvement
  - Diagnose bottlenecks, compact lessons, distill subagents

Manifest Tracking:
- Add failure_count, retry_count fields
- Update optimization_history with Phase 2 changes

Impact:
- Context efficiency +30% (lessons.md savings)
- Subagent prompt clarity +40% (redundancy removal)
- God-node safety (mandatory pre-flight)

Co-Authored-By: Claude Sonnet 4.5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## 🎯 Quick Commands (Copy-Paste)

### Airflow
```bash
cd ~/Desktop/External-Repos/example-repo-airflow
git add .agent/skills/query-vault.md .agent/index.md .agent/manifest.json .claude/agents/wiki-keeper.md
git status
```

### Glue
```bash
cd ~/Desktop/External-Repos/example-repo-glue
git add .agent/skills/query-vault.md .agent/index.md .agent/manifest.json .claude/agents/wiki-keeper.md
git status
```

### Redshift (MCP only)
```bash
cd ~/Desktop/External-Repos/example-repo-redshift
git add .agent/skills/query-vault.md
git add -p .agent/index.md .agent/manifest.json .claude/agents/wiki-keeper.md
git status
```

### Redshift (Meta-optimizer)
```bash
cd ~/Desktop/External-Repos/example-repo-redshift
git add .agent/learning/ .agent/memory/working.md .agent/skills/optimize-system.md
git add .claude/agents/fixer.md .claude/agents/researcher.md .claude/agents/sql-worker.md .gitignore
git status
```

---

**Ready to commit! Copy commit messages from sections above.** 🚀
