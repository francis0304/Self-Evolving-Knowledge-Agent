# .agent 系统组件深度解析

**目的：** 理清每个文件/目录的作用，以及它们如何协作

---

## 🗂️ 完整目录结构与职责

```
repo-root/
│
├── .agent/                          ← Agent 系统配置（Main Agent 的"操作手册"）
│   │
│   ├── index.md                     ← 🧠 主路由表（最重要！）
│   │   职责：
│   │   • 定义 skill 触发规则（用户说什么 → 加载哪个 skill）
│   │   • 定义 delegation 规则（skill → 委派给哪个 subagent）
│   │   • 定义 routing 策略（god-node awareness, error recovery）
│   │   • Main Agent 每次任务都会先读这个文件
│   │   何时修改：
│   │   • 添加新 skill
│   │   • 添加新 routing rule
│   │   • 调整 delegation 策略
│   │
│   ├── manifest.json                ← 📊 系统元数据
│   │   职责：
│   │   • 记录版本号（v4, v5）
│   │   • 记录每个 skill 的 tokens, hit_count, confidence
│   │   • 记录每个 subagent 的 tokens, invocations, failure_count
│   │   • 记录 optimization_history
│   │   何时修改：
│   │   • 版本升级（v4 → v5）
│   │   • 添加新 skill/subagent
│   │   • Meta-optimizer 运行后
│   │   谁修改：Main Agent (post-task), Meta-optimizer
│   │
│   ├── IMPLEMENTATION.md            ← 📝 设计文档（已归档）
│   │   职责：记录 v4 架构设计决策（历史参考，不加载）
│   │   状态：⚠️ ARCHIVED SPEC
│   │
│   ├── dispatch/
│   │   └── dispatch.md              ← 🎯 委派决策逻辑
│   │       职责：
│   │       • 解释何时使用 subagents
│   │       • 解释并行 vs 串行委派
│   │       • Error recovery pattern 详细说明
│   │       • @-mention 语法说明
│   │       何时加载：Main Agent 需要理解 delegation 策略时
│   │       谁读取：Main Agent（按需）
│   │
│   ├── skills/                      ← 🛠️ Workflow 技能库
│   │   │
│   │   ├── convert-sp-block.md      ← Skill: MSSQL → Redshift 转换
│   │   │   职责：
│   │   │   • 定义转换工作流（pre-flight → convert → validate）
│   │   │   • 指定委派给 @agent-sql-worker
│   │   │   • 定义成功标准
│   │   │   何时加载：user intent = "migrate, convert, port"
│   │   │   谁执行：Main Agent 加载 → 按指令委派 subagent
│   │   │
│   │   ├── validate-migration.md    ← Skill: 运行验证对比
│   │   │   职责：委派给 @agent-validator
│   │   │   何时加载：user intent = "validate, test"
│   │   │
│   │   ├── fix-validation-diff.md   ← Skill: 修复验证差异
│   │   │   职责：委派给 @agent-fixer（可能并行 researcher）
│   │   │   何时加载：user intent = "fix diff, debug FAIL"
│   │   │
│   │   ├── update-wiki.md           ← Skill: 更新知识库
│   │   │   职责：委派给 @agent-wiki-keeper
│   │   │   何时加载：user intent = "update wiki, document"
│   │   │
│   │   ├── optimize-system.md       ← ⭐ Skill: 系统优化（v5 新增）
│   │   │   职责：
│   │   │   • 8-step 优化协议
│   │   │   • 压缩 lessons.md
│   │   │   • 优化 subagent prompts
│   │   │   • 增强 routing rules
│   │   │   何时加载：user 输入 "/optimize-system" 或 monthly trigger
│   │   │   谁执行：Main Agent 自己（不委派）
│   │   │
│   │   └── meta.md                  ← Skill: 系统审计
│   │       职责：回顾分析、export-back proposals
│   │       何时加载：user intent = "improve agent, audit"
│   │
│   ├── memory/                      ← 💾 工作记忆（短期状态）
│   │   │
│   │   ├── working.md               ← 📌 最近 5 个任务
│   │   │   职责：
│   │   │   • 记录 Active task（目标、结果、委派的 subagent、文件修改）
│   │   │   • 滚动窗口：满 5 个后，最老的 → archive.md
│   │   │   何时更新：每个任务完成后
│   │   │   谁更新：Main Agent（post-task loop）
│   │   │   何时读取：Main Agent 需要了解 recent context
│   │   │
│   │   ├── facts.md                 ← 📚 规则库（长期知识）
│   │   │   职责：
│   │   │   • 稳定的、慢变的真理
│   │   │   • Stack, Conventions, Critical migration rules
│   │   │   • Forbidden patterns
│   │   │   • Open questions（待解决）
│   │   │   何时更新：从 lessons.md 提升（3× pattern）
│   │   │   谁更新：Main Agent（手动）或 Meta-optimizer（自动）
│   │   │   何时读取：
│   │   │   • Main Agent 加载到所有 subagents
│   │   │   • Subagents 每次启动都读
│   │   │   ⚠️ 非常重要：这是 subagents 的"圣经"
│   │   │
│   │   └── archive.md               ← 🗄️ 历史归档
│   │       职责：存储从 working.md 滚出的任务
│   │       何时更新：working.md 满 5 个时
│   │       谁更新：Main Agent
│   │
│   └── learning/                    ← 🧠 学习循环（持续改进）
│       │
│       ├── lessons.md               ← 📖 学习日志（append-only）
│       │   职责：
│       │   • 记录每个任务的 wins, mistakes, insights
│       │   • Append-only（追加式，不修改过去的 entries）
│       │   • 格式：[YYYY-MM-DD HH:MM] <type> | <task> — <lesson>
│       │   何时更新：每个任务完成后
│       │   谁更新：Main Agent（post-task loop）
│       │   何时压缩：Meta-optimizer（3× pattern → facts.md）
│       │   ⚠️ 问题：会无限增长（v5 前 18K tokens）
│       │   ✅ 解决：Meta-optimizer 自动压缩到 6K
│       │
│       ├── patterns.md              ← 🔍 模式追踪
│       │   职责：
│       │   • 追踪重复出现的 patterns（seen 1×, 2×, 3×）
│       │   • 标记 confidence（high/medium/low）
│       │   • 标记 status（tracking / candidate / promoted）
│       │   何时更新：
│       │   • Main Agent 发现重复 lesson
│       │   • Retrospective 扫描 lessons.md
│       │   何时提升：3× + high confidence → facts.md
│       │   谁更新：Main Agent（手动）或 Meta-optimizer
│       │
│       ├── feedback.md              ← 👍👎 用户反馈
│       │   职责：
│       │   • 记录用户 👍/👎/🔄 信号
│       │   • 记录 agent 问用户的问题（重复问题 → 规则化）
│       │   何时更新：用户给反馈后
│       │   谁更新：Main Agent
│       │   用途：调整 skill confidence, 发现 gaps
│       │
│       ├── retrospective.md         ← 🔬 周期回顾
│       │   职责：
│       │   • 每周/月 回顾分析
│       │   • Pattern scan（发现 3× patterns）
│       │   • Skill audit（hit_count, confidence）
│       │   • Export-back proposals
│       │   何时更新：手动触发或 meta skill
│       │   谁更新：Main Agent
│       │
│       ├── changelog.md             ← 📋 变更日志
│       │   职责：记录 skill/wiki/agent 系统的变更
│       │   何时更新：修改 skill, subagent, 或 wiki 后
│       │   谁更新：Main Agent（post-task）
│       │
│       └── lessons_archive_*.md     ← 🗃️ 压缩归档
│           职责：Meta-optimizer 压缩后的原始 lessons.md
│           何时创建：Meta-optimizer 运行时
│           谁创建：Meta-optimizer
│
├── .claude/                         ← Claude Code 配置
│   │
│   ├── agents/                      ← 🤖 Subagent 定义
│   │   │
│   │   ├── researcher.md            ← Subagent: 研究员
│   │   │   职责：
│   │   │   • Read-only 探索
│   │   │   • Pre-flight checks
│   │   │   • Pattern mining
│   │   │   • Data probe（v5 新增）
│   │   │   工具：Read, Grep, Glob, Bash（只读）
│   │   │   加载内容：facts.md
│   │   │   何时使用：
│   │   │   • 任务涉及 >5 files
│   │   │   • 任务涉及 god-node files
│   │   │   • 需要 pre-flight check
│   │   │
│   │   ├── sql-worker.md            ← Subagent: SQL 转换器
│   │   │   职责：
│   │   │   • MSSQL → Redshift 转换
│   │   │   • Validation case authoring
│   │   │   • SQL syntax fixes
│   │   │   工具：Read, Edit, Write, Grep, Glob, Bash
│   │   │   加载内容：facts.md（v5 优化：只引用 top 3 rules）
│   │   │   何时使用：convert-sp-block skill 委派
│   │   │
│   │   ├── fixer.md                 ← Subagent: 修复专家
│   │   │   职责：
│   │   │   • 诊断 validation 失败
│   │   │   • 修复 DECIMAL precision, FX rate, Spectrum gaps
│   │   │   • 提供 confidence score
│   │   │   工具：Read, Edit, Grep, Glob, Bash
│   │   │   加载内容：facts.md + lessons.md (pattern matching)
│   │   │   何时使用：
│   │   │   • fix-validation-diff skill
│   │   │   • Error recovery（并行 researcher）
│   │   │   v5 增强：evidence-based guardrails
│   │   │
│   │   ├── validator.md             ← Subagent: 验证器
│   │   │   职责：
│   │   │   • 运行 validation cases
│   │   │   • 执行 comparator
│   │   │   • 报告 PASS/FAIL
│   │   │   工具：Read, Edit, Bash, Grep, Glob
│   │   │   加载内容：facts.md
│   │   │   何时使用：validate-migration skill
│   │   │
│   │   └── wiki-keeper.md           ← Subagent: 知识管理员
│   │       职责：
│   │       • 创建/更新 wiki pages
│   │       • 维护 cross-links
│   │       • 更新 index.md, log.md
│   │       工具：Read, Write, Edit, Grep, Glob
│   │       加载内容：knowledge/wiki/_template.md
│   │       何时使用：
│   │       • update-wiki skill
│   │       • 任务完成后有 notable findings
│   │
│   └── settings.json                ← ⚙️ Claude Code 设置
│       职责：
│       • 权限配置（auto-allow tools）
│       • Hooks 配置（PreToolUse, PostToolUse）
│       • Model 配置
│       示例 hooks：
│       {
│         "hooks": {
│           "PreToolUse": {
│             "Read": [
│               "python scripts/graphify_memory_export.py"
│             ]
│           }
│         }
│       }
│
├── knowledge/                       ← 📚 Knowledge Base（LLM-Wiki pattern）
│   │
│   ├── raw/                         ← 📥 Source Layer（用户策展）
│   │   职责：
│   │   • 用户添加的原始材料
│   │   • Papers, screenshots, notes
│   │   • LLM 只读，不修改
│   │   何时添加：用户手动放入
│   │   何时处理：wiki-keeper ingest
│   │
│   └── wiki/                        ← 📝 Wiki Layer（LLM 拥有）
│       │
│       ├── index.md                 ← 🗂️ Wiki 目录
│       │   职责：所有 wiki pages 的 catalog
│       │   格式：- [Title](file.md) — one-line summary + tags
│       │   何时更新：创建新 page 后
│       │   谁更新：wiki-keeper
│       │
│       ├── log.md                   ← 📅 时间线
│       │   职责：Append-only chronology
│       │   格式：## [YYYY-MM-DD] <type> | <action> → <pages>
│       │   何时更新：ingest, query, lint, graphify
│       │   谁更新：wiki-keeper
│       │
│       ├── _template.md             ← 📋 Page 模板
│       │   职责：定义 wiki page 的必需结构
│       │   包含：Frontmatter, Summary, Sections, Sources, Related
│       │   何时使用：wiki-keeper 创建新 page 时
│       │
│       └── *.md                     ← 📄 Wiki Pages
│           职责：解释概念、架构、决策
│           规则：
│           • ≥2 cross-links
│           • Sources section（引用 raw/ 或 code）
│           • No rules（rules → facts.md）
│           何时更新：
│           • 用户添加 raw/ 文件后 ingest
│           • 任务完成后有 notable findings
│           谁更新：wiki-keeper
│
├── graphify-out/                    ← 📊 Knowledge Graph
│   │
│   ├── graph.json                   ← 🕸️ 原始图数据
│   │   职责：
│   │   • Nodes (entities), Edges (relationships)
│   │   • Community assignments
│   │   • Confidence scores
│   │   何时生成：/graphify . 或 /graphify . --update
│   │   谁使用：Main Agent (god-node routing), graphify query
│   │
│   ├── graph.html                   ← 🎨 交互式可视化
│   │   职责：浏览器查看图
│   │   何时生成：/graphify . 后
│   │
│   ├── GRAPH_REPORT.md              ← 📈 分析报告
│   │   职责：
│   │   • God nodes (高连接度)
│   │   • Communities (模块聚类)
│   │   • Surprising connections (跨社区桥接)
│   │   • Suggested questions
│   │   何时生成：/graphify . 后
│   │
│   ├── .memory_exported             ← 🏷️ Sentinel（已导出标记）
│   │   职责：记录上次导出到 memory 的时间
│   │   用途：避免重复导出（sentinel 机制）
│   │   何时更新：graphify_memory_export.py 运行后
│   │
│   └── cache/                       ← 💾 Extraction cache
│       职责：缓存已处理文件的 extraction 结果
│       用途：/graphify . --update 时跳过未变化文件
│
├── scripts/                         ← 🔧 Automation Scripts
│   │
│   └── graphify_memory_export.py    ← 🔄 Auto-export to memory
│       职责：
│       • 从 graphify-out/graph.json 提取 god nodes
│       • 导出到 ~/.claude/projects/.../memory/graphify_topology.md
│       • Sentinel 机制（只在 graph 更新时 re-export）
│       何时运行：
│       • PreToolUse hook (首次 Read tool)
│       • 手动：python scripts/graphify_memory_export.py
│       输出位置：~/.claude/projects/<repo-hash>/memory/
│
├── CLAUDE.md                        ← 📖 Repo-Specific 指令
│   职责：
│   • Load order（什么时候加载什么）
│   • Cheap path vs Full path
│   • Post-task loop
│   • Agent architecture 说明
│   • Repo-specific context（essential commands, architecture）
│   何时加载：每次 session 开始
│   谁加载：Claude Code 自动
│
└── (其他 repo 文件...)
```

