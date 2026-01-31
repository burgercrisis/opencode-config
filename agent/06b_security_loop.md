## Risk Management
1. **Risk Identification**: Asset valuation, threat modeling
2. **Risk Analysis**: Likelihood and impact assessment
3. **Risk Mitigation**: Control implementation prioritization
4. **Risk Monitoring**: Continuous assessment and reporting

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

## Security Assessment Standards (8-Phase):
- OWASP Top 10: Web application security
- NIST Cybersecurity Framework: Risk management
- ISO 27001: Information security management
- GDPR/CCPA: Data protection regulations
- STRIDE Threat Modeling framework
- Defense in Depth security principles
- Comprehensive vulnerability assessment lifecycle

# Security Scope Assessment:

**Note**: This comprehensive 8-phase security loop is designed for full security audits. For quick security checks, consider using the standard security loop (06_security_loop.md) in Quick Mode.

## Quick Mode Triggers (Use Standard Security Loop):
- Single vulnerability check
- Dependency scan only
- Quick SAST/lint run
- Configuration review
- Estimated < 30 minutes

## Plan Mode Triggers (Use This Comprehensive Loop):
- Full security audit required
- Compliance certification needed
- Pre-production security assessment
- Security incident investigation
- Formal penetration testing
- Multi-phase comprehensive review
- Estimated > 2 hours

