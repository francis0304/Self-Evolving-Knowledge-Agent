# Skill: meta (audit & improve the agent system)

## Purpose
Periodically audit the .agent/ system health and propose improvements.

## When to use
- Weekly retrospective
- After any feedback that contradicts a skill
- Triggers: "audit skills", "agent health", "improve agent", "run retrospective"

## Steps

### 1. Audit skill health
- Flag skills with 0 usage in 60 days (deprecation candidate)
- Flag skills > 1500 tokens (split candidate)
- Check routing accuracy from recent lessons

### 2. Analyze learning
- Count lesson occurrences per tag → update patterns.md
- Check feedback entries → propose skill updates
- Identify 3x patterns → trigger skill-creator

### 3. Resolve open questions
`facts.md` may carry an `## Open questions` section.
- Did recent tasks answer any? → move answer to appropriate section, delete the row
- Did recent tasks surface new unknowns? → add a row

### 4. Export-back (if Global skills exist)
When a lesson appears ≥3x with same tag and extends a Global skill:
1. Identify target section in `.github/skills/<skill>/SKILL.md`
2. Draft minimal diff
3. Record in `learning/changelog.md` under `### Proposed`
4. Create PR touching only `.github/` file

### 5. Wiki audit (if knowledge/ exists)
- Orphan pages (not in index) → add row
- Stale pages (`last_reviewed` > 90 days) → flag
- Pages > 1500 tokens → split candidate
- Pages with <2 cross-links → flag for enrichment

### 6. Record findings
- Write to `learning/retrospective.md`
- Log changes to `learning/changelog.md`

## Anti-patterns
- Auto-applying changes without logging to changelog
- Deleting lessons (only compact into archive)
- Editing Global skills silently (always go through PR)

## Confidence: 1.0
