# Obsidian Vault MCP Server

Model Context Protocol (MCP) server that provides Claude Code with direct access to your Obsidian vault.

## Features

- **Search Notes**: Full-text search across all markdown files
- **Read Notes**: Get complete note content by path
- **Write Notes**: Create new notes or update existing ones
- **Navigate Links**: Extract wiki-links and find linked notes
- **Backlinks**: Find all notes that reference a specific note
- **List Notes**: Get a complete inventory of all notes

## Installation

```bash
npm install
npm run build
```

## Configuration

The server needs to know where your Obsidian vault is located. Set the `OBSIDIAN_VAULT_PATH` environment variable, or it will default to the parent directory of the server.

### Configure Claude Code

A `.mcp.json` file has been created in your vault root with the MCP server configuration. Claude Code will detect it automatically when you restart.

Alternatively, for global configuration, create `~/.claude/.mcp.json`:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": [
        "${VAULT_ROOT}/obsidian-mcp-server/dist/index.js"
      ],
      "env": {
        "OBSIDIAN_VAULT_PATH": "${VAULT_ROOT}"
      }
    }
  }
}
```

Restart Claude Code after adding the configuration.

## Available Tools

### `search_notes`
Search for notes by content or title.

**Parameters:**
- `query` (string): Search term to match against titles and content

**Returns:** Array of matching notes with previews

### `read_note`
Read the full content of a specific note.

**Parameters:**
- `path` (string): Relative path to the note (e.g., "projects/Reporting API.md")

**Returns:** Full note content

### `write_note`
Create or update a note.

**Parameters:**
- `path` (string): Relative path where the note should be saved
- `content` (string): Full markdown content

**Returns:** Success message

### `get_links`
Extract all wiki-links from a note and resolve them to file paths.

**Parameters:**
- `path` (string): Relative path to the note

**Returns:** Array of links with resolved file paths

### `get_backlinks`
Find all notes that link to the specified note.

**Parameters:**
- `path` (string): Relative path to the note

**Returns:** Array of file paths that reference this note

### `list_notes`
List all notes in the vault.

**Returns:** Array of all notes with paths and titles

## Usage Example

Once configured, you can ask Claude Code:

- "Search my vault for notes about SAP"
- "Read the Reporting API project note"
- "Create a new note in projects/ about the deployment pipeline"
- "What notes link to the Data Platform Overview?"
- "Show me all backlinks to this note"

## Security

The server enforces path security to ensure all operations stay within the vault directory. Attempts to access files outside the vault will be rejected.

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start
```
