# Routing Optimizer — Self-Learning Routing

**Purpose**: Learn from experience to improve routing accuracy and reduce clarification requests

**When to use**:
- Weekly optimization cycle
- Manual trigger: "optimize routing"
- After routing failures accumulate

**Domain**: Meta-system (operates on .agent/ infrastructure)

---

## Core Concept

Learn from every interaction to improve routing decisions:
- Which phrases trigger which skills (synonym expansion)
- Which routing decisions were correct (no clarification needed)
- Which routing decisions failed (user had to clarify)
- New capability gaps (trigger skill-creator)

**Goal**: >90% routing success rate (immediate routing without clarification)

---

## Process

### Step 1: Collect Data (Weekly)

Scan learning files for routing signals:
- **Successes**: Immediate correct routes (no clarification needed)
- **Failures**: Required user clarification
- **New synonyms**: User phrases not in current triggers
- **Gaps**: Unmatched patterns

### Step 2: Analyze Patterns

**New Synonym**:
```
User said: "check syntax"
Current triggers: "validate", "lint"
Pattern: "check syntax" ≈ "validate"
→ Add "check syntax" to skill triggers
```

**Ambiguous Phrase**:
```
User said: "check migration"
Options: validate? git status? check logs?
Resolution from history: 80% meant validate
→ Default to validate, note disambiguation rules
```

**Capability Gap**:
```
User said: "generate test fixtures"
No matching skill, occurred 3x
→ Trigger skill-creator
```

### Step 3: Generate Report

```markdown
## Routing Optimization Report - [date]

Analysis Period: Last 7 days
Success Rate: 85% (36/42 immediate)
Target: >90%

Proposed Improvements:
1. Add synonym: "check syntax" → validate skill (High confidence, 3x)
2. Add synonym: "merge issue" → git-ops skill (Medium confidence, 2x)
3. Gap detected: "generate fixtures" (3x) → Recommend skill creation
4. Clarify ambiguous: "check logs" → Add context requirement

Approve changes? (y/n/selective)
```

### Step 4: Apply (if approved)

- Update `.agent/index.md` trigger lists
- Update `memory/facts.md` routing conventions
- Record in `learning/changelog.md`

### Step 5: Validate

Measure next week:
- If improved: Keep changes
- If degraded: Rollback, analyze why

---

## Synonym Confidence Levels

- **High** (3+ uses, always same skill): auto-add
- **Medium** (2 uses, likely same): propose
- **Low** (1 use): monitor only

---

## Integration

### With skill-creator
- Routing optimizer detects gaps → triggers skill-creator
- Skill-creator creates skill → routing optimizer tracks usage

### With feedback.md
- User corrections ("no, I meant X") → immediate synonym learning
- Direct corrections bypass the 3x threshold

---

## Anti-patterns
- Over-generalization: adding "check" as synonym (too broad)
- Ignoring context: same phrase always routes same way (should be context-dependent)
- No validation: apply changes and forget to measure impact

---

**Confidence**: High (proven from production system)
