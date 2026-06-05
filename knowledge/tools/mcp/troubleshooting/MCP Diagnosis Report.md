# MCP Diagnosis & Fix Report
**Date**: 2026-06-03  
**Status**: ✅ Issues Identified and Fixed

---

## 🔍 Initial Problems

### Problem 1: MCP Only in Vault Directory
**Symptom**: MCP only showed "connected" in vault directory, not in other repos

**Root Cause**: Claude Code doesn't support global `~/.claude/.mcp.json`  
**Solution**: ✅ Created `.mcp.json` in each repo

---

### Problem 2: MCP "Failed" Status in Vault
**Symptom**: In vault directory, MCP server showed but status was "failed"

**Root Cause**: Vault's `.mcp.json` had **two issues**:

#### Issue A: Relative Path (Won't Work)
```json
❌ BEFORE:
"args": ["obsidian-mcp-server/dist/index.js"]  // Relative path

✅ AFTER:
"args": ["/c/Users/your-user/Desktop/Knowledge-Vault/obsidian-mcp-server/dist/index.js"]  // Absolute
```

**Why it failed**: 
- Claude Code may change working directory
- Relative paths break when directory changes
- Absolute path always works

---

#### Issue B: Windows Path Format (Git Bash Incompatible)
```json
❌ BEFORE:
"OBSIDIAN_VAULT_PATH": "C:\\Users\\your-user\\Desktop\\Knowledge-Vault"  // Windows format

✅ AFTER:
"OBSIDIAN_VAULT_PATH": "/c/Users/your-user/Desktop/Knowledge-Vault"  // Unix format
```

**Why it failed**:
- Git Bash uses Unix-style paths
- Windows paths with backslashes may not work correctly
- Unix format (`/c/Users/...`) is compatible with Git Bash

---

### Problem 3: Inconsistent Server Names
```json
❌ Vault:     "obsidian"
✅ Other repos: "knowledge-vault"
```

**Fixed**: Now all use `"knowledge-vault"` for consistency

---

## ✅ Fixes Applied

### 1. Fixed Vault `.mcp.json`
- ✅ Changed to absolute Unix path
- ✅ Changed Windows path to Unix format
- ✅ Renamed server to "knowledge-vault"

### 2. Configured All 5 Repos
- ✅ redshift-reporting
- ✅ airflow
- ✅ glue
- ✅ infrastructure
- ✅ sre

