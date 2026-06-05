# Knowledge - Universal Patterns

This directory contains portable, universal knowledge that can be applied to any company or project.

## Directory Structure

### `/architecture` - System Design
Deep dives on how systems are designed and evolve:
- **Agent System Architecture** - Core v5.1 design
- **Agent System Cost Optimization v5.1** - Current production spec
- **Agent System Meta-Optimizer** - Learning loop & promotion logic
- **Agent System Intelligence Analysis** - Capability assessment
- **Complete Ecosystem Overview** - Full system integration
- **Diagrams** - Visual architecture reference
- `/archive/` - Legacy versions (v4, v3, etc.)

### `/tools` - Technology Patterns
Tool-specific patterns and best practices:
- **airflow/** - Apache Airflow orchestration patterns
- **spark/** - Apache Spark ETL job patterns
- **terraform/** - Infrastructure-as-Code patterns
- **aws/** - AWS IAM and cloud architecture
- **mcp/** - Model Context Protocol integration

### `/concepts` (Ready) - Core Concepts
Theoretical knowledge and fundamental concepts (future content)

### `/practices` (Ready) - Development Practices
Development methodologies and best practices (future content)

## Philosophy

Knowledge in this directory should be:
- **Portable**: Applicable to any company or project
- **Generic**: Not tied to specific implementations
- **Reusable**: Patterns that can be adapted without modification

Company-specific implementations belong in `companies/<company-name>/reference/`

## Adding New Knowledge

When adding notes:
1. Remove company-specific details (paths, names, credentials)
2. Generalize patterns to be universally applicable
3. Add "Implementation Reference" sections linking to company examples
4. Use generic examples with placeholder names

## Quick Links

- [[knowledge/architecture/Agent System Cost Optimization v5.1]] - Start here for current system
- [[knowledge/tools/mcp/README]] - MCP integration patterns
- [[Index]] - Back to main vault

---

**Last Updated**: 2026-06-05  
**Status**: 12 core documents, 5 tool categories, growing