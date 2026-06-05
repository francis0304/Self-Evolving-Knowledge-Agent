# Skill: git-ops

## Purpose
Safe, conventional git operations.

## When to use
Triggers: commit, branch, merge, rebase, push, force, revert

## Steps
1. Always check `git status` before any destructive op
2. Use `--force-with-lease` instead of `--force`
3. Commit messages follow Conventional Commits: `type(scope): subject`
4. Branch names: `type/ticket-id-short-desc` (e.g., `feat/JIRA-123-add-cache`)

## Examples
- `git push --force-with-lease origin feat/JIRA-123-add-cache`
- `git commit -m "fix(auth): handle expired tokens"`

## Anti-patterns
- `git push --force` on shared branches
- Squashing commits authored by others without permission
- Rebasing main/master

## Related
- memory/facts.md §git-conventions
- learning/lessons.md #git

## Confidence: 0.9
