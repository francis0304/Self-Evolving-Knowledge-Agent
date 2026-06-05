# .agent Template System (v5.1)

## What is the .agent System?

The `.agent/` system is a **delegation-first, self-improving AI architecture** for Claude Code. Instead of a single monolithic agent handling everything in one bloated context, it uses:

1. **A thin router** (`index.md`) that dispatches tasks to specialized skills/subagents
2. **Autonomous learning** that converts experience into reusable rules
3. **Cost-conscious execution** that defaults to the cheapest effective approach

### The Core Idea

```
User Request
  ↓
Router (index.md) — matches intent to skill/subagent
  ↓
Skill loaded — instructs delegation to subagent(s)
  ↓
Subagent executes (clean context, narrow scope, 5-15K tokens)
  ↓
Main agent synthesizes result for user
  ↓
Post-task loop — log learnings, update memory (autonomous)
```

### Key Benefits
- **80% context reduction** (10K main + 5-8K subagent vs 40-50K monolithic)
- **Parallel execution** (multiple subagents working simultaneously)
- **Failure isolation** (subagent errors don't pollute main session)
- **Autonomous learning** (system gets smarter with every task)
- **Cost control** (explicit hierarchy: direct < subagent < workflow)

---

## When to Use This Template

**Use it when:**
- Your repository has **>5 distinct workflows**
- You're dealing with **>10K LOC** in a single domain
- Tasks require **multiple sequential steps** that could be parallelized
- You want **accumulated knowledge** from past tasks
- You need **consistent patterns** across similar operations

**Don't use for:**
- Simple scripts (<1K LOC)
- One-off projects
- Pure documentation repos (unless smart maintenance needed)

---

## File Structure

```
.agent/                          # Main system
├── index.md                     # Router: intent → skill → subagent
├── skills/                      # Workflow entry points
│   ├── universal/               # Works in any repo (copy these)
│   │   ├── git-ops.md
│   │   ├── debug.md
│   │   ├── refactor.md
│   │   ├── pr-review.md
│   │   ├── meta.md
│   │   ├── skill-creator.md
│   │   ├── routing-optimizer.md
│   │   └── graphify-check.md
│   └── [your-domain-skills]/    # Your repo-specific skills
├── memory/                      # Session-persistent knowledge
│   ├── facts.md                 # Hardened rules (conventions, constraints)
│   ├── working.md               # Active tasks (rotating 5-item buffer)
│   └── archive.md               # Completed work (grep-searchable)
└── learning/                    # Autonomous improvement
    ├── lessons.md               # What worked/failed (append-only)
    ├── feedback.md              # User corrections (immediate routing fixes)
    ├── patterns.md              # Recurring patterns (3x → skill promotion)
    └── changelog.md             # Audit trail of all system changes
```

---

## Setup Guide

### Step 1: Copy Template

```bash
cp -r /path/to/templates/.agent-template your-repo/.agent
cd your-repo/.agent
for f in $(find . -name "*.template"); do mv "$f" "${f%.template}"; done
```

### Step 2: Customize `index.md`

1. Fill in Repository Context (domain, language, tech stack)
2. Define your routing rules (what triggers what)
3. List planned subagents (start with 2-3)

### Step 3: Seed `memory/facts.md`

Document your project's:
- Code conventions (naming, structure, style)
- Critical constraints ("always X", "never Y")
- Key file paths and patterns
- Domain-specific rules

### Step 4: Choose Universal Skills

Copy skills from `skills/universal/` that match your workflow:
- **Everyone needs**: `git-ops`, `debug`, `meta`
- **Most projects**: `refactor`, `pr-review`
- **After 2+ weeks of use**: `skill-creator`, `routing-optimizer`
- **If using graphify**: `graphify-check`

### Step 5: Design Subagents (Optional)

Create `.claude/agents/` directory with 2-5 specialists:

```markdown
# .claude/agents/worker-name.md

## Role
Expert in [narrow domain]

## Tools Available
Read, Edit, Grep, Bash

## Constraints
- CANNOT do X (that's another subagent's job)
- MUST follow patterns from memory/facts.md
```

### Step 6: Wire CLAUDE.md

Copy `templates/CLAUDE.md.template` → your repo's `CLAUDE.md`. This tells Claude Code to load the agent system.

### Step 7: Test and Iterate

Run 5 representative tasks:
1. Measure context usage
2. Verify delegation works
3. Confirm parallel execution
4. Check memory updates
5. Review lesson quality

---

## How the Learning System Works

### Three-Tier Promotion Flow

```
lessons (1×)  →  patterns (3×)  →  facts (hardened rules)
```

1. **Lessons** — After each non-trivial task, the system logs what worked/failed
2. **Patterns** — When the same lesson appears 3+ times, it's promoted
3. **Facts** — Patterns proven reliable become permanent conventions

### Post-Task Loop (Automatic)

After qualifying tasks (≥5 tool calls, errors found, etc.):
1. Log to `working.md` (goal, approach, outcome, confidence)
2. Append to `lessons.md` if errors, pitfalls, or corrections
3. Resolve open questions in `facts.md` if task provided answers

### Skill Creator (3x Rule)

When `lessons.md` shows the same manual task done 3+ times:
1. System detects the pattern
2. Proposes a new skill (shows what it would do)
3. If user approves → creates skill, updates routing
4. If rejected → records feedback, waits 30 days

### Routing Optimizer (Weekly)

Analyzes routing success/failure:
1. Tracks which phrases triggered which skills
2. Identifies synonym gaps (user says X, skill expects Y)
3. Proposes routing improvements
4. Measures before/after accuracy

---

## Integration Points

### With Graphify (Knowledge Graph)

```bash
# Install the refresh manager
cp templates/scripts/graphify_refresh_manager.py your-repo/scripts/

# Edit TRACKED_PATTERNS and THRESHOLDS in the script for your repo

# Build initial graph
/graphify .

# Take baseline snapshot
python scripts/graphify_refresh_manager.py --snapshot

# The graphify-check skill handles the rest automatically
```

### With Global Skills (Team-Shared)

Place team-wide workflow playbooks in `.github/skills/<name>/SKILL.md`:
- These are canonical — local skills reference them, never duplicate
- Export-back: when local lessons refine a Global skill, PR the improvement

### With Claude Code Hooks

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Read",
        "command": "python scripts/graphify_memory_export.py"
      }
    ]
  }
}
```

---

## Customization Examples

### Code Migration Project
- **Subagents**: converter, validator, fixer, doc-keeper
- **Skills**: convert-module, validate-conversion, fix-diff
- **Memory**: Migration patterns, API mappings, known pitfalls

### API Development
- **Subagents**: endpoint-builder, tester, doc-generator, deployer
- **Skills**: create-endpoint, run-tests, generate-openapi
- **Memory**: API conventions, auth patterns, error formats

### Data Pipelines
- **Subagents**: dag-builder, validator, monitor, optimizer
- **Skills**: create-dag, validate-schema, optimize-cost
- **Memory**: Airflow patterns, data sources, SLAs

### Documentation Repos
- **Subagents**: link-checker, indexer, formatter, publisher
- **Skills**: check-links, update-index, format-all
- **Memory**: Style guide, navigation structure, link patterns

---

## Common Pitfalls

### 1. Over-Delegation
**Problem**: Too many subagent calls, overhead dominates
**Fix**: Merge related tasks, add fast-paths for simple cases

### 2. Context Bloat
**Problem**: Subagent gets too much context, misses the point
**Fix**: Narrow the delegation prompt, provide only relevant excerpts

### 3. Stale Memory
**Problem**: facts.md outdated, subagents follow wrong patterns
**Fix**: Add memory review to meta skill, update after changes

### 4. Poor Routing
**Problem**: Agent uncertain, delegates incorrectly
**Fix**: Add trigger keywords, run routing-optimizer, test edge cases

### 5. Workflow Tool Abuse
**Problem**: Using expensive Workflow tool (50-200K tokens) for simple tasks
**Fix**: Always use subagents (5-15K tokens). Workflow needs explicit user approval.

---

## Success Metrics

Track after ~30 tasks:
- **Context reduction**: 60-80% vs monolithic (target)
- **Routing accuracy**: >95% correct subagent selection
- **Speed improvement**: 20-40% from parallel execution
- **Failure rate**: Decreasing trend as memory accumulates
- **Knowledge growth**: Wiki pages increase, facts.md stabilizes

---

## Version History

| Version | Source | Key Changes |
|---------|--------|-------------|
| v5.1 | redshift-reporting | Workflow prohibition, cost hierarchy, graphify refresh |
| v5.0 | redshift-reporting | Self-evolution, skill-creator, routing-optimizer |
| v4.0 | redshift-reporting | Delegation-first, 5 subagents, wiki integration |
| v3.0 | knowledge-vault | Three-tier memory, learning promotion |
| v2.0 | knowledge-vault | Skills and routing |
| v1.0 | knowledge-vault | Basic memory system |

---

**Based on**: redshift-reporting v5.1 (production-proven, 100+ tasks)
**Last Updated**: 2026-06-05