---

## 🔄 数据流向（核心交互）

### 流程 1：任务启动 → 委派 → 执行

```
1. User: "Convert block M14"
        ↓
2. Main Agent 启动
        ↓
3. 读取 CLAUDE.md（repo-specific 指令）
        ↓
4. 读取 .agent/index.md（路由表）
        ↓ (intent match: "convert")
5. 加载 .agent/skills/convert-sp-block.md
        ↓
6. Skill 指令：delegate to @agent-sql-worker
        ↓
7. Main Agent 使用 Agent tool 生成新 session
   参数：
   - subagent_type: (from .claude/agents/sql-worker.md)
   - prompt: "Convert MSSQL block M14 to Redshift..."
        ↓
8. sql-worker session 启动
        ↓
9. sql-worker 自动加载：
   - .claude/agents/sql-worker.md (system prompt)
   - .agent/memory/facts.md (规则库)
   - CLAUDE.md (repo context)
        ↓
10. sql-worker 执行：
    - Read MSSQL source file
    - Apply conversion rules (from facts.md)
    - Write Redshift file
    - Return summary + confidence
        ↓
11. Main Agent 接收 sql-worker 返回值
        ↓
12. Main Agent 呈现结果给 User
```

---

### 流程 2：任务完成 → 记忆更新

