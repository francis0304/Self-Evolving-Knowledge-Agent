---
tags: [agent-system, architecture, self-evolution, autonomous-learning]
created: 2026-05-25
updated: 2026-06-05
status: active
version: v5.0
---

# Agent System Self-Iteration - Current Status

## Version: v5.0 (2026-06-05)

**Major Upgrade**: Autonomous Learning + Smart Knowledge Graph Refresh

## What Changed in v5.0

### 1. Autonomous Post-task Loop ✅
**Problem**: Agent completed complex tasks (10+ tool calls, errors fixed) but didn't autonomously update lessons.md. User had to explicitly remind.

**Root Cause**: Vague trigger language ("notable outcomes", "especially if") allowed agent to rationalize non-compliance.

**Solution**: 
- **Explicit quantifiable triggers** (≥5 tools, ≥3 files, any error+workaround)
- **Enforcement language**: "Do NOT wait for user reminder to run this loop. If you completed a task matching the trigger conditions above, the loop is MANDATORY even if the user didn't explicitly ask for documentation."

**Trigger Conditions** (any one):
1. Used ≥5 tool calls (complex enough to have patterns)
2. Encountered ANY Bash/tool error and found a workaround (reusable fix)
3. Spawned subagent(s) with confidence <0.8 but task succeeded (learning moment)
4. Produced a solution the user explicitly praised (feedback signal)
5. Modified ≥3 files or created new architectural components (significant change)
6. **Completed a graphify build/update** (triggers wiki update check)

**What Happens**:
1. Update `.agent/memory/working.md` (task log)
2. Append to `.agent/learning/lessons.md` (errors + workarounds, pitfalls, user corrections)
3. Resolve answerable rows in `.agent/memory/facts.md` §Open questions
4. **If graphify refresh** → run post-graphify wiki update trigger (NEW)
5. Trigger wiki-keeper for other notable findings
6. Log feedback on user 👍/👎/🔄

**Test Result**: This meta-task itself (10+ tools, 2 Edit errors, 4 files modified) auto-triggered Post-task loop ✓

---

### 2. Smart Graphify Refresh System ✅
**Problem**: Original graphify integration relied on manual memory: agent had to remember to check after ≥3 wiki edits or 14+ days. No automated tracking, no clear thresholds, costly to check.

**Solution**: Three-layer intelligent refresh system

#### Components
1. **GraphifyRefreshManager** (`scripts/graphify_refresh_manager.py`)
   - SHA256 file hashes stored in `.graphify_state.json`
   - Computes delta since last snapshot
   - Zero LLM cost

2. **Auto-export Hook** (`scripts/graphify_memory_export.py`)
   - PreToolUse:Read hook
   - Exports topology to `.claude/memory/graphify_topology.md` if graph newer than sentinel
   - Sentinel-guarded: <1ms when fresh

3. **Agent Skill** (`graphify-check.md`)
   - Session-start check
   - Parses exit code (0=OK, 1=recommend)
   - Formats user-facing message with reasons

