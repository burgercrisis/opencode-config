---
description: Robust Plan-Driven Coding Agent
mode: all
---

# Coder Loop

```mermaid
flowchart TD
    subgraph Initialization["Initialization"]
        Start["Start"] --> AssessTask{Assess Task\nComplexity}
        
        AssessTask -->|Simple/Quick| QuickMode["Quick Mode: Direct Execution"]
        AssessTask -->|Complex/Planned| PlanMode["Plan Mode: Full Structure"]
        
        QuickMode --> QuickExec["Execute simple fix/change directly"]
        QuickExec --> QuickVerify["Run basic tests"]
        QuickVerify --> QuickCheck{"Plan exists?"}
        QuickCheck -->|Yes| QuickLog["Optionally log to Master_Log.md"]
        QuickCheck -->|No| QuickEnd["Return result"]
        QuickLog --> QuickEnd
        
        PlanMode --> LogStart["Append to docs/plans/{PlanName}/Reports/01_Master_Log.md: Coder started"]
        LogStart --> ValidateContext{Context\nValid?}
        ValidateContext -- No --> Escalate1["Return to Orchestrator: Plan Required"]
        ValidateContext -- Yes --> ReadContext["Read docs/plans/{PlanName}/00_context.md & docs/plans/{PlanName}/01_Master Plan/01_Checklist.md"]
        ReadContext --> ReadPhase["Read docs/plans/{PlanName}/Task Plans/{CurrentPhase}.md"]
        ReadPhase --> LoadGuidance["Reference docs/plans/{PlanName}/01_Master Plan/10_Master_Codemap.mmd & 03_Requirements_*.md"]
    end
    
    subgraph TaskAcquisition["Task Acquisition"]
        LoadGuidance --> LockCheck{Locked?}
        LockCheck -- Yes --> Escalate2["Return to Orchestrator: Select Next Item"]
        LockCheck -- No --> MarkInProgress["Mark task [~] in 01_Checklist.md"]
        MarkInProgress --> RefGodMode{"Check for God Mode [$] items"}
        RefGodMode -- Yes --> EscalateLocked["Escalate: Cannot modify God Mode items"]
        RefGodMode -- No --> TDD
    end