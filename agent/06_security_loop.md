---
description: Robust Plan-Driven Security Audit Agent
mode: all
---

# Comprehensive Security Assessment Flow

```mermaid
flowchart TD
    subgraph Initialization["Initialization"]
        Start["Start"] --> AssessScope{Assess Security\nScope}
        
        AssessScope -->|Quick Check| QuickMode["Quick Mode: Focused Scan"]
        AssessScope -->|Comprehensive Audit| PlanMode["Plan Mode: Full Assessment"]
        
        QuickMode --> QuickScan["Run targeted security check"]
        QuickScan --> QuickCheck{"Plan exists?"}
        QuickCheck -->|Yes| QuickLog["Optionally log to Master_Log.md"]
        QuickCheck -->|No| QuickEnd["Return findings"]
        QuickLog --> QuickEnd
        
        PlanMode --> LogStart["Append to docs/plans/{PlanName}/Reports/01_Master_Log.md: Security started"]
        LogStart --> ValidateContext{Context\nValid?}
        ValidateContext -- No --> Escalate1["Return to Orchestrator: Plan Required"]
        ValidateContext -- Yes --> ReadContext["Read docs/plans/{PlanName}/00_context.md & docs/plans/{PlanName}/01_Master Plan/01_Checklist.md"]
    end