# Knowledge Vault - Index

**Last Updated**: 2026-06-05 (v5.1 release + Self-Evolution sub-system)

Welcome to the unified knowledge vault spanning personal projects, company work, and learning resources.

---

## 🌟 Recent Updates (Last 7 Days)

### 2026-06-05 (PM) - Agent System v5.1 Released ⭐ LATEST
- ⚠️ **Workflow Tool Prohibition** - DEFAULT never use Workflow (10-20× more expensive)
- ✅ **Subagent-First Strategy** - 95% of tasks via Agent tool (5-15K vs 50-200K)
- ✅ **Subagent Template** - `.claude/agents/_TEMPLATE.md` (1200+ lines, 12 sections)
- ✅ **STOP Checkpoint** - Cost-visible decision tree in index.md (rule #13)
- 💰 **Predicted Savings**: 85-90% token reduction (~$90-150/month per repo)
- 📄 **New Wiki Page**: agent-system-cost-optimization.md (11 total)
- 🛠️ **Skills Catalog**: 14 total (5 workflow + 4 utility + 5 meta) — confirmed in vault

**Links**:
- [[knowledge/architecture/Agent System Cost Optimization v5.1]] - Full v5.1 spec
- [[companies/current-company/projects/Redshift Reporting]] - v5.1 flagship deployment
- [[companies/current-company/data-platform/Data Platform Repos - Agent System Status]] - Cross-repo status

### 2026-06-05 (AM) - Agent System v5.0 + Self-Evolution Sub-System
- ✅ **Autonomous Post-task Loop** - Agent self-triggers lessons.md without user reminder
- ✅ **Smart Graphify Refresh** - Threshold-based intelligence (≥3 wiki | ≥2 python | ≥1 SP | ≥14 days)
- ✅ **Post-graphify Wiki Updates** - Mandatory wiki sync after graph refresh
- ✅ **Session-start Proactive Checks** - Auto-check graph freshness
- ✅ **Self-Evolution** (commit cb65e75) - skill-creator (3× pattern), routing-optimizer (weekly synonym learning), solutions.md (problem→solution registry)
- 📊 **Knowledge Graph**: 193 nodes (+76), 326 edges (+118), 14 communities
- 🎯 **New God Node #3**: GraphifyRefreshManager (13 edges) - smart refresh system
- 📄 **New Wiki Pages**: graphify-refresh-system.md, graphify-architecture.md
- 📄 **New .agent Docs**: SELF-EVOLUTION-UPDATE.md (release notes), Agent_Token_Usage.md (Bedrock tokenomics policy), dispatch/dispatch.md (subagent dispatch playbook)

**Links**:
- [[journal/daily/2026-06-05]] - Full day log
- [[knowledge/architecture/Agent System Self-Iteration - Current Status]] - v5.0 spec

### 2026-06-04/05 - Redshift Reporting Migrations (PROJ-645, PROJ-622)
- ✅ **PROJ-645 V10-V12**: SalesByRegion schema routing fixes (DROP TABLE/VIEW + vSOURCE views + final V12 migration)
- ✅ **PROJ-622**: Test cases backfill, SQL joins refactor, deprecated view cleanup
- 🧹 Post-stabilization cleanup of obsolete DROP statements + V10 deployment notes

### 2026-06-04 - Scope Validation Lesson
- [[lessons/2026-06-04-scope-validation-before-large-workflows]]
- Key takeaway: Always validate inputs (file existence, patterns) before launching expensive workflows

### 2026-06-03 - Agent System Meta-Optimizer Deployed
- v4 → v5 upgrade path documented
- Meta-optimizer skill created (`/optimize-system`)
- 67% lessons.md reduction, 50% subagent prompt reduction
- lessons.md 1× archive at 28KB (`.agent/learning/lessons_archive_2026-06-03.md`)
- [[knowledge/architecture/Agent System Meta-Optimizer]]

---

## 📁 Top-Level Structure

```
├── companies/           Company-specific work
│   ├── current-company/      Current Company Data Platform (primary)
│   └── README.md
├── journal/             Daily logs and reflections
│   └── daily/           Daily work logs (YYYY-MM-DD.md)
├── knowledge/           Structured technical knowledge
│   ├── architecture/    System architecture docs
│   ├── tools/           Tool-specific guides (MCP, Airflow, etc.)
│   └── README.md
├── learning/            Learning resources and courses
├── lessons/             Distilled lessons from specific experiences
├── projects/            Personal projects
└── templates/           Reusable templates
```

---

## 🏢 Companies

### Current Company Data Platform
**Current Focus**: MSSQL → Redshift migration with agent system v5.1

**Active Projects**:
- [[companies/current-company/projects/Redshift Reporting]] 🟢⭐💰 v5.1 - Flagship, Workflow prohibition + autonomous learning + self-evolution
- [[companies/current-company/projects/Reporting API]] 🟢 v4.0 - Stable delegation-first
- [[companies/current-company/projects/DataGen]] 🟡 v3.5 - Partial delegation
- [[companies/current-company/projects/Glue]] 🟡 v3.0 - Single subagent
- [[companies/current-company/projects/Airflow]] 🟡 v3.0 - Single subagent
- [[companies/current-company/projects/Infrastructure]] 🔴 v2.0 - Legacy manual
- [[companies/current-company/projects/SRE]] 🔴 v1.0 - Basic tasks only

**Platform Overview**:
- [[companies/current-company/data-platform/Data Platform Overview]]
- [[companies/current-company/data-platform/Data Platform Architecture Diagram]]
- [[companies/current-company/data-platform/Data Platform Repos - Agent System Status]] ⭐ UPDATED 2026-06-05 v5.1

**Reference Docs**:
- [[companies/current-company/reference/Database Architecture]]
- [[companies/current-company/reference/Airflow Patterns (ACME)]]
- [[companies/current-company/reference/Glue Patterns (ACME)]]
- [[companies/current-company/reference/DevOps & Infrastructure]]

---

## 🧠 Knowledge Base

### Architecture
Core system design and patterns.

- [[knowledge/architecture/Agent System Introduction]] - v4 delegation-first architecture
- [[knowledge/architecture/Agent System Self-Iteration - Current Status]] ⭐ **v5.0 SPEC** (2026-06-05)
- [[knowledge/architecture/Agent System Cost Optimization v5.1]] ⭐ **v5.1 SPEC** (2026-06-05)
- [[knowledge/architecture/Agent System Architecture Overview]] - High-level overview
- [[knowledge/architecture/Agent System Components Deep Dive]] - Component details
- [[knowledge/architecture/Agent System Meta-Optimizer]] - Self-optimization system (v5)
- [[knowledge/architecture/The Complete AI Ecosystem - Architecture]] - Broader AI ecosystem
- [[knowledge/architecture/Agent System Ecosystem Review]] - Cross-system analysis

### Tools

#### MCP (Model Context Protocol)
Complete MCP integration guide (v2.0, production-ready).

**Start Here**: [[knowledge/tools/mcp/README - Start Here]]

**Core Docs**:
- [[knowledge/tools/mcp/core/MCP Quick Reference]] - Fast lookup
- [[knowledge/tools/mcp/core/MCP Tutorial]] - Step-by-step guide
- [[knowledge/tools/mcp/core/MCP Configuration Guide]] - Setup instructions
- [[knowledge/tools/mcp/core/MCP Use Cases]] - When to use MCP
- [[knowledge/tools/mcp/core/READY - MCP v2 Production Status]] - Current status

**Technical Deep Dives**:
- [[knowledge/tools/mcp/technical/MCP Server v2 Updates]] - v2 changes
- [[knowledge/tools/mcp/technical/MCP Real Examples]] - Real-world usage
- [[knowledge/tools/mcp/technical/MCP vs Agent System]] - When to use which

**Troubleshooting**:
- [[knowledge/tools/mcp/troubleshooting/MCP Troubleshooting]] - Common issues
- [[knowledge/tools/mcp/troubleshooting/MCP Diagnosis Report]] - Diagnostic guide
- [[knowledge/tools/mcp/troubleshooting/MCP-32000-Error-Fix]] - Specific error fix

**Deployment Archive**:
- [[knowledge/tools/mcp/archive/deployment/FINAL - MCP Integration Summary]]
- [[knowledge/tools/mcp/archive/deployment/MCP v2 Validation Report]]

#### Other Tools
- [[knowledge/tools/airflow/DAG Patterns]]
- [[knowledge/tools/spark/Job Patterns]]
- [[knowledge/tools/terraform/IaC Patterns]]
- [[knowledge/tools/aws/IAM Best Practices]]

---

## 📖 Learning Resources

### Active Learning
- [[learning/README.md]] - Learning log and resources

### Distilled Lessons
- [[lessons/2026-06-04-scope-validation-before-large-workflows]] - Validate inputs before workflows
- More lessons in `/lessons/` directory

---

## 📅 Daily Journal

### This Week
- [[journal/daily/2026-06-05]] ⭐ Agent System v5.0 + v5.1 Release + Self-Evolution
- [[journal/daily/2026-06-04]] - Scope validation lesson
- [[journal/daily/2026-06-03]] - Meta-optimizer deployment

### Templates
- [[journal/daily/_template]] - Daily note template
- [[journal/daily/README]] - Journal guide

---

## 🎯 Current Focus Areas

### 1. Agent System v5.1 Rollout (2026-06-05 → 2026-08)
**Phase 1** (2 weeks): Stabilize Redshift Reporting v5.1
- ✅ Workflow prohibition deployed
- ✅ Subagent template created
- ✅ Decision tree in index.md
- ✅ Self-evolution sub-system deployed (skill-creator, routing-optimizer, solutions.md)
- ⏳ Validate 85-90% token savings, monitor Workflow usage <2%
- ⏳ Routing-optimizer first weekly cycle: 2026-06-08 (Monday)

**Phase 2** (1 week): Reporting API direct-to-v5.1 upgrade (skip v5.0)
- [ ] Deploy v5.1 (autonomous loop + Workflow prohibition + template)
- [ ] Add graphify baseline
- [ ] Test 5+ tasks

**Phase 3** (2 weeks): DataGen + Glue + Airflow direct-to-v5.1
- [ ] Parallel rollout
- [ ] Deploy graphify baselines
- [ ] Monitor behavior

**Phase 4** (3 weeks): Infrastructure + SRE
- [ ] Bootstrap from v1.0/v2.0 → progressive upgrade to v5.1
- [ ] Create wiki baselines
- [ ] Deploy graphify

**Phase 5** (ongoing): Hub Consolidation
- [ ] Export lessons to hub
- [ ] Update canonical playbooks
- [ ] Cross-repo knowledge graph

### 2. Redshift Reporting Migration (Ongoing)
**Status**: 2/2 major SPs production-ready
- ✅ RPT_OrderSummary (19/19 cases PASS)
- ✅ RPT_SalesByRegion_Online (3 cases PASS + 4 sentinels)
- ✅ PROJ-645 V10-V12 schema routing stabilized
- ✅ PROJ-622 test cases backfilled

**Next SPs**: Pipeline TBD

### 3. Knowledge Graph Evolution
**Current**: 193 nodes, 326 edges, 14 communities (2026-06-05)

**God Nodes**:
1. RPT_OrderSummary SP (19 edges)
2. RPT_SalesByRegion_Online SP (16 edges)
3. GraphifyRefreshManager ⭐ (13 edges) - NEW entrant

**Surprising Connections**:
- Multi-Modal Extraction Engine ↔ Hyperedge Support (0.7)

**Hyperedges** (6):
- Migration Validation Pipeline (5 nodes, 0.95)
- SP Migration Pitfall Patterns (5 nodes, 0.95)
- Validation Suite Runners (3 nodes, 0.90)

### 4. Bedrock Cost Discipline (4-6 week target)
**Current**: ~75% Opus spend (per `.agent/Agent_Token_Usage.md`)
**Target**: Haiku 30-40%, Sonnet 40-50%, Opus 10-20%
**Levers**: default-Sonnet in `.claude/settings.json`, prompt caching, batch inference, max_tokens ceilings, per-task instrumentation, v5.1 Workflow prohibition (largest single lever)

---

## 🔗 Quick Links

### Most Referenced Pages (Last 30 Days)
1. [[companies/current-company/projects/Redshift Reporting]] - 156 views
2. [[knowledge/architecture/Agent System Self-Iteration - Current Status]] - 89 views
3. [[knowledge/tools/mcp/README - Start Here]] - 67 views
4. [[companies/current-company/data-platform/Data Platform Overview]] - 54 views
5. [[knowledge/architecture/Agent System Introduction]] - 43 views

### External Links
- [Redshift Reporting Repo](file:///${EXTERNAL_REPOS}/example-repo-redshift)
- [Engineer-Agent Hub Repo](file:///${EXTERNAL_REPOS}/current-company-data-platform-engineer-agent)

---

## 📊 Vault Stats (2026-06-05)

- **Total Notes**: 78
- **Daily Logs**: 5
- **Company Docs**: 28 (Current Company)
- **Knowledge Pages**: 35
- **Lessons Learned**: 2
- **Last Updated**: 2026-06-05 (v5.1 + Self-Evolution sub-system)
- **Active Projects**: 7 (1 v5.1 ⭐, 1 v4.0, 2 v3.5, 2 v3.0, 2 legacy)

---

## 🏷️ Common Tags

#agent-system #autonomous-learning #self-evolution #cost-optimization #workflow-prohibition #subagent-first #tokenomics #redshift-reporting #data-platform #knowledge-graph #graphify #mcp #migration #settlement #validation #wiki #lessons-learned

---

## 📝 Templates

- [[templates/Project Template]] - Standard project structure
- [[journal/daily/_template]] - Daily note format

---

## 🚀 Getting Started

**New to the vault?**
1. Start with [[companies/current-company/data-platform/Data Platform Overview]]
2. Check [[knowledge/architecture/Agent System Introduction]] for v4 architecture
3. Read [[knowledge/architecture/Agent System Self-Iteration - Current Status]] for v5.0 features
4. Read [[knowledge/architecture/Agent System Cost Optimization v5.1]] for v5.1 cost optimization
5. Browse [[companies/current-company/projects/Redshift Reporting]] for real-world application

**Want to contribute?**
1. Follow templates in `/templates/`
2. Link liberally with `[[page-name]]`
3. Tag appropriately
4. Update this index when adding major sections

---

**Maintained by**: Francis Lim  
**Vault Created**: 2026-05-26  
**Last Major Update**: 2026-06-05 (Agent System v5.1 + Self-Evolution Sub-System)
