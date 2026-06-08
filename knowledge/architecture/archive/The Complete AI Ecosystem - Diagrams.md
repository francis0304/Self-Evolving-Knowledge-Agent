# The Complete AI Ecosystem - Visual Diagrams

**Companion to**: [[Complete Ecosystem Overview]]  
**Date**: 2026-06-04  
**Format**: Mermaid diagrams (render in Obsidian with Mermaid plugin)

---

## 🎨 Diagram 1: System Overview (High-Level)

```mermaid
graph TB
    subgraph User["👤 DEVELOPER"]
        U[Working on Task]
    end
    
    subgraph Claude["🤖 CLAUDE CODE"]
        LLM[Cloud LLM<br/>Sonnet 4.5<br/>OR<br/>Local LLM<br/>Ollama]
    end
    
    subgraph Repos["💻 CODE REPOSITORIES"]
        R1[Airflow Repo<br/>.agent/ system]
        R2[Glue Repo<br/>.agent/ system]
        R3[Redshift Repo<br/>.agent/ system]
    end
    
    subgraph Vault["📚 OBSIDIAN VAULT"]
        V[Knowledge Hub<br/>MCP Server v2<br/>Cache + Watcher]
    end
    
    subgraph Graph["🕸️ GRAPHIFY"]
        G[Auto Knowledge Graph<br/>graph.json + .html]
    end
    
    U --> Claude
    Claude --> Repos
    Claude --> Vault
    Claude --> Graph
    
    Repos <--> |MCP Protocol| Vault
    Repos --> |/graphify| Graph
    Graph --> |--obsidian| Vault
    
    style User fill:#e1f5ff
    style Claude fill:#fff4e1
    style Repos fill:#f0fff4
    style Vault fill:#fff0f5
    style Graph fill:#f5f0ff
```

---

## 🎨 Diagram 2: Knowledge Flow Architecture

```mermaid
graph LR
    subgraph Repo1["AIRFLOW REPO"]
        A1[Main Agent]
        A2[@wiki-keeper]
        A3[knowledge/wiki/]
        A1 -->|delegates| A2
        A2 -->|writes| A3
    end
    
    subgraph Vault["OBSIDIAN VAULT"]
        V1[MCP Server v2]
        V2[knowledge/tools/]
        V3[knowledge/architecture/]
        V1 --> V2
        V1 --> V3
    end
    
    subgraph Repo2["GLUE REPO"]
        G1[Main Agent]
        G2[@wiki-keeper]
        G3[knowledge/wiki/]
        G1 -->|delegates| G2
        G2 -->|writes| G3
    end
    
    A2 -->|MCP<br/>write_note| V1
    V1 -->|MCP<br/>search_notes| G1
    G2 -->|MCP<br/>write_note| V1
    
    A3 -.->|sync| V2
    V2 -.->|query| G3
    
    style Repo1 fill:#e3f2fd
    style Vault fill:#fce4ec
    style Repo2 fill:#f1f8e9
```

---

## 🎨 Diagram 3: .agent System Architecture (Single Repo)

```mermaid
graph TB
    subgraph User["USER REQUEST"]
        U["Convert block 15<br/>of stored procedure"]
    end
    
    subgraph Main["MAIN ORCHESTRATOR (10K context)"]
        M1[index.md<br/>Routing Rules]
        M2[memory/facts.md<br/>Project Context]
        M3[memory/working.md<br/>Active Tasks]
    end
    
    subgraph Skills["SKILLS (Entry Points)"]
        S1[convert-sp-block.md]
        S2[validate-migration.md]
        S3[query-vault.md<br/>NEW v5.1]
    end
    
    subgraph Subagents["SPECIALIZED SUBAGENTS (5-8K each)"]
        SA1[@sql-worker<br/>SQL Conversion]
        SA2[@validator<br/>Test Execution]
        SA3[@fixer<br/>Debugging]
        SA4[@wiki-keeper<br/>Documentation]
        SA5[@researcher<br/>Analysis]
    end
    
    subgraph MCP["MCP ACCESS"]
        MCP1[Query Vault<br/>search_notes]
        MCP2[Read Patterns<br/>read_note]
        MCP3[Sync Knowledge<br/>write_note]
    end
    
    U --> M1
    M1 --> M2
    M1 --> M3
    M1 --> S1
    S1 --> SA1
    SA1 --> SA2
    SA2 -.->|if failed| SA3
    SA1 -.->|parallel| SA4
    
    M1 --> S3
    S3 --> MCP1
    S3 --> MCP2
    SA4 --> MCP3
    
    style User fill:#fff3e0
    style Main fill:#e8eaf6
    style Skills fill:#f3e5f5
    style Subagents fill:#e0f2f1
    style MCP fill:#fce4ec
```

---

## 🎨 Diagram 4: MCP Server Architecture (Detailed)

