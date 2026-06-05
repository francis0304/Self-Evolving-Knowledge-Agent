# Agent System Index - Knowledge Vault

## Repository Context

**Domain**: Obsidian Knowledge Vault
**Primary Purpose**: Personal knowledge management - portable across companies and projects
**Key Technologies**: Markdown, Obsidian, MCP (Model Context Protocol)
**Vault Structure**: knowledge/, companies/, journal/, learning/, templates/

---

## Subagent Directory

| Subagent | Expertise | Use When |
|----------|-----------|----------|
| **@link-checker** | Link validation, orphan detection | "Check links", "Find orphans", "Fix broken links" |
| **@indexer** | Index.md maintenance, categorization | "Update Index.md", "Add new notes", "Organize" |
| **@metadata-keeper** | Frontmatter management, tagging | "Add frontmatter", "Tag notes", "Update metadata" |
| **@sync-keeper** | Wiki pattern synchronization | "Sync patterns", "Update wikis", "Check external repos" |
| **@moc-builder** | Map of Content creation | "Create MOC", "Build topic map", "Link cluster" |
| **@skill-creator** | Autonomous skill generation | Gap detection, "create skill for X", recurring patterns |
| **@routing-optimizer** | Routing decision learning | "optimize routing", background learning, weekly optimization |

## Skills Directory

| Skill | Purpose | Trigger |
|-------|---------|---------|
| **optimize-system** | Self-optimization: compact lessons, distill prompts, harden guardrails | `/optimize-system`, "optimize system" |
| **maintain-links** | Link health maintenance | From @link-checker |
| **update-index** | Index.md maintenance | From @indexer |
| **add-frontmatter** | Batch frontmatter operations | From @metadata-keeper |
| **sync-patterns** | Wiki pattern synchronization | From @sync-keeper |
| **create-moc** | MOC generation | From @moc-builder |
| **skill-creator** | Generate new specialized skills | From @skill-creator or gap detection |
| **routing-optimizer** | Learn and improve routing rules | From @routing-optimizer or weekly schedule |

---

## Routing Rules

### High-Level Decision Tree

```
User Request
  ├─ Link health? ("check links", "find orphans", "broken references")
  │   └─> Delegate to @link-checker
  │
  ├─ Index maintenance? ("update Index.md", "add note")
  │   └─> Delegate to @indexer
  │
  ├─ Metadata tasks? ("add frontmatter", "tag notes")
  │   └─> Delegate to @metadata-keeper
  │
  ├─ Wiki sync? ("sync patterns", "update from repo")
  │   └─> Delegate to @sync-keeper
  │
  ├─ MOC creation? ("create MOC", "map topic")
  │   └─> Delegate to @moc-builder
  │
  ├─ Problem reported? (user describes issue)
  │   └─> Check .agent/memory/solutions.md
  │       ├─ Known problem? → Apply proven solution
  │       └─ Unknown problem? → Investigate + add to registry
  │
  ├─ Capability gap detected? (no existing skill matches)
  │   └─> Delegate to @skill-creator
  │       Generate new skill specification
  │
  ├─ Routing improvement? ("optimize routing")
  │   └─> Delegate to @routing-optimizer
  │       Learn from lessons/feedback, update rules
  │
  └─ Recurring pattern? (same task type 3+ times)
      └─> @skill-creator (proactive skill generation)
```

---

## Rule Categories

### 1. Link Health Management

**Triggers**:
- "check links"
- "find orphaned files"
- "broken links"
- "fix links"
- "link health"

**Delegate to**: @link-checker

**Context to provide**:
- Vault root: C:\Users\your-user\Desktop\Knowledge-Vault
- Key directories: knowledge/, companies/, journal/, learning/
- Index.md path for cross-reference

**Example**:
```
User: "Check for broken links in the vault"
  → @link-checker:
      Scan vault for:
      - Broken wiki-links [[missing]]
      - Orphaned files (no incoming links)
      - Dead external links
      Generate report + fix suggestions
```

---

### 2. Index.md Maintenance

**Triggers**:
- "update Index.md"
- "add note to index"
- "organize navigation"
- "new note created" (proactive)