```
1. 任务完成（success or failure）
        ↓
2. Main Agent: Post-task loop
        ↓
3. 更新 .agent/memory/working.md
   - 添加新 Active task entry
   - 如果已有 5 个 → 最老的移到 archive.md
        ↓
4. 追加到 .agent/learning/lessons.md
   - 格式：[2026-06-03] win | M14 conversion — applied narrowing CAST rule
        ↓
5. 检查 .agent/memory/facts.md §Open questions
   - 如果任务回答了某个 open question → 移动到相应 section，删除 open question 行
        ↓
6. 如果有 notable findings：
   - 委派给 @agent-wiki-keeper
   - wiki-keeper 更新 knowledge/wiki/*.md
        ↓
7. 更新 .agent/manifest.json
   - Increment skill hit_count
   - Update subagent invocations
```

---

### 流程 3：学习循环（Pattern Promotion）

```
1. 多个任务积累 lessons
        ↓
2. lessons.md 中某个 pattern 出现 3×
   示例：
   - [2026-05-04] win | NonMoontonReload — narrowing CAST needs ROUND
   - [2026-05-04] win | 3rdPartyChannel — CAST precision loss
   - [2026-05-07] win | Static audit — narrowing CAST generalization
        ↓
3. Retrospective 或 Meta-optimizer 扫描 patterns.md
        ↓
4. 发现 "narrowing CAST" = 3× + high confidence
        ↓
5. Promote to .agent/memory/facts.md
   添加 rule：
   "Narrowing CAST always needs ROUND — applies to ANY scale reduction"
        ↓
6. 删除 lessons.md 中的 3 个重复 entries
        ↓
7. 更新 .agent/learning/patterns.md
   状态：tracking → promoted ✅
        ↓
8. (可选) Export-back to .github/skills/ (跨 repo 共享)
```

