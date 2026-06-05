# MCP vs .agent System - 协同还是冲突？

**问题**: `.agent`系统的目标是节省token和提高效率，MCP会不会与此冲突？

**结论**: ✅ **不冲突，反而互补！** 它们服务于不同的场景。

---

## 🎯 核心差异

| 维度 | .agent System | MCP |
|------|--------------|-----|
| **主要目标** | 节省token，专注任务执行 | 跨repo知识访问 |
| **作用范围** | 单个repo内的复杂任务 | 跨repo的知识查询 |
| **Context焦点** | 当前任务的深度执行 | 历史知识的广度参考 |
| **Token优化** | 通过delegation减少context | 通过精准查询减少手动查找 |
| **使用频率** | 任务密集型（持续工作） | 查询型（按需参考） |

---

## 📊 Token使用对比

### .agent System的Token节省

**Before (Monolithic)**:
```
Main Agent: 40-50K tokens
├── 读取10+文件
├── 分析代码
├── 转换SQL
├── 写测试
├── 运行验证
├── 调试
└── 更新文档

Total: 40-50K tokens per task
```

**After (v5 Delegation)**:
```
Main Agent: 10-12K tokens (orchestration)
├─ @sql-worker: 8K tokens (convert)
├─ @validator: 6K tokens (validate)
├─ @fixer: 7K tokens (debug)
└─ @wiki-keeper: 5K tokens (docs)

Total: 12-15K tokens per task
Savings: 70-75% ✅
```

---

### MCP的Token影响

**Without MCP** (查找Airflow模式):
```
1. 切换到Obsidian
2. 手动搜索"DAG patterns"
3. 阅读文档
4. 复制相关部分
5. 切换回Claude
6. 粘贴内容（+2-3K tokens to context）
7. Claude理解并应用

Human time: 2-5分钟
Token overhead: 2-3K (full document)
Context pollution: 高
```

**With MCP** (查找Airflow模式):
```
1. 问Claude: "Show me our DAG patterns from vault"
2. MCP搜索: search_notes("DAG patterns")
3. MCP读取: read_note("knowledge/tools/airflow/DAG Patterns.md")
4. Claude提取相关部分（只有需要的内容）
5. Claude应用到当前任务

Human time: 10秒
Token overhead: 0.5-1K (relevant sections only)
Context pollution: 低
```

**Net effect**: MCP实际上**节省了token**，因为：
- 只传输相关内容，不是整个文档
- 不需要在context中保留查询结果
- Claude自动提取关键信息

---

## 🔄 协同场景

### 场景1: `.agent` System 使用MCP增强知识

**在Redshift repo执行SP转换任务**:

```markdown
User: "Convert RPT_OrderSummary block M14"

Main Agent (10K context):
  ├─ Load skills/convert-sp-block.md
  ├─ Check: 需要参考SQL转换模式吗？
  │   └─ MCP query: "Search vault for MSSQL to Redshift patterns"
  │       └─ Returns: 关键转换规则（500 tokens）
  │
  ├─ Delegate to @sql-worker (8K context):
  │   └─ Receives: 转换规则 from vault + source code
  │   └─ Applies: ROUND before CAST (learned from vault)
  │   └─ Returns: Converted SQL
  │
  └─ Update lessons.md with new insights

MCP token cost: 500 tokens (one-time reference)
Value: 避免重复错误，提高首次成功率
ROI: High (节省debugging时间)
```

**好处**:
- .agent执行效率更高（有历史知识）
- MCP只在需要时查询（不是持续加载）
- 知识可以跨repo复用

---

### 场景2: Wiki-keeper通过MCP更新Obsidian

**@wiki-keeper更新跨repo知识**:

```markdown
Task完成后:

@wiki-keeper (5K context):
  ├─ 更新repo内wiki: knowledge/wiki/rpt-ordersummary.md
  │
  └─ 通过MCP更新Obsidian vault:
      ├─ MCP: search_notes("Redshift Reporting project")
      ├─ MCP: read_note("companies/current-company/projects/Redshift Reporting.md")
      ├─ 更新项目状态
      └─ MCP: write_note(...updated content...)

MCP token cost: 800 tokens (read + write)
Value: 中央知识库保持最新
ROI: Very High (团队共享知识)
```

