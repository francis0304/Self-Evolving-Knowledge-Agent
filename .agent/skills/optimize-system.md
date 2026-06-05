# optimize-system

**Purpose:** Self-optimizing protocol for `.agent/` architecture. Compacts learning loop, distills subagent prompts, hardens guardrails, and enhances routing.

**Trigger:** `/optimize-system` or manually: "optimize system"

**Frequency:** Monthly OR when `learning/lessons.md` >8K tokens

**Expected Time:** 75 minutes (15 scout + 45 optimize + 15 package)

---

## Three-Phase Protocol

### Phase 1: Scout & Diagnose (15 min)

**Objective:** Identify bottlenecks and opportunities

**Steps:**
1. Read all learning files:
   - `.agent/learning/lessons.md` (check size, count entries)
   - `.agent/learning/patterns.md` (identify 3× patterns)
   - `.agent/learning/feedback.md` (check for recurring themes)

2. Read all memory files:
   - `.agent/memory/facts.md` (check coverage)
   - `.agent/memory/working.md` (check staleness)

3. Read all subagent files:
   - Count subagents in `.agent/agents/` or `.claude/agents/`
   - Measure each subagent prompt token count
   - Check for facts.md duplication

4. Read `.agent/manifest.json` (check version, metadata)

5. Check for graphify topology (optional):
   - Read `graphify-out/topology_summary.md` if exists
   - Identify god nodes (high-centrality files)

**Diagnosis Output:**
```markdown
## Diagnosis Results

### Context Bloat
- lessons.md: {size}K tokens, {count} entries
- patterns.md: {count} 3× patterns ready for promotion
- Subagent prompts: {list with token counts}

### Redundancy
- Facts.md duplication in: {list subagents}
- Overlapping patterns in: {list}

### Promotion Lag
- 3× patterns NOT in facts.md: {count}
- High-confidence lessons (>30 days): {count}

### Routing Gaps
- God nodes without pre-flight: {list if graphify available}
- Error recovery patterns: {missing/present}
```

---

### Phase 2: Pilot Optimization (45 min)

**Objective:** Execute 5 optimization operations

#### Operation 1: Compact lessons.md (15 min)

**Goal:** 60-70% token reduction

**Actions:**
1. Identify patterns to promote (3× observations + high confidence):
   ```markdown
   Pattern: {description}
   Occurrences: {list lesson IDs}
   Evidence: {dates, case names, line numbers}
   Confidence: {high/medium}
   ```

2. Promote to facts.md:
   - Write consolidated rule with evidence citations
   - Delete individual lesson entries
   - Update facts.md with proper formatting

3. Merge redundant wins:
   - Collapse multiple "PASS" entries → summary section
   - Group by theme (deployment, validation, fixes)

4. Archive old entries:
   - Entries >30 days → move to `learning/lessons_archive_{date}.md`
   - Keep rolling 30-day window

5. Measure reduction:
   - Before: {X} entries, {Y}K tokens
   - After: {X2} entries, {Y2}K tokens
   - Reduction: {%}

#### Operation 2: Distill Subagent Prompts (10 min)

**Goal:** 40-50% token reduction via facts.md references

**Actions:**
1. For each subagent, identify facts.md duplication:
   - Rules duplicated from facts.md: {list}
   - Token count: {before} → {after estimate}

2. Replace duplications with references:
   ```markdown
   ## Critical Constraints (see facts.md)
   - **{Rule Name}** — [reference facts.md]
   - Keep ONLY top 3 subagent-specific constraints here
   ```

3. Update each subagent file:
   - Remove duplicated facts.md content
   - Add reference section at top
   - Keep only subagent-specific patterns

4. Measure distillation:
   - Total subagent tokens: {before}K → {after}K
   - Average reduction: {%}

#### Operation 3: Harden Guardrails (10 min)

**Goal:** Evidence-based pattern refinement

**Actions:**
1. Enhance fixer/validator subagents with evidence:
   - Pattern: {name}
   - Evidence: {lesson IDs, line numbers, case names}
   - Confidence: {high/medium based on 3× threshold}

2. Add search patterns:
   ```markdown
   **Search pattern:** Grep for `{regex}` to find violations
   ```

3. Add confidence notes:
   ```markdown
   **Confidence:** High (seen 3×: {case1}, {case2}, {case3})
   ```

#### Operation 4: Enhance Routing (5 min)

**Goal:** Add topology-aware routing + error recovery

**Actions:**
1. If graphify available, add god-node pre-flight:
   ```markdown
   **God-node awareness** — tasks touching high-centrality files require pre-flight:
   - {file1} ({edges} edges) — verify dependencies
   - {file2} ({edges} edges) — check for latent pitfalls
   ```