---

### 流程 4：Error Recovery（并行模式）

```
1. Validation FAIL: 2 row diff
        ↓
2. Main Agent 检测到 error
        ↓
3. Main Agent 读取 .agent/index.md routing rule #11:
   "Error recovery: dispatch researcher + fixer in parallel"
        ↓
4. Main Agent 并行委派（同一个 message，2 个 Agent tool calls）:
   ├─ @agent-researcher
   │  - Search .agent/learning/lessons.md for "row diff"
   │  - Search .agent/learning/patterns.md
   │  - Return: Found "narrowing CAST" pattern (3×)
   │
   └─ @agent-fixer
      - Read diff log
      - Diagnose: DECIMAL precision mismatch
      - Propose fix: ROUND before CAST
      - Confidence: HIGH
        ↓
5. Main Agent 接收两者结果
        ↓
6. 决策逻辑：
   IF fixer.confidence = HIGH
      AND researcher.found_matching_pattern
   THEN auto-apply fix + log to lessons.md
   ELSE escalate to user
        ↓
7. Auto-apply: Edit file with ROUND
        ↓
8. 追加到 lessons.md:
   [2026-06-03] ERROR-RECOVERY | M14 validation — auto-applied narrowing CAST fix (confidence: HIGH, pattern: 3×)
```

