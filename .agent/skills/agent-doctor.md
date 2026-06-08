# agent-doctor

## Purpose
Self-repair and hygiene for the `.agent/` system. Prune dead skills, archive stale lessons, fix working memory, sync manifest.

## When to use
- Monthly maintenance
- lessons.md > 30 entries (auto-detect)
- Dead skills detected (hit_count=0, >60 days)
- working.md corruption
- "clean up agent system", "optimize system"

## 6 Repair Actions

| Action | Trigger | What it does |
|--------|---------|--------------|
| prune-dead-skills | hit_count=0 + >60d | Delete skill file + remove from index.md |
| archive-lessons | entries >30d old | Move to `learning/lessons_archive_*.md` |
| fix-working-memory | duplicate/corrupt sections | Reconstruct clean (1 active + 5 recent) |
| sync-manifest | files out of sync | Reconcile with actual skill/agent files |
| compact-solutions | 0/0 success templates | Remove unused, keep proven |
| slim-skills | skill >40 lines + delegates | Rewrite as dispatch-only guide |

## Process
1. Main agent reads system files and diagnoses what needs repair
2. Builds repair manifest (which actions, current state)
3. Executes targeted fixes (or delegates to subagent if available)
4. Returns summary: what changed, % reduction

## Anti-patterns
- Do NOT run without diagnosis first (diagnose before fixing)
- Do NOT delete lessons (archive them)
- Do NOT slim skills that are under 40 lines already
