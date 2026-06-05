# Skill Creator — Autonomous Skill Generation

**Purpose**: Detect capability gaps and create new specialized skills when patterns emerge (3x rule)

**When to use**: 
- Same manual task performed 3+ times (pattern detected in lessons.md)
- User explicitly requests: "create skill for X"
- Capability gap: No existing skill matches the request

**Domain**: Meta-system (operates on .agent/ infrastructure)

---

## Core Concept

**3x Rule**: Once you manually do something 3 times, the system proposes automating it as a skill.

---

## Process

### Step 1: Gap Detection

Scan `learning/lessons.md` for recurring patterns:
- Extract task types from recent lessons
- Count occurrences
- Filter: count ≥ 3 AND no existing skill covers it

### Step 2: Skill Design

Generate specification:
```yaml
name: skill-name
purpose: One-line description
triggers: [phrase1, phrase2, phrase3]
domain: [code|test|deploy|meta]
process:
  1. Step 1
  2. Step 2
  3. Step 3
```

### Step 3: Create Skill File

Write to `.agent/skills/{skill-name}.md` following the standard template:
- Purpose, When to use, Steps, Examples, Anti-patterns, Confidence

### Step 4: Integration

- Update `.agent/index.md` routing table
- Record in `learning/changelog.md`

### Step 5: User Review

```
Skill Creation Proposal: {name}

Gap Detected: {description}
Frequency: Occurred 3x in last {timeframe}
Purpose: {what it does}
Triggers: {trigger phrases}

Process:
1. {step 1}
2. {step 2}
3. {step 3}

Approve? (y/n/modify)
```

If approved → create and test.
If rejected → record in feedback.md, don't propose again for 30 days.

---

## Skill Lifecycle

```
Pattern Detected (3x)
    ↓
Propose Skill → User Reviews
    ├─ Approved → Create Draft → Test → Active
    └─ Rejected → Record (skip 30 days)
    ↓
Active → Used regularly
    ├─ Still useful → Maintain
    └─ Obsolete → Deprecate (mark, don't delete)
```

---

## Heuristics

### CREATE skill when:
- Task performed 3+ times manually
- Complex multi-step process (5+ steps)
- Domain-specific knowledge required
- Error-prone manual execution

### DON'T create skill when:
- One-off task (no pattern)
- Simple 1-2 step process
- Already covered by existing skill
- Too generic (better as Global skill)

---

## Local vs Global Skills

- **Local** (`.agent/skills/`): Repo-specific workflows
- **Global** (`.github/skills/`): Reusable across projects

When a local skill proves valuable across repos → refactor into Global skill (export-back pattern from meta.md).

---

## Anti-patterns
- Over-specialization: one skill per minor variation (should be one flexible skill)
- Premature creation: skill after 1 occurrence (no confirmed pattern)
- Duplicate skills: creating without checking index.md first

---

**Confidence**: High (proven pattern)
