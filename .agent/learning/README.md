# Learning

Learning files capture how the agent system improves over time.

## Files

| File | Purpose |
|---|---|
| `lessons.md` | Notable discoveries, errors, and workarounds |
| `patterns.md` | Repeated lessons being watched for promotion |
| `feedback.md` | User corrections and routing misses |
| `changelog.md` | Audit trail for `.agent/` edits |

## Rules

- Keep `lessons.md` append-only until compaction.
- Write feedback immediately when the user corrects behavior.
- Promote repeated lessons after 3 confirmations.
- Record every `.agent/` edit in `changelog.md`.
- Compatibility prompt files do not write learning files; Codex updates learning during the post-task loop.
