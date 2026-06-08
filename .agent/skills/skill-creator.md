# Skill: skill-creator

## Purpose
Detect capability gaps and create new workflow skills when patterns emerge.

## When to use
- Same manual task performed 3 or more times.
- User explicitly requests a new skill.
- No existing skill matches a recurring request.

## Steps

1. Scan `learning/lessons.md`, `learning/feedback.md`, and `memory/working.md` for repeated task shapes.
2. Count occurrences and require at least 3 confirmations before proposing automation.
3. Check `.agent/index.md` and `.agent/skills/` to avoid duplicates.
4. Draft a skill with purpose, triggers, steps, anti-patterns, and confidence.
5. Update `.agent/index.md` routing only after the skill is useful enough to activate.
6. Record all changes in `learning/changelog.md`.

## Skill Proposal Format

```text
Skill Creation Proposal: {name}

Gap detected: {description}
Frequency: {count} occurrences
Purpose: {what it does}
Triggers: {trigger phrases}
Files to change: {list}
```

## Promotion Targets

- Local runtime skill: `.agent/skills/{name}.md`
- Reusable skill package: a shared skill directory or a plugin-provided skill
- Plugin: use when the workflow needs skills plus commands, MCP config, hooks, assets, or bundled tools

## Anti-patterns

- Creating a skill after one occurrence.
- Creating one skill per tiny variation.
- Adding provider-specific worker routing to the active runtime.
- Updating reusable skills silently without review.

## Confidence
0.9
