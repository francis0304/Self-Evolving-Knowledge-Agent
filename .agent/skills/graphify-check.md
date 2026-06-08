# Skill: graphify-check

## Purpose
Check knowledge graph freshness and recommend refresh when thresholds are met.

## When to use
- **Session start** (auto — before any task)
- After completing ≥3 wiki/doc page updates
- After major code changes (new module, large refactor)
- User asks about graph status

## Triggers
- Session initialization (automatic)
- Wiki ingest completed
- "Is the graph up to date?"

---

## Steps

### 1. Run status check
```bash
python scripts/graphify_refresh_manager.py --check
```

- Exit 0 → Graph is up-to-date. Proceed silently (don't mention graphify).
- Exit 1 → Refresh recommended. Show reasons.

### 2. If refresh recommended (exit 1)
```bash
python scripts/graphify_refresh_manager.py --status
```

Parse output for: graph age, change counts, trigger reasons.

### 3. Present recommendation

**If up-to-date**: Say nothing.

**If refresh recommended**:
```
Knowledge graph refresh recommended:
   - 4 wiki pages changed (threshold: 3)
   - Graph is 16 days old (threshold: 14)

Run `/graphify . --update` to refresh when convenient.
```

### 4. After graphify completes
```bash
python scripts/graphify_refresh_manager.py --snapshot
```

This saves new baseline and resets change counters.

---

## Refresh Thresholds (Customize Per Repo)

| Trigger | Default Threshold |
|---------|-------------------|
| Wiki/doc pages changed | ≥3 |
| Source modules changed | ≥2 |
| Domain files changed | ≥1 |
| Graph age | ≥14 days |
| Total files changed | ≥10 |

---

## Anti-patterns
- Don't auto-trigger graphify — user controls when to spend tokens
- Don't mention graphify every turn — only when status changes
- Don't forget `--snapshot` after graphify (prevents infinite recommend loop)
- Don't block work on stale graph — refresh is recommendation, not requirement

## Confidence: 0.90

## Dependencies
- `scripts/graphify_refresh_manager.py` (must exist)
- `graphify-out/` (created by graphify)
- `.graphify_state.json` (auto-created on first run)
