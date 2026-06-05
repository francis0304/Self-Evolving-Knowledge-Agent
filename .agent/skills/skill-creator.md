# Skill Creator - Autonomous Skill Generation

---

## Purpose

Identifies capability gaps in the agent system and autonomously generates new specialized skills when needed.

**Trigger**: 
- User request falls outside existing skill coverage
- Repeated manual interventions for same task type (detected from lessons.md)
- Explicit: "create skill for X" / "add capability for X"

---

## Process

### 1. Gap Detection

**Analyze user request** against existing skill directory:
- Does it fit @link-checker? (link health)
- Does it fit @indexer? (Index.md maintenance)
- Does it fit @metadata-keeper? (frontmatter/tags)
- Does it fit @sync-keeper? (external sync)
- Does it fit @moc-builder? (MOC creation)

If **NO match** → Capability gap detected.

**Check lessons.md** for recurring patterns:
- 3+ lessons about same task type = Strong signal for new skill
- Same manual intervention repeated = Automation opportunity

### 2. Skill Design

**Generate skill specification**:

```yaml
name: skill-name
purpose: One-line description
triggers:
  - "user phrase 1"
  - "user phrase 2"
  - pattern_from_lessons
domain: [vault|external-repo|meta-system]
tools_needed:
  - MCP tools / Read/Write / Bash / etc.
inputs:
  - param1: description
  - param2: description
outputs:
  - result format
process:
  1. Step 1
  2. Step 2
  3. Step 3
error_handling:
  - scenario: action
integration:
  - index.md routing: "trigger" → @skill-name
  - memory: facts to add
  - monitoring: metrics to track
```

### 3. Skill Template Generation

**Create skill markdown** at `.agent/skills/{skill-name}.md`:

```markdown
# Skill Name - Description

---

## Purpose
[One-line purpose]

**Triggers**:
- User phrase patterns
- System conditions

---

## Inputs

### Required
- param1: Description

### Optional
- param2: Description

---

## Process

### Step 1: [Action]
[Details]

### Step 2: [Action]
[Details]

### Step 3: [Action]
[Details]

---

## Outputs

### Success
- Format description
- Example

### Error Cases
- Scenario: Handling

---

## Integration

### Routing (index.md)
Add to routing rules:
```
User: "trigger phrase"
  → @skill-name: [context to provide]
```

### Memory (.agent/memory/facts.md)
Add conventions:
- Fact 1
- Fact 2

### Monitoring (.agent/monitoring/metrics.md)
Track:
- Metric 1
- Metric 2

---

## Testing Checklist

- [ ] Test case 1
- [ ] Test case 2
- [ ] Error case 1

---

**Created**: [date]
**Status**: draft
**Tested**: no
```

### 4. Integration Plan

**Show user**:
```
🔧 New skill detected: @skill-name

**Gap**: [description of what's missing]
**Purpose**: [what the skill does]
**Triggers**: [how to activate]

**Integration steps**:
1. Review skill spec: .agent/skills/{skill-name}.md
2. Add routing to .agent/index.md
3. Add facts to .agent/memory/facts.md
4. Test with: "[test trigger phrase]"

**Approve creation? (y/n)**
```

### 5. Auto-Integration (if approved)

1. **Write skill file** → `.agent/skills/{skill-name}.md`
2. **Update index.md routing** → Add to decision tree
3. **Update facts.md** → Add conventions
4. **Update metrics.md** → Add tracking
5. **Record in lessons.md** → "Created @skill-name for {purpose}"
6. **Mark as draft** → Needs testing before promotion to "active"

---

## Skill Lifecycle

### Draft → Active
```
1. Create skill (status: draft)
2. User tests with trigger phrases
3. If works correctly → Update status: active
4. If issues → Iterate on skill definition
```

### Active → Deprecated
```
1. Skill no longer needed / replaced by better approach
2. Mark status: deprecated
3. Keep file for reference (don't delete)
4. Update routing to new approach
```

---

## Heuristics for Skill Creation

### When to CREATE new skill

✅ **Strong signals**:
- Repeated task type (3+ times in lessons.md)
- Complex multi-step process (5+ steps)
- Domain-specific knowledge required
- Error-prone manual process
- Batch operation opportunity

