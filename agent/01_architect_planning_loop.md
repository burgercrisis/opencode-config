---
description: Deep Planning
mode: all
---

# Architect Planning Loop with User

```mermaid
flowchart TD
    Start[Start] --> CheckContext{Context Exists?}
    CheckContext -->|No| Init["Initialize Context: 00_context.md"]
    CheckContext -->|Yes| ReadContext["Read 00_context.md"]
    Init --> ReadContext
    
    ReadContext --> CheckStatus{Plan Status?}
    CheckStatus -->|In Progress| Resume["Resume from saved checkpoint"]
    CheckStatus -->|Complete| ConfirmRestart["Confirm restart with user"]
    
    ConfirmRestart --> A1
    
    subgraph Discovery["Parallel Discovery Track"]
        A1["Present scope & tech stack options simultaneously"]
        A1 --> U1["User provides direction on both"]
        U1 --> A1a["Architect analyzes scope-tech interactions"]
    end
    
    A1a --> A2{"Clarification needed?"}
    A2 -->|Yes| Q2["Ask focused questions"]
    Q2 --> U2["User responds"]
    U2 --> A2
    A2 -->|No| A3["Architect presents refined proposal"]
    
    A3 --> U3["User reviews proposal"]
    U3 --> A4{Ready to proceed?}
    A4 -->|No| U4["User indicates specific concerns"]
    U4 --> A2
    A4 -->|Yes| A5["Create unified plan document"]
    
    A5 --> Validate{"Requirements valid?"}
    Validate -->|Conflicts| A2
    Validate -->|Gaps| Q2
    Validate -->|Valid| A6["Generate artifacts: 10_Codemap.mmd + checklist"]
    
    A6 --> A7["Pre-handoff summary for user signoff"]
    A7 --> U5{User approves?}
    U5 -->|No| U6["User requests changes"]
    U6 --> A2
    U5 -->|Yes| A8["Update 00_context.md with checkpoint"]
    
    A8 --> Handoff["Explicit handoff to Orchestrator"]
    Handoff --> End

```

# Requirements:

1. **Always** read the context before starting a new planning session.
2. **Never** plan changes that affect checklist items marked `[$]` (God Mode).
3. **Ensure** all requirements are documented before creating the checklist.
4. **Update** the Source of Truth (00_context.md) before handoff.
