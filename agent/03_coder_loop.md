        EscalateLocked["Escalate: Cannot modify God Mode items (AGENTS.md rule 66)"]    MarkInProgress --> RefGodMode{"Check for God Mode [$] items"}
        RefGodMode -- Yes --> EscalateLocked["Escalate: Cannot modify God Mode items"]
        RefGodMode -- No --> TDD
    end
    
    subgraph Implementation["Implementation Track"]
        TDD   Start["Start"] --> AssessTask{Assess Task\nComplexity}
        
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
    end
    
    subgraph Implementation["Implementation Track"]
        MarkInProgress --> TDD
        subgraph TDD["Test-Driven Development"]
            TDD1["Write Failing Test"]
            TDD1 --> TDD2{"Test Valid?"}
            TDD2 -- No --> TDD1
            TDD2 -- Yes --> Impl["Implement Minimal Code"]
        end
        
        Impl --> ValidateVsSpec{"Passes Spec?"}
        ValidateVsSpec -- No --> Revise["Revise Code"]
        Revise --> Impl
        
        ValidateVsSpec -- Yes --> Verification
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
        LockCheck2 -- No --> MarkComplete["Mark task [x] in docs/plans/{PlanName}/01_Master Plan/01_Checklist.md"]
        MarkComplete --> FinalVerify["Final Verification"]
        FinalVerify -- Pass --> Report["Write docs/plans/{PlanName}/Reports/{PhaseNumber}_{PhaseName}.md"]
        FinalVerify -- Fail --> Implementation
    end
    
    subgraph Handoff["Handoff"]
        Report --> ContextUpdate["Update docs/plans/{PlanName}/00_context.md"]
        ContextUpdate --> LogEnd["Append to docs/plans/{PlanName}/Reports/01_Master_Log.md: Coder completed"]
        LogEnd --> End["Return to Orchestrator"]
    end
    
    subgraph ErrorHandling["Error Handling"]
        Errors --> RetryCheck{"Retry < 3?"}
        RetryCheck -- Yes --> Implementation
        RetryCheck -- No --> Escalate4["Escalate to Architect"]
    end

```

# Requirements:

1. **Always** verify Coder output against the Phase Document and Checklist (Plan Mode).
2. **Never** proceed to the next task if the current one is not verified [x] (Plan Mode).
3. **Escalate** to Architect if a task fails 3 times or requires a plan change.
4. **Reference** the Codemap for architectural alignment and Requirements for validation criteria (Plan Mode).

# Task Complexity Assessment:

## Quick Mode Triggers (Ad-hoc Execution):
- Single file edit (< 50 lines)
- Typo fixes, comment updates, simple refactors
- Log statement additions
- Simple bug fixes with obvious solutions
- No architectural impact
- User explicitly uses "quick", "just", "simple"
- Estimated < 10 minutes

## Plan Mode Triggers (Full Structure):
- Multi-file changes
- New feature implementation
- Refactoring with architectural impact
- Changes requiring test updates
- Checklist item referenced
- Complex bug fixes
- Estimated > 10 minutes

# File Structure Integration:

## Documents Read at Initialization:
- `docs/plans/{PlanName}/00_context.md` - Source of Truth
- `docs/plans/{PlanName}/01_Master Plan/01_Checklist.md` - Task Tracking
- `docs/plans/{PlanName}/Task Plans/{CurrentPhase}.md` - Phase-Specific Steps
- `docs/plans/{PlanName}/01_Master Plan/10_Master_Codemap.mmd` - Architecture Diagram
- `docs/plans/{PlanName}/01_Master Plan/03_Requirements_*.md` - Validation Specs

## Documents Updated During Workflow:
- `docs/plans/{PlanName}/01_Master Plan/01_Checklist.md` - Mark [~] in progress, [x] on completion
- `docs/plans/{PlanName}/Reports/01_Master_Log.md` - Append start/completion events
- `docs/plans/{PlanName}/Reports/{PhaseNumber}_{PhaseName}.md` - Phase completion report
- `docs/plans/{PlanName}/00_context.md` - Update checkpoint after completion

# Related Protocols:

**See `AGENTS.md` for detailed guidance on:**

## System Protocol (AGENTS.md lines 3-7):
- **Clarification**: If user intent is unclear, use ask_followup_question before proceeding
- **File Organization**: Never clutter root folders; use `tmp/` for temporary files
- **Cleanup**: Delete temporary files when done (prefix: `tmp_rovodev_*`)
- **Folder Grouping**: Group related code files in appropriate folders
- **Commit Standards**: Atomic commits with verbose conventional commit format

## Folder Structure (AGENTS.md lines 9-47):
- **Temporary Files**: Use `tmp/` directory for temporary/test files
- **Cleanup**: Remove tmp files before marking task complete
- **Restricted**: `devplans/` - only touch with explicit permission
- **Organization**: Group related code files in appropriate folders

## Checklist Syntax (AGENTS.md lines 59-67):
Update checklist with proper markers:
- `[~]` Task in progress (mark when starting implementation)
- `[x]` Task complete (mark after verification/tests pass)
- `[!]` CRITICAL ISSUE (mark and escalate to Architect immediately)
- `[?]` BLOCKER (mark and escalate - missing info/dependency)
- `[$]` GOD MODE (never modify - escalate if changes needed)

## Coding Principles (AGENTS.md lines 69-90):
Apply to all code:
- **DRY**: Single source of truth per concept
- **YAGNI**: Build only what's required now
- **Separation of Concerns**: Each module does one thing well
- **CUPID**: Write readable, predictable, idiomatic, domain-aligned code
- **Testing**: AAA Pattern (Setup → Action → Verify), Spec-Driven, Critical Paths First

## Linters & Formatters (AGENTS.md lines 92-106):
Run appropriate tools for language:
- **JavaScript**: ESLint + TypeScript ESLint + Prettier
- **Python**: PEP 8 + pytest
- **Other languages**: See AGENTS.md for full list

## Code Comment Conventions (AGENTS.md lines 108-122):
- Comments explain **WHY**, not what
- Document assumptions, preconditions, side effects
- Keep concise - plain language, no jargon
- If comment is unclear, refactor code instead
