# MCP Tutorial - Model Context Protocol

## What is MCP?

**Model Context Protocol (MCP)** is a standardized protocol that allows Claude Code to connect to external data sources and tools. Think of it as a bridge that gives Claude direct access to your applications and data.

### Why Use MCP?

- **Direct Data Access**: Claude can read/write to your Obsidian vault, databases, APIs, etc.
- **Real-time Integration**: No need to copy-paste content manually
- **Standardized Interface**: One protocol works across multiple tools
- **Secure**: Path security and access controls built-in

---

## Current Setup: Obsidian MCP Server

This vault is configured with an **Obsidian MCP Server** that gives Claude Code direct access to all your notes.

📖 **Detailed Documentation**: [[obsidian-mcp-server/README|Obsidian MCP Server README]]

### Configuration File

Location: `C:\Users\your-user\Desktop\Knowledge-Vault\.mcp.json`

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": [
        "obsidian-mcp-server/dist/index.js"
      ],
      "env": {
        "OBSIDIAN_VAULT_PATH": "C:\\Users\\your-user\\Desktop\\Knowledge-Vault"
      }
    }
  }
}
```

**How it works:**
- Claude Code detects `.mcp.json` automatically when started in this directory
- The server runs via Node.js and provides tools for vault access
- All operations are sandboxed within the vault directory

---

## Available MCP Tools

### 🔍 `search_notes`
Search for notes by content or title.

**Example:**
```
"Search my vault for notes about example reporting"
```

**Returns:** Array of matching notes with content previews

---

### 📖 `read_note`
Read the full content of a specific note.

**Example:**
```
"Read the Reporting API project note"
"Show me the content of projects/Reporting API.md"
```

**Parameters:**
- `path`: Relative path like `"projects/Reporting API.md"`

---

### ✏️ `write_note`
Create new notes or update existing ones.

**Example:**
```
"Create a new note in areas/ about Kafka streaming patterns"
"Update the Example Integrations note with the new settlement flow"
```

**Parameters:**
- `path`: Where to save (e.g., `"areas/Kafka Patterns.md"`)
- `content`: Full markdown content

---

### 🔗 `get_links`
Extract all wiki-links from a note and resolve them to file paths.

**Example:**
```
"What notes does the Data Platform Overview link to?"
```

**Returns:** Array of links with resolved paths

---

### ↩️ `get_backlinks`
Find all notes that link to a specific note.

**Example:**
```
"What notes link to the Redshift Reporting page?"
"Show me all backlinks to this note"
```

**Returns:** Array of file paths that reference the note

---

### 📋 `list_notes`
List all notes in the vault.

**Example:**
```
"List all notes in the vault"
"Show me all project notes"
```

**Returns:** Complete inventory with paths and titles

---

## Installation & Setup

### Prerequisites

```bash
# Node.js required (v16+ recommended)
node --version
```

### Initial Setup

1. **Install dependencies:**
```bash
cd obsidian-mcp-server
npm install
npm run build
```

2. **Verify the configuration:**
The `.mcp.json` file should already exist in your vault root. If not, create it:

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": [
        "obsidian-mcp-server/dist/index.js"
      ],
      "env": {
        "OBSIDIAN_VAULT_PATH": "C:\\Users\\your-user\\Desktop\\Knowledge-Vault"
      }
    }
  }
}
```

3. **Restart Claude Code:**
Claude Code will detect `.mcp.json` automatically and load the MCP server.

4. **Verify it's working:**
Ask Claude: "List all notes in my vault" or "Search for notes about data platform"

---

## Global vs Project Configuration

### Project-Level (Current Setup)
- File: `.mcp.json` in vault root
- Scope: Only active when Claude Code runs in this directory
- Best for: Vault-specific tools

### Global Configuration
- File: `~/.claude/.mcp.json`
- Scope: Available in all projects
- Best for: Cross-project tools (databases, APIs)

**Global example:**
```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": [
        "/c/Users/your-user/Desktop/Knowledge-Vault/obsidian-mcp-server/dist/index.js"
      ],
      "env": {
        "OBSIDIAN_VAULT_PATH": "/c/Users/your-user/Desktop/Knowledge-Vault"
      }
    }
  }
}
```

---

## Usage Examples

### Basic Queries

**Search across vault:**
```
"Find all notes mentioning Airflow DAGs"
"Search for example reporting documentation"
```

**Read specific notes:**
```
"Read the Data Platform Overview"
"Show me the Redshift Reporting project note"
```