```mermaid
graph TB
    subgraph Server["MCP SERVER (Node.js Process)"]
        S1[index.ts<br/>Main Server]
        S2[In-Memory Cache<br/>Map<path, content>]
        S3[Backlink Index<br/>Map<note, links[]>]
        S4[File Watcher<br/>chokidar]
        
        S1 --> S2
        S1 --> S3
        S1 --> S4
        
        subgraph Tools["5 MCP TOOLS"]
            T1[search_notes<br/>Full-text search]
            T2[read_note<br/>Get content]
            T3[write_note<br/>Create/Update]
            T4[get_links<br/>Forward links]
            T5[get_backlinks<br/>Reverse links]
        end
        
        S1 --> Tools
    end
    
    subgraph Vault["OBSIDIAN VAULT FILES"]
        V1[knowledge/]
        V2[companies/]
        V3[journal/]
        V4[templates/]
    end
    
    subgraph Clients["MCP CLIENTS"]
        C1[Airflow Repo<br/>Claude Code]
        C2[Glue Repo<br/>Claude Code]
        C3[Redshift Repo<br/>Claude Code]
    end
    
    Vault --> |load on startup| S2
    Vault --> |watch changes| S4
    S4 --> |update| S2
    S4 --> |rebuild| S3
    
    C1 <-->|JSON-RPC<br/>stdio| Server
    C2 <-->|JSON-RPC<br/>stdio| Server
    C3 <-->|JSON-RPC<br/>stdio| Server
    
    style Server fill:#e8f5e9
    style Vault fill:#fff3e0
    style Clients fill:#e3f2fd
    style Tools fill:#fce4ec
```

---

## 🎨 Diagram 5: Graphify Pipeline

```mermaid
graph LR
    subgraph Input["INPUT"]
        I1[Code Files<br/>.py .ts .go]
        I2[Documents<br/>.md .txt .pdf]
        I3[Images<br/>.png .jpg]
        I4[URLs<br/>Papers, Blogs]
    end
    
    subgraph Extract["EXTRACTION"]
        E1[Parse Files]
        E2[Extract Concepts<br/>LLM or Structural]
        E3[Extract Relationships<br/>EXTRACTED vs INFERRED]
        E4[Build Graph<br/>Nodes + Edges]
    end
    
    subgraph Analyze["ANALYSIS"]
        A1[Community Detection<br/>Louvain Algorithm]
        A2[Centrality Analysis]
        A3[Path Finding]
    end
    
    subgraph Output["OUTPUT"]
        O1[graph.json<br/>Structured Graph]
        O2[graph.html<br/>Interactive Viz]
        O3[GRAPH_REPORT.md<br/>Plain Language]
        O4[Obsidian Vault<br/>--obsidian flag]
    end
    
    Input --> Extract
    Extract --> Analyze
    Analyze --> Output
    
    style Input fill:#e3f2fd
    style Extract fill:#f3e5f5
    style Analyze fill:#fff3e0
    style Output fill:#e8f5e9
```

---

## 🎨 Diagram 6: Cross-Repo Pattern Discovery Workflow

```mermaid
sequenceDiagram
    participant User
    participant Airflow as Airflow Repo<br/>(Main Agent)
    participant WK1 as @wiki-keeper<br/>(Airflow)
    participant MCP as MCP Server<br/>(Vault)
    participant Vault as Obsidian Vault<br/>(Files)
    participant Glue as Glue Repo<br/>(Main Agent)
    
    User->>Airflow: Solve error handling problem
    Airflow->>WK1: Delegate documentation
    WK1->>WK1: Write knowledge/wiki/airflow-patterns.md
    WK1->>WK1: Check: Cross-repo applicable? YES
    WK1->>MCP: write_note("knowledge/tools/airflow/error-handling.md")
    MCP->>Vault: Create/update note
    MCP-->>WK1: Success
    
    Note over User,Glue: Later, in different repo...
    
    User->>Glue: How to handle Glue job failures?
    Glue->>MCP: search_notes("error handling")
    MCP->>Vault: Search in cache (<50ms)
    MCP-->>Glue: Return: airflow/error-handling.md
    Glue->>Glue: Adapt pattern for Glue
    Glue-->>User: Solution in 30 seconds
    
    Note over User,Glue: Pattern evolves
    
    Glue->>MCP: write_note("...error-handling.md", enhanced)
    MCP->>Vault: Update with Glue improvements
    
    Note over Airflow,Vault: Airflow can now learn from Glue
```

---

## 🎨 Diagram 7: Delegation vs Monolithic (Context Comparison)

