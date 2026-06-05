# MCP Error -32000 修复指南

**错误**: `Failed to reconnect to knowledge-vault: -32000`

## 🎯 问题根因

Claude Code在**Windows环境**运行，需要Windows路径格式，不能识别Git Bash的Unix路径。

### ❌ 错误的配置（Unix路径）
```json
{
  "command": "node",
  "args": ["/c/Users/your-user/Desktop/..."],
  "env": {"OBSIDIAN_VAULT_PATH": "/c/Users/your-user/Desktop/..."}
}
```

### ✅ 正确的配置（Windows路径）
```json
{
  "command": "node",
  "args": ["C:/Users/your-user/Desktop/..."],
  "env": {"OBSIDIAN_VAULT_PATH": "C:/Users/your-user/Desktop/..."}
}
```

**关键差异**:
- `/c/` → `C:/` (Unix风格 → Windows风格)
- 使用正斜杠 `/` 而不是反斜杠 `\\`

---

## 🔧 已修复的文件

✅ All locations updated to Windows path format:
1. Global: `~/.claude/.mcp.json`
2. Vault: `~/Desktop/Knowledge-Vault/.mcp.json`
3. All 5 BitBucket repos: `.mcp.json`
4. Template: `~/Desktop/Knowledge-Vault/mcp-config-template.json`

---

## ⚡ 立即测试

### 步骤1: 重启Claude Code
```bash
# 完全退出Claude Code
# 重新启动
```

### 步骤2: 检查MCP状态
在Claude Code中运行:
```
/mcp
```

**期望结果**:
```
🟢 knowledge-vault (connected)
```

### 步骤3: 测试查询
```
List all notes in my vault
```

**期望结果**: 显示约60个markdown文件

---

## 🐛 如果还有问题

### 问题1: 仍然显示 -32000

**可能原因**: Claude Code缓存了旧配置

**解决方案**:
```bash
# 1. 完全关闭Claude Code
# 2. 清理缓存（可选）
rm -rf ~/.claude/cache/  # 如果存在

# 3. 重启Claude Code
```

### 问题2: 显示其他错误码

**-32601**: Method not found → MCP SDK版本问题
```bash
cd ~/Desktop/Knowledge-Vault/obsidian-mcp-server
npm update @modelcontextprotocol/sdk
npm run build
```

**-32602**: Invalid params → 配置参数问题
- 检查JSON格式是否正确
- 确认路径拼写无误

### 问题3: node命令找不到

**解决方案**: 使用node.exe的完整路径
```json
{
  "command": "C:/Program Files/nodejs/node.exe",
  "args": ["C:/Users/your-user/Desktop/..."]
}
```

---

## 📝 路径格式速查表

| 环境 | 格式 | 示例 | 用途 |
|------|------|------|------|
| **Git Bash** | Unix | `/c/Users/...` | Shell命令 |
| **Claude Code** | Windows | `C:/Users/...` | MCP配置 |
| **PowerShell** | Windows | `C:\Users\...` | Windows命令 |
| **JSON配置** | Windows正斜杠 | `C:/Users/...` | 配置文件 |

**记住**: 
- MCP配置 = Windows路径 (`C:/`)
- Shell脚本 = Unix路径 (`/c/`)

---

## 🎯 验证当前配置

快速检查你的配置是否正确：

```bash
# 检查global config
cat ~/.claude/.mcp.json | grep -o '"[A-Z]:/.*"' || echo "❌ 使用Unix路径"

# 检查repo config
cat ~/Desktop/External-Repos/example-repo-airflow/.mcp.json | grep -o '"[A-Z]:/.*"' || echo "❌ 使用Unix路径"
```

如果看到 `"C:/Users/..."`，说明配置正确！✅

---

## 📚 相关文档

- [[MCP Troubleshooting]] - 完整故障排查指南
- [[MCP Quick Reference]] - 快速使用指南

---

**最后更新**: 2026-06-03 18:45  
**状态**: ✅ 问题已解决
