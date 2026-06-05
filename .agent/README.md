# .agent System - Self-Evolution v5.0

**Autonomous skill creation + routing optimization through learning**

---

## 📖 Project Overview

**Knowledge-Vault** is an Obsidian knowledge vault for personal knowledge management, designed to be portable across companies and projects.

**Primary Goals**:
1. Maintain a living, self-improving knowledge base
2. Separate portable patterns from company-specific implementations  
3. Use AI agents to handle routine upkeep (link checking, metadata) eliminating manual overhead

**Architecture**: "Delegation-first" - User requests → Router dispatches → Subagents execute → Results stored in memory

**Key Technologies**: Obsidian (vault), MCP (standardized LLM interface), Markdown + YAML frontmatter

---

## 🚀 Quick Start

1. **Read first**: `Self-Evolution-QuickRef.md` (1-page overview)
2. **Try it**: Just use the system - it learns from your patterns
3. **After 3× patterns**: System proposes improvements automatically
4. **Review weekly**: Monday optimization cycle (~5 min)

---

## 📁 File Structure

```
.agent/
├── README.md                          # This file
├── index.md                           # Main routing logic
│
├── skills/                            # Specialized skills
│   ├── maintain-links.md              # Link health (vault)
│   ├── update-index.md                # Index.md maintenance (vault)
│   ├── add-frontmatter.md             # Metadata operations (vault)
│   ├── sync-patterns.md               # External wiki sync (vault)
│   ├── create-moc.md                  # Map of Content creation (vault)
│   ├── optimize-system.md             # System optimization (meta)
│   ├── skill-creator.md               # 🆕 Autonomous skill generation (meta)
│   └── routing-optimizer.md           # 🆕 Routing learning (meta)
│
├── memory/                            # Knowledge base
│   ├── facts.md                       # Project conventions (permanent)
│   ├── working.md                     # Current session (ephemeral)
│   ├── archive.md                     # Historical context
│   └── solutions.md                   # 🆕 Problem → Solution registry
│
├── learning/                          # Learning system
│   ├── lessons.md                     # Recent experiences
│   ├── patterns.md                    # Proven patterns (3×)
│   └── feedback.md                    # User corrections
│
├── monitoring/                        # System health
│   └── metrics.md                     # Performance KPIs
│
└── docs/                              # Documentation
    ├── Self-Evolution-QuickRef.md     # 🆕 1-page quick reference
    ├── Self-Evolution-Guide.md        # 🆕 Comprehensive guide
    ├── Architecture-Self-Evolution.md # 🆕 Visual architecture
    └── CHANGELOG.md                   # 🆕 Version history
```

---

## 🎯 Core Capabilities

### Vault Operations (6 skills)
- `@link-checker` - Link validation, orphan detection
- `@indexer` - Index.md maintenance
- `@metadata-keeper` - Frontmatter management
- `@sync-keeper` - Wiki pattern synchronization
- `@moc-builder` - Map of Content creation
- `@optimize-system` - System optimization

### Self-Evolution (2 meta-skills) 🆕
- `@skill-creator` - Detects gaps, creates skills autonomously
- `@routing-optimizer` - Learns vocabulary, improves routing

---

## 🧠 How Self-Evolution Works

### 1. Pattern Detection (3× Rule)
```
Do task manually → Recorded in lessons.md
Do task again → Pattern building
Do task 3rd time → System proposes skill
Approve → Future: Automated
```

### 2. Synonym Learning
```
You say: "broken references"
System: "Clarify: links?"
You: "Yes"
→ Next week: System learns synonym
→ Future: Immediate routing
```

### 3. Known Problems
```
Problem 1st time: Investigate 15 min → Record
Problem 2nd time: Apply known solution 3 min
Problem 3rd time: Auto-apply 1 min
```

**Time savings**: ~8-12 min per known problem

---

## 📊 Key Metrics

