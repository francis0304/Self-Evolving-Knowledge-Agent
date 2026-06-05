# .agent Self-Evolution System - User Guide

**Version**: 5.0  
**Created**: 2026-06-05  
**Purpose**: Enable autonomous skill creation and routing optimization through learning

---

## Overview

The .agent system now has **self-evolution capabilities**:

1. **@skill-creator** - Automatically detects capability gaps and creates new specialized skills
2. **@routing-optimizer** - Learns from experience to improve routing decisions
3. **Solution Registry** - Builds knowledge base of known problems → proven solutions

**Goal**: Eliminate repetitive problem-solving. Once a problem is solved or a pattern appears 3×, the system learns and automates it.

---

## How It Works

### Automatic Skill Creation

**Pattern Detection** (3× Rule):
```
Same task type appears 3 times in lessons.md
  ↓
@skill-creator detects pattern
  ↓
Proposes new skill
  ↓
User reviews and approves
  ↓
Skill created and integrated
  ↓
Future requests automatically routed
```

**Example**:
```
Week 1: User manually generates changelog (recorded in lessons.md)
Week 2: User manually generates changelog again (pattern building)
Week 3: User manually generates changelog third time
  → @skill-creator: "Detected recurring pattern: changelog generation"
  → Proposes: @changelog-generator skill
  → User approves
  → Next time: "generate changelog" → @changelog-generator (automatic)
```

### Automatic Routing Optimization

**Learning Cycle** (Weekly):
```
Monday morning:
  1. @routing-optimizer scans lessons/feedback/working memory
  2. Identifies:
     - New synonyms users naturally use
     - Ambiguous phrases needing clarification
     - Capability gaps (no matching skill)
  3. Generates optimization report
  4. User reviews proposed changes
  5. Approved changes applied
  6. Next week: Measure improvement
```

**Example**:
```
User says: "broken references" (not in trigger list)
System unclear, asks for clarification
User clarifies: "I meant wiki-links"
  ↓
Recorded in lessons.md
  ↓
Next Monday: @routing-optimizer detects synonym
  ↓
Proposes: Add "broken references" to @link-checker triggers
  ↓
User approves
  ↓
Next time: "broken references" → @link-checker (immediate, no clarification)
```

### Solution Registry (Known Problems)

**Problem → Solution Mapping**:
```
User reports problem (first time)
  ↓
System investigates and solves
  ↓
Solution recorded in .agent/memory/solutions.md
  ↓
User reports same problem (later)
  ↓
System checks registry: "Known problem P001"
  ↓
Applies proven solution immediately (no re-investigation)
  ↓
Updates success count: 5× → 6×
```

**Time Savings**:
- First occurrence: ~10-15 minutes (investigation + solution)
- Subsequent: ~2-3 minutes (apply known solution)
- Savings: ~8-12 minutes per occurrence

---

## User Interactions

### Triggering Skill Creation

**Automatic** (3× pattern):
- System detects recurring pattern in lessons.md
- Proposes skill automatically

**Manual** (explicit request):
- You say: "create skill for X"
- System designs skill on demand

**Example manual trigger**:
```
You: "Create a skill to validate Terraform syntax across all repos"

System:
  1. Analyzes request
  2. Designs @terraform-validator skill
  3. Shows proposal:
     - Purpose: Validate .tf files across repos
     - Triggers: "validate terraform", "check tf syntax"
     - Process: Find .tf files → terraform validate → report errors
  4. Asks: "Approve creation? (y/n)"
```

### Triggering Routing Optimization

**Automatic** (weekly schedule):
- Every Monday: System runs optimization
- Shows report: "Routing optimization ready - review changes?"

**Manual** (on-demand):
- You say: "optimize routing"
- System runs immediate optimization

**Background** (passive learning):
- System learns from every interaction
- Tracks success/failure in working memory
- Weekly cycle uses accumulated data

### Reviewing Proposals

When system proposes changes, you'll see:

```
🔧 Skill Creation Proposal: @changelog-generator

**Gap Detected**: Recurring task (3× in lessons.md)
**Purpose**: Generate changelog from git commits
**Triggers**: "generate changelog", "create release notes"
**Process**:
  1. Read git log since last release
  2. Categorize commits (feat/fix/chore)
  3. Generate markdown changelog
  4. Append to CHANGELOG.md

**Integration**:
- Routing: Add to index.md decision tree
- Facts: Add changelog format conventions
- Metrics: Track usage frequency

**Approve? (y/n/modify)**
```

**Options**:
- **y** (yes): Create skill and integrate
- **n** (no): Skip, record rejection (won't propose again for 30 days)
- **modify**: Adjust specification before creation

---

## Benefits

### 1. Avoid Repetitive Problem-Solving

**Before self-evolution**:
```
Problem occurs → Investigate (10 min) → Solve → Done
Problem occurs again → Investigate again (10 min) → Solve → Done
Problem occurs third time → Investigate again (10 min) → Solve → Done
Total: 30 minutes
```

**After self-evolution**:
```
Problem occurs → Investigate (10 min) → Solve → Record in registry
Problem occurs again → Check registry (30 sec) → Apply known solution → Done
Problem occurs third time → Check registry (30 sec) → Apply known solution → Done
Total: 11 minutes (19 minutes saved)
```

### 2. Expand System Capabilities Organically

**Before**:
- Fixed set of 6 skills
- Any new task type requires manual skill creation
- No learning from experience

**After**:
- System starts with 8 skills
- Detects gaps and creates skills automatically
- Learns from patterns (3× rule)
- Grows capabilities based on your actual usage

### 3. Improve Routing Accuracy

**Before**:
- Fixed trigger phrases
- Ambiguous requests require clarification
- Routing success rate: ~70-80%

**After**:
- Learns your vocabulary (synonym expansion)
- Builds composite routes for common multi-skill tasks
- Routing success rate: Target >90%

### 4. Build Institutional Knowledge

**Solution registry** becomes a knowledge base:
- Top 10-20 problems you encounter
- Proven solutions with success rates
- Time-to-resolution for each problem
- Historical trends (which problems most common)

**Value grows over time**:
- Month 1: 5 problems documented
- Month 3: 15 problems documented
- Month 6: 25+ problems documented
- Each addition saves time on future occurrences

---

## Monitoring & Feedback

### Check System Health

**Quick check**:
```
You: "Show routing performance"
System: Reports current success rate, recent changes
```

**Detailed metrics**:
- File: `.agent/monitoring/metrics.md`
- Sections:
  - Skill Creation (count, success rate)
  - Routing Optimization (success rate, synonym coverage)
  - Solution Registry (problems documented, time saved)

### Provide Feedback

**When routing is incorrect**:
```
You: "No, I meant [correct skill]"
System: Records correction in feedback.md
Next week: Optimization uses this to improve
```

**When skill doesn't work as expected**:
```
You: "This skill isn't working correctly"
System: Updates skill status to "needs revision"
Proposes: Fix or deprecate skill
```

**When solution doesn't work**:
```
You: "This solution didn't work"
System: Updates solution confidence
If confidence drops below 50%: Mark for review/removal
```

---

## Examples: Self-Evolution in Action

### Example 1: Automatic Skill Creation

**Scenario**: You frequently need to run security scans

**Timeline**:
```
Week 1: You manually run security scan, system records in lessons.md
Week 2: You manually run security scan again
Week 3: You manually run security scan third time

System detects pattern:
  🔧 Detected recurring pattern: security scanning (3×)
  
  Proposed skill: @security-scanner
  Purpose: Run security scans across repos
  Triggers: "run security scan", "check vulnerabilities"
  Process:
    1. Identify repos with security scan config
    2. Run scan (npm audit, pip-audit, etc.)
    3. Parse results
    4. Report vulnerabilities with severity
  
  Approve creation? (y/n)

You: y

System: ✅ Created @security-scanner
  - Added to .agent/skills/security-scanner.md
  - Updated routing in index.md
  - Status: draft (needs testing)

Week 4: You: "run security scan"
System: → @security-scanner (automatic routing, no manual process)
```

### Example 2: Synonym Learning

**Scenario**: You use different phrases than default triggers

**Timeline**:
```
You: "fix broken references"
System: "Clarify: Did you mean check links?"
You: "Yes, wiki-links"
System: Routes to @link-checker, records synonym

Next Monday optimization:
  🧠 Routing Optimization Report
  
  Detected synonym:
    - "broken references" = "broken links" (high confidence)
    - Used 1× this week, user confirmed intent
  
  Proposed: Add "broken references" to @link-checker triggers
  
  Approve? (y/n)

You: y

System: ✅ Added synonym

Next time:
You: "check for broken references"
System: → @link-checker (immediate, no clarification)
```

### Example 3: Problem → Solution Registry

**Scenario**: You encounter a sync conflict issue

**Timeline**:
```
First occurrence:
You: "Wiki sync failed with merge conflict"
System: Investigates... finds conflict in Airflow Patterns.md
System: Resolves by manual merge, records solution

Solution registered as P006:
  Problem: Wiki Sync Merge Conflict
  Symptoms: Sync fails, conflict in .md file
  Root Cause: Manual vault edits + external repo updates
  Solution: 
    1. Read both versions
    2. Section-level merge (preserve vault + external)
    3. Flag unresolvable conflicts
  Success Rate: 1/1 (100%)
  Confidence: Low (first occurrence)

Second occurrence (2 weeks later):
You: "Wiki sync failed again, merge conflict"
System: Checks solutions.md → Match: P006
System: "Known problem P006 - applying proven solution"
System: Applies section-level merge, resolves conflict
System: Updates: Success Rate 2/2, Confidence: Medium

Third occurrence (1 month later):
You: "Same merge conflict issue"
System: Checks solutions.md → Match: P006 (High confidence)
System: Auto-applies solution (no explanation needed)
System: Updates: Success Rate 3/3, Confidence: High
```

Time saved: 
- First: 15 min (investigation)
- Second: 3 min (apply known solution)
- Third: 2 min (auto-apply high confidence)
- Total saved: 20 minutes over 3 occurrences

---

## Best Practices

### 1. Approve Thoughtfully

**When reviewing skill proposals**:
- ✅ Approve if: Pattern is genuine, skill will save time
- ❌ Reject if: One-off task, too simple for skill, already covered

**When reviewing routing changes**:
- ✅ Approve if: Synonym is accurate, clarification was genuinely needed
- ❌ Reject if: Synonym is ambiguous, could cause false positives

### 2. Provide Clear Feedback

**When system gets it wrong**:
- Don't just say "wrong" - specify what was wrong
- Example: "No, I meant @metadata-keeper not @link-checker"
- System learns from specificity

**When system gets it right**:
- No action needed (success is tracked automatically)
- But feel free to confirm: "Yes, exactly what I needed"

### 3. Monitor Metrics

**Check monthly** (5 minutes):
- `.agent/monitoring/metrics.md`
- Routing success rate trending up? ✅
- Solution registry growing? ✅
- Skills being created appropriately? ✅

**If metrics degrade**:
- Review recent changes
- Identify problematic routing rules or skills
- Rollback if needed

### 4. Trust but Verify

**For new skills (draft status)**:
- Test thoroughly before marking "active"
- Report issues immediately
- System learns from failures too

**For high-confidence solutions**:
- Generally safe to auto-apply
- But stay vigilant - if solution fails, report it
- Confidence will adjust accordingly

---

## Troubleshooting

### Problem: Too Many Skills Created

**Symptom**: System proposing skills for every small task

**Cause**: Over-sensitive pattern detection

**Fix**:
1. Reject inappropriate skill proposals
2. System learns from rejections
3. Adjust threshold: Change 3× rule to 5× (edit skill-creator.md)

### Problem: Routing Success Rate Degraded

**Symptom**: After optimization, more clarifications needed

**Cause**: Over-generalized synonyms causing ambiguity

**Fix**:
1. Review recent routing changes in index.md
2. Identify problematic synonyms
3. Remove or refine problematic rules
4. System will adjust based on failures

### Problem: Solution Registry Not Used

**Symptom**: System re-investigating known problems

**Cause**: Symptom matching not working

**Fix**:
1. Review problem descriptions in solutions.md
2. Make symptoms more specific
3. Add alternative symptom phrases
4. System will match better next time

### Problem: Skills Not Being Used

**Symptom**: Created skills but never routed to

**Cause**: Triggers don't match user's natural language

**Fix**:
1. Check skill triggers in index.md
2. Add more trigger phrases (your natural vocabulary)
3. Routing optimization will eventually learn this
4. But manual fix is faster

---

## Maintenance

### Weekly

**Every Monday** (automated):
- @routing-optimizer runs optimization cycle
- Review proposed changes (~5 minutes)
- Approve/reject changes
- System applies approved changes

### Monthly

**First of month** (manual):
- Review `.agent/monitoring/metrics.md`
- Check trends:
  - Routing success rate (target: >90%)
  - Skill creation rate (target: <5/month)
  - Solution registry growth (target: +3-5 problems/month)
- Adjust thresholds if needed

### Quarterly

**Every 3 months** (manual):
- Audit skill inventory:
  - Which skills are actually used? (high value)
  - Which skills are unused? (consider deprecate)
  - Which skills overlap? (consider merge)
- Audit solution registry:
  - Which problems obsolete? (move to archive)
  - Which problems most common? (optimize solutions)
- Update system based on findings

---

## Advanced: Customization

### Adjust Pattern Detection Threshold

**Default**: 3× (same pattern 3 times → propose skill)

**To change** (edit `.agent/skills/skill-creator.md`):
```markdown
### When to CREATE new skill

✅ **Strong signals**:
- Repeated task type (5+ times in lessons.md)  # Changed from 3+
```

**Effect**: More conservative skill creation (fewer false positives)

### Adjust Routing Success Target

**Default**: 90% (target for immediate routing without clarification)

**To change** (edit `.agent/monitoring/metrics.md`):
```markdown
**Target**: >95% success rate
```

**Effect**: Higher bar for routing optimization approval

### Disable Automatic Optimization

**Default**: Weekly automatic optimization (every Monday)

**To disable** (edit `.agent/skills/routing-optimizer.md`):
```markdown
**Trigger**: 
- Manual: "optimize routing"
- Automatic: [DISABLED]  # Changed from "Weekly schedule"
```

**Effect**: Only run optimization on explicit request

---

## FAQ

**Q: How do I know if a skill should be created?**  
A: If you've done the same task 3+ times manually, it's a good candidate. System will detect and propose automatically.

**Q: What if system creates too many skills?**  
A: Reject proposals that aren't valuable. System learns from rejections and adjusts sensitivity.

**Q: Can I manually create a skill without 3× pattern?**  
A: Yes, just say "create skill for X". System will design it on-demand.

**Q: What if routing optimization makes things worse?**  
A: Changes are tracked. You can rollback by editing `.agent/index.md` to previous version. System learns from degraded performance.

**Q: How do I add a problem to solution registry?**  
A: Just solve the problem normally. System will ask: "Record this solution for future?" Say yes.

**Q: Can I edit skills after creation?**  
A: Yes, skills are markdown files in `.agent/skills/`. Edit directly and test.

**Q: What happens to deprecated skills?**  
A: They're kept for reference (status: deprecated) but removed from active routing.

---

## Summary

Self-evolution system = **Learning from experience**

**Three mechanisms**:
1. **@skill-creator**: Patterns (3×) → New skills → Automation
2. **@routing-optimizer**: Experience → Better routing → Less clarification
3. **Solution registry**: Problems → Known solutions → Time savings

**Your role**:
- Review and approve proposals (5-10 min/week)
- Provide feedback when system is wrong
- Monitor metrics monthly (5 min)

**System's role**:
- Detect patterns automatically
- Propose improvements proactively
- Learn from every interaction
- Apply approved changes safely

**Result**: System gets better over time, tailored to your specific usage patterns.

---

**Version**: 5.0  
**Created**: 2026-06-05  
**Last Updated**: 2026-06-05  
**Next Review**: 2026-07-05
