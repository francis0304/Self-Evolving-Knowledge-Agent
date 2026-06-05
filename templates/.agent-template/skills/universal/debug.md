# Skill: debug

## Purpose
Diagnose failures using evidence-first strategies, not guesses.

## When to use
Triggers: error, stack trace, crash, bug, fail, regression, flaky

## Steps
1. Read the full stack trace / log — do not skim
2. Reproduce locally with the smallest possible input
3. When history matters, `git bisect` to isolate the bad commit
4. Check environment differences (env vars, secrets, DB state) before code
5. Add logging at the boundary, not inside pure functions

## Examples
- Bisecting a failing test across 50 commits to find the breaking change
- Diffing prod vs local env vars before blaming code
- Capturing input state that reproduces a flaky test

## Anti-patterns
- Guessing at fixes without reproducing first
- Swallowing exceptions with try/except-log-and-continue
- Adding `print` statements to committed code (use the logger)

## Related
- memory/facts.md §forbidden
- learning/lessons.md #debug

## Confidence: 0.8