**Delegate to**: @indexer

**Context to provide**:
- Current Index.md content
- New/unindexed notes list
- Vault structure conventions

**Example**:
```
User: "Add the new SAP analysis note to Index.md"
  → @indexer:
      1. Read Index.md
      2. Determine section (areas/ → Data Platform)
      3. Find appropriate position
      4. Add wiki-link with description
      5. Avoid duplicates
      6. Maintain structure
```

---

### 3. Frontmatter & Metadata

**Triggers**:
- "add frontmatter"
- "tag notes"
- "update metadata"
- "batch tag" (multiple files)

**Delegate to**: @metadata-keeper

**Context to provide**:
- Notes without frontmatter (scan)
- Tagging conventions (from facts.md)
- Folder-to-tag mapping (knowledge/ = universal patterns, companies/ = work context, etc.)

**Example**:
```
User: "Add frontmatter to all notes in companies/current-company/projects/ without it"
  → @metadata-keeper:
      1. Scan companies/current-company/projects/ for notes missing frontmatter
      2. Infer tags from folder + content
      3. Generate frontmatter:
         ---
         tags: [project, data-platform, current-company]
         created: [date]
         updated: [date]
         status: active
         ---
      4. Batch update with user approval
```

---

### 4. Wiki Pattern Synchronization

**Triggers**:
- "sync wiki patterns"
- "update from external repo"
- "check pattern freshness"
- "pull latest patterns"

**Delegate to**: @sync-keeper

**Context to provide**:
- External repo paths (from facts.md)
- companies/current-company/reference/ directory structure
- Manual edits to preserve

**Example**:
```
User: "Sync Airflow patterns from the Airflow repo"
  → @sync-keeper:
      1. Read external repo: C:/Users/.../airflow-repo/knowledge/wiki/
      2. Compare with companies/current-company/reference/Airflow Patterns (DP).md
      3. Identify updates (timestamps, content changes)
      4. Preserve manual vault edits
      5. Merge updates
      6. Report sync status
```

---

### 5. Map of Content (MOC) Creation

**Triggers**:
- "create MOC for X"
- "map topic cluster"
- "build topic index"
- "organize notes about X"

**Delegate to**: @moc-builder

**Context to provide**:
- Topic/keyword
- Related notes (via search)
- MOC structure conventions

**Example**:
```
User: "Create MOC for Data Platform architecture"
  → @moc-builder:
      1. Search vault for "Data Platform" notes
      2. Analyze relationships (links, topics)
      3. Categorize by theme
      4. Generate MOC structure:
         # Data Platform MOC
         ## Overview
         - [[Note 1]]
         ## Components
         - [[Note 2]]
         - [[Note 3]]
         ## Patterns
         - [[Note 4]]
      5. Create bidirectional links
      6. Add to Index.md
```

---

### 6. Self-Evolution: Skill Creation

**Triggers**:
- Capability gap detected (no existing skill matches user request)
- Recurring pattern (same manual task 3+ times in lessons.md)
- Explicit: "create skill for X"

**Delegate to**: @skill-creator

**Context to provide**:
- User request pattern
- Lessons.md entries (if recurring pattern)
- Existing skills (for gap analysis)

**Example**:
```
User: "Generate changelog from git commits" (requested 3rd time)
  → @skill-creator detects pattern:
      1. Check existing skills → No changelog skill
      2. Check lessons.md → Found 3× manual changelog generation
      3. Gap detected: Need @changelog-generator
      4. Design skill:
         - Triggers: "generate changelog", "create release notes"
         - Process: git log → categorize → markdown → append
         - Integration: Add to routing, facts, metrics
      5. Show proposal to user
      6. If approved: Create skill + integrate
```

**Flow**:
```
@skill-creator:
  1. Analyze gap/pattern
  2. Design skill specification
  3. Generate skill markdown (.agent/skills/{name}.md)
  4. Propose integration (routing, facts, metrics)
  5. User approval required
  6. Apply integration
  7. Mark as draft (needs testing)
  8. After validation → Mark as active
```

---

### 7. Self-Evolution: Routing Optimization

