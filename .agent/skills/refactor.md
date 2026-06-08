# Skill: refactor

## Purpose
Extract, simplify, or restructure code without changing behavior.

## When to use
Triggers: rename, extract, split, simplify, clean up, DRY, dedup

## Steps
1. Ensure tests exist and pass BEFORE starting (create if missing)
2. Make one structural change at a time — run tests between each
3. Rename first (cheap, safe), then extract, then restructure
4. If renaming crosses module boundaries, grep for all callers first
5. After refactor, diff the test output — behavior must be identical

## Examples
- Extract a 200-line function into 3 focused helpers
- Rename `processData` → `validateAndTransformOrder` (intention-revealing)
- Split a god-module into domain-aligned sub-modules

## Anti-patterns
- Refactoring without tests (can't prove behavior preserved)
- Mixing behavior changes with structural changes in one commit
- Premature abstraction (3 similar lines is fine; 10 is a pattern)

## Related
- memory/facts.md §structure-conventions
- learning/lessons.md #refactor

## Confidence: 0.85
