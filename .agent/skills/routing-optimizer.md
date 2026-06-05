# Routing Optimizer - Self-Learning Route Decisions

---

## Purpose

Learns from routing successes and failures to optimize `.agent/index.md` routing rules, ensuring faster and more accurate delegation to skills.

**Trigger**:
- Automatic: After each user interaction (background learning)
- Manual: "optimize routing" / "improve agent routing"
- Scheduled: Weekly (via maintenance schedule)

---

## Core Concept

The router (.agent/index.md) starts with basic rules. Over time, it learns:
- **Which phrases** actually trigger which skills (usage patterns)
- **Which routing decisions** were correct (user didn't need to rephrase)
- **Which routing decisions** failed (user had to clarify or rephrase)
- **New trigger phrases** users naturally use (expand vocabulary)

---

## Learning Data Sources

### 1. Lessons.md - Problem Resolution Patterns

Extract from `.agent/learning/lessons.md`:

```
Pattern: "Problem: [X] → Solution: [Y]"
```

**Example**:
```markdown
## 2026-06-05: User Said "Fix Broken References" But Meant Links

**Context**: User requested "fix broken references in docs"
**Routing**: Initially unclear (references = links? citations? code imports?)
**Clarification**: User meant wiki-links
**Correct routing**: @link-checker → maintain-links
**Lesson**: "broken references" = synonym for "broken links"

**Action**: Add "broken references" to @link-checker triggers
```

### 2. Feedback.md - Direct Corrections

Extract from `.agent/learning/feedback.md`:

```
Pattern: User corrected agent routing
```

**Example**:
```markdown
User: "Check vault health"
Agent: Routed to @link-checker only
User: "No, I meant all health checks - links AND metadata"

**Correction**: "vault health" = @link-checker + @metadata-keeper (parallel)
**Action**: Update routing for "vault health" to trigger both
```

### 3. Working Memory - Current Session Success

Track in `.agent/memory/working.md`:

```markdown
## Recent Routing Decisions

| User Input | Routed To | Success | Notes |
|------------|-----------|---------|-------|
| "check links" | @link-checker | ✅ | Immediate, no clarification |
| "update index" | @indexer | ✅ | Immediate |
| "vault cleanup" | ❌ (unclear) | ❌ | Required clarification → @link-checker + @metadata-keeper |
```

**Success = No user clarification needed**

---

## Optimization Process

### Step 1: Collect Routing Data

**Scan learning system**:
```python
routing_data = {
    "successes": [],      # Immediate correct routes
    "failures": [],       # Required clarification
    "new_synonyms": [],   # User phrases not in current triggers
    "ambiguous": []       # Multiple valid interpretations
}

# From lessons.md
for lesson in lessons:
    if "routing" in lesson or "clarification" in lesson:
        extract_routing_pattern(lesson, routing_data)

# From feedback.md
for feedback in feedback:
    if "wrong skill" in feedback or "should have" in feedback:
        extract_correction(feedback, routing_data)

# From working.md (current session)
for interaction in working_memory:
    track_routing_success(interaction, routing_data)
```

### Step 2: Generate Routing Improvements

**Analyze patterns**:

#### Pattern: New Synonym Discovered
```
User said: "broken references"
Current trigger: "broken links", "link health"
Pattern: "broken references" ≈ "broken links"

→ Add "broken references" to @link-checker triggers
```

#### Pattern: Ambiguous Phrase
```
User said: "vault health"
Options:
  - @link-checker (links)
  - @metadata-keeper (frontmatter)
  - Both? (full health check)

Resolution from history:
  - 2/3 times meant both
  - 1/3 times meant links only

→ Default: Both (parallel execution)
→ Add note: "If only links, say 'link health'"
```

#### Pattern: Multi-Step Inference
```
User said: "prepare for new company"
Current routing: None (no match)

From lessons.md:
  - This required: archive old company notes + create new company folder + update Index.md
  - Touches: file operations, Index.md, metadata

Skills involved:
  - File operations (no existing skill → gap!)
  - @indexer (Index.md update)
  - @metadata-keeper (tag updates)

→ Identify gap: Need @vault-organizer skill for folder operations
→ Route to @skill-creator to create it
```

### Step 3: Update Routing Rules

**Generate proposed changes** to `.agent/index.md`:

```markdown
## Proposed Routing Updates

### 1. Expand @link-checker triggers
**Add**: "broken references", "link health check", "find dead links"
**Reason**: Used by user 3× in last week, always meant link checking
**Confidence**: High

### 2. Add composite route for "vault health"
**Route**: @link-checker + @metadata-keeper (parallel)
**Reason**: 67% of "vault health" requests needed both (from history)
**Confidence**: Medium

### 3. Clarify ambiguous "sync" phrase
**Current**: "sync patterns" → @sync-keeper
**Ambiguity**: "sync" alone unclear (patterns? repo? vault?)
**Improvement**: Require specificity
  - "sync patterns" → @sync-keeper
  - "sync repo" → clarify which repo
  - "sync" alone → ask "Sync what? (patterns/repo/vault)"
**Confidence**: High

### 4. New gap detected: folder operations
**Pattern**: User manually organized vault folders 2×
**Needed**: Archive, move, bulk rename operations
**Recommendation**: Create @vault-organizer skill
**Confidence**: Medium (needs validation)
```

### Step 4: User Review & Apply

**Show changes** to user:
```
🧠 Routing Optimization Report

**Learning period**: Last 7 days
**Interactions analyzed**: 24
**Routing success rate**: 83% (20/24 immediate, 4 needed clarification)

**Proposed improvements**:

1. ✅ Expand @link-checker vocabulary (+3 synonyms)
2. ✅ Add composite route for "vault health"  
3. ✅ Clarify "sync" ambiguity
4. 🔧 Create @vault-organizer skill (gap detected)

**Apply changes? (y/n/review)**
```

If **approved**:
1. Update `.agent/index.md` (add triggers, update routing rules)
2. Update `.agent/memory/facts.md` (document new conventions)
3. If gaps detected → Delegate to @skill-creator
4. Record optimization in `.agent/learning/lessons.md`

### Step 5: Validate Improvements

**Track routing success rate** over next period:
```
Before optimization: 83% success rate (20/24)
After optimization: [measure next period]

If improved → Keep changes
If degraded → Rollback, analyze why
```

---

## Routing Rule Patterns

### Pattern: Direct Mapping
```
User phrase → Single skill (high confidence)

"check links" → @link-checker
"update index" → @indexer
"add tags" → @metadata-keeper
```

### Pattern: Composite (Parallel)
```
User phrase → Multiple skills (all needed simultaneously)

"vault health" → @link-checker + @metadata-keeper (parallel)
"full audit" → @link-checker + @metadata-keeper + @sync-keeper (parallel)
```

### Pattern: Sequential Chain
```
User phrase → Skill A → (output) → Skill B

"sync and index" → @sync-keeper (sync wikis) → @indexer (add to Index.md)
"create MOC and link" → @moc-builder (create MOC) → @link-checker (verify links)
```

### Pattern: Conditional
```
User phrase + context → Different skills based on state

"check X":
  - If X = file → Check existence (basic)
  - If X = links → @link-checker
  - If X = metadata → @metadata-keeper
  - If X = sync status → @sync-keeper
```

### Pattern: Ambiguous (Clarify)
```
User phrase unclear → Ask clarification → Route after

User: "clean up"
Agent: "Clean up what? (links/metadata/index/all)"
User: "links"
Agent: → @link-checker
```

---

## Synonym Expansion Strategy

### Collect User Vocabulary

Track phrases users naturally use (from working memory):

```
Canonical trigger: "check links"
User variations:
  - "find broken links"
  - "broken references"
  - "link health"
  - "validate links"
  - "dead links"

→ Add all as valid triggers for @link-checker
```

### Confidence Levels

- **High confidence**: Used 3+ times, always meant same skill
- **Medium confidence**: Used 2 times, likely same skill
- **Low confidence**: Used 1 time, needs more data

Only add High confidence synonyms automatically.
Medium/Low → Ask user: "Did you mean [skill]?"

---

## Problem → Solution Knowledge Base

Maintain a **solution registry** at `.agent/memory/solutions.md`:

```markdown
# Solution Registry - Known Problem Patterns

---

## Problem: Broken Wiki Links After Renaming Files

**Symptoms**: Links show as unresolved after file rename
**Root Cause**: Obsidian doesn't auto-update links in all cases
**Solution**: @link-checker → maintain-links → Fix broken links
**Confidence**: High (solved 5×)
**Last seen**: 2026-06-04

---

## Problem: Notes Missing from Index.md After Bulk Creation

**Symptoms**: Created 10+ notes but not in Index.md
**Root Cause**: Manual index maintenance can't keep up with bulk creation
**Solution**: @indexer → update-index → Scan for unindexed notes
**Confidence**: High (solved 3×)
**Last seen**: 2026-06-05

---

## Problem: External Wiki Patterns Out of Sync

**Symptoms**: Vault wiki content differs from external repo wiki
**Root Cause**: External repo updated but sync not run
**Solution**: @sync-keeper → sync-patterns → Merge updates
**Confidence**: High (solved 4×)
**Last seen**: 2026-06-03
```

### Using Solution Registry

When user describes problem:
1. **Match symptoms** to known problems
2. **Suggest solution** from registry
3. **Route to appropriate skill**
4. **Record outcome** (did solution work?)
5. **Update confidence** (increment success count)

**Example**:
```
User: "Some of my wiki links stopped working after I reorganized folders"

@routing-optimizer:
  1. Match symptoms → "Broken Wiki Links After Renaming Files"
  2. Known solution: @link-checker → maintain-links
  3. Confidence: High (solved 5× before)
  4. Route immediately (no clarification needed)
  5. After resolution: Increment success count to 6×
```

---

## Integration with Skill Creator

When routing optimization detects a **capability gap**:

```
@routing-optimizer detects:
  - User request pattern not covered by existing skills
  - Manual intervention required 3+ times for same task type
  - No clear routing target

→ Delegate to @skill-creator:
    "Create skill for: [task pattern]"
    Context: [user requests, manual steps, frequency]

@skill-creator:
  - Designs new skill
  - Proposes integration
  
@routing-optimizer:
  - Updates routing rules to include new skill
  - Adds to monitoring for validation
```

---

## Metrics & Monitoring

Track in `.agent/monitoring/metrics.md`:

### Routing Performance
- **Success rate**: % of immediate correct routes (no clarification)
- **Failure rate**: % requiring clarification or correction
- **Ambiguity rate**: % of unclear user requests

### Optimization Impact
- **Before/after success rate**: Compare pre/post optimization
- **Synonym coverage**: # of trigger phrases per skill
- **Gap detection**: # of capability gaps identified
- **Skill creation triggers**: # times routing optimization triggered @skill-creator

### Trends
- **Weekly success rate**: Track over time
- **Most ambiguous phrases**: Top 5 phrases requiring clarification
- **Most improved skills**: Skills with most trigger phrase additions

---

## Weekly Optimization Cycle

**Every Monday** (or configurable):

1. **Collect data**: Scan lessons/feedback/working memory from last week
2. **Analyze patterns**: Identify synonyms, ambiguities, gaps
3. **Generate report**: Proposed routing improvements
4. **Present to user**: "Routing optimization ready - review changes?"
5. **Apply approved changes**: Update index.md, facts.md
6. **Validate**: Measure routing success rate next week

---

## Error Handling

### Over-generalization
```
Problem: Added synonym that causes false positives

Example:
  - Added "clean" as synonym for @link-checker
  - But "clean code" doesn't mean link checking!

Detection:
  - User corrects routing 2+ times for same phrase
  
Fix:
  - Remove over-generalized synonym
  - Add to exceptions list
  - Record in feedback.md
```

### Conflicting Routes
```
Problem: New rule conflicts with existing rule

Example:
  - "check health" → @link-checker
  - "check health" → @metadata-keeper
  - Both valid!

Resolution:
  - Make composite route (both in parallel)
  - Or: Add context qualifier ("check link health" vs "check metadata health")
```

### Degraded Performance
```
Problem: After optimization, success rate drops

Example:
  - Before: 83% success
  - After: 75% success (worse!)

Action:
  - Rollback recent changes
  - Analyze which changes caused degradation
  - Re-optimize with corrected logic
```

---

## Example: Full Optimization Cycle

### Week 1: Baseline
```
Routing success: 20/24 (83%)
Failures:
  - "vault cleanup" (unclear)
  - "fix references" (synonym not recognized)
  - "organize notes" (no skill exists)
  - "sync" (ambiguous)
```

### Week 2: Analysis
```
@routing-optimizer analyzes:
  1. "fix references" → Always meant @link-checker (add synonym)
  2. "vault cleanup" → 2× meant @link-checker, 1× meant both (clarify)
  3. "organize notes" → Gap: no vault organization skill (create @vault-organizer)
  4. "sync" alone → Ambiguous (require specificity)
```

### Week 2: Optimization
```
Applied changes:
  ✅ Added "fix references" to @link-checker triggers
  ✅ Changed "vault cleanup" to ask: "Cleanup what? (links/metadata/all)"
  🔧 Created @vault-organizer skill (via @skill-creator)
  ✅ Updated "sync" to require specificity
```

### Week 3: Validation
```
Routing success: 28/30 (93%) ⬆️ +10%
Remaining failures:
  - "refresh docs" (new phrase, no pattern yet)
  - "prepare release" (complex, multi-skill chain)

→ Keep optimizations (success rate improved)
→ Monitor new failure patterns for next cycle
```

---

## MCP Requirements

**Operates on .agent/ system files** (not vault content).

Use **direct file I/O**:
- Read: `.agent/learning/lessons.md`, `feedback.md`, `.agent/memory/working.md`
- Edit: `.agent/index.md` (update routing rules)
- Write: `.agent/memory/solutions.md` (solution registry)
- Edit: `.agent/monitoring/metrics.md` (track routing performance)

**Do NOT use MCP** for .agent/ system files.

---

**Created**: 2026-06-05
**Status**: active
**Version**: 1.0
