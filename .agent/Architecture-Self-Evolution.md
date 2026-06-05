# .agent Self-Evolution System Architecture

**Version**: 5.0  
**Created**: 2026-06-05  
**Purpose**: Visual architecture and data flow diagrams for self-evolution system

---

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    .agent Self-Evolution System                  │
│                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ @skill-creator │  │ @routing-      │  │   Solution      │   │
│  │                │  │  optimizer     │  │   Registry      │   │
│  │  Detects gaps  │  │                │  │                 │   │
│  │  Creates skills│  │ Learns routes  │  │ Known problems  │   │
│  └────────┬───────┘  └────────┬───────┘  └────────┬────────┘   │
│           │                   │                    │             │
│           └───────────────────┼────────────────────┘             │
│                               ↓                                  │
│                    ┌──────────────────────┐                      │
│                    │   Learning System    │                      │
│                    │  lessons → patterns  │                      │
│                    │   patterns → facts   │                      │
│                    └──────────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Skill Creation

```
User Interaction (3× pattern detected)
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 1. Pattern Detection                                              │
│    ┌─────────────────────────────────────────────────────┐      │
│    │ @skill-creator scans lessons.md                      │      │
│    │ Detects: "Generate changelog" appears 3×            │      │
│    │ Gap: No skill exists for this task                  │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 2. Skill Design                                                   │
│    ┌─────────────────────────────────────────────────────┐      │
│    │ Generate skill specification:                        │      │
│    │ - Name: @changelog-generator                        │      │
│    │ - Triggers: "generate changelog", "release notes"   │      │
│    │ - Process: git log → categorize → markdown         │      │
│    │ - Tools: Bash (git), Write (CHANGELOG.md)          │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 3. User Review                                                    │
│    ┌─────────────────────────────────────────────────────┐      │
│    │ Show proposal to user                                │      │
│    │ User: Approve / Reject / Modify                     │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 4. Integration (if approved)                                      │
│    ┌─────────────────────────────────────────────────────┐      │
│    │ Write: .agent/skills/changelog-generator.md         │      │
│    │ Edit: .agent/index.md (add routing rule)            │      │
│    │ Edit: .agent/memory/facts.md (add conventions)      │      │
│    │ Edit: .agent/monitoring/metrics.md (add tracking)   │      │
│    │ Record: .agent/learning/lessons.md (creation event) │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 5. Testing Phase                                                  │
│    ┌─────────────────────────────────────────────────────┐      │
│    │ Status: draft                                        │      │
│    │ User tests with trigger phrases                     │      │
│    │ If works correctly: Status → active                 │      │
│    │ If issues: Iterate on skill definition              │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
           ↓
Future: "generate changelog" → @changelog-generator (automatic)
```

---

## Data Flow: Routing Optimization

```
Weekly Optimization Cycle (Every Monday)
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 1. Data Collection                                                │
│    ┌─────────────────────────────────────────────────────┐      │
│    │ Read: .agent/learning/lessons.md                    │      │
│    │       .agent/learning/feedback.md                   │      │
│    │       .agent/memory/working.md                      │      │
│    │                                                      │      │
│    │ Extract:                                            │      │
│    │ - Routing corrections (user clarifications)        │      │
│    │ - New synonyms (user's natural phrases)            │      │
│    │ - Capability gaps (unmatched patterns)             │      │
│    │ - Success/failure patterns                         │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 2. Pattern Analysis                                               │
│    ┌─────────────────────────────────────────────────────┐      │
│    │ Analyze routing data:                                │      │
│    │                                                      │      │
│    │ Example findings:                                   │      │
│    │ - "broken references" used 3×, always meant links  │      │
│    │ - "vault health" needed both links + metadata (2×) │      │
│    │ - "organize notes" unmatched (gap detected)        │      │
│    │ - Success rate this week: 85% (below 90% target)   │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 3. Generate Improvements                                          │
│    ┌─────────────────────────────────────────────────────┐      │
│    │ Proposed changes:                                    │      │
│    │                                                      │      │
│    │ 1. Add synonym: "broken references" → @link-checker │      │
│    │ 2. Composite route: "vault health" → @link-checker  │      │
│    │                      + @metadata-keeper (parallel)  │      │
│    │ 3. Gap detected: Create @vault-organizer skill      │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 4. User Review                                                    │
│    ┌─────────────────────────────────────────────────────┐      │
│    │ Show optimization report                             │      │
│    │ User: Approve all / Selective approval / Reject     │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 5. Apply Changes (if approved)                                    │
│    ┌─────────────────────────────────────────────────────┐      │
│    │ Edit: .agent/index.md (update routing rules)        │      │
│    │ Edit: .agent/memory/facts.md (add conventions)      │      │
│    │ If gaps: Delegate to @skill-creator                │      │
│    │ Record: .agent/learning/lessons.md (optimization)   │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 6. Validation                                                     │
│    ┌─────────────────────────────────────────────────────┐      │
│    │ Measure next week:                                   │      │
│    │ - Before: 85% success rate                          │      │
│    │ - After: [measure next Monday]                      │      │
│    │ - If improved: Keep changes ✅                      │      │
│    │ - If degraded: Rollback, analyze ❌                │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: Solution Registry

```
User Reports Problem
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 1. Check Solution Registry                                        │
│    ┌─────────────────────────────────────────────────────┐      │
│    │ Read: .agent/memory/solutions.md                    │      │
│    │ Match symptoms: "broken links after rename"         │      │
│    │ Result: P001 found (High confidence, 5/5 success)  │      │
│    └─────────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────────┘
           ↓
