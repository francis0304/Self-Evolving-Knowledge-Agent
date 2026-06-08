# Repository Guidelines

## Project Overview
`Knowledge-Vault-OSS` is a reference implementation for an AI-agent-centric knowledge management system. It features a Model Context Protocol (MCP) server that bridges Obsidian vaults with LLMs, supported by a "Delegation-First" architecture to optimize context and cost.

## Architecture & Data Flow
The core logic follows a **Bridge and Cache** pattern:
- **State Management**: The `obsidian_mcp_server` maintains an in-memory cache of notes (`noteCache`) and backlink indices (`backlinkIndex`).
- **Sync Layer**: Uses `fs.watch` to sync the physical Obsidian vault with internal state in real-time.
- **Data Flow**: 
  1. User/Agent requests a tool (e.g., `search_notes`, `read_note`).
  2. Server checks memory cache first, falling back to disk if necessary.
  3. Results are processed through standard MCP tool schemas for output.

## Key Directories
- `obsidian-mcp-server/`: The core MCP implementation. Includes source code in `src/` and configuration scripts.
- `knowledge/`: Extensive documentation on architecture, cost optimization, and tools (e.g., `tools/mcp`).
- `scripts/`: Maintenance scripts like `graphify_refresh_manager.py` for knowledge graph consistency.
- `templates/`: Reusable structures for starting new `.agent` systems.

## Development Commands
- **Setup**: Run `./obsidian-mcp-server/configure.sh` to set up environment variables (e.g., `OBSIDIAN_VAULT_PATH`).
- **Runtime**: Requires Node.js 18+ and TypeScript support.
- **Execution**: Uses `tsx` for running scripts or `tsc` to build the production bundle in `dist/`.

## Code Conventions & Common Patterns
- **Asynchronous I/O**: Every file operation (read/write/walk) uses `async/await`.
- **Robustness**: Wrap tool handlers in `try-catch` blocks to ensure MCP errors are returned as JSON rather than crashing the process.
- **Security**: Use `isPathInsideVault()` to prevent directory traversal attacks.
- **Parsing**: Extensive use of RegEx for Obsidian link parsing (e.g., `[[Title|Alias]]`).
- **Paths**: Normalize all paths using a central utility to ensure cross-platform compatibility.

## Important Files
- `obsidian-mcp-server/src/index.ts`: Primary entry point and core logic hub.
- `scripts/graphify_refresh_manager.py`: Management of the internal knowledge graph.
- `README.md`: High-level project philosophy and quick-start.

## Runtime/Tooling Preferences
- **Runtime**: Node.js (ESM) preferred.
- **Package Manager**: standard `npm`/`pnpm`.
- **Environment**: Ensure `OBSIDIAN_VAULT_PATH` is correctly set before startup.

## Testing & QA
The project prioritizes integration and contract validation:
- **Integration Tests**: Use `obsidian-mcp-server/test-server.js` to verify MCP tool execution.
- **Connectivity Check**: Run `obsidian-mcp-server/test-mcp-connection.sh` for environment audits.
- **Success Criteria**: A "good" test provides evidence of behavior (e.g., correct JSON response) rather than unit testing internal logic.
