---
description: Deep Planning
mode: all
---

# Architect Planning Loop with User

## Related Protocols:

**See `AGENTS.md` for detailed guidance on:**

## System Protocol (AGENTS.md lines 3-7):
- **Clarification**: If user intent is unclear, use ask_followup_question before proceeding
- **File Organization**: Never clutter root folders; use `tmp/` for temporary files
- **Folder Grouping**: Group related code files in appropriate folders
- **Commit Standards**: Atomic commits with verbose conventional commit format

## Folder Structure (AGENTS.md lines 9-47):
- **Plan Structure**: `docs/plans/{PlanName}/` - this is the structure you create during planning
- **Master Plan**: Must contain Broad_View, Checklist, Techstack, Requirements, Codemaps
- **Task Plans**: Create phase-specific implementation steps
- **Reports**: Initialize Master_Log during planning; create Phase Reports
- **Restricted**: `devplans/` - only touch with explicit permission
- **Organization**: Group related code files, maintain tools/ folder

## Checklist Syntax (AGENTS.md lines 59-67):
When creating checklist, use proper syntax:
- `[ ]` Task pending
- `[x]` Task complete (Verified via test/run)
- `[~]` Task in progress
- `[!]` CRITICAL ISSUE (Requires human or Architect intervention)
- `[?]` BLOCKER (Cannot proceed due to missing info/dependency)
- `[$]` GOD MODE (Do not touch/edit this file under any circumstances)

## Scope Assessment Criteria:

## Quick Response Mode Triggers:
- User asks clarifying questions about existing plan
- Minor refinement requests (wording, priority adjustments)
- Conceptual questions not requiring plan changes
- Decision validation or confirmation
- Estimated response < 5 minutes

## Full Planning Mode Triggers:
- New project or phase planning
- Major scope changes
- Architecture design decisions
- Creating initial plan structure
- User explicitly requests planning/documentation
- Multi-phase coordination needed

## Planning Standards:

### Quick Response Mode:
- Answer question or make minor adjustment directly
- Optionally note in Master_Log.md if plan exists
- Return answer directly without full documentation

### Full Planning Mode:
- Always read context before starting new planning session
- Never plan changes that affect checklist items marked `[$]` (God Mode)
- Ensure all requirements documented before creating checklist
- Update Source of Truth (00_context.md) before handoff

```mermaid
flowchart TD
    subgraph Initialization["Scope Assessment"]
        Start[Start] --> AssessScope{Assess Request\nScope}
        
        AssessScope -->|Quick Decision/Refinement| QuickResponse["Quick Response Mode"]
        AssessScope -->|Full Planning Needed| CheckContext{Context Exists?}
        
        QuickResponse --> QR1["Answer question or make minor adjustment"]
        QR1 --> QR2{"Existing plan?"}
        QR2 -->|Yes| QR3["Optionally note in Master_Log.md"]
        QR2 -->|No| QR4["Return answer directly"]
        QR3 --> QREnd["End"]
        QR4 --> QREnd
        
        CheckContext -->|No| Init["Initialize Context: docs/plans/{PlanName}/00_context.md"]
        CheckContext -->|Yes| ReadContext["Read docs/plans/{PlanName}/00_context.md"]
        Init --> ReadContext
        ReadContext --> CheckStatus{Plan Status?}
        
        CheckStatus -->|In Progress| Resume["Resume from saved checkpoint"]
        CheckStatus -->|Complete| ConfirmRestart["Confirm restart with user"]
        
        ConfirmRestart --> A1
        Resume --> A1
        
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
    A4 -->|Yes| A5["Create unified plan document: docs/plans/{PlanName}/01_Master Plan/00_Broad_View.md"]
    
    A5 --> A5a["Document Requirements: docs/plans/{PlanName}/01_Master Plan/03_Requirements_*.md"]
    A5a --> A5b["Document Tech Stack: docs/plans/{PlanName}/01_Master Plan/02_Techstack.md"]
    A5b --> A6["Validate Requirements & Tech Stack coherence"]
    
    A6 -->|Conflicts| A2
    A6 -->|Gaps| Q2
    A6 -->|Valid| A7["Generate artifacts: docs/plans/{PlanName}/01_Master Plan/10_Master_Codemap.mmd & 01_Checklist.md"]
    
    A7 --> A7a["Create Task Plans: docs/plans/{PlanName}/Task Plans/{Phase}.md"]
    A7a --> A8["Pre-handoff summary for user signoff"]
    A8 --> U5{User approves?}
    U5 -->|No| U6["User requests changes"]
    U6 --> A2
    U5 -->|Yes| A9["Update docs/plans/{PlanName}/00_context.md with checkpoint"]
    
    A9 --> A9a["Initialize docs/plans/{PlanName}/Reports/01_Master_Log.md"]
    A9a --> Handoff["Explicit handoff to Orchestrator"]
    Handoff --> End
```

# File Structure Created During Planning:

## Documents Created:
- `docs/plans/{PlanName}/00_context.md` - Source of Truth
- `docs/plans/{PlanName}/01_Master Plan/00_Broad_View.md` - Project Overview
- `docs/plans/{PlanName}/01_Master Plan/01_Checklist.md` - Task Tracking with status markers
- `docs/plans/{PlanName}/01_Master Plan/02_Techstack.md` - Technology Choices
- `docs/plans/{PlanName}/01_Master Plan/03_Requirements_*.md` - Specifications (numbered as needed)
- `docs/plans/{PlanName}/01_Master Plan/10_Master_Codemap.mmd` - Architecture Diagram
- `docs/plans/{PlanName}/01_Master Plan/11_Unit_Codemap_*.mmd` - Component Details (as needed)
- `docs/plans/{PlanName}/Task Plans/{PhaseNumber}_{PhaseName}.md` - Implementation Steps per phase
- `docs/plans/{PlanName}/Reports/01_Master_Log.md` - Activity Audit Trail (initialized during planning)

## Documents Read/Referenced During Planning:
- `docs/plans/{PlanName}/00_context.md` - Read at start for existing plans
- User input and direction throughout process

## Documents Updated During Planning:
- `docs/plans/{PlanName}/00_context.md` - Updated with checkpoint at completion
- `docs/plans/{PlanName}/01_Master Plan/01_Checklist.md` - Created/Updated with task items
- `docs/plans/{PlanName}/01_Master Plan/01_Master Plan/` folder - Created/Updated with planning artifacts
- `docs/plans/{PlanName}/Task Plans/` folder - Created with phase-specific implementation plans
- `docs/plans/{PlanName}/Reports/01_Master_Log.md` - Updated with planning notes and handoffs