┌──────────────────────────────────────────────────────────────────┐
│ 2. Decision Branch                                                │
│                                                                   │
│    ┌─────────────────────┐         ┌────────────────────────┐   │
│    │ Known Problem?      │         │ Unknown Problem?       │   │
│    │ (Match found)       │         │ (No match)             │   │
│    └──────────┬──────────┘         └──────────┬─────────────┘   │
│               │                                │                 │
│               ↓                                ↓                 │
│    ┌──────────────────────┐         ┌────────────────────────┐  │
│    │ Apply Known Solution │         │ Investigate + Solve    │  │
│    │ (2-3 minutes)        │         │ (10-15 minutes)        │  │
│    └──────────┬───────────┘         └──────────┬─────────────┘  │
│               │                                │                 │
│               ↓                                ↓                 │
│    ┌──────────────────────┐         ┌────────────────────────┐  │
│    │ Update Success Count │         │ Record as New Problem  │  │
│    │ 5/5 → 6/6            │         │ P006 (Low confidence)  │  │
│    └──────────────────────┘         └────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Interaction Diagram

```
┌───────────────────────────────────────────────────────────────────┐
│                         User Interaction                           │
└───────────────────────┬───────────────────────────────────────────┘
                        ↓
┌───────────────────────────────────────────────────────────────────┐
│                      Routing Layer (.agent/index.md)              │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 1. Problem reported? → Check solutions.md                 │   │
│  │ 2. Known pattern? → Route to skill                       │   │
│  │ 3. Unknown pattern? → @skill-creator (gap detection)     │   │
│  │ 4. Routing unclear? → @routing-optimizer (learn synonym) │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────┬───────────────────────────────────────────┘
                        ↓
        ┌───────────────┴────────────────┐
        ↓                                ↓
┌──────────────────┐          ┌──────────────────────┐
│  Execution Layer │          │   Learning Layer     │
│                  │          │                      │
│  ┌────────────┐ │          │  ┌────────────────┐ │
│  │ @link-     │ │          │  │ lessons.md     │ │
│  │  checker   │ │          │  │ patterns.md    │ │
│  ├────────────┤ │          │  │ facts.md       │ │
│  │ @indexer   │ │          │  └────────────────┘ │
│  ├────────────┤ │          │                      │
│  │ @metadata- │ │◄─────────┤  ┌────────────────┐ │
│  │  keeper    │ │  Record  │  │ working.md     │ │
│  ├────────────┤ │  Results │  │ feedback.md    │ │
│  │ @sync-     │ │          │  └────────────────┘ │
│  │  keeper    │ │          │                      │
│  ├────────────┤ │          │  ┌────────────────┐ │
│  │ @moc-      │ │          │  │ solutions.md   │ │
│  │  builder   │ │          │  │ (registry)     │ │
│  └────────────┘ │          │  └────────────────┘ │
└──────────────────┘          └──────────────────────┘
        │                                ↑
        └────────────────────────────────┘
             Feedback Loop (continuous)
```

---

