# MCP Configuration Guide
**Global Obsidian Vault Access**

**Status**: ✅ Configured  
**Last Updated**: 2026-06-03

---

## 🎯 What This Enables

With Global MCP configured, you can now:

✅ **Access vault from any repo** - Work in redshift-reporting, airflow, or glue repos and query vault knowledge  
✅ **Cross-repo queries** - "How does Airflow handle this?" while working in Glue  
✅ **Universal knowledge access** - Reference generic patterns while working on specific implementations  
✅ **Personal knowledge at hand** - Access journal entries, learning notes, and presentations from anywhere  

---

## 📍 Configuration Location

**File**: `~/.claude/.mcp.json`  
**Full Path**: `C:\Users\your-user\.claude\.mcp.json`

```json
{
  "mcpServers": {
    "knowledge-vault": {
      "command": "node",
      "args": [
        "C:\\Users\\your-user\\Desktop\\Knowledge-Vault\\obsidian-mcp-server\\dist\\index.js"
      ],
      "env": {
        "OBSIDIAN_VAULT_PATH": "C:\\Users\\your-user\\Desktop\\Knowledge-Vault"
      },
      "disabled": false,
      "alwaysAllow": []
    }
  }
}
```

---

## 🔧 MCP Server Details

**Name**: `knowledge-vault`  
**Type**: Obsidian Vault MCP Server  
**Vault Path**: `C:\Users\your-user\Desktop\Knowledge-Vault`  
**Server Path**: `C:\Users\your-user\Desktop\Knowledge-Vault\obsidian-mcp-server\dist\index.js`

### Available Tools

| Tool | Purpose | Example Usage |
|------|---------|---------------|
| `mcp__obsidian__search_notes` | Full-text search | "Search vault for 'validation pattern'" |
| `mcp__obsidian__read_note` | Read specific note | "Read knowledge/tools/airflow/DAG Patterns.md" |
| `mcp__obsidian__list_notes` | List all notes | "List all notes in knowledge/architecture/" |
| `mcp__obsidian__get_links` | Get outgoing links | "What does this note link to?" |
| `mcp__obsidian__get_backlinks` | Get incoming links | "What notes reference this?" |
| `mcp__obsidian__write_note` | Create/update note | "Update journal/daily/2026-06-03.md" |

---

## 🚀 How to Use

### Scenario 1: Working in Redshift Repo

```bash
cd ~/Desktop/External-Repos/example-repo-redshift/

# Claude Code automatically has access to:
# 1. Local .agent/ (redshift-specific)
# 2. Local knowledge/wiki/ (redshift deep knowledge)
# 3. Global vault via MCP (universal patterns)
```

**Example queries**:
```
"What's the generic validation pattern in my vault?"
→ Claude uses MCP to read knowledge/practices/Validation Patterns.md

"How does Airflow handle similar tasks?"
→ Claude queries companies/current-company/projects/Airflow.md

"Show me the data platform architecture"
→ Claude reads companies/current-company/data-platform/Data Platform Architecture Diagram.md
```

---

### Scenario 2: Working in Airflow Repo

```bash
cd ~/Desktop/External-Repos/example-repo-airflow/

# Now you can query:
```

**Example queries**:
```
"What's the generic DAG factory pattern?"
→ Reads knowledge/tools/airflow/DAG Patterns.md (universal)

"Compare with Redshift's approach"
→ Reads companies/current-company/projects/Redshift Reporting.md

"Show DP-specific Airflow patterns"
→ Reads companies/current-company/reference/Airflow Patterns (DP).md
```

---

### Scenario 3: Cross-Repo Architecture Questions

```bash
# From any directory:

"How do the 5 repos integrate?"
→ Reads companies/current-company/data-platform/Data Platform Overview.md

"What's the maturity level of each repo's agent system?"
→ Reads companies/current-company/data-platform/Data Platform Repos - Agent System Status.md

"Show me the end-to-end data flow"
→ Reads companies/current-company/data-platform/Data Platform Architecture Diagram.md
```

---

### Scenario 4: Personal Knowledge Management

