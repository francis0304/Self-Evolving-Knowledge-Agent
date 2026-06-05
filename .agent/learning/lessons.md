# Lessons Learned - Knowledge Vault

---

## 2026-06-03: MCP Tools Required for Vault Operations

**Context**: Setting up .agent system for Obsidian vault

**Problem**: Initial design considered using direct file I/O (Read/Write tools)

**Discovery**: Obsidian vault has special structure (links, backlinks, frontmatter) that MCP understands natively

**Solution**: Use MCP tools exclusively (mcp__obsidian__*) for all vault operations

**Impact**: 
- Proper link resolution
- Backlink tracking works correctly
- Obsidian graph view stays in sync
- No need to parse wiki-links manually

**Applies To**: All vault maintenance tasks, any Obsidian integration

**Confidence**: High - Design decision based on MCP capabilities

---

## 2026-06-03: Orphan Detection Must Exclude System Files

**Context**: Designing maintain-links skill for orphan file detection

**Problem**: Initial orphan detection would flag Index.md, daily notes, templates as orphaned

**Discovery**: Many files are intentionally unlinked (Index.md is hub, daily notes are independent, templates are blueprints)

**Solution**: Exclude from orphan detection:
- Index.md (navigation hub)
- daily/*.md (journal entries, independent)
- templates/*.md (blueprints, not referenced)
- .agent/*.md (system files)
- .obsidian/*.md (config)
- Recently created files (<7 days, may be work-in-progress)

**Impact**: Reduces false positives, focuses on actual orphaned content

**Applies To**: Link health checking, vault audits

**Confidence**: High - Learned from SAP cleanup experience (2026-05-26)

---

## 2026-06-03: Batch Operations Need User Approval

**Context**: Designing add-frontmatter skill for batch metadata updates

**Problem**: Auto-updating 10+ files without user review could cause issues

**Discovery**: Users want to see what will change before applying (trust + control)

**Solution**: 
- Show preview/diff before applying
- For >5 files: Ask explicit approval
- For >10 files: Show preview in batches (10 at a time)
- Allow user to approve/reject/modify

**Impact**: Safer batch operations, user maintains control, builds trust in agent system

**Applies To**: All batch operations (frontmatter, link fixes, syncs)

**Confidence**: High - UX best practice

---

## 2026-06-03: Preserve Manual Edits When Syncing

**Context**: Designing sync-patterns skill for wiki synchronization

**Problem**: Vault wikis may have manual edits not in external repos, blind overwrite would lose them

**Discovery**: Users add vault-specific notes, examples, customizations to synced content

**Solution**: 
- Compare vault vs external (section-level)
- Merge: Update external sections, preserve vault-only sections
- Flag conflicts for manual review
- Never blindly overwrite

**Impact**: Vault becomes source of truth + external sync, not just read-only mirror

**Applies To**: All sync operations, any merge scenarios

**Confidence**: High - Merge logic best practice

---

## 2026-05-26: Orphaned Files Hard to Discover Without Tools

**Context**: Manual SAP folder cleanup

**Problem**: Found multiple orphaned files that were not linked anywhere, hard to discover manually

**Discovery**: No easy way to find orphaned files in Obsidian UI (graph shows linked notes only)

**Solution**: Automated link checking with backlink analysis (led to maintain-links skill)

**Impact**: Regular automated checks prevent orphan accumulation, easier maintenance

**Applies To**: Vault health monitoring, periodic maintenance

**Confidence**: High - Pain point experienced firsthand

---

---

## 2026-06-05: Self-Evolution System Implemented

**Context**: User requested autonomous skill creation and routing optimization to avoid repeating same problem-solving

**Problem**: 
- Agent system had fixed capabilities (6 skills)
- Routing rules were static (no learning from experience)
- Same problems required re-investigation each time
- No mechanism to detect patterns and automate recurring tasks

**Discovery**: 
- Patterns appear frequently (e.g., same task type 3+ times)
- Users use different vocabulary than default triggers (synonyms)
- Many problems recur with same root cause and solution
- Manual skill creation was reactive, not proactive

**Solution Implemented**:

1. **@skill-creator** - Autonomous skill generation
   - Detects capability gaps (no matching skill for request)
   - Recognizes recurring patterns (3× rule from lessons.md)
   - Designs skill specification automatically
   - Proposes integration (routing, facts, metrics)
   - User approval required before creation
   - Lifecycle: draft → active (after testing) → deprecated

2. **@routing-optimizer** - Self-learning routing
   - Learns from lessons.md (corrections), feedback.md (user feedback), working.md (success/failure)
   - Synonym expansion (add user's natural phrases to triggers)
   - Composite routes (multi-skill parallel for common combos)
   - Gap detection (triggers @skill-creator for unmatched patterns)
   - Weekly optimization cycle (every Monday)
   - Metrics: Routing success rate (target >90%)

3. **Solution Registry** (.agent/memory/solutions.md)
   - Known problem → Proven solution mapping
   - Structure: P00X: Symptoms → Root Cause → Solution → Success Rate
   - First occurrence: Investigate (10-15 min) + record
   - Subsequent: Apply known solution (2-3 min) 
   - Confidence levels: Low (1-2×) → Medium (3-4×) → High (5+×)
   - Time savings: ~8-12 min per known problem occurrence

**Impact**:
- **Capability growth**: System can now create skills autonomously based on usage
- **Routing accuracy**: Learning from experience improves routing over time
- **Time efficiency**: Known problems resolved in ~2-3 min vs 10-15 min investigation
- **Knowledge accumulation**: Solution registry builds institutional memory
- **Reduced repetition**: 3× pattern → Automated skill (never manual again)

**Integration**:
- Created: `.agent/skills/skill-creator.md`, `.agent/skills/routing-optimizer.md`
- Created: `.agent/memory/solutions.md` (5 initial problems documented)
- Updated: `.agent/index.md` (added routing rules for self-evolution)
- Updated: `.agent/memory/facts.md` (added self-evolution conventions)
- Updated: `.agent/monitoring/metrics.md` (added self-evolution KPIs)
- Created: `.agent/Self-Evolution-Guide.md` (user documentation)

**Files Created/Modified**:
- New: skill-creator.md, routing-optimizer.md, solutions.md, Self-Evolution-Guide.md
- Modified: index.md, facts.md, metrics.md

**Applies To**: All future agent operations, continuous learning

**Confidence**: High - Proven pattern from software engineering (CI/CD, ML ops, DevOps automation)

**Key Innovation**: System now learns from every interaction and evolves capabilities autonomously, avoiding the need to re-solve same problems.

---

## 2026-06-05: Self-Evolution System Synced to Redshift-Reporting Repo

**Context**: User requested syncing self-evolution system to work repos (redshift-reporting)

**Challenge**: 
- Vault .agent uses MOC/vault-specific architecture (MCP-first)
- Work repos use code-focused architecture (different file structure)
- Need to adapt self-evolution for code development context

**Solution**:
- Adapted skill-creator.md for code repo context (Local vs Global skills)
- Adapted routing-optimizer.md for development workflow
- Created solutions.md with code-specific problem templates (SQL conversion, validation, git conflicts)
- Updated index.md with self-evolution routing rules (integrated with existing rules 1-12)
- Created SELF-EVOLUTION-UPDATE.md documentation (repo-specific guide)

**Files Synced to** `${EXTERNAL_REPOS}/example-repo-redshift/`:
```
.agent/
├── skills/
│   ├── skill-creator.md         # Adapted for code repo
│   └── routing-optimizer.md     # Adapted for code repo
├── memory/
│   └── solutions.md              # Code-specific problem templates
├── index.md                      # Updated with rules 3, 8, 9
└── SELF-EVOLUTION-UPDATE.md     # Repo-specific documentation
```

**Key Adaptations**:
- Problem templates: SQL conversion errors, validation diffs, git conflicts (not vault-specific)
- Integration: Works with existing skills (git-ops, debug, pr-review, convert-sp-block)
- Terminology: Local skills (repo-specific) vs Global skills (.github/skills/)
- Context: Development workflow vs knowledge management

**Git Commit**: 
```
commit cb65e75
feat(.agent): Add self-evolution system v5.0
- skill-creator, routing-optimizer, solutions.md
- Updated index.md routing rules
- See SELF-EVOLUTION-UPDATE.md
```

**Impact**:
- Redshift-reporting repo now has self-evolution capabilities
- Will learn from development patterns (SP conversion, testing, deployment)
- Same 3× rule applies (manual task 3 times → propose skill)
- Weekly optimization cycle starts next Monday

**Next Steps**:
- Monitor lessons.md in redshift-reporting for emerging patterns
- First routing optimization: 2026-06-12 (next Monday)
- Expected first skill proposal: When any manual task occurs 3×

**Applies To**: Cross-repo knowledge transfer, system portability

**Confidence**: High - Successfully adapted architecture for different context

---

## Archive

[Move lessons older than 6 months with no repeats here]

---

**Created**: 2026-06-03
**Last Updated**: 2026-06-05
