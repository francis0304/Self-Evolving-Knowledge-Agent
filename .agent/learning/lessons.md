# Lessons Learned

> Append-only log of what worked or failed. Never delete; only compact into archive.
> When this file exceeds roughly 8K tokens, move entries older than 30 days into archive form.

## [2026-06-08] system: Root `.agent/` needs a different contract from the template
The published template lives in `templates/.agent-template/`, but this repo also needs a tracked root `.agent/` for dogfooding. Runtime files should be repo-specific and tracked, while local scratch state should stay under ignored `.agent/local/` or `.agent/tmp/`.
-> Added to `memory/facts.md` and `.gitignore`.

## [2026-06-08] runtime: Active `.agent/` should not depend on provider-specific workers
The runtime works better when it relies on durable repo guidance, skills, MCP, hooks/plugins, and direct tool execution. Compatibility prompt files should stay reference-only.
-> Added `AGENTS.md`; updated `index.md`, `facts.md`, and runtime skill wording.
