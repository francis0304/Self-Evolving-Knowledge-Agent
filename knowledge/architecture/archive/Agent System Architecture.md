---
tags: [agent-system, architecture, components, delegation-first, v51]
created: 2026-06-05
updated: 2026-06-05
status: active
---

# Agent System Architecture Complete Guide

**Version**: v5 (redshift-reporting) / v4 (airflow, glue) / v1 (infra, sre)  
**Last Updated**: 2026-06-03

---

## 📐 System Architecture Overview

### Hierarchical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User / Claude Code                        │
│                  (发起任务，接收结果)                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│                  Main Agent (主协调器)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  • 读取 index.md (路由规则)                           │  │
│  │  • 匹配 intent → 加载 workflow skill                  │  │
│  │  • 决定 delegation 策略                               │  │
│  │  • 更新 working.md + lessons.md                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────┬─────────┬─────────┬─────────┬─────────┬─────────────┘
      │         │         │         │         │
┌─────▼───┐ ┌──▼────┐ ┌──▼────┐ ┌──▼────┐ ┌──▼────┐
│researcher│ │sql-   │ │fixer  │ │validator│ │wiki-  │
│(预检)    │ │worker │ │(修复) │ │(验证)  │ │keeper │
│         │ │(转换) │ │       │ │        │ │(文档) │
└─────────┘ └───────┘ └───────┘ └────────┘ └───────┘
    ↓            ↓         ↓          ↓          ↓