```bash
# Journal entries:
"What did I learn last week?"
→ Searches journal/daily/2026-*.md

# Learning resources:
"What courses am I taking?"
→ Lists learning/courses/

# Presentations:
"Show me my AI agent presentation"
→ Reads companies/current-company/reference/AI Agent System - Presentation.md
```

---

## 📊 Access Hierarchy

When Claude Code works on a task, it follows this priority:

```
1. Local Repo Context (Highest Priority)
   ├── .agent/index.md (routing rules)
   ├── .claude/agents/ (subagents)
   └── knowledge/wiki/ (deep repo knowledge)
   
2. Vault MCP (Cross-repo & Universal)
   ├── knowledge/ (universal patterns)
   ├── companies/current-company/ (DP cross-repo)
   ├── journal/ (personal context)
   └── learning/ (reference material)
   
3. Direct File Access (When needed)
   └── Source code in repo
```

---

## 🔄 Workflow Examples

### Example 1: Convert SQL Block (Redshift Repo)

```
Task: "Convert block 15 of RPT_OrderSummary"

Claude's Access Pattern:
1. ✅ Local .agent/index.md → routes to convert-sp-block skill
2. ✅ Local @sql-worker subagent → does conversion
3. ✅ Local knowledge/wiki/rpt-ordersummary-validation.md → deep details
4. 🔍 Vault MCP (optional) → generic SQL conversion patterns if needed
```

**Vault Role**: Fallback reference for generic patterns

---

### Example 2: Design New Feature (Airflow Repo)

```
Task: "Design a new pipeline for MongoDB ingestion"

Claude's Access Pattern:
1. ✅ Local .agent/ → airflow-specific routing
2. 🔍 Vault MCP → knowledge/tools/airflow/DAG Patterns.md (generic pattern)
3. 🔍 Vault MCP → companies/current-company/reference/Glue Patterns (DP).md (how Glue does it)
4. 🔍 Vault MCP → companies/current-company/data-platform/Data Platform Overview.md (integration context)
5. ✅ Local implementation → airflow-specific code
```

**Vault Role**: Primary source for cross-repo patterns and integration context

---

### Example 3: Onboarding New Team Member

```
Task: "Explain the entire data platform"

Claude's Access Pattern:
1. 🔍 Vault MCP → companies/current-company/README.md (overview)
2. 🔍 Vault MCP → Data Platform Architecture Diagram.md (visual)
3. 🔍 Vault MCP → Data Platform Repos - Agent System Status.md (repo comparison)
4. 🔍 Vault MCP → AI Agent System - Presentation.md (detailed explanation)
5. ✅ Local repos → specific implementation details as needed
```

**Vault Role**: Primary source for onboarding and overview

---

## ⚙️ Testing Your Configuration

### Test 1: Verify MCP Server Running

```bash
# Restart Claude Code to load new config
# Then test:
```

**Claude prompt**:
```
"List all notes in my Knowledge Vault"
```

**Expected result**: Claude uses `mcp__obsidian__list_notes` and shows all vault notes

---

### Test 2: Cross-Repo Query

```bash
cd ~/Desktop/External-Repos/example-repo-airflow/
```

**Claude prompt**:
```
"From my vault, show me the generic Airflow DAG pattern"
```

**Expected result**: Claude reads `knowledge/tools/airflow/DAG Patterns.md` via MCP

---

### Test 3: Architecture Query

```bash
# From any directory
```

**Claude prompt**:
```
"Show me the data platform architecture from my vault"
```

**Expected result**: Claude reads `companies/current-company/data-platform/Data Platform Architecture Diagram.md`

---

## 🛠️ Troubleshooting

### Issue 1: MCP Server Not Loading

**Symptoms**: Claude says "I don't have access to your vault"

**Fix**:
```bash
# 1. Check config file exists
ls -la ~/.claude/.mcp.json

# 2. Verify MCP server is built
ls -la ~/Desktop/Knowledge-Vault/obsidian-mcp-server/dist/index.js

# 3. Rebuild if needed
cd ~/Desktop/Knowledge-Vault/obsidian-mcp-server/
npm install
npm run build

# 4. Restart Claude Code
```