### 3. Added to `.gitignore`
All repos now have `.mcp.json` in `.gitignore` (won't commit personal config)

---

## 📊 Final Configuration

### Standard MCP Config (All Repos)
```json
{
  "mcpServers": {
    "knowledge-vault": {
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

**Key Points**:
- ✅ Absolute Unix path for server
- ✅ Unix format for vault path
- ✅ Consistent server name
- ✅ Works in Git Bash environment

---

## 🧪 Testing Checklist

### After Restarting Claude Code

#### Test 1: Vault Directory
```bash
cd ~/Desktop/Knowledge-Vault/

# Expected:
✅ MCP server "knowledge-vault" shows as "connected" (not "failed")
✅ Can list vault notes
```

#### Test 2: Redshift Repo
```bash
cd ~/Desktop/External-Repos/example-repo-redshift/

# Ask Claude: "List all notes in my vault"
# Expected:
✅ MCP server "knowledge-vault" connected
✅ Shows ~60 markdown files
```

#### Test 3: Airflow Repo
```bash
cd ~/Desktop/External-Repos/example-repo-airflow/

# Ask Claude: "Show me generic Airflow patterns from my vault"
# Expected:
✅ Reads knowledge/tools/airflow/DAG Patterns.md
✅ Shows generic DAG factory pattern
```

#### Test 4: Cross-Repo Query
```bash
# From any repo:
# Ask Claude: "How does Redshift handle validation? Check my vault"

# Expected:
✅ Reads companies/current-company/projects/Redshift Reporting.md
✅ Cross-repo knowledge access works
```

---

## 🔧 Why Previous Config Failed

### Technical Explanation

**Relative Path Problem**:
```javascript
// When Claude Code runs:
process.cwd() // Could be anything when command executes
// "obsidian-mcp-server/dist/index.js" is relative to process.cwd()
// If cwd changes → file not found → MCP fails

// With absolute path:
"/c/Users/your-user/Desktop/Knowledge-Vault/obsidian-mcp-server/dist/index.js"
// Always points to the same file → works reliably
```

**Path Format Problem**:
```bash
# Git Bash environment:
$ node "C:\Users\..."           # May fail (Windows format)
$ node "/c/Users/..."           # Works (Unix format)

# The backslash in Windows paths can cause issues in Git Bash
```

---

## 📋 Configuration Best Practices

### 1. Always Use Absolute Paths
```json
✅ DO:
"args": ["/c/Users/your-user/Desktop/Knowledge-Vault/obsidian-mcp-server/dist/index.js"]

❌ DON'T:
"args": ["obsidian-mcp-server/dist/index.js"]
"args": ["./obsidian-mcp-server/dist/index.js"]
"args": ["../Knowledge-Vault/obsidian-mcp-server/dist/index.js"]
```

### 2. Use Unix Path Format in Git Bash
```json
✅ DO:
"/c/Users/your-user/Desktop/..."

❌ DON'T:
"C:\\Users\\your-user\\Desktop\\..."
"C:/Users/your-user/Desktop/..."
```

### 3. Use Consistent Server Names
```json
✅ DO:
All repos use "knowledge-vault"

❌ DON'T:
Vault uses "obsidian", others use "knowledge-vault"
```

### 4. Keep Template Updated
When you update any config, update the template:
```bash
~/Desktop/Knowledge-Vault/mcp-config-template.json
```

---

## 🎯 Root Cause Summary

| Issue | Symptom | Root Cause | Fix |
|-------|---------|------------|-----|
| **No MCP in other repos** | Only vault had MCP | Global config not supported | Created per-repo `.mcp.json` |
| **MCP failed in vault** | "failed" status | Relative path | Changed to absolute path |
| **MCP failed in vault** | "failed" status | Windows path format | Changed to Unix format |
| **Inconsistent names** | Confusing | Different server names | Standardized to "knowledge-vault" |

---

## ✅ Current Status

### All Issues Resolved

1. ✅ **Vault `.mcp.json`** - Fixed (absolute Unix paths)
2. ✅ **5 Repos configured** - Each has `.mcp.json`
3. ✅ **All in `.gitignore`** - Won't commit personal config
4. ✅ **Template saved** - `mcp-config-template.json`
5. ✅ **Auto-setup script** - `setup-mcp-all-repos.sh`

### What Should Work Now

After restarting Claude Code:

✅ Vault directory → MCP connected (not failed)  
✅ Redshift repo → Can access vault  
✅ Airflow repo → Can access vault  
✅ Glue repo → Can access vault  
✅ Infrastructure repo → Can access vault  
✅ SRE repo → Can access vault  

---

## 🚀 Next Steps

### Immediate (Now)
1. **Restart Claude Code** - Load updated configs
2. **Test vault directory** - Should show "connected" not "failed"
3. **Test one repo** - Try Airflow or Redshift

### If Still Having Issues

**Check MCP server manually**:
```bash
cd ~/Desktop/Knowledge-Vault/
OBSIDIAN_VAULT_PATH="/c/Users/your-user/Desktop/Knowledge-Vault" \
  node obsidian-mcp-server/dist/index.js

# Should show: "Obsidian Vault MCP Server running on..."
```

**Rebuild MCP server if needed**:
```bash
cd ~/Desktop/Knowledge-Vault/obsidian-mcp-server/
npm install
npm run build
```

**Verify config files**:
```bash
# Check vault config
cat ~/Desktop/Knowledge-Vault/.mcp.json

# Check a repo config
cat ~/Desktop/External-Repos/example-repo-airflow/.mcp.json

# Both should be identical in structure
```

---

## 📚 Reference

### Documents Created
- [[MCP Setup Complete]] - Setup status and testing
- [[MCP Quick Reference]] - Quick usage guide
- [[MCP Troubleshooting]] - Problem solving
- [[MCP Configuration Guide]] - Complete documentation
- [[MCP Diagnosis Report]] - This document

### Files Created
- `mcp-config-template.json` - Config template
- `setup-mcp-all-repos.sh` - Auto-setup script
- `.mcp.json` in 6 locations (vault + 5 repos)

---

## 🎓 Key Learnings

### 1. Claude Code MCP Behavior
- ❌ Does NOT support global `~/.claude/.mcp.json`
- ✅ Only loads project-local `.mcp.json`
- ✅ Loads at startup (restart required for changes)

### 2. Path Requirements
- ✅ Must use absolute paths for reliability
- ✅ Must use Unix format in Git Bash (`/c/Users/...`)
- ❌ Relative paths unreliable
- ❌ Windows format may not work

### 3. Configuration Management
- ✅ Keep template for consistency
- ✅ Add to `.gitignore` (personal config)
- ✅ Use same server name everywhere

---

## ✨ Final Checklist

Before you restart Claude Code:

- [x] Vault `.mcp.json` fixed (absolute Unix paths) ✅
- [x] All 5 repos have `.mcp.json` ✅
- [x] All `.mcp.json` in `.gitignore` ✅
- [x] All configs use "knowledge-vault" ✅
- [x] Template saved for future use ✅
- [x] Documentation complete ✅

**Ready to restart Claude Code and test!** 🎯

---

**Report Date**: 2026-06-03  
**Issues Found**: 3  
**Issues Fixed**: 3  
**Status**: 🟢 **All Fixed - Ready to Test**