**Triggers**:
- Manual: "optimize routing"
- Automatic: Weekly schedule (every Monday)
- Background: After significant interactions

**Delegate to**: @routing-optimizer

**Context to provide**:
- Lessons.md (routing corrections)
- Feedback.md (user corrections)
- Working.md (recent routing success/failure)
- Solutions.md (known problem patterns)

**Example**:
```
User: "My wiki links are broken after renaming files"
  → @routing-optimizer:
      1. Check solutions.md → Match: P001 (Broken Wiki Links)
      2. Known solution: @link-checker → maintain-links
      3. Confidence: High (solved 5× before)
      4. Route immediately (no investigation)
      5. After resolution: Update success count to 6×
```

**Weekly optimization cycle**:
```
Every Monday:
  1. Collect data: Scan lessons/feedback/working (last week)
  2. Analyze patterns:
     - New synonyms discovered (add to triggers)
     - Ambiguous phrases (clarify or make composite)
     - Capability gaps (trigger @skill-creator)
  3. Generate report:
     - Routing success rate (before/after)
     - Proposed improvements
  4. User review & approval
  5. Apply changes:
     - Update index.md routing rules
     - Update facts.md conventions
     - Update solutions.md (new problems)
  6. Validate: Measure success rate next week
```

**Key features**:
- **Synonym expansion**: Add user's natural phrases to triggers
- **Solution registry**: Known problem → Proven solution mapping
- **Gap detection**: Unmatched patterns → Trigger @skill-creator
- **Metrics tracking**: Success rate trends over time

---

## Context Management

### MCP Integration

All vault agents use MCP tools for Obsidian access:

**Available Tools**:
- `mcp__obsidian__list_notes` - List all notes or by path
- `mcp__obsidian__read_note` - Read note content
- `mcp__obsidian__write_note` - Create/update notes
- `mcp__obsidian__search_notes` - Full-text search
- `mcp__obsidian__get_links` - Extract outgoing wiki-links
- `mcp__obsidian__get_backlinks` - Find incoming links

**Pattern**:
```
@subagent:
  1. list_notes(path="projects/")
  2. read_note("projects/Redshift Reporting.md")
  3. Analyze content
  4. write_note("projects/Redshift Reporting.md", updated_content)
  5. get_backlinks() - verify link integrity
```

---

## Error Handling

### Broken Link Resolution

```
@link-checker finds: [[Missing Note]]
  ↓
  1. Search for similar filenames
  2. Search for content matches
  3. If found: Suggest fix ("Did you mean [[Actual Note]]?")
  4. If not found: Suggest creating stub or removing link
  5. User approval before changes
```

### Index.md Conflicts

```
@indexer tries to add note already in Index.md
  ↓
  1. Detect duplicate
  2. Compare locations
  3. If identical: Skip
  4. If different sections: Ask user "Which one to keep?"
  5. Update only if user confirms
```

### Frontmatter Conflicts

```
@metadata-keeper finds note with existing frontmatter
  ↓
  1. Read existing frontmatter
  2. Compare with proposed
  3. If tags differ: Merge (union of both)
  4. If structure different: Preserve existing, add missing fields
  5. Never overwrite user-added fields
```

---

## Memory Integration

### Vault Facts (from .agent/memory/facts.md)

Key conventions:
- **Folder structure**: knowledge/ (universal) companies/ (work-specific) journal/ learning/ templates/
- **Philosophy**: Universal patterns in knowledge/, company implementations in companies/
- **Naming**: Spaces allowed (no dashes in note titles)
- **Frontmatter format**: tags, created, updated, status
- **Link style**: Wiki-links [[Note Title]] preferred
- **Index.md sections**: Knowledge (Universal), Work (Current Company), Templates, Journal, Learning
- **External repos**: 
  - Airflow: ${EXTERNAL_REPOS}/example-repo-airflow
  - Glue: ${EXTERNAL_REPOS}/example-repo-glue
  - Redshift: ${EXTERNAL_REPOS}/example-repo-redshift
  - Infrastructure: ${EXTERNAL_REPOS}/example-repo-infra
  - SRE: ${EXTERNAL_REPOS}/example-repo-sre

### Working Memory

