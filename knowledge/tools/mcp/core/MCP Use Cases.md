# MCP 实用场景指南

**场景**: 在任何repo工作时，Claude可以访问你vault中的知识库，实现知识复用和智能辅助。

---

## 🎯 核心使用场景

### 场景1: 跨项目知识查询

**情境**: 你在Airflow repo写DAG，想参考Glue的错误处理模式

```
在Airflow repo中问Claude:
"How does Glue handle validation errors? Check my vault for patterns"
```

**Claude会**:
1. 搜索vault中的Glue相关文档
2. 找到 `knowledge/tools/spark/Job Patterns.md` 或 `companies/current-company/reference/Glue Patterns (DP).md`
3. 提取相关的错误处理模式
4. 应用到你的Airflow DAG代码中

**价值**: 不需要手动切换到Obsidian查找，Claude自动获取并应用知识

---

### 场景2: 参考历史实现

**情境**: 在Redshift repo实现新的validation逻辑，想看看其他项目怎么做的

```
"Show me how we handle data validation across all projects in my vault"
```

**Claude会**:
1. 搜索vault中的validation相关内容
2. 汇总来自Airflow/Glue/Redshift的validation模式
3. 比较不同项目的实现方式
4. 推荐最适合当前场景的方案

**价值**: 避免重复造轮子，复用团队最佳实践

---

### 场景3: 快速查找配置/命令

**情境**: 在Infrastructure repo配置IAM，忘记最佳实践

```
"What are the IAM best practices? Check my vault"
```

**Claude会**:
1. 读取 `knowledge/tools/aws/IAM Best Practices.md`
2. 直接给出相关的配置建议
3. 甚至可以直接生成Terraform代码

**价值**: 知识库变成即时参考手册

---

### 场景4: 架构决策参考

**情境**: 设计新功能，需要了解整体架构

```
"Explain our data platform architecture from my vault, especially the Airflow→Glue→Redshift flow"
```

**Claude会**:
1. 读取 `companies/current-company/data-platform/Data Platform Overview.md`
2. 读取各个项目文档
3. 生成带有context的架构说明
4. 确保新设计符合现有架构

**价值**: 确保新代码与整体架构一致

---

### 场景5: 故障排查知识查询

**情境**: Glue job失败，想找类似问题的解决方案

```
"Search my vault for Glue job failures related to OOM errors"
```

**Claude会**:
1. 搜索vault中关于Glue OOM的记录
2. 找到历史troubleshooting笔记
3. 提供解决方案

**价值**: 快速找到历史经验，避免重复调试

---

### 场景6: 代码实现时参考模式

**情境**: 写新的DAG，想参考标准模式

```
"Show me our standard DAG patterns from the vault, I need to create a daily ETL job"
```

**Claude会**:
1. 读取 `knowledge/tools/airflow/DAG Patterns.md`
2. 提供标准的DAG模板
3. 根据你的需求定制代码
4. 包含团队约定的命名规范和结构

**价值**: 确保代码风格和结构的一致性

---

### 场景7: 项目文档同步

**情境**: 在repo中实现了新功能，想更新vault中的项目文档

```
"I just added a new validation step to the Redshift reporting pipeline. 
Update the relevant note in my vault to document this change."
```

**Claude会**:
1. 找到 `companies/current-company/projects/Redshift Reporting.md`
2. 读取现有内容
3. 添加新功能的说明
4. 保持文档格式一致

**价值**: 保持vault文档与代码同步

---

### 场景8: 学习和知识积累

**情境**: 发现了一个好的Terraform模式，想记录到vault

```
"Add this Terraform pattern to my vault under tools/terraform:
[粘贴代码和说明]"
```

**Claude会**:
1. 读取 `knowledge/tools/terraform/IaC Patterns.md`
2. 以合适的格式添加新模式
3. 保持与现有内容的结构一致

**价值**: 持续积累团队知识库

---

## 🔥 高级使用场景

### 场景9: 全局知识搜索

**情境**: 记得在vault某处记录了某个概念，但忘了在哪

```
"Search my entire vault for 'circuit breaker pattern'"
```

**Claude会**:
1. 搜索所有笔记
2. 列出包含该概念的文件
3. 显示相关段落
4. 提供wikilink快速访问

**价值**: Vault变成可搜索的知识库

---

### 场景10: 跨项目依赖分析

**情境**: 想了解Airflow和Glue之间的交互

```
"Explain how Airflow triggers Glue jobs based on my vault documentation"
```

**Claude会**:
1. 读取Airflow和Glue的项目文档
2. 读取架构图文档
3. 分析两个系统的交互方式
4. 解释实现细节

**价值**: 快速理解复杂的跨系统交互

---

### 场景11: 新人入职知识传递