**好处**:
- Repo wiki保持轻量（repo内）
- Obsidian vault积累跨repo模式（跨repo）
- 新repo启动时可以参考历史经验

---

### 场景3: 跨Repo知识查询（MCP独有场景）

**在Airflow repo需要Glue经验**:

```markdown
User: "How does Glue handle S3 partitioning? Check vault"

Main Agent:
  ├─ MCP: search_notes("Glue S3 partitioning")
  ├─ MCP: read_note("knowledge/tools/spark/Job Patterns.md")
  ├─ MCP: read_note("companies/current-company/reference/Glue Patterns (DP).md")
  └─ Synthesize answer: "Glue uses Hive-style partitioning..."

No .agent delegation needed (simple query)
MCP token cost: 1K tokens
Value: 跨repo知识复用
```

**这种场景不需要.agent**:
- 不是复杂任务执行
- 只是知识查询和参考
- Main Agent直接处理即可

---

## 💡 何时用哪个？

### 使用 .agent System（Delegation）

✅ **任务执行场景**:
- 转换大型SQL文件
- 运行验证测试
- 调试复杂错误
- 更新文档和wiki

✅ **特征**:
- 需要深度执行
- 涉及多个步骤
- 需要专业工具
- Token密集型

**Example**:
```
"Convert all blocks of RPT_OrderSummary"
→ Use .agent delegation (sql-worker, validator, fixer)
```

---

### 使用 MCP（Knowledge Query）

✅ **知识查询场景**:
- 查找历史模式
- 跨repo参考
- 快速查询最佳实践
- 架构决策参考

✅ **特征**:
- 需要参考资料
- 跨repo知识
- 快速查询
- Token轻量型

**Example**:
```
"What's our standard approach for error handling in Airflow?"
→ Use MCP query (direct, no delegation needed)
```

---

## 🎯 最佳实践：组合使用

### Pattern 1: 任务开始前查询知识

```markdown
User: "Implement retry logic for Glue job"

Flow:
1. MCP查询: "Search vault for retry patterns" (500 tokens)
   → 获取通用最佳实践
   
2. 决策: 这是简单实现还是复杂任务？
   - 简单 → Main Agent直接实现
   - 复杂 → Delegate to subagent

3. 如果delegate:
   @sql-worker receives:
   - Task definition
   - Retry patterns from vault (via MCP)
   - Current code context
```

**Token效率**: MCP前期投入500 tokens，避免后期debugging 5K+ tokens

---

### Pattern 2: 任务完成后更新知识

```markdown
Task: "Fixed validation diff in RPT_SalesByRegion"

Flow:
1. @fixer执行修复 (7K tokens)
   └─ Discovers: "Narrowing CAST needs ROUND"

2. Main Agent更新lessons.md (repo内)

3. @wiki-keeper检查是否需要更新vault:
   └─ MCP: "Does this pattern exist in vault?"
       ├─ Not found → 添加到vault
       └─ Found → 更新案例数

4. 未来其他repos可以通过MCP学习这个模式
```

**ROI**: 一次学习（7K tokens），未来复用（500 tokens per query）

---

### Pattern 3: 新Repo启动（纯MCP场景）

```markdown
Starting new repo: infrastructure-v2

Flow:
1. "What patterns exist across our repos? Check vault"
   └─ MCP lists all pattern documents

2. "Show me Infrastructure patterns from vault"
   └─ MCP reads infrastructure-specific patterns

3. "Compare Airflow and Glue orchestration approaches"
   └─ MCP reads and compares both

4. 设计新repo的.agent system based on learnings

No .agent delegation needed (planning phase)
Pure MCP queries (2-3K tokens total)
```

---

## 📊 Token Budget示例

