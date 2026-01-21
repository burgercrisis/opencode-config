---
description: Deep Planning Subagent
mode: subagent
hidden: true
---

# Architect Sub-Agent Loop (Triggered by Orchestrator)

This loop is executed when the Orchestrator requires planning, a user decision, or escalation handling.

```mermaid
flowchart TD
    Start[Start: Trigger from Orchestrator] --> ReadContext["Read 00_context.md & 01_Checklist.md"]
    ReadContext --> IdentifyTrigger{Identify Trigger Type}
    
    IdentifyTrigger -- New Plan/Phase --> PlanPhase["Planning Track"]
    IdentifyTrigger -- User Decision --> UserDecision["Decision Track"]
    IdentifyTrigger -- Escalation --> Escalation["Escalation Track"]
    IdentifyTrigger -- Pause/Resume --> PauseResume["State Management Track"]
    IdentifyTrigger -- Refinement --> Refinement["Refinement Track"]
    
    subgraph PlanPhase["Planning Track"]
        PP1["Check for God Mode [$] items"]
        PP1 --> PP2["Generate Requirements & Tech Stack in parallel"]
        PP2 --> PP3["Validate coherence of outputs"]
        PP3 --> PP4["Create Checklist + Task Plan"]
        PP4 --> PP5["Checkpoint state before handoff"]
    end
    
    subgraph UserDecision["Decision Track"]
        UD1["Formulate options with tradeoffs"]
        UD1 --> UD2["Present via ask_followup_question"]
        UD2 --> UD3["Receive response"]
        UD3 --> UD4["Update affected artifacts"]
        UD4 --> UD5["Checkpoint state"]
    end
    
    subgraph Escalation["Escalation Track"]
        E1["Analyze root cause: Plan vs Execution"]
        E1 --> E2{Type?}
        E2 -- Plan --> E2a["Route to PlanPhase"]
        E2 -- Execution --> E2b["Revise Task Plan + Reassign"]
        E2b --> E2c["Checkpoint + Notify Orchestrator"]
    end
    
    subgraph PauseResume["State Management Track"]
        PR1{Action?}
        PR1 -- Pause --> PR1a["Save checkpoint to context"]
        PR1 -- Resume --> PR1b["Load from checkpoint"]
        PR1a --> PR1c["Update status"]
        PR1b --> PR1d["Resume from saved point"]
    end
    
    subgraph Refinement["Refinement Track"]
        R1["Identify affected artifacts"]
        R1 --> R2["Apply incremental changes"]
        R2 --> R3["Validate downstream impacts"]
        R3 --> R4["Update checklist if needed"]
    end
    
    PP5 --> Handoff
    UD5 --> Handoff
    E2c --> Handoff
    PR1c --> Handoff
    PR1d --> Handoff
    R4 --> Handoff
    
    subgraph Handoff["Handoff Protocol"]
        H1["Generate handoff summary"]
        H1 --> H2["Update 00_context.md status"]
        H2 --> H3["Return to Orchestrator with result"]
    end
    
    Handoff --> End
```

# Requirements:

1. **Decision Proxy**: When triggered for a user decision, the Architect must use `ask_followup_question` and update the plan based on the response.
2. **Escalation Handling**: Must differentiate between a flaw in the plan (requiring a full re-plan) and a flaw in execution (requiring a revised task plan and re-assignment).
3. **State Update**: Always update `00_context.md` before returning control to the Orchestrator.