## Memory System Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Memory Hierarchy                             │
│                                                                 │
│  ┌────────────────┐                                            │
│  │  working.md    │  ← Current session (ephemeral)            │
│  └────────┬───────┘                                            │
│           ↓ Record                                             │
│  ┌────────────────┐                                            │
│  │  lessons.md    │  ← Recent experiences (append-only)       │
│  └────────┬───────┘     Threshold: <8K tokens                 │
│           ↓ Promote (3× occurrences)                           │
│  ┌────────────────┐                                            │
│  │  patterns.md   │  ← Reusable patterns (proven 3×)          │
│  └────────┬───────┘                                            │
│           ↓ Harden (high confidence)                           │
│  ┌────────────────┐                                            │
│  │  facts.md      │  ← Project conventions (permanent)        │
│  └────────────────┘                                            │
│                                                                 │
│  Parallel track:                                               │
│  ┌────────────────┐                                            │
│  │ solutions.md   │  ← Problem → Solution registry            │
│  └────────────────┘     Confidence: Low → Medium → High       │
└────────────────────────────────────────────────────────────────┘
```

---

## Skill Lifecycle State Machine

```
                    ┌─────────────┐
                    │   Detected  │
                    │  (Pattern)  │
                    └──────┬──────┘
                           ↓
                   User Request or
                   3× Pattern Detected
                           ↓
                    ┌──────────────┐
                    │   Proposed   │
                    │ (Show to User)│
                    └──────┬───────┘
                           ↓
              ┌────────────┼────────────┐
              ↓                         ↓
       ┌──────────┐              ┌──────────┐
       │ Approved │              │ Rejected │
       └─────┬────┘              └─────┬────┘
             ↓                         ↓
      ┌──────────────┐         Record rejection
      │    Draft     │         (Won't propose again
      │  (Testing)   │          for 30 days)
      └──────┬───────┘
             ↓
    Test with trigger phrases
             ↓
       ┌─────┴─────┐
       ↓           ↓
  ┌─────────┐  ┌──────────┐
  │ Active  │  │ Revision │
  │ (Works) │  │ (Issues) │
  └────┬────┘  └─────┬────┘
       │             │
       │             ↓
       │       Fix & Re-test
       │             │
       └─────────────┘
             ↓
       Used regularly
             ↓
   ┌───────────────────┐
   │ Mature (Optimized)│
   └─────────┬─────────┘
             ↓
       ┌─────┴─────┐
       ↓           ↓
  ┌─────────┐  ┌──────────────┐
  │ Active  │  │  Deprecated  │
  │ (Keep)  │  │ (Obsolete or │
  │         │  │  Replaced)   │
  └─────────┘  └──────────────┘
```

---

## Routing Decision Tree (Detailed)

```
User Input
    ↓
┌───────────────────────────────────────┐
│ 1. Check Problem Registry             │
│    (solutions.md)                     │
└───┬───────────────────────────────────┘
    │
    ├─ Match found (Known problem)
    │   └─> Apply solution → Update success count → Done
    │
    └─ No match
        ↓
┌───────────────────────────────────────┐
│ 2. Pattern Match (Existing Skills)    │
│    (index.md routing rules)           │
└───┬───────────────────────────────────┘
    │
    ├─ Clear match (Single skill)
    │   └─> Route to skill → Done
    │
    ├─ Composite match (Multiple skills)
    │   └─> Route to skills (parallel) → Done
    │
    ├─ Ambiguous (Multiple interpretations)
    │   └─> Ask clarification → Record answer → Route
    │
    └─ No match (Gap detected)
        ↓
┌───────────────────────────────────────┐
│ 3. Gap Detection                      │
│    (@skill-creator triggered)         │
└───┬───────────────────────────────────┘
    │
    ├─ Recurring pattern (3× in lessons)?
    │   └─> Propose skill creation → User approval → Integrate
    │
    ├─ Novel request (1st time)?
    │   └─> Handle manually → Record in lessons → Done
    │
    └─ User explicit: "create skill for X"
        └─> Design skill → Propose → User approval → Integrate
```

---

## Optimization Feedback Loop

```
                    ┌──────────────┐
              ┌────►│ User Request │◄────┐
              │     └──────┬───────┘     │
              │            ↓             │
              │     ┌──────────────┐    │
              │     │   Routing    │    │
              │     │  (index.md)  │    │
              │     └──────┬───────┘    │
              │            ↓             │
              │     ┌──────────────┐    │
              │     │ Skill Exec   │    │
              │     └──────┬───────┘    │
              │            ↓             │
              │     ┌──────────────┐    │
              │     │   Result     │    │
    Improved  │     └──────┬───────┘    │  Feedback
    Routing   │            ↓             │  (corrections,
              │     ┌──────────────┐    │   clarifications)
              │     │ Record to    │    │
              │     │ lessons.md   │    │
              │     └──────┬───────┘    │
              │            ↓             │
              │     ┌──────────────────┐│
              │     │ Weekly:          ││
              │     │ @routing-        ││
              │     │  optimizer       ││
              │     │ Analyzes patterns││
              │     └──────┬───────────┘│
              │            ↓             │
              │     ┌──────────────────┐│
              │     │ Propose          ││
              │     │ Improvements     ││
              │     └──────┬───────────┘│
              │            ↓             │
              │     ┌──────────────────┐│
              │     │ User Review      ││
              │     │ & Approval       ││
              │     └──────┬───────────┘│
              │            ↓             │
              │     ┌──────────────────┐│
              └─────┤ Update Routing   │┘
                    │ Rules (index.md) │
                    └──────────────────┘