✅ **Examples**:
- "Generate changelog from git history" (repeated 3×)
- "Validate terraform syntax across repos" (complex, multi-repo)
- "Create presentation deck from notes" (domain-specific formatting)

### When NOT to create skill

❌ **Weak signals**:
- One-off request (no pattern)
- Simple 1-2 step process (routing overhead not worth it)
- Already covered by existing skill with minor variation
- User preference, not capability gap

❌ **Examples**:
- "Add note to Index.md" → Already @indexer
- "Check if file exists" → Too simple for dedicated skill
- "Search for keyword" → Basic tool use, not skill-level

---

## Integration with Learning System

### From Lessons → Skill
```
lessons.md contains:
  - 2026-06-01: Generate changelog manually (pain point)
  - 2026-06-03: Generate changelog again (recurring)
  - 2026-06-04: Generate changelog third time (pattern!)

→ @skill-creator detects pattern
→ Proposes: @changelog-generator skill
→ User approves
→ Skill created + integrated
→ Record: "Promoted changelog generation to skill (pattern: 3×)"
```

### From Skill → Pattern
```
Skill proves useful (used 5+ times, no errors)
→ Extract core pattern to .agent/learning/patterns.md
→ Pattern can inspire skills for other domains

Example:
  @changelog-generator pattern → "Auto-generate summaries from structured data"
  → Could apply to: Release notes, sprint reports, etc.
```

---

## MCP Requirements

**This skill operates on .agent/ system files** (not vault content).

Use **direct file I/O** (Read/Write/Edit tools):
- Read: `.agent/learning/lessons.md` (detect patterns)
- Write: `.agent/skills/{new-skill}.md` (create skill)
- Edit: `.agent/index.md` (update routing)
- Edit: `.agent/memory/facts.md` (add conventions)

**Do NOT use MCP** for .agent/ system files (these are agent infrastructure, not vault content).

---

## Error Handling

### Skill name conflict
```
@skill-creator proposes: @changelog-generator
But .agent/skills/changelog-generator.md already exists

→ Check existing skill status
→ If deprecated: Propose reactivation + update
→ If active: Propose variation name or merge with existing
```

### Invalid skill design
```
Skill design has logical issues (missing steps, circular dependencies)

→ Show design to user
→ Ask for clarification
→ Iterate until valid
```

### Integration failure
```
Routing update to index.md conflicts with existing route

→ Show conflict
→ Propose resolution (merge routes, clarify triggers)
→ User decides
```

---

## Metrics

Track in `.agent/monitoring/metrics.md`:
- Skills created (total count)
- Skills active vs draft vs deprecated
- Skill usage frequency (top 5)
- Skill creation success rate (draft → active %)
- Patterns promoted to skills (count)

---

## Example: Creating @changelog-generator

**User request**: "Generate changelog from git log"

**@skill-creator analysis**:
1. Check existing skills → No changelog generation skill
2. Check lessons.md → Found 3 occurrences of manual changelog generation
3. Gap detected: changelog generation

**Proposed skill**:
```yaml
name: changelog-generator
purpose: Generate changelog from git history
triggers:
  - "generate changelog"
  - "create release notes"
  - "summarize commits"
domain: external-repo
tools_needed: [Bash (git log), Read (CHANGELOG.md), Write (updated changelog)]
process:
  1. git log --since="last release" --pretty=format:"%s"
  2. Categorize commits (feat/fix/chore)
  3. Generate markdown sections
  4. Append to CHANGELOG.md
```

**Integration**:
- Routing: `User: "generate changelog" → @changelog-generator`
- Facts: "Changelog format: Keep a Changelog style"
- Metrics: Track changelog generation frequency

**User approves** → Skill created → Ready for testing

---

## Testing

Before marking skill as "active":

1. **Unit test**: Run skill with sample inputs
2. **Integration test**: Trigger via routing from user phrase
3. **Error test**: Try invalid inputs, missing files
4. **Performance test**: Run on realistic data (not just toy examples)

**Promotion criteria**:
- All tests pass
- User confirms it works as expected
- No major design issues discovered

---

**Created**: 2026-06-05
**Status**: active
**Version**: 1.0
