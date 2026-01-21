---
description: Robust Plan-Driven Project Research Agent
---

# Project Research Loop

```mermaid
flowchart TD
    subgraph Initialization["Initialization"]
        Start["Start"] --> ValidateContext{Context\nValid?}
        ValidateContext -- No --> Escalate1["Return to Orchestrator: Plan Required"]
        ValidateContext -- Yes --> ReadContext["Read 00_context.md & checklist"]
    end
    
    subgraph Planning["Research Planning"]
        ReadContext --> DefineGoals["Define Research Goals: Specific questions to answer"]
        DefineGoals --> ScopeCheck{"Scope\nDefined?"}
        ScopeCheck -- No --> DefineGoals
        ScopeCheck -- Yes --> Prioritize["Prioritize: Critical vs Nice-to-know"]
    end
    
    subgraph Execution["Research Execution"]
        Prioritize --> GatherInfo["Gather: Codebase, Docs, Web"]
        GatherInfo --> SourceCheck{"Sources\nFound?"}
        SourceCheck -- No --> Escalate2["Escalate: Cannot find information"]
        SourceCheck -- Yes --> CrossRef["Cross-Reference: 2+ independent sources"]
        CrossRef --> AssessQuality{"Source\nQuality?"}
        AssessQuality -- Low --> GatherInfo
        AssessQuality -- High --> CriticalCheck{"Critical\nClaim?"}
    end
    
    subgraph Verification["Verification Phase"]
        CriticalCheck -- Yes --> DeepVerify["Deep Verify: IEEE citations, author credentials"]
        CriticalCheck -- No --> VerifyRelevance["Verify Relevance: Matches goals"]
        DeepVerify --> VerifyRelevance
        VerifyRelevance --> Analyze["Analyze: Patterns, risks, constraints"]
        Analyze --> Unknowns{"Unknowns\nIdentified?"}
        Unknowns -- Yes --> DocumentUnknowns["Document Unknowns & Risks"]
        Unknowns -- No --> Synthesize
    end
    
    subgraph Documentation["Documentation"]
        Synthesize["Synthesize: Structured summary"]
        Synthesize --> IEEE["Apply IEEE Style Citations"]
        IEEE --> Review{"Review: Meets goals?"}
        Review -- Fail --> GatherInfo
        Review -- Pass --> MarkComplete["Mark task [x]"]
    end
    
    subgraph Finalization["Finalization"]
        MarkComplete --> Report["Write Phase Report"]
        Report --> ContextUpdate["Update 00_context.md"]
        ContextUpdate --> End["Return to Orchestrator"]
    end
    
    subgraph ErrorHandling["Error Handling"]
        Errors --> Recoverable{Can Recover?}
        Recoverable -- Yes --> AppropriateNode
        Recoverable -- No --> Escalate3["Escalate to Architect"]
    end

```

# Requirements:

1. **IEEE Style Citations** required for all external research.
2. **Cross-reference** at least 2 independent sources for critical claims.
3. **Verify** findings against the actual codebase if applicable.
4. **Document** all "Unknowns" or risks identified during research.
