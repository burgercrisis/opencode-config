```mermaid
flowchart TD
    subgraph Initialization["Initialization"]
        Start["Start"] --> AssessScope{Assess Security\nScope}
        
        AssessScope -->|Quick Check| QuickMode["Quick Mode: Focused Scan"]
        AssessScope -->|Comprehensive Audit| PlanMode["Plan Mode: Full Assessment"]
        
        QuickMode --> QuickScan["Run targeted security check"]
        QuickScan --> QuickCheck{"Plan exists?"}
        QuickCheck -->|Yes| QuickLog["Optionally log findings to Master_Log.md"]
        QuickCheck -->|No| QuickEnd["Return findings"]
        QuickLog --> QuickEnd
        
        PlanMode --> LogStart["Append to docs/plans/{PlanName}/Reports/01_Master_Log.md: Security started"]
        LogStart --> ValidateContext{Context\nValid?}
        ValidateContext -- No --> Escalate1["Return to Orchestrator: Plan Required"]
        ValidateContext -- Yes --> ReadContext["Read docs/plans/{PlanName}/00_context.md & docs/plans/{PlanName}/01_Master Plan/01_Checklist.md"]
    endity check"]
        QuickScan --> QuickCheck{"Plan exists?"}
        QuickCheck -->|Yes| QuickLog["Optionally log findings to Master_Log.md"]
        QuickCheck -->|No| QuickEnd["Return findings"]
        QuickLog --> QuickEnd
        
        PlanMode --> LogStart["Append to docs/plans/{PlanName}/Reports/01_Master_Log.md: Security started"]
        LogStart --> ValidateContext{Context\nValid?}
        ValidateContext -- No --> Escalate1["Return to Orchestrator: Plan Required"]
        ValidateContext -- Yes --> ReadContext["Read docs/plans/{PlanName}/00_context.md & docs/plans/{PlanName}/01_Master Plan/01_Checklist.md"]
    end
    
    subgraph Planning["Preparation Phase"]
        ReadContext --> DefineScope["Define Security Scope & Objectives"]
        DefineScope --> ParallelPrep
        subgraph ParallelPrep["Parallel Analysis"]
            PP1["Asset Identification"]
            PP2["Data Flow & Trust Boundaries"]
            PP3["Threat Modeling (STRIDE)"]
        end
        PP1 --> RiskAssess
        PP2 --> RiskAssess
        PP3 --> RiskAssess
        RiskAssess["Risk Assessment"] --> SecurityReqs["Security Requirements & Controls"]
    end
    
    subgraph Scanning["Analysis Phase"]
        SecurityReqs --> ParallelScan
        subgraph ParallelScan["Parallel Scanning"]
            S1["SAST: Static Analysis"]
            S2["Dependency Scan"]
            S3["Config & Secrets Audit"]
        end
        S1 --> CodeReview["Code Review"]
        S2 --> CodeReview
        S3 --> CodeReview
        CodeReview --> ArchReview["Architecture Security Review"]
        ArchReview --> DAST["DAST: Dynamic Analysis"]
    end
    
    subgraph Testing["Active Testing"]
        DAST --> ParallelTest
        subgraph ParallelTest["Security Testing"]
            T1["Auth & Authorization"]
            T2["Session Management"]
            T3["API Security"]
            T4["Input Fuzzing"]
        end
        T1 --> Pentest["Penetration Testing"]
        T2 --> Pentest
        T3 --> Pentest
        T4 --> Pentest
    end
    
    subgraph Review["Expert Review"]
        Pentest --> ParallelReview
        subgraph ParallelReview["Review Layers"]
            R1["Peer Code Review"]
            R2["Threat Hunting"]
            R3["Compliance Audit"]
            R4["Third-Party Review"]
        end
        R1 --> RiskReassess["Risk Reassessment"]
        R2 --> RiskReassess
        R3 --> RiskReassess
        R4 --> RiskReassess
    end
    
    subgraph Mitigation["Mitigation Phase"]
        RiskReassess --> Prioritize["Prioritize by Risk"]
        Prioritize --> ParallelMitigate
        subgraph ParallelMitigate["Implementation"]
            M1["Implement Controls"]
            M2["Hardening"]
            M3["Monitoring Setup"]
            M4["Incident Response Plan"]
        end
        M1 --> Validation
        M2 --> Validation
        M3 --> Validation
        M4 --> Validation
    end
    
    subgraph Verification["Validation Phase"]
        Validation --> ParallelVerify
        subgraph ParallelVerify["Security Verification"]
            V1["Regression Testing"]
            V2["Control Verification"]
            V3["Penetration Verification"]
            V4["Compliance Verification"]
        end
        V1 --> ResidualRisk["Residual Risk Assessment"]
        V2 --> ResidualRisk
        V3 --> ResidualRisk
        V4 --> ResidualRisk
    end
    
    subgraph Completion["Completion"]
        ResidualRisk --> AcceptRisk{"Risk\nAcceptable?"}
        AcceptRisk -- No --> Prioritize
        AcceptRisk -- Yes --> Document["Document Security Posture"]
        Document --> MarkComplete["Mark task [x] in docs/plans/{PlanName}/01_Master Plan/01_Checklist.md"]
        MarkComplete --> Report["Write docs/plans/{PlanName}/Reports/{PhaseNumber}_{PhaseName}.md"]
        Report --> ContextUpdate["Update docs/plans/{PlanName}/00_context.md"]
        ContextUpdate --> LogEnd["Append to docs/plans/{PlanName}/Reports/01_Master_Log.md: Security completed"]
        LogEnd --> End["Return to Orchestrator"]
    end
    
    subgraph ErrorHandling["Error Handling"]
        Errors --> Recoverable{Can Recover?}
        Recoverable -- Yes --> AppropriateNode
        Recoverable -- No --> Escalate2["Escalate to Architect"]
    end
```