---

### 流程 5：Meta-Optimizer（系统自优化）

```
1. Trigger: /optimize-system OR lessons.md > 8K OR monthly
        ↓
2. Main Agent 加载 .agent/skills/optimize-system.md
        ↓
3. Step 1: Diagnose
   - Read .agent/learning/lessons.md → 153 entries, 18K tokens ⚠️
   - Read .agent/learning/patterns.md → 4 patterns at 3× not promoted ⚠️
   - Read .claude/agents/sql-worker.md → 900 tokens, 38 lines duplicate facts.md ⚠️
        ↓
4. Step 2: Compact lessons.md
   - 提升 4 patterns to .agent/memory/facts.md
   - Archive entries >30 days to lessons_archive_2026-06-03.md
   - Merge 8 "PASS" entries → 1 summary
   - Result: 40 entries, 6K tokens ✅
        ↓
5. Step 3: Distill subagents
   - Edit .claude/agents/sql-worker.md
   - Remove 38 lines of facts.md duplication
   - Add "Reference facts.md for full rules"
   - Result: 450 tokens ✅
        ↓
6. Step 4: Harden guardrails
   - Edit .claude/agents/fixer.md
   - Add evidence: "Pattern seen 3× (cite lesson IDs)"
   - Add grep pattern: CAST\(.*AS DECIMAL\( without ROUND\(
   - Result: +evidence-based ✅
        ↓
7. Step 5: Enhance routing
   - Edit .agent/index.md
   - Add rule #3: God-node awareness
   - Add rule #11: Error recovery pattern
   - Result: routing updated ✅
        ↓
8. Step 6: Update manifest
   - Edit .agent/manifest.json
   - version: v4 → v5
   - Add failure_count, retry_count fields
   - Append optimization_history entry
        ↓
9. Step 7: Generate reports
   - Write OPTIMIZATION_REPORT_2026-06-03.md
   - Write META_LESSONS_2026-06-03.md
        ↓
10. 呈现 summary 给 user
```

