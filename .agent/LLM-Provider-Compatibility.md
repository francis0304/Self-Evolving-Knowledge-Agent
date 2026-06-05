---
tags: [architecture, llm, portability, provider-agnostic]
created: 2026-06-05
updated: 2026-06-05
status: active
---

# .agent系统：LLM提供商适配性分析

**作者**: Francis Lim + Claudian AI  
**日期**: 2026-06-05  
**结论**: ✅ **完全可以适配任何LLM/AI提供商**

---

## 🎯 核心观点

你的.agent生态系统采用了**供应商无关的架构设计**，这意味着：

- ✅ **内容格式**: Markdown + YAML = 跨平台通用
- ✅ **工具接口**: MCP = 标准化JSON-RPC协议 (与提供商无关)
- ✅ **架构模式**: 委托-优先设计 = 支持任何AI能力的LLM
- ✅ **状态管理**: 本地文件系统 = 独立于云平台
- ✅ **知识库**: Obsidian vault = 纯Markdown (可在任何地方打开)

**不绑定的地方**:
- ❌ Claude Code界面 (这是使用场景，不是架构)
- ❌ 具体的LLM能力 (长上下文、函数调用等)
- ✅ 一切都可以迁移

---

## 🏗️ 架构层的供应商无关性

### 第1层：知识存储（完全可移植）

```
Obsidian Vault
├── Markdown files     ← 任何编辑器可打开
├── YAML frontmatter   ← 标准格式
├── Wiki-links         ← 纯文本
└── 纯本地文件系统     ← 不依赖云服务
```

**适配任何提供商**: ✅  
原因：Markdown是通用标准，不属于任何LLM

### 第2层：工具接口（MCP标准化）

```
MCP (Model Context Protocol)
├── 标准JSON-RPC格式
├── 6个通用工具:
│   ├── search_notes()        ← 跨提供商都支持
│   ├── read_note()           
│   ├── write_note()          
│   ├── get_links()           
│   ├── get_backlinks()       
│   └── list_notes()          
└── 任何支持MCP的LLM都可以调用
```

**工具定义** (MCP v2):
```json
{
  "tools": [
    {
      "name": "search_notes",
      "description": "全文搜索notes",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": {"type": "string"}
        }
      }
    }
  ]
}
```

**支持的提供商**: 
- ✅ Anthropic Claude (current)
- ✅ OpenAI (o1, GPT-4, etc.)
- ✅ Google Gemini
- ✅ Mistral
- ✅ 任何支持MCP的本地LLM
- ✅ 任何支持工具调用/函数的API

### 第3层：.agent系统（委托模式与能力无关）

```
.agent/
├── index.md              ← 路由逻辑 (纯文本)
├── manifest.json         ← 元数据 (纯JSON)
├── skills/*.md           ← 工作流 (Markdown)
└── agents/*.md           ← 子代理定义 (Markdown)

这些都是静态配置，不包含LLM特定的API调用
```

**适配任何提供商**: ✅  
原因：路由/委托是逻辑操作，不是模型特定的

### 第4层：执行环境（可替换）

```
Current:
  Claude Code + MCP客户端 → Claude API

可以替换为:
  
  方案A：OpenAI替代
  ┌─────────────────────┐
  │ Custom IDE/Editor   │
  │ + OpenAI API Client │ → OpenAI GPT-4 API
  │ + MCP Client        │
  └─────────────────────┘
  
  方案B：本地LLM替代
  ┌─────────────────────┐
  │ Ollama/LMStudio     │
  │ + MCP Client        │ → Ollama (Llama, Qwen等)
  │ + .agent System     │
  └─────────────────────┘
  
  方案C：多提供商混合
  ┌─────────────────────┐
  │ Custom Orchestrator │
  │ + MCP Router        │ → Claude (复杂任务)
  │ + .agent System     │    + Ollama (本地快速)
  └─────────────────────┘ + Gemini (分析)
```

---

## 🔄 迁移路径：从Claude到其他提供商

### 场景1：迁移到OpenAI GPT-4

**所需更改**:

| 组件 | 当前 | OpenAI版本 | 迁移成本 |
|------|------|-----------|--------|
| 知识存储 | Markdown | Markdown | ✅ 无 |
| MCP工具 | MCP标准 | MCP标准 | ✅ 无 |
| .agent系统 | index.md | index.md | ✅ 无 |
| 执行客户端 | Claude Code | Custom Python/Node | ⏱️ 1-2小时 |
| 提示词 | Claude特定 | 通用化 | ⏱️ 1-2小时 |
| API调用 | 无 (MCP抽象) | 无 (MCP抽象) | ✅ 无 |

**代码示例**:

```typescript
// 当前 (Claude)
const response = await claude.messages.create({
  model: "claude-3-5-sonnet",
  tools: mcpTools,  // ← 标准MCP工具定义
  messages: [...]
});

// OpenAI版本 (替换客户端，工具定义不变)
const response = await openai.chat.completions.create({
  model: "gpt-4-turbo",
  tools: mcpTools,  // ← 相同的MCP工具定义！
  messages: [...]
});
```