┌───────────────────────────────────────────────────────┐
│              Shared Resources (共享资源)               │
│  • facts.md (规则库)                                   │
│  • patterns.md (模式库)                                │
│  • graphify-out/graph.json (拓扑图)                    │
│  • knowledge/wiki/ (知识库)                            │
└───────────────────────────────────────────────────────┘
```

---

## 🔧 Core Components

### 1. Main Agent (主协调器)

**Role**: Orchestrator — routes requests, delegates work, maintains state

**Responsibilities**:
- Parse user intent (intent matching)
- Load corresponding workflow skill
- Delegate to subagents based on skill instructions
- Monitor subagent execution
- Synthesize results and present to user
- Update memory (working.md, lessons.md)

**What it does NOT do**:
- ❌ Write code directly (except <5 line trivial changes)
- ❌ Run validations directly
- ❌ Read large files directly (delegates to researcher)

**Key Files**:
```
.agent/
├── index.md              ← 路由规则（Main Agent 的"大脑"）
├── manifest.json         ← 版本、metrics
└── dispatch/dispatch.md  ← delegation 决策逻辑
```

---

### 2. Subagents (专业执行器)

#### 2.1 Researcher (研究员)

**Tools**: Read, Grep, Glob, Bash (只读)

**Purpose**:
- Pre-flight checks (verify dependencies)
- Pattern mining (find similar patterns)
- Data exploration (probe source row counts)

**Example**:
```
@agent-researcher 检查 vSOURCE.CustomerSetting 是否存在 CustomerId=12220 的行
```

**Enhancements (2026-06-03)**:
- Added pre-flight data probe pattern
- Reduced dormant validation case creation by 40%

---

#### 2.2 SQL-Worker (SQL 工作者)

**Tools**: Read, Edit, Write, Grep, Glob, Bash

**Purpose**:
- MSSQL → Redshift stored procedure conversion
- Write validation test cases
- Fix SQL syntax errors

**Core Rules** (from facts.md):
1. ROUND before narrowing CAST
2. Hardcode 'USD' in FX-rate lookups
3. NULLIF for division safety

**Optimization (2026-06-03)**:
- Prompt reduced from 900 tokens → 450 tokens (50% reduction)
- Facts.md duplication removed, replaced with references

---

#### 2.3 Fixer (修复专家)

**Tools**: Read, Edit, Grep, Glob, Bash

**Purpose**:
- Diagnose validation failures
- Fix DECIMAL precision issues
- Fix FX rate errors
- Handle Spectrum view data gaps

**Enhancement (2026-06-03)**:
- Evidence-based pattern matching (3× occurrences)
- Grep patterns: `CAST\(.*AS DECIMAL\(` without `ROUND\(`
- Higher auto-apply success rate

---

#### 2.4 Validator (验证器)

**Tools**: Read, Edit, Bash, Grep, Glob

**Purpose**:
- Run validation test cases
- Execute data comparisons
- Report PASS/FAIL/KNOWN-ISSUES

**Workflow**:
```
1. Run execute_redshift_sp.sql
2. Fetch redshift results
3. Fetch MSSQL reference results
4. Compare with comparator.py
5. Report: PASS / FAIL / PASS-with-known-issue
```

---

#### 2.5 Wiki-Keeper (知识管理员)

**Tools**: Read, Write, Edit, Grep, Glob + MCP (v5+)

**Purpose**:
- Create/update wiki pages
- Maintain cross-links
- Update index.md and log.md
- Sync to Obsidian Vault (via MCP)

**Rules**:
- Each page: ≥2 cross-links
- Mandatory: Sources section
- Update: index.md after changes

---

### 3. Workflow Skills (工作流技能)

**Location**: `.agent/skills/*.md`

**Purpose**: Translate user intent → specific subagent delegation instructions

#### Example Workflow

```
User: "migrate block M14 from RPT_OrderSummary"

Main Agent:
  1. Match intent → Load convert-sp-block.md skill
  2. Read skill instructions → Delegate to @agent-sql-worker
  3. sql-worker converts 140 lines → Returns confidence: 0.92
  4. Present result to user
  5. Update working.md
```

---

### 4. Memory System (记忆系统)

#### 4.1 Working Memory (.agent/memory/)

**working.md**: Last 5 tasks (rolling window)  
**facts.md**: Long-term knowledge & conventions  
**archive.md**: Historical tasks  

#### 4.2 Learning Loop (.agent/learning/)

**lessons.md**: Append-only experience log  
**patterns.md**: Reusable patterns (1× → 3× → facts.md)  
**feedback.md**: User corrections  
**changelog.md**: System modifications  

#### 4.3 Learning Promotion Flow

```
lessons (1×)  →  patterns (3×)  →  facts (hardened)
```

---

## 📂 Complete Directory Structure

### Repository Layout

```
repo-root/
│
├── .agent/                          ← Agent 系统配置
│   ├── index.md                     ← 🧠 Main routing table
│   ├── manifest.json                ← 📊 System metadata
│   ├── dispatch/
│   │   └── dispatch.md              ← 🎯 Delegation logic
│   ├── skills/                      ← 🛠️ Workflow skills
│   │   ├── convert-sp-block.md
│   │   ├── validate-migration.md
│   │   ├── fix-validation-diff.md
│   │   ├── update-wiki.md
│   │   ├── optimize-system.md
│   │   └── meta.md
│   ├── memory/                      ← 💾 Working state
│   │   ├── working.md
│   │   ├── facts.md
│   │   └── archive.md
│   └── learning/                    ← 🧠 Learning loop
│       ├── lessons.md
│       ├── patterns.md
│       ├── feedback.md
│       ├── changelog.md
│       └── lessons_archive_*.md
│
├── .claude/                         ← Claude Code 配置
│   ├── agents/                      ← 🤖 Subagent definitions
│   │   ├── researcher.md
│   │   ├── sql-worker.md
│   │   ├── fixer.md
│   │   ├── validator.md
│   │   └── wiki-keeper.md
│   └── settings.json                ← ⚙️ Claude Code config
│
├── knowledge/                       ← 📚 Knowledge Base
│   ├── raw/                         ← 📥 Source layer
│   │   └── (User-curated materials)
│   ├── wiki/                        ← 📝 Wiki layer
│   │   ├── index.md
│   │   ├── log.md
│   │   ├── _template.md
│   │   └── *.md (pages)
│   └── graphify-out/                ← 📊 Knowledge graph
│       ├── graph.json
│       ├── graph.html
│       └── GRAPH_REPORT.md
│
└── ... (source code, tests, etc)
```

---

## 🎯 Key Architectural Principles

### 1. Delegation-First (委派优先)

**Traditional**: Single agent with 40-50K context  
**Our Approach**: Main (10K) + specialized subagents (5-8K each)

**Benefits**:
- ✅ 80% context reduction
- ✅ Parallel execution
- ✅ Failure isolation
- ✅ Session continuity

---

### 2. Memory Layers (多层记忆)

| Layer | File | Scope | Lifespan |
|-------|------|-------|----------|
| Working | working.md | Last 5 tasks | Rolling |
| Rules | facts.md | Conventions | Long-term |
| Learning | lessons.md | Experiences | Append-only |
| Patterns | patterns.md | Recurring patterns | 3× threshold |

---

### 3. Intent-Driven Routing (意图驱动)

```
User Input
  ↓
Intent Matching (Keyword search)
  ↓
Skill Selection (from index.md)
  ↓
Delegation Strategy (from dispatch.md)
  ↓
Subagent Dispatch
  ↓
Result Synthesis
```

---

## 🔄 Example Workflow: Full Task

```
User: "Convert block M14 from RPT_OrderSummary and validate"

┌─────────────────────────────────────────────────────┐
│ PHASE 1: ANALYSIS (Main Agent)                      │
└─────────────────────────────────────────────────────┘

1. Parse intent
   - Keywords: "convert" + "validate"
   - Load skill: convert-sp-block.md

2. Read skill instructions:
   a. Pre-flight: Check view exists
   b. Convert: Delegate to @sql-worker
   c. Validate: Delegate to @validator
   d. If failed: Call @fixer (in parallel with reporter)

┌─────────────────────────────────────────────────────┐
│ PHASE 2: EXECUTION (Parallel Subagents)             │
└─────────────────────────────────────────────────────┘

@researcher (parallel):
  • Verify vSOURCE_M14 exists
  • Check: Are there sample rows?
  • Return: View exists, 523 rows

@sql-worker:
  • Load facts.md (top 3 rules)
  • Convert 140 lines MSSQL → Redshift
  • Apply ROUND, USD hardcode, NULLIF
  • Generate validation.sql
  • Return: 94% confidence

@validator (after sql-worker):
  • Execute redshift_sp.sql
  • Execute validation.sql
  • Compare results vs MSSQL reference
  • Return: PASS on rows 1-500, FAIL on row 501

@fixer (parallel with wiki-keeper):
  • Diagnose: DECIMAL precision mismatch
  • Examine logs: Similar "narrowing CAST" pattern
  • Fix: Add ROUND before CAST
  • Confidence: 0.88 (from patterns.md match)

@wiki-keeper (parallel):
  • Create page: M14 Conversion Details
  • Link to: RPT_OrderSummary, Redshift patterns
  • Add: Decision rationale, test results
  • Update: knowledge/wiki/index.md

┌─────────────────────────────────────────────────────┐
│ PHASE 3: SYNTHESIS (Main Agent)                     │
└─────────────────────────────────────────────────────┘

1. Collect results:
   - Pre-flight: ✅ Pass
   - Conversion: ✅ Pass (94% confidence)
   - Initial validation: ❌ Fail (1 row)
   - Fix applied: ✅ Pass (88% confidence)
   - Wiki: ✅ Created + linked

2. Format response:
   ✅ Block M14 migrated successfully
   
   Results:
   • 140 lines converted to Redshift
   • Confidence: 94% (conversion) + 88% (fix)
   • Validation: PASS (all 501 rows)
   • Documentation: [[M14 Conversion Details]]

3. Update memory:
   • working.md: Add task entry
   • lessons.md: Log success (confidence trend)
   • patterns.md: Update "narrowing CAST" pattern count
   • If pattern now 3×: promote to facts.md
```

---

## 📊 Performance Metrics

### Token Efficiency

| Approach | Tokens | Subagents | Context Reuse |
|----------|--------|-----------|---------------|
| Monolithic (old) | 40-50K | 1 | 0% |
| Main + Specialists (new) | 15-20K | 5 | 80%+ |
| **Reduction** | **60-75%** | — | — |

---

## 🔗 Related Documents

- [[Agent System Meta-Optimizer]] - Self-optimization mechanism
- [[Agent System Cost Optimization v5.1]] - Token efficiency strategy
- [[Agent System Self-Iteration - Current Status]] - Current state
- [[The Complete AI Ecosystem - Diagrams]] - Visual architecture

---

## 📚 Additional Resources

- **Getting Started**: `.agent/index.md`
- **Subagent Template**: `.claude/agents/_TEMPLATE.md`
- **Dispatch Logic**: `.agent/dispatch/dispatch.md`
- **Optimization Guide**: `.agent/learning/lessons.md`
