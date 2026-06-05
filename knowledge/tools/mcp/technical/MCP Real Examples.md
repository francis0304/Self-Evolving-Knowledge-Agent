# MCP 实际使用示例

基于你当前vault的真实示例，可以直接复制使用。

---

## 📋 示例1: 查询Airflow DAG模式

### 场景
你在 `example-repo-airflow` repo，需要创建新DAG

### 命令
```
Show me our standard DAG patterns from the vault
```

### Claude会做什么
1. 读取 `knowledge/tools/airflow/DAG Patterns.md`
2. 显示标准模式和最佳实践
3. 可以基于这些模式生成代码

### 延伸用法
```
# 更具体的查询
"Show me the error handling pattern for DAGs from my vault"

# 应用模式
"Based on our DAG patterns, help me create a daily ETL DAG that processes user events"

# 跨项目参考
"Compare Airflow DAG patterns with our Glue job patterns from the vault"
```

---

## 📋 示例2: 查询项目架构

### 场景
新人或者需要回顾整体架构

### 命令
```
Explain our data platform architecture from the vault
```

### Claude会做什么
1. 读取 `companies/current-company/data-platform/Data Platform Overview.md`
2. 读取 `companies/current-company/data-platform/Data Platform Architecture Diagram.md`
3. 整合说明各组件的关系

### 延伸用法
```
# 聚焦特定部分
"Explain how Airflow orchestrates Glue jobs based on vault docs"

# 查看组件关系
"What's the data flow from source to Redshift according to our architecture docs?"

# 对比设计
"Does this new design fit our existing architecture? Check the vault"
```

---

## 📋 示例3: 查找特定项目信息

### 场景
需要了解Redshift Reporting项目的详情

### 命令
```
Read the Redshift Reporting project documentation from my vault
```

### Claude会做什么
1. 读取 `companies/current-company/projects/Redshift Reporting.md`
2. 显示项目的功能、结构、技术栈等

### 延伸用法
```
# 查询所有项目
"List all our projects from the vault with brief descriptions"

# 对比项目
"Compare the tech stacks of Airflow and Glue projects from vault"

# 查找依赖
"Which projects depend on Redshift based on vault docs?"
```

---

## 📋 示例4: 搜索特定技术或概念

### 场景
记得vault里记录过某个terraform模式，但忘了在哪

### 命令
```
Search my vault for terraform patterns
```

### Claude会做什么
1. 使用 `search_notes` 工具搜索
2. 列出包含terraform的所有笔记
3. 显示相关段落

### 延伸用法
```
# 搜索错误处理
"Search vault for error handling strategies"

# 搜索配置
"Find all IAM-related notes in my vault"

# 搜索模式
"Search vault for retry logic patterns"
```

---

## 📋 示例5: 查看项目间的引用关系

### 场景
想了解哪些文档链接到某个项目

### 命令
```
What notes in my vault link to the Airflow project?
```

### Claude会做什么
1. 使用 `get_backlinks` 工具
2. 找到所有引用Airflow的笔记
3. 显示引用上下文

### 延伸用法
```
# 查看依赖
"What other projects reference the Infrastructure docs?"

# 追踪影响
"If I change the Glue patterns, which docs might be affected? Check backlinks"
```

---

## 📋 示例6: 更新项目文档

### 场景
刚完成Airflow新功能，需要更新项目文档

### 命令
```
Update the Airflow project note in my vault:
- Added new DAG: user_analytics_daily
- Purpose: Aggregate user events from S3 to Redshift
- Schedule: Daily at 2 AM UTC
```

### Claude会做什么
1. 读取 `companies/current-company/projects/Airflow.md`
2. 在合适的位置添加新信息
3. 保持文档格式一致

### 延伸用法
```
# 记录troubleshooting
"Add to vault: Glue job OOM issue resolved by increasing memory to 10G"

# 记录决策
"Document in vault: We chose DynamoDB over RDS for session storage because of [reason]"

# 添加新模式
"Add this Terraform module pattern to vault under tools/terraform"
```

---

## 📋 示例7: 跨repo工作时的上下文切换

### 场景
从Airflow repo切换到Infrastructure repo，需要快速了解

### 命令
```
I'm now working on Infrastructure. Give me a quick overview from the vault 
and highlight how it relates to Airflow.
```

### Claude会做什么
1. 读取 `companies/current-company/projects/Infrastructure.md`
2. 读取架构文档
3. 说明Infrastructure如何支持Airflow
4. 提醒相关的配置和依赖

### 延伸用法
```
# 切换到新项目
"Brief me on the SRE project from vault, what are the key monitoring practices?"

# 了解接口
"How does Glue interact with Redshift? Check the vault docs"
```

---

## 📋 示例8: 生成报告或文档

### 场景
需要写项目总结或onboarding文档

### 命令
```
Generate a data platform overview document based on my vault, 
suitable for new team members
```

