# Universal Skills

These skills work in **any repository** regardless of domain. Copy them into your `.agent/skills/` directory and they're ready to use.

## Included Skills

| Skill | Purpose | Triggers |
|-------|---------|----------|
| `git-ops.md` | Safe git operations | commit, branch, merge, rebase, push |
| `debug.md` | Evidence-first error diagnosis | error, stack trace, crash, bug, fail |
| `refactor.md` | Code extraction/simplification | rename, extract, split, simplify |
| `pr-review.md` | Diff analysis and review | review, PR, diff, merge request |
| `meta.md` | Audit agent health, export lessons | audit skills, improve agent, retrospective |
| `skill-creator.md` | Detect 3x patterns → propose new skills | capability gap, create skill |
| `routing-optimizer.md` | Learn synonyms, improve routing | optimize routing, weekly cycle |
| `graphify-check.md` | Knowledge graph freshness monitor | session start (auto) |

## How to Use

1. Copy desired skills into your `.agent/skills/` directory
2. Add entries to your `.agent/index.md` routing table
3. Skills activate automatically when user intent matches their triggers

## Skill Anatomy

Every skill follows the same structure:

```markdown
# Skill: name

## Purpose
One sentence.

## When to use
Trigger phrases and conditions.

## Steps
1. Numbered actionable steps
2. Clear and specific
3. Includes decision points

## Examples
Concrete usage examples (what works, what doesn't)

## Anti-patterns
Common mistakes to avoid

## Confidence: 0.0-1.0
```

## Creating Domain-Specific Skills

When your repo needs skills beyond these universals:

1. Check if a 3x pattern has emerged (see `skill-creator.md`)
2. Use `_template.md` from the parent `skills/` directory
3. Keep skills under 500 tokens (short, actionable)
4. Add routing entry to `index.md`
5. Test with 3-5 real scenarios before marking as active

## Relationship to Global Skills

- **Universal skills** (this directory): Work anywhere, ship with the template
- **Domain skills** (your `skills/` root): Repo-specific workflows
- **Global skills** (`.github/skills/`): Team-shared, versioned with code

When a domain skill proves valuable across repos → export-back to Global skill (see `meta.md` §export-back).