```mermaid
graph TB
    subgraph Monolithic["❌ TRADITIONAL MONOLITHIC (50K context)"]
        M[Single Claude Instance]
        M1[Read 10+ files<br/>15K tokens]
        M2[Analyze code<br/>10K tokens]
        M3[Convert SQL<br/>8K tokens]
        M4[Write tests<br/>5K tokens]
        M5[Run validation<br/>4K tokens]
        M6[Debug failures<br/>6K tokens]
        M7[Update docs<br/>2K tokens]
        
        M --> M1
        M --> M2
        M --> M3
        M --> M4
        M --> M5
        M --> M6
        M --> M7
    end
    
    subgraph Delegation["✅ .AGENT DELEGATION (15K total)"]
        D[Main Orchestrator<br/>10K context]
        D1[@sql-worker<br/>8K context]
        D2[@validator<br/>6K context]
        D3[@fixer<br/>7K context]
        D4[@wiki-keeper<br/>5K context]
        
        D -->|delegates| D1
        D -->|delegates| D2
        D2 -.->|if needed| D3
        D1 -.->|parallel| D4
    end
    
    R1[Result: Context overwhelmed<br/>Slow, error-prone]
    R2[Result: Clean, fast<br/>Isolated failures<br/>Parallel execution]
    
    M --> R1
    D --> R2
    
    style Monolithic fill:#ffebee
    style Delegation fill:#e8f5e9
    style R1 fill:#ffcdd2
    style R2 fill:#c8e6c9
```

---

## 🎨 Diagram 8: Knowledge Portability Model

```mermaid
graph TB
    subgraph Vault["OBSIDIAN VAULT"]
        subgraph Universal["✅ UNIVERSAL (Portable)"]
            U1[knowledge/<br/>Patterns, Tools, Concepts]
            U2[templates/<br/>Reusable Templates]
            U3[journal/<br/>Personal Notes]
        end
        
        subgraph Company["🔒 COMPANY-SPECIFIC (Local Only)"]
            C1[companies/current-company/<br/>Projects, APIs, Teams]
            C2[.gitignore excludes this]
        end
    end
    
    subgraph Job1["JOB 1: ACME"]
        J1[Use Vault with<br/>companies/current-company/]
        J1A[Build patterns in knowledge/]
    end
    
    subgraph Job2["JOB 2: NEXT COMPANY"]
        J2[Delete companies/current-company/]
        J2A[Add companies/new-company/]
        J2B[Keep all knowledge/]
        J2C[Productive from Day 1]
    end
    
    Vault --> Job1
    Job1 --> |Leave company| Job2
    U1 -.->|Take with you| J2B
    U2 -.->|Take with you| J2B
    C1 -.->|Delete| J2
    
    style Universal fill:#c8e6c9
    style Company fill:#ffcdd2
    style Job1 fill:#e3f2fd
    style Job2 fill:#f3e5f5
```

---

## 🎨 Diagram 9: Hybrid Cloud/Local LLM Strategy

```mermaid
graph TB
    subgraph Task["LARGE TASK: Migrate 100 SQL Procedures"]
        T[User Request]
    end
    
    subgraph Phase1["PHASE 1: PLANNING (Cloud LLM)"]
        P1[Analyze first 5 procedures<br/>Claude Sonnet 4.5]
        P2[Extract common pattern]
        P3[Create conversion template]
        P4[Validate approach]
        P5[Cost: ~$2]
    end
    
    subgraph Phase2["PHASE 2: EXECUTION (Local LLM)"]
        E1[Apply template to 95 procedures<br/>Llama 3 / DeepSeek]
        E2[Parallel processing<br/>No rate limits]
        E3[Batch generation]
        E4[Cost: $0]
    end
    
    subgraph Phase3["PHASE 3: QA (Cloud LLM)"]
        Q1[Review 10% sample<br/>Claude Sonnet 4.5]
        Q2[Validate correctness]
        Q3[Cost: $0.50]
    end
    
    Result[Total Cost: $2.50<br/>vs $20+ all cloud<br/>87% savings]
    
    T --> Phase1
    Phase1 --> Phase2
    Phase2 --> Phase3
    Phase3 --> Result
    
    style Phase1 fill:#e3f2fd
    style Phase2 fill:#c8e6c9
    style Phase3 fill:#fff3e0
    style Result fill:#f3e5f5
```

---

## 🎨 Diagram 10: Complete Ecosystem Integration