2. Add error recovery pattern:
   ```markdown
   **Error recovery** — parallel dispatch researcher + fixer
   Auto-apply if: fixer confidence=HIGH AND researcher found matching pitfall
   ```

#### Operation 5: Update Manifest (5 min)

**Actions:**
1. Bump version in manifest.json:
   ```json
   "version": "5.2" // increment minor version
   ```

2. Add optimization_history entry:
   ```json
   "optimization_history": [
     {
       "date": "2026-06-04",
       "lessons_reduction": "67%",
       "subagent_reduction": "50%",
       "patterns_promoted": 4,
       "notes": "First optimization run"
     }
   ]
   ```

3. Add failure_count fields if missing:
   ```json
   "failure_count": 0,
   "retry_count": 0
   ```

---

### Phase 3: Package Results (15 min)

**Objective:** Document and prepare for cross-repo sharing

#### Step 1: Generate Optimization Report (8 min)

Create `.agent/reports/optimization_{date}.md`:

```markdown
# Optimization Report: {date}

## Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| lessons.md | {X} entries, {Y}K | {X2} entries, {Y2}K | {%} reduction |
| Subagent prompts | {avg}K | {avg2}K | {%} reduction |
| facts.md coverage | {%} | {%} | - |
| Context efficiency | baseline | optimized | +{%} |

## Operations Executed

1. ✅ Compacted lessons.md: {details}
2. ✅ Distilled subagent prompts: {list}
3. ✅ Hardened guardrails: {list patterns}
4. ✅ Enhanced routing: {additions}
5. ✅ Updated manifest: v{old} → v{new}

## Patterns Promoted to facts.md

1. **{Pattern Name}**
   - Evidence: {lesson IDs}
   - Confidence: High
   - Token savings: ~{X}K

## Time Investment

- Phase 1 (Scout): {X} min
- Phase 2 (Optimize): {X} min  
- Phase 3 (Package): {X} min
- **Total**: {X} min

## Projected ROI

- Annual savings: ~40 hours (less context loading, clearer patterns)
- Investment: {X} hours
- ROI: {X}× return
```

#### Step 2: Extract Meta-Lessons (5 min)

Identify cross-repo applicable patterns:

```markdown
# Meta-Lessons for Cross-Repo Sharing

## Lesson 1: {Title}
**Pattern:** {description}
**Evidence:** {from this repo}
**Applicable To:** {vault-wide / specific domain}
**How to Apply:** {steps}

## Lesson 2: ...
```

#### Step 3: Update MEMORY.md (2 min)

If meta-lessons are vault-wide, add to `.agent/memory/facts.md` or note in `MEMORY.md`.

---

## Success Criteria

After optimization, verify:

✅ lessons.md loads in <2 seconds (was >4)  
✅ lessons.md reduced by 50-70%  
✅ Subagent prompts reference facts.md (no duplication)  
✅ At least 3× patterns promoted to facts.md  
✅ manifest.json version bumped  
✅ Archive file created (lessons_archive_{date}.md)  
✅ Optimization report generated

---

## Delegation Test

Run a typical task to verify optimization:

```
User: "{typical task for this repo}"

Main agent → delegates to subagent

Verify:
- Subagent prompt loads in <3 seconds (was >5 pre-optimization)
- Facts.md referenced correctly
- Routing works as expected
```

---

## Troubleshooting

**Q: lessons.md still >8K after compaction**  
A: Lower promotion threshold to 2× (aggressive), or archive >60 days instead of >30.

**Q: Subagent prompts not distilled**  
A: Check facts.md exists and has overlapping rules. Distillation only removes ≥30% overlap.

**Q: God-node routing but no graphify**  
A: Run `/graphify .` first, or remove god-node rules if not using graphify.

**Q: Optimization broke routing**  
A: Restore from `.agent-backup-{timestamp}` and re-run with conservative settings.

---

## Notes

- **Backup:** Always backup `.agent/` before optimization (auto-created as `.agent-backup-{timestamp}`)
- **Frequency:** Monthly OR when lessons.md >8K tokens
- **Review:** Check optimization_history in manifest.json quarterly
- **Cross-repo:** Share meta-lessons via vault's `knowledge/` directory

---

**Status:** Operational  
**First Deployed:** 2026-06-03 (redshift-reporting)  
**Token Count:** ~4200 tokens  
**Expected Time:** 75 minutes  
**Expected ROI:** 32× (40h saved / 1.25h invested annually)
