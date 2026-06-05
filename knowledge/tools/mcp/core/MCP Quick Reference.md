# MCP Quick Reference Card
**Global Vault Access - Quick Guide**

---

## ✅ Status
- **MCP Server**: `knowledge-vault`
- **Configuration**: `~/.claude/.mcp.json`
- **Vault Path**: `C:\Users\your-user\Desktop\Knowledge-Vault`
- **Status**: ✅ Active (Global Access)

---

## 🚀 Quick Start

### 1. Restart Claude Code
MCP configuration loads at startup. Restart Claude Code to activate.

### 2. Test It
```
From any directory, ask Claude:
"List all notes in my vault"
```

Should return ~60+ markdown files! ✅

---

## 💬 Example Queries

### Basic Access
```
"List all notes in knowledge/architecture/"
"Read knowledge/tools/airflow/DAG Patterns.md"
"Search vault for 'validation pattern'"
```

### Cross-Repo Queries
```
"How does Redshift handle validation?"
→ Reads companies/current-company/projects/Redshift Reporting.md

"Show me the data platform architecture"
→ Reads companies/current-company/data-platform/Data Platform Architecture Diagram.md

"What patterns does Glue use?"
→ Reads companies/current-company/reference/Glue Patterns (DP).md
```

### Personal Knowledge
```
"What did I work on yesterday?"
→ Searches journal/daily/

"Show my AI agent presentation"
→ Reads companies/current-company/reference/AI Agent System - Presentation.md
```

---

## 🎯 Common Scenarios

### Scenario 1: Working in Redshift Repo
```bash
cd ~/Desktop/External-Repos/example-repo-redshift/

# Ask Claude:
"What's the generic validation pattern in my vault?"
→ Uses MCP to read knowledge/practices/Validation Patterns.md

"How does Airflow handle similar tasks?"
→ Reads companies/current-company/projects/Airflow.md via MCP
```

**Key**: Local .agent/ handles execution, Vault provides generic patterns

---

### Scenario 2: Working in Airflow Repo
```bash
cd ~/Desktop/External-Repos/example-repo-airflow/

# Ask Claude:
"Show me generic DAG factory pattern"
→ Reads knowledge/tools/airflow/DAG Patterns.md

"Compare with Glue's approach"
→ Cross-references companies/current-company/projects/Glue.md
```

**Key**: Vault enables cross-repo knowledge sharing

---

### Scenario 3: Architecture Review
```bash
# From anywhere:

"Explain the entire data platform"
→ Reads companies/current-company/data-platform/Data Platform Overview.md

"Show agent system status across all repos"
→ Reads Data Platform Repos - Agent System Status.md
```

**Key**: Vault provides the 10,000m view

---

## 🔧 Troubleshooting

### MCP Not Working?

1. **Restart Claude Code** (MCP loads at startup)
2. **Check config**: `cat ~/.claude/.mcp.json`
3. **Verify server**: `ls ~/Desktop/Knowledge-Vault/obsidian-mcp-server/dist/index.js`
4. **Rebuild if needed**:
   ```bash
   cd ~/Desktop/Knowledge-Vault/obsidian-mcp-server/
   npm install
   npm run build
   ```

---

## 📊 Access Pattern

```
Priority when Claude works on a task:

1️⃣ Local Repo (.agent/, knowledge/wiki/)
   ↓ Primary source for deep details
   
2️⃣ Vault MCP (knowledge/, companies/)
   ↓ Cross-repo patterns & universal knowledge
   
3️⃣ Direct File Access
   ↓ Source code when needed
```

---

## 💡 Best Practices

### ✅ DO
- Use vault for generic patterns
- Query vault for cross-repo questions
- Reference vault for architecture decisions
- Use journal for daily reflections

### ❌ DON'T
- Don't rely on vault for deep implementation details (use repo wiki)
- Don't query vault for local code (direct access is faster)
- Don't forget to update vault when you learn generic patterns

---

## 📚 Full Documentation

See [[MCP Configuration Guide]] for complete details.

---

## 🎉 You're Ready!

**Test it now**:
1. Restart Claude Code
2. From any directory: "List all notes in my vault"
3. Should see ~60+ files ✅

**Then try**:
- "Show me generic Airflow patterns"
- "How do the 5 repos integrate?"
- "What's my AI agent presentation about?"

---

**Last Updated**: 2026-06-03  
**Config File**: `~/.claude/.mcp.json`  
**Status**: ✅ Active
