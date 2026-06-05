# Knowledge Vault — Self-Optimizing `.agent` System

> A reference architecture for **delegation-first, self-improving AI agent ecosystems** built on Claude Code.

## The Idea

Most people use AI coding assistants as a single monolithic agent — one context window juggling everything. This works for small tasks but breaks down when:

- Context fills up and the agent "forgets" critical rules
- Every task reinvents the wheel (no memory of past solutions)
- Complex tasks timeout or hallucinate mid-way

The `.agent` system solves this with three key innovations:

### 1. Delegation-First Architecture
A thin **router** dispatches tasks to **specialized subagents** — each gets a clean context window with only what it needs. 80% context reduction vs monolithic.

```
User Request → Router (.agent/index.md)
                 ├─ matches skill?  → load skill → delegates to subagent(s)
                 ├─ trivial?        → handle directly (no overhead)
                 └─ complex?        → @researcher pre-flight → then delegate
```

### 2. Autonomous Learning Loop
The system learns from every task — errors become workarounds, workarounds become patterns, patterns become rules:

```
lessons (1×)  →  patterns (3×)  →  facts (hardened rules)
```

When a pattern appears 3 times, it's promoted to a skill. The system literally grows smarter with use.

### 3. Cost-Conscious Execution
Every token counts. The system enforces a clear cost hierarchy:

| Approach | Token Cost | When to Use |
|----------|-----------|-------------|
| Direct execution | 2-5K | Trivial (<5 lines, no logic) |
| **Subagent** (Agent tool) | 5-15K | **Default for 95% of tasks** |
| Workflow (multi-agent) | 50-200K | User approval required |

---

## What's Inside

| Component | Path | What it does |
|-----------|------|--------------|
| **Agent template** | `templates/.agent-template/` | Drop-in `.agent` system for any repo |
| **CLAUDE.md template** | `templates/CLAUDE.md.template` | Wire the agent system into Claude Code |
| **MCP server** | `obsidian-mcp-server/` | Node/TypeScript MCP server for Obsidian vault operations |
| **Knowledge base** | `knowledge/` | Portable, vendor-neutral patterns (Airflow, Spark, Terraform, AWS, MCP) |
| **Architecture docs** | `knowledge/architecture/` | Deep dives on the agent ecosystem design |

---

## Quick Start (Add to Any Repo in 5 Minutes)

### Step 1: Copy the template

```bash
cp -r /path/to/Knowledge-Vault-OSS/templates/.agent-template your-repo/.agent
```

### Step 2: Remove `.template` extensions

```bash
cd your-repo/.agent
for f in $(find . -name "*.template"); do mv "$f" "${f%.template}"; done
```

### Step 3: Customize three files

1. **`.agent/index.md`** — Define your routing rules (what triggers what)
2. **`.agent/memory/facts.md`** — Document your project conventions
3. **Copy 1-2 skills** from `templates/.agent-template/skills/universal/` that match your workflow

### Step 4: Wire into Claude Code

Copy `templates/CLAUDE.md.template` to your repo root as `CLAUDE.md` and customize the repo-specific sections.

### Step 5: Start working

The system bootstraps itself. After ~5 tasks, lessons accumulate. After ~15 tasks, the routing optimizer proposes improvements. After ~30 tasks, the system runs like a well-oiled machine.

---

## The `.agent` System at a Glance

```
.agent/
├── index.md              ← Router: matches intent → delegates to skill/subagent
├── skills/               ← Workflow playbooks (multi-step orchestration)
│   ├── universal/        ← Works in any repo (git, debug, refactor, meta)
│   └── domain/           ← Your domain-specific skills
├── memory/               ← Durable project knowledge
│   ├── facts.md          ← Hardened rules (conventions, constraints)
│   ├── working.md        ← Active tasks (rotating 5-item buffer)
│   └── archive.md        ← Completed task history (grep-searchable)
└── learning/             ← Autonomous improvement
    ├── lessons.md        ← What worked/failed (append-only)
    ├── patterns.md       ← Recurring patterns (3× → skill promotion)
    ├── feedback.md       ← User corrections (instant routing fixes)
    └── changelog.md      ← Audit trail of all system changes
```

### Key Mechanisms