---

### 流程 6: Graphify Integration

```
1. User: /graphify . (首次)
        ↓
2. graphify 分析代码 + docs
        ↓
3. 生成输出：
   - graphify-out/graph.json (原始数据)
   - graphify-out/graph.html (可视化)
   - graphify-out/GRAPH_REPORT.md (分析报告)
        ↓
4. scripts/graphify_memory_export.py 自动触发
   (via PreToolUse hook on next Read)
        ↓
5. 提取 god nodes, communities, surprises
        ↓
6. 导出到 ~/.claude/projects/.../memory/graphify_topology.md
        ↓
7. 更新 ~/.claude/projects/.../memory/MEMORY.md (index)
        ↓
8. 写入 sentinel: graphify-out/.memory_exported
        ↓
9. Main Agent 下次任务时自动加载 graphify_topology.md
        ↓
10. Main Agent 使用 god-node 信息：
    - 任务涉及 RPT_OrderSummary.sql (19 edges)
    - 触发 routing rule #3: 强制 @agent-researcher pre-flight
```

---

## 🧩 关键关系图

### 1. Main Agent 的"决策链"

```
CLAUDE.md (项目上下文)
    ↓ (加载)
.agent/index.md (路由表)
    ↓ (匹配 intent)
.agent/skills/*.md (workflow)
    ↓ (delegation 指令)
.claude/agents/*.md (subagent prompt)
    ↓ (加载规则)
.agent/memory/facts.md (规则库)
```