**情境**: 新团队成员需要了解数据平台

```
"Generate an onboarding guide for our data platform using my vault"
```

**Claude会**:
1. 读取Data Platform Overview
2. 读取各个项目的README
3. 整合架构图和模式文档
4. 生成结构化的入职指南

**价值**: 快速生成onboarding材料

---

### 场景12: 代码Review时的上下文

**情境**: Review PR时，想确认是否符合团队标准

```
"Review this DAG implementation against our Airflow patterns in the vault"
```

**Claude会**:
1. 读取团队的Airflow Patterns
2. 对比PR中的代码
3. 指出不符合标准的地方
4. 提供改进建议

**价值**: 确保代码质量和一致性

---

## 💡 日常工作流示例

### 工作流1: 开始新任务

```bash
# 1. 切换到工作repo
cd ~/Desktop/External-Repos/example-repo-airflow

# 2. 询问Claude
"I need to create a new DAG for daily user analytics. 
 Show me our standard patterns from the vault and help me design it."

# Claude会:
# - 读取DAG Patterns
# - 读取Data Platform架构
# - 生成符合标准的DAG代码
```

---

### 工作流2: 故障排查

```bash
# 1. 遇到问题
"Glue job failing with S3 access denied error"

# 2. 查询vault
"Search my vault for S3 permission issues in Glue jobs"

# Claude会:
# - 搜索相关的troubleshooting记录
# - 查找IAM best practices
# - 提供解决方案
```

---

### 工作流3: 实现功能

```bash
# 在Redshift repo实现新功能
"I'm adding a new validation table. 
 Check our database architecture in the vault to ensure consistency."

# Claude会:
# - 读取Database Architecture文档
# - 确认命名规范
# - 生成符合架构的SQL
```

---

### 工作流4: 文档维护

```bash
# 完成功能后
"Update the Airflow project note in my vault to document 
 the new user_analytics DAG I just created."

# Claude会:
# - 找到对应的项目文档
# - 添加新DAG的说明
# - 保持文档结构一致
```

---

## 🎯 最佳实践

### 1. 明确指定vault查询

❌ 不好:
```
"How do we handle errors?"
```

✅ 好:
```
"Check my vault for error handling patterns in Glue jobs"
```

---

### 2. 结合具体场景

❌ 不好:
```
"Show me all Airflow docs"
```

✅ 好:
```
"I'm creating a daily ETL DAG. Show me our standard DAG patterns 
 from the vault and help me apply them."
```

---

### 3. 跨项目对比

✅ 强大用法:
```
"Compare how Airflow and SRE repos handle monitoring based on my vault docs"
```

---

### 4. 知识更新闭环

✅ 好习惯:
```
# 学到新东西后
"Add this pattern to my vault: [说明]"

# 完成功能后
"Update the project doc in vault: [说明]"
```

---

## 📊 效果评估

### 使用MCP前 vs 后

| 场景 | 没有MCP | 有MCP |
|------|---------|-------|
| 查找模式 | 切换到Obsidian → 手动搜索 → 复制 | 直接问Claude |
| 参考架构 | 打开多个文档 → 手动整合 | Claude自动整合 |
| 更新文档 | 记得要更新 → 手动编辑 | 告诉Claude更新 |
| 跨项目查询 | 不知道在哪个文档 → 放弃 | Claude搜索所有文档 |
| 新人onboarding | 手动发送多个文档链接 | Claude生成整合指南 |

---

## 🚀 进阶技巧

### 技巧1: Vault作为Long-term Memory

```
每次完成重要功能:
"Add this implementation detail to my vault under the relevant project"

下次类似任务:
"How did we implement X last time? Check my vault"
```

**效果**: Vault成为团队的"记忆"

---

### 技巧2: Pattern Library

```
发现好的实现:
"Extract this as a reusable pattern and add to vault"

应用时:
"Show me patterns for X from my vault"
```

**效果**: 持续积累可复用模式

---

### 技巧3: Decision Log

```
做架构决策时:
"Document this decision in vault: why we chose X over Y"

后续参考:
"Why did we choose this approach? Check decision history in vault"
```

**效果**: 保留决策上下文

---

## 📝 下一步

1. **尝试基础场景**: 从场景1-3开始，熟悉基本用法
2. **建立习惯**: 工作中遇到需要查文档的时候，先问Claude + vault
3. **闭环更新**: 学到新东西记得更新vault
4. **扩展知识库**: 持续往vault添加有价值的内容

---

## 🔗 相关文档

- [[MCP Quick Reference]] - 快速参考
- [[MCP Tutorial]] - 新手教程
- [[knowledge/README]] - Knowledge库结构

---

**最后更新**: 2026-06-03  
**下一步**: 试试场景1，在任意repo中查询vault知识！