**迁移步骤**:
1. ✅ 导出Obsidian vault (git clone)
2. ✅ 复制.agent/ 系统
3. ✅ 创建OpenAI MCP客户端包装器
4. ✅ 测试MCP工具连接
5. ✅ 运行"optimize system"验证

**预计时间**: 2-3小时

### 场景2：迁移到本地LLM (Ollama)

**所需更改**:

| 组件 | 当前 | Ollama版本 | 迁移成本 |
|------|------|-----------|--------|
| 知识存储 | 云端 | 本地 | ✅ 无 (相同文件) |
| MCP工具 | MCP标准 | MCP标准 | ✅ 无 |
| .agent系统 | 云环境 | 本地环境 | ✅ 无 |
| 执行环境 | VS Code | Ollama CLI/API | ⏱️ 30分钟 |
| 模型能力 | 100K上下文 | 8K-32K上下文 | ⚠️ 需要调整 |
| 成本 | 按token计费 | 免费 (本地) | ✅ $0 |

**设置步骤**:

```bash
# 1. 启动Ollama MCP服务器
cd obsidian-mcp-server
npm run build
OBSIDIAN_VAULT_PATH=/path/to/vault node dist/index.js

# 2. 启动Ollama
ollama serve

# 3. 创建MCP客户端配置
cat > ~/.ollama/.mcp.json << EOF
{
  "mcpServers": {
    "obsidian-vault": {
      "command": "node",
      "args": ["/path/to/obsidian-mcp-server/dist/index.js"]
    }
  }
}
EOF

# 4. 测试连接
ollama pull qwen:14b  # 使用Qwen支持中文
ollama run qwen:14b "Search notes about airflow patterns"
```

**模型选择**:
- **推荐**: Qwen 14B (中文支持好)
- **备选**: Llama 3 (70B for quality)
- **轻量**: Mistral 7B (快速)

**适配成本**:
- 上下文限制更严 (32K vs 200K)
- 需要更精准的提示词
- .agent系统的委托模式帮助：每个子代理只用5-8K
- 性能反而更好（因为上下文小）

### 场景3：混合策略（多提供商）

**应用场景**:
```
长/复杂任务     → Claude (100K上下文)
快速查询        → Ollama本地 (30ms响应)
分析报告        → Gemini (更好的摘要)
代码验证        → GPT-4 (可靠的测试)
```

**实现方式**:

```typescript
class HybridLLMRouter {
  async delegate(task: Task, context: Context) {
    const taskType = this.classify(task);
    
    if (taskType === "search" && context.tokens < 10K) {
      // 快速本地查询
      return await ollama.query(task);
    }
    
    if (taskType === "complex" && context.tokens > 50K) {
      // 复杂任务需要长上下文
      return await claude.message(task);
    }
    
    if (taskType === "analysis") {
      // 分析使用Google的实力
      return await gemini.analyze(task);
    }
    
    // 默认本地优先
    return await ollama.query(task).fallback(() => 
      claude.message(task)
    );
  }
}
```

**架构图**:

```
用户请求
  ↓
混合路由器 (HybridLLMRouter)
  ├─ 任务分类 (search/complex/analysis/etc)
  ├─ 成本评估 (API费用 vs 本地资源)
  ├─ 上下文评估 (token需求)
  └─ 模型选择 (最优配置)
     ├─→ Ollama (本地) - 快速 $0
     ├─→ Claude - 质量 $$$
     ├─→ GPT-4 - 准确 $$
     └─→ Gemini - 分析 $$
```

---

## 🔐 供应商锁定风险评估

### ✅ 绿色区域（无风险）

| 组件 | 锁定风险 | 原因 |
|------|--------|------|
| **知识库** (Markdown) | ❌ 无 | 通用格式，任何编辑器可打开 |
| **MCP工具** | ❌ 无 | 标准协议，多提供商支持 |
| **.agent系统** | ❌ 无 | 纯文本配置+路由逻辑 |
| **YAML frontmatter** | ❌ 无 | 标准格式 |
| **Wiki-links** | ❌ 无 | Obsidian标准，可导出 |

### ⚠️ 黄色区域（轻微锁定）

| 组件 | 锁定风险 | 缓解方案 |
|------|--------|--------|
| **MCP客户端** | ⚠️ 轻微 | 使用标准MCP库，避免提供商特定API |
| **提示词工程** | ⚠️ 中等 | 保存提示词版本，定期更新 |
| **模型特定特性** | ⚠️ 中等 | 使用通用能力（工具调用、结构化输出） |

### 🔴 红色区域（中等锁定）

| 组件 | 锁定风险 | 缓解方案 |
|------|--------|--------|
| **上下文窗口** | 🔴 中等 | 委托模式分散上下文需求 |
| **函数调用格式** | 🔴 中等 | MCP抽象化统一格式 |
| **成本模型** | 🔴 中等 | 混合策略降低单一提供商依赖 |

### 解除锁定的实际步骤

**步骤1：审计依赖**
```bash
# 检查代码中的硬编码提供商调用
grep -r "claude\|openai\|gemini" .agent/ --include="*.md"
grep -r "import.*anthropic\|openai" .claude/ --include="*.ts"

# 结果应该很少（只在客户端）
```