**Current State** (2026-06-05):
- Skills: 8 (6 vault + 2 meta)
- Solution registry: 5 problems (100% success rate)
- Routing success: 100% (baseline)
- Next optimization: 2026-06-12 (Monday)

**Targets**:
- Routing success: >90%
- Skill creation: <5/month
- Solution registry: +3-5 problems/month

**Check**: `.agent/monitoring/metrics.md`

---

## 🔄 Weekly Cycle

**Every Monday** (automated):
1. System scans lessons/feedback/working memory
2. Identifies patterns, synonyms, gaps
3. Generates optimization report
4. User reviews (~5 min)
5. Applies approved changes
6. Validates next week

---

## 🎓 Documentation

| Document | Purpose | When to Read |
|----------|---------|--------------|
| `Self-Evolution-QuickRef.md` | 1-page overview | **Start here** |
| `Self-Evolution-Guide.md` | Comprehensive guide | Deep dive |
| `Architecture-Self-Evolution.md` | Visual diagrams | Understand internals |
| `CHANGELOG.md` | Version history | What's new |
| `index.md` | Routing logic | Reference |

---

## 💡 Quick Commands

| Say This | System Does |
|----------|-------------|
| "create skill for X" | Manual skill creation |
| "optimize routing" | Trigger routing optimization |
| "show solution registry" | List known problems |
| "routing performance" | Check success metrics |
| "check links" | → @link-checker (vault) |
| "update index" | → @indexer (vault) |
| "add frontmatter" | → @metadata-keeper (vault) |
| "sync patterns" | → @sync-keeper (vault) |
| "create MOC" | → @moc-builder (vault) |

---

## ✅ Benefits

- ✅ **Avoid repetition**: 3× pattern → Automated forever
- ✅ **Learn vocabulary**: System adapts to your phrases
- ✅ **Solve faster**: Known problems in ~2-3 min
- ✅ **Grow capabilities**: Skills created based on usage
- ✅ **Build knowledge**: Solution registry accumulates

---

## 🔧 Maintenance

### Weekly (~5 min)
- Review Monday optimization proposals
- Approve/reject routing changes

### Monthly (~5 min)
- Check `.agent/monitoring/metrics.md`
- Verify routing success rate
- Review solution registry growth

### Quarterly (~15 min)
- Audit skill inventory (deprecate unused)
- Archive obsolete problems
- Update system based on trends

---

## 🐛 Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Too many skill proposals | Reject inappropriate, system learns |
| Routing worse | Check index.md, remove problematic rules |
| Solutions not used | Make symptoms more specific |
| Skills never routed | Add more trigger phrases |

**Full troubleshooting**: `Self-Evolution-Guide.md`

---

## 📈 Version History

| Version | Date | Key Feature |
|---------|------|-------------|
| **v5.0** | 2026-06-05 | Self-evolution (skill creation + routing optimization) |
| v4.0 | 2026-06-03 | Delegation-first architecture (subagents) |
| v3.0 | 2026-05-26 | Meta-optimizer |
| v2.0 | 2026-05-20 | Memory system |
| v1.0 | 2026-05-15 | Initial release |

---

## 🎯 Philosophy

**"Learn from every interaction, automate recurring patterns"**

The system observes your work, detects patterns, and proposes automation. You stay in control (approve/reject), but the system handles the detection and design.

**Result**: System gets better over time, tailored to your specific usage.

---

## 🚦 Getting Started Checklist

- [ ] Read `Self-Evolution-QuickRef.md` (5 min)
- [ ] Use system normally (it learns automatically)
- [ ] After 1 week: Review Monday optimization (5 min)
- [ ] After 1 month: Check metrics (5 min)
- [ ] After 3 months: Audit skills & solutions (15 min)

**That's it!** System handles the rest.

---

**Version**: 5.0  
**Created**: 2026-06-05  
**Next Review**: 2026-07-05  

**Questions?** See `Self-Evolution-Guide.md` (FAQ section)