**每一层的作用：**
- CLAUDE.md：告诉 Main Agent "这是什么项目，怎么工作"
- index.md：告诉 Main Agent "用户说 X，你该做 Y"
- skills/*.md：告诉 Main Agent "做 Y 的具体步骤是 Z"
- agents/*.md：告诉 Subagent "你是谁，你的工具和规则是什么"
- facts.md：告诉 Subagent "这些是不能违反的规则"

---

### 2. Memory System 的"流动"

```
工作记忆 (短期)               学习记忆 (中期)              知识库 (长期)
──────────────              ──────────────              ──────────
working.md                  lessons.md                  facts.md
(最近 5 任务)                 (追加式日志)                 (规则)
    ↓ (滚动)                     ↓ (3× 提升)                  ↓ (引用)
archive.md                  patterns.md                 Subagents
(历史归档)                    (追踪重复)                    (执行)
                                ↓ (可选)
                            .github/skills/
                            (跨 repo 共享)
```

**流动规则：**
- working.md → archive.md：满 5 个任务时
- lessons.md → patterns.md：发现重复时（手动或 retrospective）
- patterns.md → facts.md：3× + high confidence
- facts.md → .github/skills/：值得跨 repo 共享时（export-back）

---

### 3. Subagent 的"知识来源"

```
Subagent 启动时自动加载：
┌─────────────────────────────────────────┐
│ 1. .claude/agents/<name>.md             │ ← System prompt (我是谁)
│ 2. .agent/memory/facts.md               │ ← Rules (必须遵守)
│ 3. CLAUDE.md                            │ ← Repo context (项目背景)
│ 4. ~/.claude/.../memory/*.md (optional) │ ← Graphify topology, vault patterns
└─────────────────────────────────────────┘

Subagent 按需读取：
┌─────────────────────────────────────────┐
│ 5. knowledge/wiki/*.md                   │ ← Domain knowledge (需要时)
│ 6. .agent/learning/lessons.md           │ ← Historical patterns (fixer 用)
│ 7. Source code files                    │ ← Task-specific (当前任务)
└─────────────────────────────────────────┘
```

**加载优先级：**
1. **Always load (自动):** agents/*.md, facts.md, CLAUDE.md
2. **Load if exists (条件):** memory/graphify_topology.md, memory/vault_*.md
3. **Load on-demand (按需):** wiki/*.md, lessons.md, source files

---

### 4. Skills vs Subagents 的"分工"

```
Skill (Workflow 定义)              Subagent (执行器)
────────────────                  ──────────────
定义"做什么"                        定义"怎么做"
• Pre-flight 需要吗？               • 我有什么工具？
• 谁来执行？                        • 我的规则是什么？
• 串行还是并行？                    • 我如何报告结果？
• 成功标准是什么？                  • 我的 confidence 如何判断？

示例：                             示例：
convert-sp-block.md               sql-worker.md
├─ Step 1: @agent-researcher     "You are an expert in MSSQL→Redshift.
├─ Step 2: @agent-sql-worker      Tools: Read, Edit, Write, Grep, Glob, Bash
├─ Step 3: @agent-validator       Apply rules from facts.md:
└─ Success: PASS validation       1. ROUND before narrowing CAST
                                  2. Hardcode 'USD' in FX lookups
                                  3. NULLIF for division safety"
```

**关系：**
- Skill = 剧本（告诉 Main Agent 剧情走向）
- Subagent = 演员（告诉演员如何演好这个角色）
- Main Agent = 导演（根据剧本指挥演员）

---

## 📝 谁负责什么（职责矩阵）

| 文件/目录 | 读取者 | 修改者 | 修改时机 | 修改频率 |
|-----------|--------|--------|----------|----------|
| **CLAUDE.md** | Main Agent | Human | 架构变更 | 低（月）|
| **.agent/index.md** | Main Agent | Human / Meta-optimizer | 添加 skill/routing rule | 中（周）|
| **.agent/manifest.json** | Main Agent | Main Agent / Meta-optimizer | 任务完成 / 优化 | 高（天）|
| **.agent/skills/*.md** | Main Agent | Human | 创建新 workflow | 中（周）|
| **.agent/memory/working.md** | Main Agent | Main Agent | 每个任务后 | 高（天）|
| **.agent/memory/facts.md** | Main + All Subagents | Main Agent / Meta-optimizer | 3× pattern 提升 | 低（月）|
| **.agent/memory/archive.md** | (Rare) | Main Agent | working.md 满 5 个 | 中（周）|
| **.agent/learning/lessons.md** | Main + Fixer | Main Agent | 每个任务后 | 高（天）|
| **.agent/learning/patterns.md** | Main Agent | Main Agent / Meta-optimizer | 发现重复 | 中（周）|
| **.agent/learning/feedback.md** | Main Agent | Main Agent | 用户反馈后 | 低（周）|
| **.agent/learning/changelog.md** | (Reference) | Main Agent | Skill/wiki 变更 | 中（周）|
| **.claude/agents/*.md** | Subagents | Human / Meta-optimizer | Subagent 定义变更 | 低（月）|
| **.claude/settings.json** | Claude Code | Human | Hook/permission 配置 | 低（月）|
| **knowledge/raw/*.md** | wiki-keeper | Human | 添加 source material | 低（周）|
| **knowledge/wiki/*.md** | wiki-keeper + (Optional) Subagents | wiki-keeper | Ingest / notable findings | 中（周）|
| **graphify-out/graph.json** | Main Agent (god-node routing) | graphify tool | /graphify 运行 | 低（月）|
| **graphify-out/.memory_exported** | graphify_memory_export.py | graphify_memory_export.py | Graph 更新后 | 低（月）|
| **scripts/*.py** | Claude Code hooks | Human | 添加 automation | 低（月）|

---

## 🎯 设计哲学

### 1. **Separation of Concerns（关注点分离）**

- **CLAUDE.md** — 项目知识（"这个 repo 是干什么的"）
- **index.md** — 路由逻辑（"用户说 X，做 Y"）
- **skills/*.md** — 工作流（"做 Y 的步骤"）
- **agents/*.md** — 能力定义（"执行者的工具和规则"）
- **facts.md** — 规则库（"不可违反的真理"）
- **lessons.md** — 学习日志（"我们学到了什么"）

### 2. **Append-Only → Compaction（追加后压缩）**

- **Append-only:** lessons.md（不修改历史，只追加）
- **Compaction:** Meta-optimizer（3× pattern → facts.md，删除重复）
- **好处:** 不会丢失历史，但也不会无限增长

### 3. **Load What You Need（按需加载）**

- **Always load:** CLAUDE.md, index.md, facts.md
- **Load on intent match:** skills/*.md
- **Load in subagent:** agents/*.md, facts.md
- **Load on-demand:** wiki/*.md, lessons.md (fixer only)

### 4. **Delegation-First（委派优先）**

- **Main Agent = 指挥官**（不执行细节）
- **Subagents = 专家**（执行具体任务）
- **好处:** Context 干净，并行化，失败隔离

### 5. **Evidence-Based（证据驱动）**

- **Pattern 必须 3×** 才提升到 facts.md
- **Guardrail 必须引用 lesson IDs**
- **Confidence 必须基于历史数据**
- **好处:** 避免 false positives，提高 auto-apply 成功率

---

## 💡 关键洞察

### 1. **facts.md 是 Subagents 的"圣经"**

- 所有 subagents 启动时都加载它
- 它是 "source of truth" for rules
- v5 优化：subagent prompts 只引用 facts.md，不重复内容

### 2. **index.md 是 Main Agent 的"大脑"**

- 每个任务都先读它
- 它决定 "用户意图 → skill → subagent" 的整个流程
- 修改它 = 修改系统行为

### 3. **lessons.md 是系统的"成长日志"**

- Append-only（追加式）
- 3× pattern → 提升到 facts.md
- v5 前问题：无限增长（18K tokens）
- v5 解决：Meta-optimizer 自动压缩（67% reduction）

### 4. **Skills 定义"做什么"，Subagents 定义"怎么做"**

- Skill = 剧本（workflow）
- Subagent = 演员（execution）
- Main Agent = 导演（orchestration）

### 5. **Memory System 有 3 个层级**

- **短期（working.md）:** 最近 5 任务，滚动窗口
- **中期（lessons.md, patterns.md）:** 学习日志，追踪重复
- **长期（facts.md）:** 规则库，稳定真理

---

## 🚀 现在清楚了吗？

现在你应该能回答这些问题：

1. ✅ 用户输入 "convert block M14"，系统如何找到 sql-worker？
   - index.md (intent match) → skills/convert-sp-block.md → delegate to sql-worker

2. ✅ sql-worker 启动时加载了什么？
   - agents/sql-worker.md, facts.md, CLAUDE.md

3. ✅ 任务完成后，Main Agent 做什么？
   - 更新 working.md, 追加到 lessons.md, 检查 open questions, 可能委派 wiki-keeper

4. ✅ lessons.md 如何变成 facts.md？
   - 3× pattern → patterns.md (tracking) → facts.md (promote) → delete from lessons.md

5. ✅ Meta-optimizer 做什么？
   - Compact lessons.md, distill subagents, harden guardrails, enhance routing, update manifest

6. ✅ Graphify 如何集成？
   - graph.json → graphify_memory_export.py → memory/graphify_topology.md → Main Agent (god-node routing)

**接下来我们可以设计 vault integration 了！现在你清楚每个部件的作用，我们就能准确地知道 vault 应该插入到哪里。** 🎯

准备好继续吗？