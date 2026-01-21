---
description: Robust Plan-Driven Coding Agent
---

# Coder Loop

```mermaid
flowchart TD
    subgraph Initialization["Initialization"]
        Start["Start"] --> LogStart["Log: Coder started"]
        LogStart --> ValidateContext{Context\nValid?}
        ValidateContext -- No --> Escalate1["Return to Orchestrator: Plan Required"]
        ValidateContext -- Yes --> ReadContext["Read 00_context.md & checklist"]
        ReadContext --> ReadPhase["Read Task Plan"]
    end
    
    subgraph TaskAcquisition["Task Acquisition"]
        LockCheck{Locked?}
        LockCheck -- Yes --> Escalate2["Return to Orchestrator: Select Next Item"]
        LockCheck -- No --> MarkInProgress["Mark task [~]"]
    end
    
    subgraph Implementation["Implementation Track"]
        subgraph TDD["Test-Driven Development"]
            TDD1["Write Failing Test"]
            TDD1 --> TDD2{"Test Valid?"}
            TDD2 -- No --> TDD1
            TDD2 -- Yes --> Impl["Implement Minimal Code"]
        end
        
        Impl --> ValidateVsSpec{"Passes Spec?"}
        ValidateVsSpec -- No --> Revise["Revise Code"]
        Revise --> Impl
        
        subgraph Verification["Verification"]
            RunTests["Run Tests"]
            RunTests --> TestsPass{Tests\nPass?}
            TestsPass -- No --> Debug["Debug & Fix"]
            Debug --> RunTests
        end
        
        TestsPass -- Yes --> CodeReview
    end
    
    subgraph CodeReview["Code Review"]
        CodeReview{Code\nReview}
        CodeReview -- Issues --> Implementation
        CodeReview -- Pass --> LockCheck2{"Touched Locked\nItems?"}
    end
    
    subgraph Finalization["Finalization"]
        LockCheck2 -- Yes --> Escalate3["Escalate to Architect"]
        LockCheck2 -- No --> MarkComplete["Mark task [x]"]
        MarkComplete --> FinalVerify["Final Verification"]
        FinalVerify -- Pass --> Report["Write Phase Report"]
        FinalVerify -- Fail --> Implementation
    end
    
    subgraph Handoff["Handoff"]
        Report --> ContextUpdate["Update 00_context.md"]
        ContextUpdate --> LogEnd["Log: Coder completed"]
        LogEnd --> End["Return to Orchestrator"]
    end
    
    subgraph ErrorHandling["Error Handling"]
        Errors --> RetryCheck{"Retry < 3?"}
        RetryCheck -- Yes --> Implementation
        RetryCheck -- No --> Escalate4["Escalate to Architect"]
    end

```