**Implementation Note**: At Phase 1 initialization, agent should assess if full 8-phase assessment is warranted or if a subset of phases is sufficient for the current scope.
=========================================
    subgraph Phase1["Phase 1: Initialization"]
        Start["Start: Security Assessment Triggered"] --> LogStart["Log: Security Audit Started - 01_Master_Log.md"]
        LogStart --> ValidateContext{Context & Checklist\nExist?}
        ValidateContext -- No --> EscalatePlan["Escalate to Architect: Create Security Plan"]
        ValidateContext -- Yes --> ReadContext["Read: 00_context.md & 01_Checklist.md"]
        ReadContext --> CheckPrivileges{"Admin/Sufficient\nAccess?"}
        CheckPrivileges -- No --> EscalateAccess["Escalate: Insufficient Access Rights"]
        CheckPrivileges -- Yes --> Phase1Complete["✓ Initialization Complete"]
    end

    %% ============================================
    %% PHASE 2: PREPARATION & SCOPE
    %% ============================================
    subgraph Phase2["Phase 2: Preparation & Scope Definition"]
        Phase1Complete --> ScopeDefinition["Define Security Scope & Objectives"]
        
        subgraph AssetInventory["Asset Identification & Classification"]
            AssetID1["Data Assets: PII, Credentials, Intellectual Property"]
            AssetID2["Technical Assets: Servers, Containers, APIs, Services"]
            AssetID3["Identity Assets: Service Accounts, API Keys, Certificates"]
            AssetID1 --> AssetInventoryComplete
            AssetID2 --> AssetInventoryComplete
            AssetID3 --> AssetInventoryComplete
            AssetInventoryComplete["✓ Asset Inventory Complete"]
        end
        
        subgraph DataFlow["Data Flow Analysis & Trust Boundaries"]
            DF1["Map Data Movements Between Components"]
            DF2["Identify Trust Boundaries & Zones"]
            DF3["Document Data Classification Policies"]
            DF1 --> DataFlowComplete
            DF2 --> DataFlowComplete
            DF3 --> DataFlowComplete
            DataFlowComplete["✓ Data Flow Analysis Complete"]
        end
        
        subgraph ThreatModel["Threat Modeling: STRIDE Framework"]
            TM1["S - Spoofing: Identity Verification Gaps"]
            TM2["T - Tampering: Data Integrity Risks"]
            TM3["R - Repudiation: Audit Trail Gaps"]
            TM4["I - Information Disclosure: Data Exposure"]
            TM5["D - Denial of Service: Availability Risks"]
            TM6["E - Elevation of Privilege: Authorization Flaws"]
            TM1 --> ThreatModelComplete
            TM2 --> ThreatModelComplete
            TM3 --> ThreatModelComplete
            TM4 --> ThreatModelComplete
            TM5 --> ThreatModelComplete
            TM6 --> ThreatModelComplete
            ThreatModelComplete["✓ Threat Model Complete"]
        end
        
        ScopeDefinition --> AssetInventory
        ScopeDefinition --> DataFlow
        ScopeDefinition --> ThreatModel
        AssetInventoryComplete --> RiskAssess
        DataFlowComplete --> RiskAssess
        ThreatModelComplete --> RiskAssess
        
        subgraph RiskAssessment["Risk Assessment & Business Impact"]
            RA1["Asset Valuation & Criticality Analysis"]
            RA2["Threat Likelihood Assessment"]
            RA3["Business Impact Analysis (BIA)"]
            RA4["Risk Matrix Calculation"]
            RA1 --> RiskAssessComplete
            RA2 --> RiskAssessComplete
            RA3 --> RiskAssessComplete
            RA4 --> RiskAssessComplete
            RiskAssessComplete["✓ Risk Assessment Complete"]
        end
        
        RiskAssess --> AttackSurface
        
        subgraph AttackSurface["Attack Surface Analysis"]
            AS1["Exposed Endpoints & Services"]
            AS2["Network Attack Vectors"]
            AS3["Code Exposure Analysis"]
            AS4["Third-Party Integration Points"]
            AS1 --> AttackSurfaceComplete
            AS2 --> AttackSurfaceComplete
            AS3 --> AttackSurfaceComplete
            AS4 --> AttackSurfaceComplete
            AttackSurfaceComplete["✓ Attack Surface Analysis Complete"]
        end
        
        AttackSurface --> Compliance
        AttackSurfaceComplete --> Compliance
        
        subgraph ComplianceReview["Compliance Requirements Review"]
            CR1["OWASP Top 10 Requirements"]
            CR2["NIST Cybersecurity Framework Alignment"]
            CR3["ISO 27001 Control Mapping"]
            CR4["GDPR/CCPA Data Protection Requirements"]
            CR5["Industry-Specific Standards (PCI-DSS, HIPAA, SOC2)"]
            CR1 --> ComplianceComplete
            CR2 --> ComplianceComplete
            CR3 --> ComplianceComplete
            CR4 --> ComplianceComplete
            CR5 --> ComplianceComplete
            ComplianceComplete["✓ Compliance Review Complete"]
        end
        
        Compliance --> SecurityReqs
        
        subgraph SecurityRequirements["Security Requirements & Controls"]
            SR1["Preventive Controls: Input Validation, Access Controls, Encryption"]
            SR2["Detective Controls: Logging, Monitoring, IDS"]
            SR3["Corrective Controls: Incident Response, Patching"]
            SR4["Deterrent Controls: Policies, Training, Awareness"]
            SR1 --> SecurityReqsComplete
            SR2 --> SecurityReqsComplete
            SR3 --> SecurityReqsComplete
            SR4 --> SecurityReqsComplete
            SecurityReqsComplete["✓ Security Requirements Defined"]
        end
        
        ComplianceReview --> SecurityReqs
        SecurityReqs --> Phase2Complete["✓ Phase 2 Complete"]
    end

    %% ============================================
    %% PHASE 3: STATIC ANALYSIS
    %% ============================================
    subgraph Phase3["Phase 3: Static Analysis & Code Review"]
        Phase2Complete --> ParallelStatic
        
        subgraph ParallelStatic["Parallel Static Analysis Execution"]
            subgraph SAST["Static Application Security Testing (SAST)"]
                SAST1["CodeQL/Semgrep/ESLint Security Rules"]
                SAST2["Injection Vulnerabilities: SQLi, XSS, SSRF, Command Injection"]
                SAST3["Cryptographic Weaknesses: Hardcoded Secrets, Weak Algos"]
                SAST4["Business Logic Flaws: Auth Bypass, Race Conditions"]
                SAST5["Insecure Deserialization Patterns"]
                SAST6["Path Traversal & File Inclusion Risks"]
                SAST1 --> SASTComplete
                SAST2 --> SASTComplete
                SAST3 --> SASTComplete
                SAST4 --> SASTComplete
                SAST5 --> SASTComplete
                SAST6 --> SASTComplete
                SASTComplete["✓ SAST Scan Complete"]
            end
            
            subgraph DependencyScan["Dependency Vulnerability Scanning"]
                DS1["npm audit / Snyk / OWASP Dependency-Check"]
                DS2["Outdated Packages with Known CVEs"]
                DS3["Transitive Dependency Risk Analysis"]
                DS4["License Compliance Verification"]
                DS5["Unmaintained/Abandoned Dependency Identification"]
                DS1 --> DepScanComplete
                DS2 --> DepScanComplete
                DS3 --> DepScanComplete
                DS4 --> DepScanComplete
                DS5 --> DepScanComplete
                DepScanComplete["✓ Dependency Scan Complete"]
            end
            
            subgraph SecretsAudit["Configuration & Secrets Audit"]
                SSA1["Hardcoded Credentials Detection"]
                SSA2["Environment Variable Exposure Analysis"]
                SSA3["Insecure Storage Pattern Identification"]
                SSA4["API Key & Token Leakage in Logs"]
                SSA5["Configuration File Security Review"]
                SSA1 --> SecretsComplete
                SSA2 --> SecretsComplete
                SSA3 --> SecretsComplete
                SSA4 --> SecretsComplete
                SSA5 --> SecretsComplete
                SecretsComplete["✓ Secrets Audit Complete"]
            end
        end
        
        SASTComplete --> CodeReview
        DepScanComplete --> CodeReview
        SecretsComplete --> CodeReview
        
        subgraph CodeReview["Automated Code Review"]
            CRV1["Apply Security Linting Rules"]
            CRV2["Code Quality Security Gates"]
            CRV3["Complexity & Maintainability Analysis"]
            CRV4["Framework-Specific Security Checks"]
            CRV1 --> CodeReviewComplete
            CRV2 --> CodeReviewComplete
            CRV3 --> CodeReviewComplete
            CRV4 --> CodeReviewComplete
            CodeReviewComplete["✓ Code Review Complete"]
        end
        
        CodeReview --> ArchitectureReview
        
        subgraph ArchitectureReview["Architecture Security Review"]
            AR1["Security Architecture Patterns"]
            AR2["Microservices Security Boundaries"]
            AR3["Authentication Architecture Analysis"]
            AR4["Authorization Architecture Patterns"]
            AR5["Cryptography Architecture Review"]
            AR1 --> ArchReviewComplete
            AR2 --> ArchReviewComplete
            AR3 --> ArchReviewComplete
            AR4 --> ArchReviewComplete
            AR5 --> ArchReviewComplete
            ArchReviewComplete["✓ Architecture Review Complete"]
        end
        
        ArchitectureReview --> Phase3Complete["✓ Phase 3 Complete"]
    end

    %% ============================================
    %% PHASE 4: DYNAMIC TESTING
    %% ============================================
    subgraph Phase4["Phase 4: Dynamic Application Security Testing"]
        Phase3Complete --> ParallelDynamic
        
        subgraph ParallelDynamic["Parallel Dynamic Testing"]
            subgraph DAST["Dynamic Application Security Testing (DAST)"]
                DAST1["OWASP ZAP Baseline Scan"]
                DAST2["OWASP ZAP Active Scan"]
                DAST3["Burp Suite Professional Scan"]
                DAST4["Authentication Testing: Brute Force, Session Fixation"]
                DAST5["Authorization Testing: IDOR, Privilege Escalation"]
                DAST6["Input Validation Fuzzing"]
                DAST7["Business Logic Testing"]
                DAST1 --> DASTComplete
                DAST2 --> DASTComplete
                DAST3 --> DASTComplete
                DAST4 --> DASTComplete
                DAST5 --> DASTComplete
                DAST6 --> DASTComplete
                DAST7 --> DASTComplete
                DASTComplete["✓ DAST Scan Complete"]
            end
            
            subgraph APISecurity["API Security Testing"]
                API1["REST API Endpoint Analysis"]
                API2["GraphQL Security Testing"]
                API3["Broken Object-Level Authorization (BOLA)"]
                API4["Mass Assignment Vulnerabilities"]
                API5["Rate Limiting & Throttling Tests"]
                API6["API Versioning & Deprecation Analysis"]
                API1 --> APIComplete
                API2 --> APIComplete
                API3 --> APIComplete
                API4 --> APIComplete
                API5 --> APIComplete
                API6 --> APIComplete
                APIComplete["✓ API Security Testing Complete"]
            end
            
            subgraph Infrastructure["Infrastructure Security Testing"]
                INF1["TLS Configuration Analysis (Cipher Suites, Cert Validity)"]
                INF2["Security Header Analysis (CSP, HSTS, X-Frame-Options)"]
                INF3["Container Security Scanning (Trivy, Clair)"]
                INF4["Cloud Misconfiguration Review (S3, IAM, VPC)"]
                INF5["DNS & Subdomain Enumeration"]
                INF6["Firewall & Network Segmentation Review"]
                INF1 --> InfraComplete
                INF2 --> InfraComplete
                INF3 --> InfraComplete
                INF4 --> InfraComplete
                INF5 --> InfraComplete
                INF6 --> InfraComplete
                InfraComplete["✓ Infrastructure Testing Complete"]
            end
            
            subgraph Fuzzing["Intelligent Fuzzing & Input Validation"]
                FUZZ1["Input Vector Identification"]
                FUZZ2["Mutation-Based Fuzzing"]
                FUZZ3["Generation-Based Fuzzing"]
                FUZZ4["Protocol-Specific Fuzzing"]
                FUZZ5["Boundary Condition Testing"]
                FUZZ1 --> FuzzComplete
                FUZZ2 --> FuzzComplete
                FUZZ3 --> FuzzComplete
                FUZZ4 --> FuzzComplete
                FUZZ5 --> FuzzComplete
                FuzzComplete["✓ Fuzzing Complete"]
            end
        end
        
        DASTComplete --> AuthTest
        APIComplete --> AuthTest
        InfraComplete --> AuthTest
        FuzzComplete --> AuthTest
        
        subgraph AuthTest["Authentication & Authorization Testing"]
            AT1["Credential Stuffing Detection"]
            AT2["Multi-Factor Authentication Bypass"]
            AT3["Session Management Security"]
            AT4["JWT Token Security Analysis"]
            AT5["OAuth 2.0/OpenID Connect Security"]
            AT6["Password Policy Enforcement"]
            AT1 --> AuthComplete
            AT2 --> AuthComplete
            AT3 --> AuthComplete
            AT4 --> AuthComplete
            AT5 --> AuthComplete
            AT6 --> AuthComplete
            AuthComplete["✓ Auth Testing Complete"]
        end
        
        AuthComplete --> Phase4Complete["✓ Phase 4 Complete"]
    end

    %% ============================================
    %% PHASE 5: MANUAL TESTING
    %% ============================================
    subgraph Phase5["Phase 5: Manual Security Testing"]
        Phase4Complete --> ParallelManual
        
        subgraph ParallelManual["Parallel Manual Testing"]
            subgraph Pentest["Penetration Testing Scenarios"]
                PT1["Business Logic Attack Testing"]
                PT2["Payment Flow Manipulation"]
                PT3["Workflow Bypass Scenarios"]
                PT4["Chained Exploit Development"]
                PT5["Social Engineering Vectors"]
                PT6["Physical Security Assessment"]
                PT1 --> PentestComplete
                PT2 --> PentestComplete
                PT3 --> PentestComplete
                PT4 --> PentestComplete
                PT5 --> PentestComplete
                PT6 --> PentestComplete
                PentestComplete["✓ Penetration Testing Complete"]
            end
            
            subgraph RedTeam["Red Team Simulation"]
                RT1["Lateral Movement Simulation"]
                RT2["Privilege Escalation Path Analysis"]
                RT3["Data Exfiltration Simulation"]
                RT4["Persistence Mechanism Detection"]
                RT5["Command & Control (C2) Detection"]
                RT6["Defense Evasion Techniques"]
                RT1 --> RedTeamComplete
                RT2 --> RedTeamComplete
                RT3 --> RedTeamComplete
                RT4 --> RedTeamComplete
                RT5 --> RedTeamComplete
                RT6 --> RedTeamComplete
                RedTeamComplete["✓ Red Team Simulation Complete"]
            end
            
            subgraph SourceCode["Source Code Review"]
                SCR1["Manual Code Inspection for Logic Flaws"]
                SCR2["Authentication Flow Analysis"]
                SCR3["Cryptographic Implementation Review"]
                SCR4["Error Handling & Information Disclosure"]
                SCR5["Memory Safety (if applicable)"]
                SCR1 --> SourceCodeComplete
                SCR2 --> SourceCodeComplete
                SCR3 --> SourceCodeComplete
                SCR4 --> SourceCodeComplete
                SCR5 --> SourceCodeComplete
                SourceCodeComplete["✓ Source Code Review Complete"]
            end
        end
        
        PentestComplete --> PeerReview
        RedTeamComplete --> PeerReview
        SourceCodeComplete --> PeerReview
        
        subgraph PeerReview["Security Peer Code Review"]
            PR1["Independent Security Expert Review"]
            PR2["Architecture Peer Review"]
            PR3["Codebase Security Patterns Review"]
            PR1 --> PeerReviewComplete
            PR2 --> PeerReviewComplete
            PR3 --> PeerReviewComplete
            PeerReviewComplete["✓ Peer Review Complete"]
        end
        
        PeerReview --> ThreatHunt
        
        subgraph ThreatHunt["Threat Hunting & Anomaly Detection"]
            TH1["IOC (Indicator of Compromise) Analysis"]
            TH2["Behavioral Anomaly Detection"]
            TH3["Lateral Movement Indicators"]
            TH4["Data Exfiltration Patterns"]
            TH5["Persistence Mechanism Hunting"]
            TH1 --> ThreatHuntComplete
            TH2 --> ThreatHuntComplete
            TH3 --> ThreatHuntComplete
            TH4 --> ThreatHuntComplete
            TH5 --> ThreatHuntComplete
            ThreatHuntComplete["✓ Threat Hunting Complete"]
        end
        
        ThreatHunt --> ComplianceAudit
        
        subgraph ComplianceAudit["Compliance & Regulatory Audit"]
            CA1["OWASP Top 10 2021 Compliance"]
            CA2["NIST CSF Alignment Verification"]
            CA3["GDPR Article 25, 30, 32, 33 Check"]
            CA4["PCI-DSS Requirements (if applicable)"]
            CA5["SOC 2 Control Testing"]
            CA1 --> ComplianceAuditComplete
            CA2 --> ComplianceAuditComplete
            CA3 --> ComplianceAuditComplete
            CA4 --> ComplianceAuditComplete
            CA5 --> ComplianceAuditComplete
            ComplianceAuditComplete["✓ Compliance Audit Complete"]
        end
        
        ComplianceAudit --> ThirdPartyReview
        
        subgraph ThirdParty["Third-Party Component Review"]
            TP1["Third-Party Library Security"]
            TP2["API Integration Security"]
            TP3["Cloud Service Security"]
            TP4["External Service Dependencies"]
            TP1 --> ThirdPartyComplete
            TP2 --> ThirdPartyComplete
            TP3 --> ThirdPartyComplete
            TP4 --> ThirdPartyComplete
            ThirdPartyComplete["✓ Third-Party Review Complete"]
        end
        
        ThirdParty --> IncidentAnalysis
        
        subgraph IncidentAnalysis["Historical Incident Analysis"]
            IA1["Previous Vulnerability Review"]
            IA2["Incident Response Effectiveness"]
            IA3["Root Cause Analysis of Past Issues"]
            IA4["Lessons Learned Integration"]
            IA1 --> IncidentComplete
            IA2 --> IncidentComplete
            IA3 --> IncidentComplete
            IA4 --> IncidentComplete
            IncidentComplete["✓ Incident Analysis Complete"]
        end
        
        IncidentComplete --> Phase5Complete["✓ Phase 5 Complete"]
    end

    %% ============================================
    %% PHASE 6: MITIGATION
    %% ============================================
    subgraph Phase6["Phase 6: Mitigation & Remediation"]
        Phase5Complete --> Prioritize
        
        subgraph Prioritization["Vulnerability Prioritization by Risk"]
            P1["Critical: RCE, SQLi, Auth Bypass → 24h SLA"]
            P2["High: XSS, IDOR, Sensitive Data → 7-day SLA"]
            P3["Medium: Information Disclosure → 30-day SLA"]
            P4["Low: Best Practice Gaps → 90-day SLA"]
            P5["Risk Score Calculation (CVSS 3.1)"]
            P6["Business Impact Weighting"]
            P1 --> PrioritizeComplete
            P2 --> PrioritizeComplete
            P3 --> PrioritizeComplete
            P4 --> PrioritizeComplete
            P5 --> PrioritizeComplete
            P6 --> PrioritizeComplete
            PrioritizeComplete["✓ Prioritization Complete"]
        end
        
        PrioritizeComplete --> ParallelMitigate
        
        subgraph ParallelMitigate["Parallel Mitigation Implementation"]
            subgraph Controls["Implement Security Controls"]
                IC1["Input Validation Whitelisting"]
                IC2["Output Encoding (Context-Aware)"]
                IC3["Parameterized Queries"]
                IC4["Secure Session Management"]
                IC5["Content Security Policy (CSP)"]
                IC6["CSRF Token Implementation"]
                IC1 --> ControlsComplete
                IC2 --> ControlsComplete
                IC3 --> ControlsComplete
                IC4 --> ControlsComplete
                IC5 --> ControlsComplete
                IC6 --> ControlsComplete
                ControlsComplete["✓ Controls Implemented"]
            end
            
            subgraph Hardening["Application & Infrastructure Hardening"]
                HD1["Remove Unused Dependencies"]
                HD2["Disable Default Accounts"]
                HD3["Enable Comprehensive Audit Logging"]
                HD4["Configure Security Alerts"]
                HD5["Harden Container Configurations"]
                HD6["Network Segmentation Implementation"]
                HD1 --> HardeningComplete
                HD2 --> HardeningComplete
                HD3 --> HardeningComplete
                HD4 --> HardeningComplete
                HD5 --> HardeningComplete
                HD6 --> HardeningComplete
                HardeningComplete["✓ Hardening Complete"]
            end
            
            subgraph Monitoring["Security Monitoring Implementation"]
                MON1["SIEM Integration & Log Aggregation"]
                MON2["Intrusion Detection System (IDS) Rules"]
                MON3["File Integrity Monitoring (FIM)"]
                MON4["Vulnerability Scanning Automation"]
                MON5["Endpoint Detection & Response (EDR)"]
                MON1 --> MonitoringComplete
                MON2 --> MonitoringComplete
                MON3 --> MonitoringComplete
                MON4 --> MonitoringComplete
                MON5 --> MonitoringComplete
                MonitoringComplete["✓ Monitoring Implemented"]
            end
            
            subgraph IncidentResp["Incident Response Planning"]
                IR1["IR Playbook Development"]
                IR2["Escalation Matrix Definition"]
                IR3["Communication Plan Creation"]
                IR4["Forensic Toolkit Preparation"]
                IR5["Recovery Procedure Documentation"]
                IR1 --> IRComplete
                IR2 --> IRComplete
                IR3 --> IRComplete
                IR4 --> IRComplete
                IR5 --> IRComplete
                IRComplete["✓ IR Planning Complete"]
            end
            
            subgraph Training["Security Awareness Training"]
                TR1["Developer Security Training"]
                TR2["Phishing Awareness Program"]
                TR3["Secure Coding Guidelines Distribution"]
                TR4["Incident Reporting Procedures"]
                TR1 --> TrainingComplete
                TR2 --> TrainingComplete
                TR3 --> TrainingComplete
                TR4 --> TrainingComplete
                TrainingComplete["✓ Training Complete"]
            end
        end
        
        ControlsComplete --> Phase6Complete
        HardeningComplete --> Phase6Complete
        MonitoringComplete --> Phase6Complete
        IRComplete --> Phase6Complete
        TrainingComplete --> Phase6Complete
        Phase6Complete["✓ Phase 6 Complete"]
    end

    %% ============================================
    %% PHASE 7: VERIFICATION
    %% ============================================
    subgraph Phase7["Phase 7: Verification & Validation"]
        Phase6Complete --> ParallelVerify
        
        subgraph ParallelVerify["Parallel Verification Testing"]
            subgraph Regression["Security Regression Testing"]
                RG1["Retest Critical Vulnerabilities"]
                RG2["Verify Fix Effectiveness"]
                RG3["Regression Test Suite Execution"]
                RG4["Integration Security Testing"]
                RG1 --> RegressionComplete
                RG2 --> RegressionComplete
                RG3 --> RegressionComplete
                RG4 --> RegressionComplete
                RegressionComplete["✓ Regression Testing Complete"]
            end
            
            subgraph ControlVerify["Security Control Verification"]
                CV1["Verify Input Validation Coverage"]
                CV2["Verify Access Control Enforcement"]
                CV3["Verify Encryption Implementation"]
                CV4["Verify Logging & Monitoring"]
                CV5["Verify Authentication Strength"]
                CV1 --> ControlVerifyComplete
                CV2 --> ControlVerifyComplete
                CV3 --> ControlVerifyComplete
                CV4 --> ControlVerifyComplete
                CV5 --> ControlVerifyComplete
                ControlVerifyComplete["✓ Control Verification Complete"]
            end
            
            subgraph PentestVerify["Penetration Testing Verification"]
                PV1["Retest Critical Findings"]
                PV2["Verify Remediation Effectiveness"]
                PV3["Check for Regression Issues"]
                PV4["Final Security Assertion"]
                PV1 --> PentestVerifyComplete
                PV2 --> PentestVerifyComplete
                PV3 --> PentestVerifyComplete
                PV4 --> PentestVerifyComplete
                PentestVerifyComplete["✓ Penetration Verification Complete"]
            end
            
            subgraph ComplianceVerify["Compliance Verification"]
                COV1["OWASP Top 10 2021 Verification"]
                COV2["NIST CSF Control Verification"]
                COV3["GDPR Requirement Verification"]
                COV4["Generate Compliance Evidence"]
                COV5["Prepare Audit Artifacts"]
                COV1 --> ComplianceVerifyComplete
                COV2 --> ComplianceVerifyComplete
                COV3 --> ComplianceVerifyComplete
                COV4 --> ComplianceVerifyComplete
                COV5 --> ComplianceVerifyComplete
                ComplianceVerifyComplete["✓ Compliance Verification Complete"]
            end
        end
        
        RegressionComplete --> RiskReassess
        ControlVerifyComplete --> RiskReassess
        PentestVerifyComplete --> RiskReassess
        ComplianceVerifyComplete --> RiskReassess
        
        subgraph RiskReassess["Residual Risk Assessment"]
            RR1["Calculate Residual Risk Scores"]
            RR2["Identify Remaining Vulnerabilities"]
            RR3["Document Compensating Controls"]
            RR4["Prepare Risk Acceptance Criteria"]
            RR1 --> RiskReassessComplete
            RR2 --> RiskReassessComplete
            RR3 --> RiskReassessComplete
            RR4 --> RiskReassessComplete
            RiskReassessComplete["✓ Risk Reassessment Complete"]
        end
        
        RiskReassessComplete --> AcceptRisk
        
        subgraph RiskAcceptance["Risk Acceptance Decision"]
            RAD1["Present Residual Risk Report"]
            RAD2["Business Stakeholder Review"]
            RAD3["Executive Sign-Off (if required)"]
            RAD4["Document Acceptance Terms"]
        end
        
        RiskAcceptance --> DecisionCheck
        
        DecisionCheck{All Risks\nAcceptable?}
        DecisionCheck -- No --> ReMitigate["Return to Phase 6: Re-mediate"]
        DecisionCheck -- Yes --> ValidationPass
        
        ValidationPass["✓ Validation Passed: All Risks Accepted"]
    end

    %% ============================================
    %% PHASE 8: DOCUMENTATION & COMPLETION
    %% ============================================
    subgraph Phase8["Phase 8: Documentation & Completion"]
        ValidationPass --> FinalDocument
        
        subgraph FinalDocumentation["Final Security Documentation"]
            FD1["Executive Summary: Overall Security Posture Score"]
            FD2["Critical Findings Summary with Business Risk"]
            FD3["Detailed Technical Report (Finding, Proof, Impact, Remediation)"]
            FD4["Remediation Steps with Code Examples"]
            FD5["References: CVE, CWE, OWASP Links"]
            FD6["Evidence: Screenshots, Logs, Test Results"]
            FD7["Compliance Evidence & Control Mappings"]
            FD8["Recommendations & Investment Priorities"]
            FD1 --> DocumentationComplete
            FD2 --> DocumentationComplete
            FD3 --> DocumentationComplete
            FD4 --> DocumentationComplete
            FD5 --> DocumentationComplete
            FD6 --> DocumentationComplete
            FD7 --> DocumentationComplete
            FD8 --> DocumentationComplete
            DocumentationComplete["✓ Documentation Complete"]
        end
        
        DocumentationComplete --> ChecklistUpdate
        
        subgraph ChecklistUpdate["Checklist & Status Updates"]
            CU1["Update Checklist: Mark Task [x]"]
            CU2["Write to Reports/0X_Phase_X.md"]
            CU3["Update 00_context.md Status"]
            CU4["Append to 01_Master_Log.md: Security Completed"]
            CU5["Archive Test Evidence & Reports"]
        end
        
        ChecklistUpdate --> End
    end

    %% ============================================
    %% ERROR HANDLING
    %% ============================================
    subgraph ErrorHandling["Error Handling & Escalation"]
        EH1{"Error\nDetected?"}
        EH1 -- Yes --> ErrorType{Error\nType?}
        ErrorType -- Recoverable --> Recover["Apply Recovery Procedure"]
        ErrorType -- Non-Recoverable --> EscalateArchitect["Escalate to Architect"]
        ErrorType -- Timeout --> EscalateArchitect
        Recover --> AppropriatePhase["Return to Appropriate Phase"]
        EscalateArchitect --> ArchitectResolution["Wait for Architect Resolution"]
        ArchitectResolution --> AppropriatePhase
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
