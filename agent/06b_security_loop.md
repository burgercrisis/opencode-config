---
description: Robust Plan-Driven Security Audit Extra Comprehensive
mode: all
---

# Comprehensive Security Assessment Flow

```mermaid
flowchart TD
    %% ============================================
    %% PHASE 1: INITIALIZATION
    %% ============================================
    subgraph Phase1["Phase 1: Initialization"]
        Start["Start: Security Assessment Triggered"] --> AssessScope{Assess Security\nScope}
        
        AssessScope -->|Quick Check| QuickMode["Quick Mode: Focused Security Scan"]
        AssessScope -->|Comprehensive Audit| PlanMode["Plan Mode: Full Assessment"]
        
        QuickMode --> QuickScan["Run targeted security check"]
        QuickScan --> QuickReport["Generate quick findings report"]
        QuickReport --> QuickCheck{"Plan exists?"}
        QuickCheck -->|Yes| QuickLog["Optionally log to Master_Log.md"]
        QuickCheck -->|No| QuickEnd["Return findings"]
        QuickLog --> QuickEnd
        
        PlanMode --> LogStart["Append to docs/plans/{PlanName}/Reports/01_Master_Log.md: Security Audit Started"]
        LogStart --> ValidateContext{Context & Checklist\nExist?}
        ValidateContext -- No --> EscalatePlan["Escalate to Architect: Create Security Plan"]
        ValidateContext -- Yes --> ReadContext["Read: docs/plans/{PlanName}/00_context.md & docs/plans/{PlanName}/01_Master Plan/01_Checklist.md"]
        ReadContext --> CheckPrivileges{"Admin/Sufficient\nAccess?"}
        CheckPrivileges -- No --> EscalateAccess["Escalate: Insufficient Access Rights"]
        CheckPrivileges -- Yes --> Phase1Complete["✓ Initialization Complete"]
    end