```mermaid
graph TB
    subgraph User["👤 DEVELOPER WORKFLOW"]
        U1[Start: New Task]
        U2[Query: Check Vault]
        U3[Execute: Run AI]
        U4[Document: Capture Knowledge]
        U5[Graph: Visualize Understanding]
    end
    
    subgraph Agent[".AGENT SYSTEM"]
        A1[Main Orchestrator]
        A2[Specialized Subagents]
        A3[Memory & Learning]
    end
    
    subgraph MCP["MCP PROTOCOL"]
        M1[Search Vault<br/>search_notes]
        M2[Read Patterns<br/>read_note]
        M3[Write Knowledge<br/>write_note]
    end
    
    subgraph Vault["OBSIDIAN VAULT"]
        V1[Universal Knowledge]
        V2[Company Specific]
        V3[Personal Journal]
    end
    
    subgraph Graph["GRAPHIFY"]
        G1[Extract Concepts]
        G2[Build Graph]
        G3[Detect Communities]
        G4[Generate Docs]
    end
    
    subgraph LLM["LLM EXECUTION"]
        L1[Cloud: Complex Tasks]
        L2[Local: High Volume]
    end
    
    U1 --> U2
    U2 --> MCP
    MCP <--> Vault
    
    U2 --> Agent
    Agent --> LLM
    LLM --> U3
    
    U3 --> U4
    U4 --> Agent
    Agent --> Vault
    
    U4 --> U5
    U5 --> Graph
    Graph --> Vault
    
    Vault -.->|Feedback Loop| U2
    
    style User fill:#fff3e0
    style Agent fill:#e8f5e9
    style MCP fill:#fce4ec
    style Vault fill:#e1f5ff
    style Graph fill:#f3e5f5
    style LLM fill:#fff9c4
```

---

## 📊 Comparison Diagrams

### Performance: Before vs After

```mermaid
graph LR
    subgraph Before["❌ BEFORE THIS SYSTEM"]
        B1[Knowledge Query<br/>2-3K tokens<br/>Manual copy-paste]
        B2[Cross-Repo Task<br/>10K tokens<br/>Context switching]
        B3[Pattern Search<br/>2-5 minutes<br/>Manual search]
        B4[Onboarding<br/>2-4 weeks<br/>Linear reading]
    end
    
    subgraph After["✅ WITH THIS SYSTEM"]
        A1[Knowledge Query<br/>500-800 tokens<br/>MCP instant]
        A2[Cross-Repo Task<br/>1.5K tokens<br/>MCP synthesis]
        A3[Pattern Search<br/>&lt;1 second<br/>MCP cache]
        A4[Onboarding<br/>3-5 days<br/>Graph view]
    end
    
    B1 -.->|60-70% savings| A1
    B2 -.->|85% savings| A2
    B3 -.->|99% faster| A3
    B4 -.->|70% faster| A4
    
    style Before fill:#ffebee
    style After fill:#e8f5e9
```

---

## 🎯 Usage Example: End-to-End Flow

```mermaid
sequenceDiagram
    autonumber
    participant Dev as Developer
    participant CC as Claude Code
    participant Main as Main Agent
    participant MCP as MCP Server
    participant Vault as Obsidian Vault
    participant Sub as @sql-worker
    participant Wiki as @wiki-keeper
    
    Dev->>CC: "Convert SP block 15 using our pattern"
    CC->>Main: Process request
    
    Note over Main: Detect "use our pattern" trigger
    
    Main->>MCP: search_notes("SQL conversion pattern")
    MCP->>Vault: Query cache (<50ms)
    Vault-->>MCP: Return pattern doc
    MCP-->>Main: Pattern content (800 tokens)
    
    Note over Main: Routing: convert-sp-block.md
    
    Main->>Sub: Delegate conversion<br/>Context: Pattern + Block 15
    Sub->>Sub: Convert SQL (8K context)
    Sub-->>Main: Converted code
    
    Main->>Wiki: Delegate documentation (parallel)
    Wiki->>Wiki: Update local wiki/
    Wiki->>MCP: Check: New pattern?
    
    alt New pattern discovered
        Wiki->>MCP: write_note("knowledge/tools/...")
        MCP->>Vault: Sync to vault
    end
    
    Wiki-->>Main: Documentation complete
    Main-->>CC: Task complete
    CC-->>Dev: Result + Pattern applied
    
    Note over Dev,Wiki: Knowledge captured for next task
```

---

## 📝 Diagram Legend

### Colors
- 🔵 **Blue** - User interaction / Interface layer
- 🟢 **Green** - Processing / Agent systems
- 🔴 **Red** - Problems / Traditional approach
- 🟣 **Purple** - Knowledge / Storage
- 🟡 **Yellow** - Execution / LLM layer

### Symbols
- `→` Synchronous flow
- `-.->` Async / Optional flow
- `<-->` Bidirectional communication
- `▣` Subprocess / Component
- `◊` Decision point

---

## 🔗 Related Documents

- [[Complete Ecosystem Overview]] - Full written documentation
- [[Agent System Introduction]] - .agent system explained
- [[knowledge/tools/mcp/core/MCP Tutorial]] - MCP setup guide
- [[Index]] - Vault navigation

---

**Tip**: These diagrams render beautifully in Obsidian with the Mermaid plugin installed. You can also copy them to tools like Mermaid Live Editor (https://mermaid.live) for standalone viewing.

**Last Updated**: 2026-06-04  
**Format**: Mermaid.js syntax