**步骤2：抽象化客户端**
```typescript
// ✅ 好的做法：抽象化接口
interface LLMClient {
  callTools(tools, messages): Promise<Response>;
  chat(prompt): Promise<string>;
}

// 实现多个适配器
class ClaudeClient implements LLMClient { }
class OpenAIClient implements LLMClient { }
class OllamaClient implements LLMClient { }

// 不要做这样：
// const response = await Anthropic.messages.create(...)  // ❌ 硬编码
```

**步骤3：版本控制知识库**
```bash
# 你已经在做了！
git add .agent/ knowledge/ journal/ companies/
git commit -m "Vault snapshot - provider agnostic"

# 任何新提供商都能拉取相同的内容
```

---

## 💡 最佳实践：保持供应商无关性

### DO ✅

```markdown
# 在.agent文档中

## MCP工具
使用标准MCP工具定义，不提及特定提供商
- search_notes()
- read_note()
- write_note()

## 提示词
使用通用写法：
"You are an agent that can use the following tools..."
"When the user asks X, call tool Y with parameter Z"

不要写：
"You are Claude, specifically trained on..."
"Only use Claude's internal APIs..."

## 子代理配置
定义能力需求，而不是模型名称：
```yaml
---
name: sql-worker
required_abilities:
  - tool_calling
  - code_analysis
  - 8K+ context
context_tokens: 8000
model_agnostic: true  # 可以用任何支持这些能力的LLM
---
```
```

### DON'T ❌

```markdown
# 要避免的做法

## 硬编码API调用
❌ async function useVault() {
  const response = await Anthropic.messages.create({...})
}

## 提供商特定的特性
❌ "使用Claude的extended thinking能力..."
❌ "调用OpenAI的vision API..."

## 文档中的假设
❌ ".agent系统只能在Claude Code中运行"
❌ "MCP需要Anthropic API密钥"
```

### 代码组织建议

```
.agent/
├── index.md              # 核心逻辑 (提供商无关)
├── manifest.json         # 配置 (提供商无关)
├── skills/               # 工作流 (提供商无关)
│   └── *.md             # Markdown定义
└── adapters/             # 新建：提供商适配层
    ├── llm-interface.ts  # 通用接口定义
    ├── claude.ts         # Claude实现
    ├── openai.ts         # OpenAI实现
    ├── ollama.ts         # Ollama实现
    └── router.ts         # 智能路由

.claude/agents/           # Claude特定配置
├── agent-*.md           # 子代理定义
└── README.md            # 当前设置说明
```

---

## 📈 实际迁移成本对比

| 迁移目标 | 时间 | 成本 | 复杂度 | 建议 |
|--------|------|------|--------|------|
| **Claude → OpenAI** | 2-3小时 | $50-200 | 低 | ⭐⭐⭐ 简单直接 |
| **Claude → Ollama** | 3-5小时 | 免费 | 低 | ⭐⭐⭐ 推荐本地替代 |
| **Claude → Gemini** | 2-3小时 | $0-100 | 低 | ⭐⭐ 试验用途 |
| **Claude →混合** | 1-2天 | 最优化 | 中 | ⭐⭐⭐⭐ 生产级最优 |
| **Claude → 自建LLM** | 1-2周 | 显著 | 高 | ⭐ 长期投资 |

---

## 🎓 总结：你的系统是供应商无关的

### 关键设计原则

1. **内容 ≠ 执行环境**
   - 知识库 (Markdown) 独立于LLM选择
   - .agent系统 (配置) 独立于LLM选择
   - 只有客户端需要适配

2. **标准化接口**
   - MCP = 供应商无关的工具协议
   - 任何支持工具调用的LLM都能使用

3. **委托模式**
   - 小上下文窗口 (5-8K per subagent)
   - 适应任何LLM容量
   - 本地LLM也能高效运行

4. **分层架构**
   - 知识层 (Markdown) - 完全可移植
   - 配置层 (.agent) - 完全可移植
   - 执行层 (LLM client) - 可替换

### 你现在的位置

✅ **架构**: 供应商无关 (好！)  
✅ **知识库**: 供应商无关 (好！)  
✅ **工具接口**: 供应商无关 (好！)  
⚠️ **客户端**: Claude Code专用 (需要适配层)  
✅ **可移植性**: 高 (2-3小时迁移任何提供商)

### 下一步建议

**短期** (即刻):
- 继续使用Claude Code (当前最优)
- 记录.agent系统的通用原则

**中期** (1-3个月):
- 创建MCP客户端抽象层 (adapters/)
- 测试Ollama本地替代方案
- 文档化迁移步骤

**长期** (3-12个月):
- 实现混合策略 (多提供商)
- 建立提供商成本监控
- 定期评估新LLM选项 (Gemini 2.0, etc)

---

## 📚 相关文档

- [[knowledge/architecture/The Complete AI Ecosystem - Architecture|完整生态系统架构]]
- [[knowledge/tools/mcp/README - Start Here|MCP文档]]
- [[.agent/index|.agent系统路由]]
- [[.agent/AGENTS|Agent系统完整文档]]