**Navigate relationships:**
```
"What notes link to the Infrastructure page?"
"Show me all backlinks to areas/Data Platform Overview.md"
```

### Creating Content

**New notes:**
```
"Create a note in projects/ about the new API gateway project"
"Add a tutorial note about debugging Glue jobs"
```

**Update existing:**
```
"Add a section to the Airflow Patterns note about error handling"
"Update the Quick Start Guide with MCP tutorial link"
```

### Advanced Workflows

**Cross-reference analysis:**
```
"Find all notes that mention both 'settlement' and 'Redshift'"
"What notes in projects/ link to the Data Platform Overview?"
```

**Content generation:**
```
"Create a summary note of all SAP-related pages"
"Generate an index of all pattern notes"
```

---

## Security Features

### Path Security
- All operations are restricted to the vault directory
- Attempts to access files outside the vault are rejected
- No risk of reading/writing system files

### Environment Isolation
- MCP server runs with vault-specific environment variables
- No access to system-wide resources unless explicitly configured

---

## Troubleshooting

### MCP Server Not Loading

**Check Claude Code startup logs:**
```bash
# Look for MCP connection messages
# Should see: "Connected to MCP server: obsidian"
```

**Verify file paths:**
```bash
# Check the server is built
ls obsidian-mcp-server/dist/index.js

# Test manually
node obsidian-mcp-server/dist/index.js
```

### Tools Not Available

**Restart Claude Code:**
- MCP servers are loaded at startup
- Changes to `.mcp.json` require restart

**Check permissions:**
- Ensure vault path is readable/writable
- Verify Node.js has necessary permissions

### Search Not Finding Notes

**Check file extensions:**
- Server searches `.md` files only
- Hidden files (starting with `.`) are excluded

**Verify vault path:**
- Ensure `OBSIDIAN_VAULT_PATH` is correct
- Use absolute paths, not relative

---

## Development & Testing

### Test the Server Manually

```bash
cd obsidian-mcp-server
node test-server.js
```

### Development Mode

```bash
# Hot reload during development
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

### Adding Custom Tools

Edit `obsidian-mcp-server/src/index.ts` to add new tools:

```typescript
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    // Add your custom tool here
    {
      name: "custom_tool",
      description: "Description of what it does",
      inputSchema: {
        type: "object",
        properties: {
          param: { type: "string" }
        }
      }
    }
  ]
}));
```

---

## Other MCP Servers

### Popular MCP Servers

**Database Access:**
- `mcp-server-postgres` - PostgreSQL queries
- `mcp-server-sqlite` - SQLite databases
- `mcp-server-mysql` - MySQL/MariaDB

**APIs & Services:**
- `mcp-server-github` - GitHub API integration
- `mcp-server-slack` - Slack messaging
- `mcp-server-google-drive` - Google Drive files

**File Systems:**
- `mcp-server-filesystem` - Generic file access
- `mcp-server-git` - Git repository operations

### Adding Multiple Servers

```json
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": ["obsidian-mcp-server/dist/index.js"],
      "env": {
        "OBSIDIAN_VAULT_PATH": "C:\\Users\\your-user\\Desktop\\Knowledge-Vault"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["mcp-server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost:5432/mydb"
      }
    }
  }
}
```

---

## Best Practices

### Organize Your Vault for MCP

1. **Use consistent paths:**
   - `projects/` - Project-specific notes
   - `areas/` - Domain knowledge
   - `resources/` - Reference material

2. **Link liberally:**
   - Use `[[wiki-links]]` for relationships
   - MCP tools can traverse these connections

3. **Keep metadata:**
   - Add frontmatter for structured queries
   - Tag notes for easy filtering

### Efficient Prompts

**Specific paths:**
```
✅ "Read projects/Reporting API.md"
❌ "Read the API note somewhere"
```

**Clear intent:**
```
✅ "Search for notes about settlement AND Redshift"
❌ "Find stuff about payments"
```

**Batch operations:**
```
✅ "List all project notes, then read the three most recent"
❌ Multiple separate requests
```

---

## Related Notes

- [[Quick Start Guide]] - Vault overview and navigation
- [[Index]] - Main vault navigation hub
- [[Data Platform Overview]] - Architecture documentation

---

## References

- [MCP Specification](https://modelcontextprotocol.io/)
- [Claude Code Documentation](https://claude.ai/code/docs)
- Server Source: `obsidian-mcp-server/`

---

Last Updated: 2026-06-03