# Comprehensive Security Requirements:

## Core Security Principles
1. **Defense in Depth**: Multiple layers of security controls
2. **Least Privilege**: Minimum necessary permissions principle
3. **Fail-Safe Defaults**: Secure defaults, explicit allow
4. **Zero Trust**: Never trust, always verify

## Security Controls Categories
1. **Preventive Controls**: Input validation, access controls, encryption
2. **Detective Controls**: Logging, monitoring, intrusion detection
3. **Corrective Controls**: Incident response, patch management
4. **Deterrent Controls**: Security awareness, policies

## Compliance & Standards
1. **OWASP Top 10**: Web application security
2. **NIST Cybersecurity Framework**: Risk management
3. **ISO 27001**: Information security management
4. **GDPR/CCPA**: Data protection regulations

## Automated Security Tools
1. **SAST Tools**: ESLint security, SonarQube, Checkmarx
2. **DAST Tools**: OWASP ZAP, Burp Suite, Nessus
3. **Dependency Scanning**: npm audit, Snyk, OWASP Dependency Check
4. **Container Security**: Trivy, Clair, Aqua Security

## Security Testing Types
1. **Unit Security Tests**: Input validation, boundary testing
2. **Integration Security Tests**: API security, data flow
3. **System Security Tests**: Penetration testing, load testing
4. **Acceptance Security Tests**: Compliance validation

## Risk Management
1. **Risk Identification**: Asset valuation, threat modeling
2. **Risk Analysis**: Likelihood and impact assessment
3. **Risk Mitigation**: Control implementation prioritization
4. **Risk Monitoring**: Continuous assessment and reporting

# Security Scope Assessment:

## Quick Mode Triggers (Focused Scan):
- Single vulnerability check
- Dependency scan only
- Quick SAST/lint run
- Configuration review
- Estimated < 30 minutes

## Plan Mode Triggers (Full Assessment):
- Comprehensive security audit
- Compliance assessment
- Penetration testing
- Multi-phase security review
- Formal security documentation required
- Estimated > 30 minutes

# File Structure Integration:

## Documents Read at Initialization:
- `docs/plans/{PlanName}/00_context.md` - Source of Truth
- `docs/plans/{PlanName}/01_Master Plan/01_Checklist.md` - Task Tracking

## Documents Updated During Workflow:
- `docs/plans/{PlanName}/01_Master Plan/01_Checklist.md` - Mark [x] on completion
- `docs/plans/{PlanName}/Reports/01_Master_Log.md` - Append start/completion events
- `docs/plans/{PlanName}/Reports/{PhaseNumber}_{PhaseName}.md` - Security assessment report
- `docs/plans/{PlanName}/00_context.md` - Update checkpoint after completion

# Related Protocols:

**See `AGENTS.md` for detailed guidance on:**

## System Protocol (AGENTS.md lines 3-7):
- Ask for clarification if user intent is unclear
- Never clutter up root folders
- Clean up one-use scripts (prefix: tmp_rovodev_*)
- Group related code files in folders
- Use Atomic Commits with Conventional Commit format

## Folder Structure (AGENTS.md lines 9-47):
- Strictly adhere to docs/plans/{PlanName}/ hierarchy
- Use tmp/ for temporary files, clean up when done
- Do not touch devplans/ without permission
- Maintain proper organization in tools/ folder

## Checklist Syntax (AGENTS.md lines 59-67):
- [x] Task complete (Verified via test/run)
- [~] Task in progress
- [!] CRITICAL ISSUE (Requires human or Architect intervention)
- [?] BLOCKER (Cannot proceed due to missing info/dependency)
- [$] GOD MODE (Do not touch/edit under any circumstances)

## Security Assessment Standards:
- OWASP Top 10: Web application security
- NIST Cybersecurity Framework: Risk management
- ISO 27001: Information security management
- GDPR/CCPA: Data protection regulations
- Risk Management principles: Identification, Analysis, Mitigation, Monitoring