### Claude会做什么
1. 读取所有相关项目文档
2. 整合架构图和模式
3. 生成结构化的overview
4. 包含各项目的职责和关系

### 延伸用法
```
# 技术栈总结
"List all technologies we use across projects based on vault docs"

# 功能矩阵
"Create a matrix showing which project handles which data pipeline stage"

# 最佳实践手册
"Generate a best practices guide from all pattern documents in vault"
```

---

## 📋 示例9: Code Review时的参考

### 场景
Review PR时，检查是否符合团队标准

### 命令
```
Here's a new DAG implementation:
[粘贴代码]

Compare it against our Airflow patterns in the vault and suggest improvements.
```

### Claude会做什么
1. 读取 `knowledge/tools/airflow/DAG Patterns.md`
2. 对比代码与标准模式
3. 指出偏差和改进建议
4. 确保符合团队约定

### 延伸用法
```
# Terraform review
"Review this Terraform code against our IaC patterns from vault"

# 架构review
"Does this new service design fit our overall architecture? Check vault"

# 命名review
"Are these table names consistent with our database architecture docs?"
```

---

## 📋 示例10: 学习和知识积累

### 场景
发现了一个有用的技巧或模式

### 命令
```
Add this Spark optimization tip to my vault:

When processing large datasets with many small files, use coalesce() 
before writing to reduce the number of output files. 

Example: df.coalesce(10).write.parquet(output_path)

Add this under knowledge/tools/spark
```

### Claude会做什么
1. 读取 `knowledge/tools/spark/Job Patterns.md`
2. 在合适的section添加新内容
3. 保持markdown格式一致
4. 如果需要，创建新section

### 延伸用法
```
# 记录错误和解决方案
"Add to vault: S3 403 error fixed by updating IAM role trust policy"

# 记录配置
"Document this Airflow configuration in vault for future reference"

# 记录工具使用
"Add this aws-cli command pattern to vault"
```

---

## 🎯 组合使用示例

### 完整工作流: 实现新功能

```bash
# Step 1: 需求分析
"I need to build a daily ETL pipeline from S3 to Redshift. 
 What are the relevant patterns and projects in my vault?"

# Step 2: 参考现有实现
"Show me how our current S3→Redshift pipelines work based on vault docs"

# Step 3: 应用模式
"Based on our DAG patterns and data platform architecture, 
 help me design this new pipeline"

# Step 4: 实现代码
# Claude会参考vault中的模式生成代码

# Step 5: 更新文档
"Update the Airflow project doc in vault to include this new pipeline"

# Step 6: 记录经验
"Add this S3 partitioning strategy to vault as a best practice"
```

---

### 完整工作流: 故障排查

```bash
# Step 1: 搜索已知问题
"Glue job failing with OOM error. 
 Search my vault for similar issues and solutions"

# Step 2: 查看配置标准
"What are our standard memory configurations for Glue jobs? Check vault"

# Step 3: 应用解决方案
# Claude提供基于vault的解决方案

# Step 4: 记录解决过程
"Add to vault: Glue OOM resolved by increasing DPU from 2 to 5 
 for jobs processing >1GB input"
```

---

### 完整工作流: 新人Onboarding

```bash
# Step 1: 整体了解
"Generate an overview of our data platform from vault for a new team member"

# Step 2: 项目深入
"Explain each project's purpose and tech stack from vault docs"

# Step 3: 重点学习
"What are the most important patterns and practices in our vault 
 that a new engineer should know?"

# Step 4: 动手资源
"List all the tool-specific patterns (Airflow, Glue, Terraform) 
 from vault that can serve as reference"
```

---

## 💡 快速参考卡片

### 常用查询模板

```bash
# 读取特定文档
"Read [project/topic] from my vault"

# 搜索内容
"Search my vault for [keyword/concept]"

# 查看链接
"What notes link to [topic] in my vault?"

# 比较对比
"Compare [A] and [B] based on my vault docs"

# 更新文档
"Update [project] doc in vault: [new info]"

# 添加知识
"Add this to vault under [category]: [content]"

# 整合说明
"Explain [topic] using all relevant docs from my vault"

# 模式应用
"Based on [pattern] from vault, help me [task]"
```

---

## 🚀 试试这些！

### 立即可用的命令

1. **了解你的知识库**:
   ```
   List all my project documentation from the vault
   ```

2. **查看架构**:
   ```
   Show me the data platform architecture from my vault
   ```

3. **查找模式**:
   ```
   What patterns do we have documented in the vault?
   ```

4. **搜索内容**:
   ```
   Search my vault for "validation"
   ```

5. **查看项目**:
   ```
   Tell me about each of our 5 main projects based on vault docs
   ```

---

## 📚 相关文档

- [[MCP Use Cases]] - 使用场景详解
- [[MCP Quick Reference]] - 快速参考
- [[knowledge/README]] - Knowledge库结构

---

**提示**: 这些示例都是基于你当前vault的真实内容，可以直接使用！

**最后更新**: 2026-06-03
