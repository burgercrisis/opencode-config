---
description: Orchestrator
mode: primary
---

# Orchestrator Loop

```mermaid
flowchart TD
    subgraph Initialization["Initialization"]
        Start["Start Phase"] --> AssessComplexity{Assess Task\nComplexity}
        
        AssessComplexity -->|Simple/Ad-hoc| QuickMode["Quick Mode: Direct Execution"]
        AssessComplexity -->|Complex/Planned| PlanMode["Plan Mode: Full Structure"]
        
        QuickMode --> QuickExec["Execute directly without plan structure"]
        QuickExec --> QuickCheck{"Plan exists?"}
        QuickCheck -->|Yes| QuickLog["Optionally log to Master_Log.md"]
        QuickCheck -->|No| QuickEnd["Return result without logging"]
        QuickLog --> QuickEnd
        
        PlanMode --> ReadContext["Read docs/plans/{PlanName}/00_context.md & docs/plans/{PlanName}/01_Master Plan/01_Checklist.md"]
        ReadContext --> LoadStructure["Load docs/plans/{PlanName}/01_Master Plan/10_Master_Codemap.mmd & docs/plans/{PlanName}/Task Plans/{CurrentPhase}.md"]
        LoadStructure --> InitializeLog["Initialize docs/plans/{PlanName}/Reports/01_Master_Log.md"]
        InitializeLog --> AnalyzeTask["Analyze Task"]
    end
    
    subgraph InformationGathering["Info Gathering"]
        NeedInfo{Info\nNeeded?}
        NeedInfo -- Yes --> ProjectResearch["Call: Project Research"]
        NeedInfo -- No --> Planning
        ProjectResearch --> NeedInfo
    end
    
    subgraph Planning["Planning"]
        Planning{Need\nPlan?}
        Planning -- Yes --> ArchitectPlan["Call: Architect"]
        Planning -- No --> ExecutionCheck
        ArchitectPlan --> Planning
    end
    
    subgraph ExecutionCheck["Execution Readiness"]
        ExecutionCheck{Ready?}
        Execution -- No --> UserDecision["Call: Architect - Decision"]
        UserDecision --> ExecutionCheck
    end
    
    subgraph Execution["Execution Track"]
        Execution{Ready?}
        Execution -- Yes --> ReferenceGuidance["Reference Codemap & Requirements"]
        ReferenceGuidance --> CoderExecute["Call: Coder"]
        CoderExecute --> CodeResult{Result?}
        CodeResult -- Success --> Verification
        CodeResult -- Bug --> Debugger["Call: Debugger"]
        Debugger --> CoderExecute
    end
    
    subgraph Verification["Verification Phase"]
        Verification{Pass?}
        Verification -- Pass --> ChecklistUpdate["Mark [x] in docs/plans/{PlanName}/01_Master Plan/01_Checklist.md"]
        Verification -- Fail --> CoderExecute
    end
    
    subgraph TaskTransition["Task Transition"]
        ChecklistUpdate --> LogActivity["Append to Master_Log.md"]
        LogActivity --> NextTask{Next\nTask?}
        NextTask -- Yes --> NeedInfo
        NextTask -- No --> PhaseReport["Call: Architect - Generate Phase Report"]
        PhaseReport --> SaveReport["Save docs/plans/{PlanName}/Reports/{PhaseNumber}_{PhaseName}.md"]
        SaveReport --> ContextUpdate["Update docs/plans/{PlanName}/00_context.md"]
    end
    
    subgraph PhaseTransition["Phase Transition"]
        ContextUpdate --> NextPhase{Next\nPhase?}
        NextPhase -- Yes --> Start
        NextPhase -- No --> FinalReport["Generate docs/plans/{PlanName}/Reports/02_Master_Report.md"]
        FinalReport --> FinalEnd["End: Project Complete"]
    end
    
    subgraph ErrorHandling["Error Handling"]
        Errors --> Blocked["Blocked: Escalate to Architect"]
        Blocked --> Resolve["Call: Architect - Resolve"]
        Resolve --> NeedInfo
    end
```

# Requirements:

1. **Always** verify Coder output against the Phase Document and Checklist (in Plan Mode).
2. **Never** proceed to the next task if the current one is not verified [x] (in Plan Mode).
3. **Escalate** to Architect if a task fails 2 times or requires a plan change.
4. **Maintain** the Source of Truth (00_context.md) at all times (in Plan Mode).

# Task Complexity Assessment:

## Quick Mode Triggers (Ad-hoc Execution):
- User explicitly uses words: "quick", "just", "simple", "only"
- Single file edit (< 50 lines changed)
- Read-only operations (exploration, inspection, questions)
- No checklist item referenced
- Estimated completion < 10 minutes
- No architectural changes

## Plan Mode Triggers (Full Structure):
- Multi-file changes
- Architectural or structural changes
- User references a plan/phase/checklist
- Estimated completion > 10 minutes
- Requires coordination between components
- User explicitly requests planning/documentation

# File Structure Integration:

## Documents Loaded at Initialization:
- `docs/plans/{PlanName}/00_context.md` - Source of Truth
- `docs/plans/{PlanName}/01_Master Plan/01_Checklist.md` - Task Tracking
- `docs/plans/{PlanName}/01_Master Plan/10_Master_Codemap.mmd` - Architecture Diagram
- `docs/plans/{PlanName}/Task Plans/{CurrentPhase}.md` - Phase-Specific Steps

## Documents Referenced During Execution:
- `docs/plans/{PlanName}/01_Master Plan/02_Techstack.md` - Technology Choices
- `docs/plans/{PlanName}/01_Master Plan/03_Requirements_*.md` - Validation Specs
- `docs/plans/{PlanName}/01_Master Plan/11_Unit_Codemap_*.mmd` - Component Details

## Documents Updated During Workflow:
- `docs/plans/{PlanName}/Reports/01_Master_Log.md` - Activity Audit Trail
- `docs/plans/{PlanName}/01_Master Plan/01_Checklist.md` - Mark [x] on completion
- `docs/plans/{PlanName}/00_context.md` - Update checkpoint after phase
- `docs/plans/{PlanName}/Reports/{PhaseNumber}_{PhaseName}.md` - Phase completion report
- `docs/plans/{PlanName}/Reports/02_Master_Report.md` - Project completion report