#!/bin/bash
# MCP Connection Test Script
# Tests if MCP server can be reached from different repos

echo "🔍 MCP Connection Diagnostics"
echo "=============================="
echo ""

# Dynamically resolve vault path instead of hardcoded
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VAULT_PATH="$(cd "$SCRIPT_DIR/.." && pwd)"
MCP_SERVER="$VAULT_PATH/obsidian-mcp-server/dist/index.js"

# Test 1: Check files exist
echo "📁 Test 1: File Checks"
echo "----------------------"
if [ -f "$MCP_SERVER" ]; then
    echo "✅ MCP Server exists: $MCP_SERVER"
else
    echo "❌ MCP Server NOT found: $MCP_SERVER"
    exit 1
fi

if [ -d "$VAULT_PATH" ]; then
    echo "✅ Vault directory exists: $VAULT_PATH"
else
    echo "❌ Vault directory NOT found: $VAULT_PATH"
    exit 1
fi

echo ""

# Test 2: Check Node.js
echo "🟢 Test 2: Node.js"
echo "-------------------"
NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "✅ Node.js installed: $NODE_VERSION"
else
    echo "❌ Node.js NOT found in PATH"
    exit 1
fi

echo ""

# Test 3: Check MCP server dependencies
echo "📦 Test 3: Dependencies"
echo "------------------------"
if [ -d "$VAULT_PATH/obsidian-mcp-server/node_modules/@modelcontextprotocol" ]; then
    echo "✅ @modelcontextprotocol/sdk installed"
else
    echo "❌ @modelcontextprotocol/sdk NOT installed"
    echo "   Run: cd $VAULT_PATH/obsidian-mcp-server && npm install"
    exit 1
fi

echo ""

# Test 4: Test server startup
echo "🚀 Test 4: Server Startup"
echo "--------------------------"
echo "Starting MCP server for 2 seconds..."
OBSIDIAN_VAULT_PATH="$VAULT_PATH" timeout 2 node "$MCP_SERVER" 2>&1 &
SERVER_PID=$!
sleep 1

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ MCP Server started successfully"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ MCP Server failed to start"
    exit 1
fi

wait $SERVER_PID 2>/dev/null

echo ""

# Test 5: Check .mcp.json in repos
echo "🗂️  Test 5: Repo Configurations"
echo "--------------------------------"

REPOS=(
    "example-repo-a"
    "example-repo-b"
    "example-repo-c"
)

REPOS_BASE="${EXTERNAL_REPOS:-$(cd "$VAULT_PATH/.." && pwd)}"
if [ ! -d "$REPOS_BASE" ]; then
    # Fallback to parent directory of VAULT_PATH
    REPOS_BASE="$(cd "$VAULT_PATH/.." && pwd)"
fi

for repo in "${REPOS[@]}"; do
    REPO_PATH="$REPOS_BASE/$repo"
    if [ -f "$REPO_PATH/.mcp.json" ]; then
        # Check if it uses correct Unix path
        if grep -q '"/c/Users' "$REPO_PATH/.mcp.json"; then
            echo "✅ $repo"
        else
            echo "⚠️  $repo (may have wrong path format)"
        fi
    else
        echo "❌ $repo (no .mcp.json)"
    fi
done

echo ""

# Test 6: Check .gitignore
echo "🙈 Test 6: .gitignore Check"
echo "----------------------------"
for repo in "${REPOS[@]}"; do
    REPO_PATH="$REPOS_BASE/$repo"
    if [ -f "$REPO_PATH/.gitignore" ]; then
        if grep -q "^\.mcp\.json$" "$REPO_PATH/.gitignore"; then
            echo "✅ $repo (.mcp.json ignored)"
        else
            echo "⚠️  $repo (.mcp.json NOT in .gitignore - should add it!)"
        fi
    else
        echo "⚠️  $repo (no .gitignore)"
    fi
done

echo ""
echo "=============================="
echo "✅ All tests passed!"
echo ""
echo "📝 Next Steps:"
echo "1. Restart Claude Code completely"
echo "2. Open one of your repos: cd $REPOS_BASE/example-repo-a"
echo "3. In Claude Code, check if MCP server 'knowledge-vault' appears"
echo "4. Test with: 'List all notes in my vault'"
echo ""
echo "If MCP still doesn't work after restart, the issue might be:"
echo "- Claude Code version doesn't support .mcp.json in project directory"
echo "- Claude Code needs global MCP config instead"
echo "- File permissions issue"
echo ""
