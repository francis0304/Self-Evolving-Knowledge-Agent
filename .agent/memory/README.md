# Memory

Memory is persistent project context for the main agent.

## Files

| File | Purpose | Update Rule |
|---|---|---|
| `facts.md` | Durable rules and repo conventions | Update rarely, only when evidence is strong |
| `working.md` | Rotating buffer of recent non-trivial tasks | Update after qualifying tasks |
| `archive.md` | Compacted completed-task history | Move old working entries here |

## Ownership

- Codex writes memory files during the post-task loop.
- Compatibility prompt files under `.claude/agents/` do not own memory writes.
- User corrections should be reflected in `learning/feedback.md` first, then promoted to facts only when stable.

## Promotion Flow

```text
learning/lessons.md -> learning/patterns.md -> memory/facts.md
```

Promote only repeated, high-confidence behavior into facts.