```

---

## File Dependencies

```
User Actions
    ↓
┌─────────────────────────────────────────────────────────────┐
│                     Core Routing                             │
│  .agent/index.md ◄──────────┐                               │
│       │                      │ Updates                      │
│       ↓                      │                               │
│  ┌─────────────────┐  ┌─────────────────────┐              │
│  │ Vault Skills    │  │ Evolution Skills    │              │
│  │ - @link-checker │  │ - @skill-creator    │              │
│  │ - @indexer      │  │ - @routing-optimizer│              │
│  │ - @metadata     │  └──────────┬──────────┘              │
│  │ - @sync         │             │ Reads/Writes            │
│  │ - @moc-builder  │             ↓                          │
│  └─────────────────┘  ┌───────────────────────────────┐    │
│                       │ Memory System                  │    │
│                       │ - lessons.md (recent)          │    │
│                       │ - patterns.md (proven)         │    │
│                       │ - facts.md (hardened)          │    │
│                       │ - working.md (current)         │    │
│                       │ - feedback.md (corrections)    │    │
│                       │ - solutions.md (registry)      │    │
│                       └────────────┬──────────────────┘    │
│                                    ↓                        │
│                       ┌────────────────────────────────┐    │
│                       │ Monitoring                     │    │
│                       │ - metrics.md (performance)     │    │
│                       └────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Design Principles

### 1. Separation of Concerns
- **Execution Layer**: Vault skills (link-checker, indexer, etc.)
- **Evolution Layer**: Meta-skills (skill-creator, routing-optimizer)
- **Memory Layer**: Learning system (lessons → patterns → facts)

### 2. Feedback-Driven Learning
- Every interaction recorded (working.md)
- Patterns emerge (lessons.md)
- System adapts (routing-optimizer)

### 3. User in Control
- System proposes, user decides
- All changes require approval
- Metrics track impact (can rollback if worse)

### 4. Gradual Promotion
- working.md (ephemeral) → lessons.md (recent)
- lessons.md (3×) → patterns.md (proven)
- patterns.md (high confidence) → facts.md (hardened)

### 5. Confidence-Based Execution
- Low confidence: Ask user first
- Medium confidence: Propose solution
- High confidence: Auto-apply (but track success)

---

## Performance Optimization

### Context Efficiency
```
Without self-evolution:
  Load index.md (7K) + all skills (6×7K = 42K) = 49K total

With self-evolution:
  Load index.md (7K) + relevant skill only (7K) = 14K total
  (70% context reduction)
```

### Time Savings
```
Problem without registry:
  Occurrence 1: 15 min investigation → 15 min
  Occurrence 2: 15 min investigation → 30 min total
  Occurrence 3: 15 min investigation → 45 min total

Problem with registry:
  Occurrence 1: 15 min investigation + record → 15 min
  Occurrence 2: 2 min apply solution → 17 min total
  Occurrence 3: 1 min auto-apply → 18 min total
  
Savings: 27 minutes (60% reduction)
```

### Routing Accuracy
```
Before optimization:
  Success rate: 70-80% (2-3 clarifications per 10 requests)

After optimization (target):
  Success rate: >90% (<1 clarification per 10 requests)
  
Time saved: ~2-3 min per avoided clarification
```

---

## Scalability Considerations

### Skill Count
- **Current**: 8 skills
- **Target**: <15 skills (avoid over-specialization)
- **Strategy**: Merge overlapping skills, deprecate unused ones

### Solution Registry
- **Current**: 5 problems documented
- **Growth**: +3-5 problems/month (expected)
- **Maintenance**: Archive obsolete problems quarterly

### Memory Size
- **lessons.md**: <8K tokens (trigger optimization if exceeded)
- **patterns.md**: ~5K tokens (stable after initial period)
- **facts.md**: ~7K tokens (slow growth)

**Total context**: Target <20K for typical task execution

---

## Extension Points

### Future Capabilities

1. **Cross-Skill Patterns**: Detect patterns spanning multiple skills
2. **Automatic Skill Merging**: Combine overlapping capabilities
3. **Predictive Routing**: Predict user intent before clarification
4. **Confidence-Based Auto-Execute**: High confidence → Skip approval
5. **External Integrations**: GitHub issues → Auto-skill creation

---

**Version**: 5.0  
**Created**: 2026-06-05  
**Last Updated**: 2026-06-05
