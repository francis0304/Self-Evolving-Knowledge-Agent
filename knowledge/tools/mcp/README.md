# MCP (Model Context Protocol) Documentation

Model Context Protocol 让Claude能够访问你的Obsidian vault作为知识库。

## 📚 文档目录

### 快速开始
- [[MCP Demo Results]] - 🎬 实际演示结果（推荐先看这个！）
- [[MCP Quick Reference]] - 常用命令速查表
- [[MCP Tutorial]] - 新手教程，从零开始

### 使用场景
- [[MCP Use Cases]] - 🎯 12个实用场景详解
- [[MCP Real Examples]] - 📋 真实示例，可直接复制使用

### 配置指南
- [[MCP Configuration Guide]] - 完整配置文档
- [[troubleshooting/MCP Troubleshooting]] - 完整故障排查指南

### 故障排查
- [[troubleshooting/MCP-32000-Error-Fix]] - 错误 `-32000` 修复指南
- [[troubleshooting/MCP Diagnosis Report]] - 诊断报告

### 配置文件
- `.claudian/mcp-config-template.json` - MCP配置模板
- `.claudian/setup-mcp-all-repos.sh` - 批量配置脚本

---

## ⚡ 快速测试

检查MCP状态：
```
/mcp
```

列出所有笔记：
```
List all notes in my vault
```

搜索特定内容：
```
Search for "airflow" in my vault
```

---

## 🔧 当前配置

**Server**: Obsidian MCP Server  
**Vault**: `${VAULT_ROOT}`  
**Repos configured**: 
- example-repo-redshift
- example-repo-airflow
- example-repo-glue
- example-repo-infra
- example-repo-sre

---

## 🆘 需要帮助？

1. 先查看 [[MCP Quick Reference]]
2. 如果有错误，看 [[troubleshooting/MCP Troubleshooting]]
3. 特定错误码参考 `troubleshooting/` 文件夹

---

**最后更新**: 2026-06-03  
**状态**: ✅ 配置完成并正常工作
