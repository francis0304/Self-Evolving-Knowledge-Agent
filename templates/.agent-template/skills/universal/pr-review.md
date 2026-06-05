# Skill: pr-review

## Purpose
Review a pull request diff for correctness, style, and risk.

## When to use
Triggers: review, PR, diff, merge request, code review

## Steps
1. Read the full diff (`git diff main...HEAD` or PR URL)
2. Categorize changes: new feature / bug fix / refactor / config / docs
3. Check for: logic errors, edge cases, missing tests, security issues
4. Note: breaking changes, performance implications, dependency additions
5. Summarize: 1-3 key findings, overall risk (low/medium/high)

## Review Dimensions
- **Correctness**: Does it do what it claims? Edge cases handled?
- **Security**: Input validation, injection vectors, auth checks?
- **Performance**: O(n²) loops, unnecessary allocations, missing indexes?
- **Maintainability**: Clear naming, reasonable complexity, tests?
- **Consistency**: Follows existing patterns in this codebase?

## Examples
- "Line 45: potential NPE — `user.profile` is nullable but not checked"
- "This adds a dependency on `left-pad`; consider inline implementation"
- "Missing test for the empty-input case on line 72"

## Anti-patterns
- Nitpicking style when linter handles it
- Reviewing without understanding the context/ticket
- Rubber-stamping ("LGTM") without actually reading

## Related
- memory/facts.md §conventions
- learning/lessons.md #review

## Confidence: 0.85