### 一个完整的工作日（8小时）

**Without MCP** (手动查找):
```
5 tasks × 40K tokens = 200K tokens
+ 10 manual doc lookups × 3K tokens = 30K tokens
Total: 230K tokens
```

**With .agent System only**:
```
5 tasks × 15K tokens = 75K tokens (delegation优化)
+ 10 manual doc lookups × 3K tokens = 30K tokens
Total: 105K tokens
Savings: 54% ✅
```

**With .agent + MCP**:
```
5 tasks × 15K tokens = 75K tokens (delegation优化)
+ 10 MCP queries × 0.8K tokens = 8K tokens (自动查询)
Total: 83K tokens
Savings: 64% ✅✅
Additional human time saved: 20-50 minutes
```

---

## 🎯 结论

### .agent System的价值

**专注于**: 任务执行效率
- 复杂任务的delegation
- Context隔离和并行化
- 专业subagent

**Token savings**: 70-75% (在任务执行中)

---

### MCP的价值

**专注于**: 知识访问效率
- 跨repo知识查询
- 历史经验复用
- 快速参考

**Token savings**: 60-70% (在知识查询中)
**Time savings**: 2-5分钟 per lookup

---

### 组合的价值

**1 + 1 > 2**:

1. **.agent执行任务时**，MCP提供历史知识
   → 提高首次成功率
   → 减少debugging迭代

2. **Wiki-keeper更新知识时**，MCP同步到vault
   → 知识跨repo积累
   → 团队共享学习

3. **简单查询时**，只用MCP，不用.agent
   → 避免over-engineering
   → Token效率最大化

---

## 🚀 建议的使用策略

### 规则1: 任务执行 → .agent

```
IF task_complexity > simple
AND requires_multiple_steps
THEN use .agent delegation
```

### 规则2: 知识查询 → MCP

```
IF need_reference OR need_pattern
AND cross_repo_knowledge
THEN use MCP query
```

### 规则3: 组合使用

```
IF complex_task AND need_historical_knowledge
THEN:
  1. MCP query for patterns (500 tokens)
  2. .agent delegation with context (15K tokens)
  3. Wiki-keeper updates vault via MCP (800 tokens)
```

---

## 📈 预期效果

### Token效率

| Scenario | Before | .agent Only | .agent + MCP |
|----------|--------|-------------|--------------|
| 复杂任务 | 40-50K | 15-18K | 15-18K |
| 知识查询 | 2-3K | 2-3K | 0.5-1K |
| 跨repo参考 | N/A | N/A | 0.8K |
| 总体节省 | - | 60% | 68% |

### 人力时间

| Activity | Without MCP | With MCP |
|----------|-------------|----------|
| 查找文档 | 2-5 min | 10 sec |
| 切换context | 频繁 | 极少 |
| 知识复用 | 低 | 高 |

---

## 🎯 最终答案

### 冲突吗？❌ 不冲突

.agent和MCP是**正交的**（orthogonal）：

- **.agent** = 如何**高效执行**任务
- **MCP** = 如何**高效访问**知识

它们解决不同的问题，可以完美协同。

### 互补吗？✅ 高度互补

**协同效应**:
1. MCP为.agent提供历史知识 → 提高执行质量
2. .agent通过MCP更新vault → 积累组织知识
3. 简单查询跳过.agent，直接用MCP → 避免over-delegation

### 总Token效率

**Baseline (无优化)**: 100%  
**只用.agent**: 30-35% (65% savings)  
**只用MCP**: 70-80% (20-30% savings在查询场景)  
**组合使用**: 25-32% (68-75% savings) ✅✅

---

## 🔗 相关文档

- [[knowledge/architecture/Agent System Introduction]] - .agent系统架构
- [[MCP Use Cases]] - MCP使用场景
- [[MCP Real Examples]] - MCP实际示例

---

**建议**: 继续使用.agent做任务执行，加上MCP做知识访问。两者是**力量倍增器**，不是竞争关系。

**最后更新**: 2026-06-03
