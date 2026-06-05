# .agent Self-Evolution - Quick Reference

**Version**: 5.0 | **Updated**: 2026-06-05

---

## 🚀 What's New

The .agent system now **learns from experience** and **creates skills autonomously**:

- **@skill-creator**: Detects patterns (3× rule) → Creates new skills automatically
- **@routing-optimizer**: Learns your vocabulary → Improves routing accuracy
- **Solution Registry**: Known problems → Instant solutions (skip investigation)

**Goal**: Once you do something 3 times, the system automates it forever.

---

## ⚡ Quick Commands

| What You Want | Say This |
|---------------|----------|
| Create a skill manually | "create skill for [X]" |
| Improve routing | "optimize routing" |
| Check what problems are known | "show solution registry" |
| See system performance | "routing performance" or check `.agent/monitoring/metrics.md` |

---

## 🔄 How It Works (30 Second Version)

### Pattern Detection (3× Rule)
```
Do task manually (1st time) → Recorded
Do task manually (2nd time) → Pattern building
Do task manually (3rd time) → System proposes skill
Approve → Future: Automated forever
```

### Synonym Learning
```
You: "broken references" (not in trigger list)
System: "Clarify: did you mean links?"
You: "Yes"
→ Next week: System learns synonym
→ Future: "broken references" → Immediate routing
```

### Known Problems
```
Problem (1st time): Investigate 10-15 min → Solve → Record
Problem (2nd time): Check registry → Apply solution 2-3 min
Problem (3rd time): Auto-apply (high confidence) 1 min
```

---

## 📊 Key Metrics

**Target Performance**:
- Routing success: >90% (immediate, no clarification)
- Time savings: ~8-12 min per known problem
- Skill creation: <5 new skills/month (avoid over-specialization)

**Check Monthly**: `.agent/monitoring/metrics.md`

---

## ✅ When to Approve Proposals

### Skill Creation

**✅ Approve if**:
- Task done 3+ times (genuine pattern)
- Takes 5+ minutes manually
- Will save time in future
- Clear, repeatable process

**❌ Reject if**:
- One-off task (no pattern)
- Too simple (1-2 steps)
- Already covered by existing skill
- Ambiguous or unclear purpose

### Routing Changes

**✅ Approve if**:
- Synonym is accurate (no ambiguity)
- You genuinely used that phrase
- Would reduce clarification requests
- Composite route makes sense

**❌ Reject if**:
- Synonym too broad (causes false positives)
- One-time usage (not your typical vocabulary)
- Would increase ambiguity

---

## 🔧 Maintenance

### Weekly (Automated)
**Every Monday**:
- System: Runs routing optimization
- You: Review proposals (~5 min)
- System: Applies approved changes

### Monthly (Manual)
- Check `.agent/monitoring/metrics.md` (~5 min)
- Verify trends:
  - Routing success rate increasing? ✅
  - Solution registry growing? ✅
  - Skills being used? ✅

### Quarterly (Manual)
- Audit skill inventory (~15 min):
  - Which skills unused? (consider deprecate)
  - Which skills overlap? (consider merge)
- Audit solution registry:
  - Which problems obsolete? (archive)
  - Which problems most common? (optimize)

---

## 🎯 Examples

### Example: Skill Creation

**Scenario**: You run security scans frequently

```
Week 1: Manual scan → Recorded
Week 2: Manual scan → Pattern building
Week 3: Manual scan → System proposes @security-scanner

System: "Detected pattern: security scanning (3×)"
        "Create @security-scanner skill?"
You: "y"

Week 4: "run security scan" → @security-scanner (automatic)
```

**Time saved**: ~10-15 min per scan after automation

### Example: Synonym Learning

**Scenario**: You say "fix references" but system expects "check links"

```
You: "fix broken references"
System: "Clarify: did you mean check links?"
You: "Yes, wiki-links"
→ Recorded

Next Monday:
System: "Add 'broken references' to triggers?"
You: "y"

Future:
You: "fix broken references"
System: → @link-checker (immediate)
```

**Clarifications eliminated**: 1 per occurrence

### Example: Solution Registry

**Scenario**: Wiki sync fails with merge conflict

```
1st occurrence: Investigate 15 min → Resolve → Record as P006
2nd occurrence: Check registry → Apply solution 3 min (saved 12 min)
3rd occurrence: Auto-apply high confidence 1 min (saved 14 min)

Total savings: 26 minutes over 3 occurrences
```

---

## 🐛 Troubleshooting

| Problem | Quick Fix |
|---------|-----------|
| Too many skill proposals | Reject inappropriate ones, system learns |
| Routing worse after optimization | Check index.md, remove problematic rules |
| Solution registry not used | Make problem symptoms more specific in solutions.md |
| Skills never routed to | Add more trigger phrases (your natural vocabulary) |

**Full troubleshooting**: `.agent/Self-Evolution-Guide.md` (Troubleshooting section)

---

## 📁 Key Files

| File | Purpose | When to Check |
|------|---------|---------------|
| `.agent/skills/skill-creator.md` | Skill creation logic | Customize 3× threshold |
| `.agent/skills/routing-optimizer.md` | Routing learning | Customize optimization frequency |
| `.agent/memory/solutions.md` | Problem-solution registry | Add problems manually |
| `.agent/monitoring/metrics.md` | Performance metrics | Monthly review |
| `.agent/Self-Evolution-Guide.md` | Full documentation | Deep dive |

---

## 💡 Pro Tips

1. **Be specific when correcting**: Don't say "wrong", say "I meant @skill-name"
2. **Check metrics monthly**: 5 minutes to spot trends
3. **Trust high-confidence solutions**: >5× success rate = safe to auto-apply
4. **Reject over-specialized skills**: Keep skill count <15 for maintainability
5. **Document new problems**: When you solve something new, say "record this solution"

---

## 🎓 Learn More

- **Full guide**: `.agent/Self-Evolution-Guide.md` (comprehensive)
- **Changelog**: `.agent/CHANGELOG.md` (what's new)
- **System overview**: `.agent/index.md` (routing logic)

---

## 🔗 Integration with Existing Skills

**Self-evolution skills work alongside existing vault skills**:

| Existing Skill | Self-Evolution Enhancement |
|----------------|----------------------------|
| @link-checker | Learns synonym: "broken references" |
| @indexer | Detects gap: "bulk organize" → Creates @vault-organizer |
| @metadata-keeper | Learns composite: "vault health" = links + metadata |
| @sync-keeper | Registers problem: P003 (sync conflicts) |
| @moc-builder | Learns trigger: "map topic" = create MOC |

**No conflicts** - Self-evolution enhances existing skills, doesn't replace them.

---

**Quick Start**: Just use the system normally. After 3× patterns, system will propose improvements automatically. Review and approve proposals. That's it!

**Questions?** Check `.agent/Self-Evolution-Guide.md` (FAQ section)

---

**Version**: 5.0  
**Created**: 2026-06-05  
**1-Page Quick Ref** - For full docs see Self-Evolution-Guide.md