#### Refresh Thresholds
| Threshold | Value | Rationale |
|---|---|---|
| `wiki_pages` | ≥3 | Wiki pages represent structural knowledge; 3+ changes indicate significant conceptual shifts |
| `python_modules` | ≥2 | Python modules are god nodes; 2+ changes likely alter community boundaries |
| `sp_files` | ≥1 | Stored procedure changes are rare but high-impact (god nodes #1 and #2 are SPs) |
| `age_days` | ≥14 | Force refresh after 2 weeks to catch drift |
| `total_changes` | ≥10 | Cumulative changes across all file types |

#### Workflow
**Session Start** (main agent runs automatically):
```bash
python scripts/graphify_refresh_manager.py --check
```
- Exit 0 → up-to-date, proceed silently
- Exit 1 → mention in greeting: "📊 Knowledge graph refresh recommended ([reasons]). Run `/graphify . --update` when convenient."

**Manual Refresh** (user decides when to spend tokens):
- User invokes `/graphify` or asks to "graph", "visualize", "map the codebase"
- After ingesting a raw source that touches ≥3 wiki pages
- After `--check` shows refresh recommended

**After Refresh** (MANDATORY):
```bash
python scripts/graphify_refresh_manager.py --snapshot  # Save new baseline
```

**Auto-Export**:
- Hook exports topology on first Read if graph newer than last export
- Fast path: <1ms when fresh (sentinel check only)

#### Cost Optimization
- **Code-only changes**: FREE (AST extraction, no LLM cost)
- **Doc/wiki changes**: PAID (LLM semantic extraction)

---

### 3. Post-graphify Wiki Update Trigger ✅
**Problem**: Graphify updates revealed structural insights (god node shifts, new connections, community evolution) but required manual user decision to update wiki. No automated check → insights stayed in GRAPH_REPORT.md, never integrated into searchable wiki.

**Solution**: Mandatory wiki update check after graphify refresh

#### Trigger Conditions (any one triggers user prompt)
1. **God nodes ranking changed** (top 3 shifted, new entrant in top 10)
2. **New surprising connection** with confidence ≥0.7 spanning 2+ communities
3. **New community detected** (community count increased)
4. **Community cohesion dropped** below 0.15 (fragmentation signal)

#### Automatic Skip Conditions (silent, no user prompt)
1. Top 3 god nodes unchanged → skip
2. All surprising connections <0.6 confidence → skip
3. Community count ±1 (normal churn) → skip
4. Cohesion change <0.05 → skip

#### Workflow
**After graphify build/update completes** (mandatory step in post-task loop):
1. Agent reads `graphify-out/GRAPH_REPORT.md` (God Nodes, Surprising Connections, Communities)
2. Evaluates trigger conditions
3. If ANY trigger → prompts user: "Graph update revealed [X]. Update wiki? (y/n)"
4. If approved → delegate to wiki-keeper with specific findings
5. If declined → log as deferred in `knowledge/wiki/log.md`

#### First Test (2026-06-05)
✅ Detected god node #3 change: comparator.py (14 edges → 8 edges, rank #9) → GraphifyRefreshManager (13 edges, rank #3)  
✅ Detected new connection: Multi-Modal Extraction Engine ↔ Hyperedge Support (0.7)  
✅ Prompted user → approved  
✅ Delegated to wiki-keeper → created 2 pages (`graphify-refresh-system.md`, `graphify-architecture.md`), updated 3 pages, added 6 cross-links  
✅ Logged to `knowledge/wiki/log.md`: `## [2026-06-05] wiki-update | graphify findings → 5 pages`

#### Why It Matters
Graphify is an expensive operation (semantic extraction, clustering, ~30K tokens per full run). Capturing insights into wiki ensures the investment compounds — future sessions leverage documented god nodes, surprising connections, and community structure rather than re-discovering them from raw GRAPH_REPORT.md.

**Closes the learning loop**: code changes → graphify detects structural shifts → wiki documents new patterns → agents reference patterns in future work.

---

## Behavioral Changes

### Before v5.0
- Agent waited for user reminder to update lessons.md
- Graphify refresh decision was manual (user had to remember thresholds)
- Graph insights stayed in GRAPH_REPORT.md (not wiki)
- Session-start was passive (no proactive checks)

### After v5.0
- Agent self-triggers post-task loop (autonomous documentation)
- Graphify refresh is threshold-based + session-start proactive check
- Graph insights automatically flow into wiki (wiki-keeper delegation)
- Session-start includes graph freshness check + user-facing recommendation

---

## God Node Status (Knowledge Graph)

**Current** (2026-06-05): 193 nodes, 326 edges, 14 communities

**Top 5 God Nodes**:
1. RPT_OrderSummary SP (19 edges) - unchanged
2. RPT_SalesByRegion_Online SP (16 edges) - unchanged
3. **GraphifyRefreshManager** (13 edges) ⭐ NEW entrant
4. cli_main (12 edges)
5. run_verification() (11 edges)

**Displacement**: `comparator.py` dropped from #3 (14 edges) → #9 (8 edges)

**Reason**: GraphifyRefreshManager is now central to:
- Change detection (file monitoring)
- Threshold evaluation (smart refresh logic)
- State persistence (.graphify_state.json)
- CLI interface (--check, --snapshot)
- Auto-export hooks (topology export)
- Session-start checks (proactive monitoring)

**Surprising Connection** (confidence 0.7):
- Multi-Modal Extraction Engine ↔ Hyperedge Support
- Both describe v5.0 extraction/modeling upgrades

**Hyperedges** (6 detected):
1. **Migration Validation Pipeline** (5 nodes, 0.95) - cli_main + comparator + connections
2. **SP Migration Pitfall Patterns** (5 nodes, 0.95) - CAST/ROUND, USD FX, funcFXRate
3. **Validation Suite Runners** (3 nodes, 0.90) - run_cases, run_payment_channel_tests, probe_zero_cases

---

## New Wiki Pages (v5.0)

1. **[graphify-refresh-system.md](../../../companies/current-company/projects/Redshift%20Reporting.md)** (2026-06-05)
   - Smart refresh architecture
   - Threshold logic + session-start checks
   - Auto-export hook + sentinel pattern
   - God node status (GraphifyRefreshManager #3)

2. **[graphify-architecture.md](../../../companies/current-company/projects/Redshift%20Reporting.md)** (2026-06-05)
   - Multi-modal extraction engine (AST + LLM semantic)
   - Hyperedge support (N-ary relationships)
   - Cost optimization (code changes free)
   - v5.0 upgrade context

---

## System Architecture Improvements

### Pattern: "Smart hook + dumb state file"
**Why it scales**:
- Hook runs often (every Read) → must be <1ms fast path
- State file captures expensive computation (file hashing) once → amortizes across many checks
- Superior to "LLM decides when to refresh" (expensive, inconsistent) or "user remembers to check" (unreliable)

### Pattern: Sentinel for conditional export
**`graphify-out/.memory_exported` timestamp**:
- Without sentinel: hook would be 50-100ms per Read (file IO)
- With sentinel: <1ms (stat only) when fresh

### Pattern: Threshold-based automation
**Quantifiable triggers** (≥5 tools, ≥3 files, ≥3 wiki pages):
- Testable and unambiguous
- Agent can't rationalize non-compliance
- Vague phrases like "notable outcomes" or "especially if" allow too much discretion

### Pattern: Enforcement language
**"Do NOT wait for user reminder"**:
- Explicit instructions + enforcement = autonomous behavior
- Without this, agent treats autonomous loops as "nice-to-have"

---

## Windows Development Fixes

### Unicode Encoding Issue
**Problem**: Python `print()` with Unicode (e.g., `→`) fails with `UnicodeEncodeError: 'charmap' codec can't encode character` on Windows PowerShell (cp1252 encoding).

**Fix**:
```python
import sys
import io

# At module level, wrap stdout/stderr in UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
```

**For file writes**:
```python
from pathlib import Path

Path('file.md').write_text(content, encoding='utf-8')
```

### NetworkX API Confusion
**Problem**: Existing `graphify-out/graph.json` uses `"links"` key (not `"edges"`), but NetworkX 3.x `node_link_graph()` expects `"edges"` by default.

**Fix**:
```python
import networkx as nx

# Load JSON
with open('graphify-out/graph.json') as f:
    data = json.load(f)

# Rename key before loading
if 'links' in data and 'edges' not in data:
    data['edges'] = data.pop('links')

G = nx.node_link_graph(data)
```

---

## Lessons for Agent System Design

### Autonomous behavior requires explicit triggers
- **Vague**: "Append notable outcomes to lessons.md (especially if subagent confidence was <0.8)"
- **Explicit**: "Used ≥5 tool calls | encountered ANY error | modified ≥3 files"

### High-cost analysis needs insight extraction hooks
**Pattern**: Expensive analysis (graphify, static analyzers, benchmarks) should trigger documentation/learning steps automatically.

**Without hook**: Expensive analysis becomes "one-time reports" instead of cumulative knowledge.

**With hook**: Insights compound across sessions → future work references patterns rather than re-discovering.

### Proactive checks improve UX
**Session-start graph freshness check**:
- User sees: "📊 Knowledge graph refresh recommended: • 4 wiki pages changed (threshold: 3) • Graph is 14 days old. Run `/graphify . --update` when convenient."
- User controls when to spend tokens (not auto-triggered)
- Zero cost when fresh (exit 0, silent)

---

## Deployment Status

### Redshift Reporting Repo (Primary Test Bed)
- ✅ v5.0 deployed (2026-06-05)
- ✅ All 3 improvements active (autonomous loop, smart refresh, wiki triggers)
- ✅ First real-world test passed (graphify update → wiki sync)
- ✅ God node #3 shift documented in wiki

### Cross-repo Rollout Plan
**Phase 1** (v5.0 stable in Redshift Reporting):
- Monitor for 2 weeks (10+ tasks)
- Collect metrics: autonomous trigger rate, false positives, wiki sync accuracy

**Phase 2** (rollout to sibling repos):
- Reporting API repo (simpler structure, good second test)
- DataGen repo (high churn, stress-test)
- Infrastructure repo (low agent activity, control group)

**Phase 3** (hub consolidation):
- Export lessons to `data-platform-engineer-agent/` hub
- Update `.github/skills/` canonical playbooks
- Archive local `.agent/learning/` to hub memory

---

## Open Questions

**Q1**: Should graphify refresh thresholds be tunable per repo?
- **Current**: Hardcoded in `GraphifyRefreshManager.THRESHOLDS`
- **Proposal**: Load from `.graphify_config.json` (optional override)
- **Decision**: Defer until Phase 2 rollout (wait for more data)

**Q2**: How to handle low-cohesion communities in wiki triggers?
- **Example**: Community 8 (cohesion 0.29) named "Report Generation" but contains graphify architecture nodes
- **Current**: Wiki trigger doesn't check cohesion (only community count change)
- **Proposal**: Add cohesion threshold (don't document if <0.20?)
- **Decision**: Monitor for 2 more refreshes, then decide

**Q3**: Should autonomous post-task loop log to user-facing output?
- **Current**: Silent (agent updates files, no user message unless error)
- **User feedback**: "我觉得应该是.agent系统里也就是刚刚的对话自主触发的而不是我提醒" (expects it to happen, but doesn't need to see it)
- **Proposal**: Add optional `--verbose` flag to show "✅ Updated lessons.md" messages
- **Decision**: Keep silent for now (user trusts it happens, doesn't want noise)

---

## Related

- [[Redshift Reporting|companies/current-company/projects/Redshift Reporting]] - Primary deployment repo
- [[Agent System Architecture Overview]] - v4 delegation-first design
- [[AI Agent System - Presentation]] - Team presentation on v4
- [[Agent System Meta-Optimizer]] - Future v6 direction (self-optimization)

---

## Version History

- **v5.0** (2026-06-05): Autonomous post-task loop + smart graphify refresh + wiki triggers
- **v4.0** (2026-05-25): Delegation-first architecture (5 subagents)
- **v3.0** (2026-04): LLM-Wiki pattern + graphify baseline
- **v2.0** (2026-03): Skill-based routing + memory system
- **v1.0** (2025-12): Monolithic agent + basic task tracking
