#!/bin/bash

# Configuration script for Obsidian MCP Server

VAULT_PATH="$(cd "$(dirname "$0")/.." && pwd)"
SERVER_PATH="$(cd "$(dirname "$0")" && pwd)"
CONFIG_FILE="$HOME/.claude/settings.json"

echo "Setting up Obsidian MCP Server..."
echo "Vault path: $VAULT_PATH"
echo "Server path: $SERVER_PATH/dist/index.js"

# Ensure Claude config directory exists
mkdir -p "$HOME/.claude"

# Create or update settings.json
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Creating new settings.json..."
    cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": [
        "$SERVER_PATH/dist/index.js"
      ],
      "env": {
        "OBSIDIAN_VAULT_PATH": "$VAULT_PATH"
      }
    }
  }
}
EOF
else
    echo "Settings file exists. Please add this configuration manually:"
    echo ""
    cat << EOF
{
  "mcpServers": {
    "obsidian": {
      "command": "node",
      "args": [
        "$SERVER_PATH/dist/index.js"
      ],
      "env": {
        "OBSIDIAN_VAULT_PATH": "$VAULT_PATH"
      }
    }
  }
}
EOF
    echo ""
fi

echo ""
echo "Configuration complete!"
echo "Please restart Claude Code for changes to take effect."