Track in `.agent/memory/working.md`:
- Recent link fixes
- Index.md updates
- Frontmatter batch operations
- Wiki sync status

---

## Parallel Execution Opportunities

### Pattern 1: Link Check + Metadata Audit

```
User: "Audit vault health"
  ├─> [PARALLEL] @link-checker: Check all links
  └─> [PARALLEL] @metadata-keeper: Find notes without frontmatter

Wait for both, then report combined results
```

### Pattern 2: Wiki Sync + Index Update

```
User: "Refresh wikis and update navigation"
  ├─> @sync-keeper: Sync all wiki patterns
  └─> After sync: @indexer: Ensure wikis/ entries in Index.md
```

---

## Optimization Tips

### 1. Batch Operations

For multiple similar tasks:
```
User: "Add frontmatter to all notes in knowledge/ and companies/"
  → @metadata-keeper: Single delegation, two directories
```

### 2. Incremental Link Checking

Instead of scanning entire vault every time:
```
Cache link health in .agent/memory/link_status.md
Only check changed files (via timestamp)
Full scan: weekly
```

### 3. Index.md Smart Diff

Before updating Index.md:
```
1. Read current Index.md
2. Generate proposed changes (diff)
3. Show user only the diff (not entire file)
4. Apply if approved
```

---

## Integration with Graphify

**Note**: Obsidian vault itself doesn't need graphify (notes are simple), but referenced repos do.

**Pattern**:
```
User: "What's the structure of Redshift Reporting?"
  → Read companies/current-company/projects/Redshift Reporting.md (has graphify summary)
  → Or: Check repo's graphify-out/GRAPH_REPORT.md (if sync'd to vault)
```

---

## Maintenance Schedule

### Daily (Automated via MCP)
- Check for new notes not in Index.md
- Scan for common broken links patterns

### Weekly
- Full link health scan
- Review orphaned files
- Sync wiki patterns from external repos
- **Routing optimization** (every Monday - automated via @routing-optimizer)

### Monthly
- Frontmatter consistency audit
- Index.md structure review
- MOC generation for new topic clusters
- **Review self-evolution metrics** (check .agent/monitoring/metrics.md)

---

## Testing Checklist

Validate routing with these scenarios:

1. **Link check**: "Find broken links" → @link-checker
2. **Index update**: "Add new note to Index.md" → @indexer
3. **Metadata**: "Tag all notes in knowledge/" → @metadata-keeper
4. **Wiki sync**: "Update Airflow patterns" → @sync-keeper
5. **MOC**: "Create MOC for agent system" → @moc-builder
6. **Parallel**: "Audit vault health" → Both link-checker + metadata-keeper
7. **Skill creation**: "Create skill for X" → @skill-creator
8. **Routing optimization**: "Optimize routing" → @routing-optimizer
9. **Known problem**: Report symptom matching solutions.md → Auto-apply solution

---

## Notes

- All subagents use MCP tools (never direct file I/O)
- Always preserve user manual edits
- User approval required for batch operations (>5 files)
- Index.md is critical - extra caution on updates
- External repo paths in facts.md - update if repos move

---

## Documentation

### Self-Evolution System (v5.0)

**Quick Start**:
- **1-page overview**: `.agent/Self-Evolution-QuickRef.md` (start here!)
- **Full guide**: `.agent/Self-Evolution-Guide.md` (comprehensive)
- **Architecture**: `.agent/Architecture-Self-Evolution.md` (visual diagrams)
- **Changelog**: `.agent/CHANGELOG.md` (version history)

**Key Files**:
- **Skill creation**: `.agent/skills/skill-creator.md`
- **Routing optimization**: `.agent/skills/routing-optimizer.md`
- **Problem registry**: `.agent/memory/solutions.md`
- **Performance metrics**: `.agent/monitoring/metrics.md`

**Quick Commands**:
- "create skill for X" → Manual skill creation
- "optimize routing" → Trigger routing optimization
- "show solution registry" → List known problems
- "routing performance" → Check success metrics

---

**Version**: 5.0 (Self-Evolution Update)
**Created**: 2026-06-03
**Last Updated**: 2026-06-05
**Next Review**: 2026-07-05
