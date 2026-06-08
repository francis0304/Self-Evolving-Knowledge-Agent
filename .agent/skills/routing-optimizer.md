# routing-optimizer

## Purpose
Learn from routing successes/failures to improve index.md trigger accuracy.

## When to use
- Weekly optimization cycle
- "optimize routing"
- After routing failures accumulate

## Process
1. Scan learning files for last 7 days (lessons.md, feedback.md)
2. Identify: new synonyms, ambiguous phrases, capability gaps
3. Generate report: proposed trigger changes + success rate
4. Present to user for approval
5. Apply approved changes to index.md
6. Validate next week (rollback if degraded)

## Synonym Confidence
- **High** (3+ uses, same skill): auto-add
- **Medium** (2 uses): propose
- **Low** (1 use): monitor only

## Integration
- Gaps detected → triggers skill-creator
- User corrections in feedback.md → immediate synonym learning (bypass 3x threshold)

## Anti-patterns
- Over-generalization (e.g., "check" alone is too broad)
- Applying changes without measuring impact next period
- Running more than weekly (insufficient data)
