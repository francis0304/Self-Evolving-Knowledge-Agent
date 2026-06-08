---
tags: [architecture, local-llm, compatibility]
created: 2026-06-04
updated: 2026-06-08
status: active
---

# Local LLM Compatibility Assessment

**Verdict**: Seamless migration possible. ~95% of .agent system is provider-agnostic (pure Markdown). Only `.claude/settings.json` model config needs changing.

---

## Compatibility by Layer

| Layer | Files | Compatible? |
|-------|-------|-------------|
| Core Logic | `.agent/index.md`, `skills/*.md` | 100% — pure Markdown routing |
| Subagents | `.claude/agents/*.md` | 100% — knowledge-base prompts |
| Context Memory | `learning/`, `.agent/memory/` | 100% — plain text injection |
| Provider Config | `.claude/settings.json`, `.mcp.json` | ~95% — model name + tool registry only |

---

## Migration Steps

1. Update `.claude/settings.json` model field (e.g., `"qwen:7b"` or `"gemma2:9b"`)
2. Verify MCP tools registered in local platform's tool registry
3. Test 3 routing scenarios to validate
4. Tune few-shot examples if quality drops

**Effort**: ~5-8 hours total

---

## Potential Challenges

| Challenge | Impact | Mitigation |
|-----------|--------|------------|
| Smaller context window (<20B params) | May affect multi-hop reasoning | Prune older entries, batch queries |
| Reasoning quality variance | ~95% vs 98% success rate | Few-shot examples in skill definitions |
| MCP tool availability varies by platform | Some tools may be missing | Verify bridge packages before running |

---

## Related

- [[knowledge/tools/mcp/README - Start Here]] — MCP documentation
- [[knowledge/architecture/Agent System Cost Optimization v5.1]] — current agent spec