---

### Issue 2: Wrong Vault Path

**Symptoms**: MCP connects but can't find files

**Fix**:
```bash
# 1. Check vault path in config
cat ~/.claude/.mcp.json | grep OBSIDIAN_VAULT_PATH

# 2. Verify vault location
ls -la ~/Desktop/Knowledge-Vault/

# 3. Update path if needed (edit ~/.claude/.mcp.json)
```

---

### Issue 3: Permission Errors

**Symptoms**: "Cannot read file" or "Access denied"

**Fix**:
```bash
# Check file permissions
ls -la ~/Desktop/Knowledge-Vault/

# Fix if needed
chmod -R u+rw ~/Desktop/Knowledge-Vault/
```

---

## 📈 Usage Recommendations

### When to Use Vault MCP

✅ **DO use for**:
- Generic patterns and best practices
- Cross-repo integration questions
- Architecture overview
- Personal knowledge (journal, learning)
- Onboarding documentation

❌ **DON'T use for**:
- Deep implementation details (use local repo wiki)
- Project-specific bugs (use local knowledge)
- Quick local file reads (use direct file access)

---

### Performance Tips

1. **Prefer local repo knowledge first**
   - Faster access
   - More detailed
   - Repo-specific

2. **Use vault for cross-cutting concerns**
   - Generic patterns
   - Integration points
   - Architecture decisions

3. **Cache frequently used patterns**
   - Keep common patterns in repo wiki with vault reference
   - Example: "See vault/knowledge/tools/airflow/ for generic pattern"

---

## 🔐 Security Notes

### What's Accessible

✅ **Accessible via MCP**:
- All markdown files in vault
- All wiki-links and backlinks
- Search functionality

❌ **NOT accessible**:
- Files outside vault directory
- System files
- Other user's files

### Privacy

- MCP server only reads/writes within vault directory
- No network access (runs locally)
- No data sent to external servers
- All operations sandboxed

---

## 📚 Related Documentation

**In Vault**:
- [[README]] - Vault overview
- [[Index]] - Main navigation
- [[MCP Tutorial]] - MCP basics

**External**:
- [MCP Specification](https://modelcontextprotocol.io/)
- [Obsidian MCP Server Source](obsidian-mcp-server/README.md)

---

## 🎯 Next Steps

Now that Global MCP is configured:

### Immediate (This Week)

1. ✅ Test configuration with simple queries
2. 🔄 Try cross-repo queries from different repos
3. 📝 Start using journal/daily/ for work logs
4. 🎯 Reference vault patterns when working in repos

### Short-term (This Month)

5. 📖 Extract first generic pattern from repo to vault
6. 🗺️ Create cross-repo integration map
7. 📊 Use vault for architecture discussions
8. 🎤 Reference presentations when needed

### Long-term (Ongoing)

9. 🔄 Develop habit of vault-first for generic knowledge
10. 📈 Track cross-repo patterns
11. 🎓 Use journal for growth tracking
12. 🔍 Leverage cross-repo queries regularly

---

## ❓ FAQ

### Q1: Will this slow down Claude in repos?
**A**: No. MCP is only queried when explicitly requested or when local knowledge is insufficient.

### Q2: Can I have multiple vaults?
**A**: Yes. Add more entries to `mcpServers` in `.mcp.json` with different names.

### Q3: What if I rename the vault?
**A**: Update `OBSIDIAN_VAULT_PATH` in `~/.claude/.mcp.json` and restart Claude Code.

### Q4: Does this work offline?
**A**: Yes. MCP server runs locally, no internet required.

### Q5: Can other people access my vault?
**A**: No. It's local to your machine. Only you can access it.

---

## 🎉 Success!

Your Global MCP is now configured! 

**Test it**:
```
In any repo or directory, ask Claude:
"List all notes in my Knowledge Vault"
```

You should see all your vault notes! 🚀

---

**Configuration File**: `~/.claude/.mcp.json`  
**Vault Path**: `C:\Users\your-user\Desktop\Knowledge-Vault`  
**Status**: ✅ Active  
**Last Updated**: 2026-06-03