| Mechanism | What it Does | How it Triggers |
|-----------|-------------|-----------------|
| **Post-task loop** | Log learnings, resolve open questions, update memory | After any task with ≥5 tool calls or errors |
| **Skill creator** | Detects 3× patterns → proposes new skills | Automatic from lessons.md analysis |
| **Routing optimizer** | Learns synonym triggers, improves accuracy | Weekly cycle or after routing failures |
| **Graphify check** | Monitors knowledge graph freshness | Session start (silent if fresh) |
| **Export-back** | Promotes validated local lessons → global skills | When lesson contradicts/extends a global skill |

---

## The Knowledge Graph (Graphify)

Optional but powerful: run `/graphify .` to generate an interactive knowledge graph of your codebase.

**What it gives you:**
- **God nodes** — Files/entities with highest connectivity (touch carefully)
- **Communities** — Natural module boundaries (inform subagent design)
- **Surprising connections** — Non-obvious coupling between components
- **Smart refresh** — Only rebuilds when meaningful changes accumulate

**Refresh thresholds** (customize per repo):
- ≥3 wiki/doc pages changed
- ≥2 source modules changed
- Graph ≥14 days old
- ≥10 total files changed

---

## Universal Skills (Work in Any Repo)

These skills come bundled in the template:

| Skill | Purpose | Triggers |
|-------|---------|----------|
| `git-ops` | Safe git operations | commit, branch, merge, rebase, push |
| `debug` | Evidence-first error diagnosis | error, stack trace, crash, bug, fail |
| `refactor` | Code extraction/simplification | rename, extract, split, simplify |
| `pr-review` | Diff analysis and review | review, PR, diff, merge request |
| `meta` | Audit agent health, export lessons | audit skills, improve agent, retrospective |
| `skill-creator` | Detect gaps → propose new skills | 3× pattern detected, capability gap |
| `routing-optimizer` | Learn synonyms, improve routing | weekly optimization, routing failure |
| `graphify-check` | Knowledge graph freshness monitor | session start (auto) |

---

## Integration Points

### With Graphify (Knowledge Graph)
```bash
/graphify .                    # Build initial graph
/graphify . --update           # Incremental refresh
/graphify query "find god nodes"  # Query the graph
```

### With Obsidian MCP (Cross-repo Knowledge)
```json
{
  "mcpServers": {
    "knowledge-vault": {
      "command": "node",
      "args": ["/path/to/obsidian-mcp-server/dist/index.js"],
      "env": { "OBSIDIAN_VAULT_PATH": "/path/to/vault" }
    }
  }
}
```

### With Claude Code Hooks
```json
{
  "hooks": {
    "PreToolUse": [{ "matcher": "Read", "command": "python scripts/graphify_refresh_manager.py --check" }]
  }
}
```

---

## Customization Examples

| Domain | Subagents | Skills |
|--------|-----------|--------|
| **Code Migration** | converter, validator, fixer, doc-keeper | convert-module, validate-all, fix-diff |
| **API Development** | endpoint-builder, tester, doc-gen, deployer | create-endpoint, run-tests, deploy-stage |
| **Data Pipelines** | dag-builder, validator, monitor, optimizer | create-dag, validate-schema, optimize-cost |
| **Documentation** | link-checker, indexer, formatter, publisher | check-links, update-index, format-all |

---

## Success Metrics

After ~30 tasks, measure:
- **Context reduction**: 60-80% vs monolithic (target)
- **Routing accuracy**: >95% correct subagent selection
- **Speed improvement**: 20-40% from parallel execution
- **Failure rate**: Decreasing trend as memory accumulates
- **Knowledge growth**: Wiki pages increase, facts.md stabilizes

---

## Getting Started with the Full Vault

### 1. Open in Obsidian

Open this folder in [Obsidian](https://obsidian.md). Install community plugins from `.obsidian/community-plugins.json`.

### 2. Build the MCP server

```bash
cd obsidian-mcp-server
npm install
npm run build
```

### 3. Configure `.mcp.json`

Replace placeholder paths with your absolute paths.

### 4. (Optional) Set up external repos

Copy `.env.example` → `.env.local` and configure `VAULT_ROOT` / `EXTERNAL_REPOS`.

---

## Note on Private Content

`companies/` and `journal/daily/` are gitignored — they hold private content in the original vault. Shipped notes use generic placeholders (`Acme Corp`, `RPT_OrderSummary`, `PROJ-123`).

## License

MIT — see [LICENSE](LICENSE).
