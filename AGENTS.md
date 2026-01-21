## 📂 SYSTEM PROTOCOL: STATE & MEMORY

- If you aren't sure of the users intention, ask them with your question tool.
- Never clutter up root folders
- One-use scripts need to be cleaned up after
- Group related code files in folders

### Folder Structure

To maintain organization and continuity between sessions, strictly adhere to this folder structure and syntax.

```mermaid
graph TD
    subgraph root["root/"]
        subgraph docs[docs/]
            subgraph plans[plans/]
                subgraph plan_name[Plan Name/]
                    context[00_context.md: Source of Truth]
                    subgraph masterplan["01_Master Plan/"]
                            master_plan --> broad_view[00_Broad_View.md: Project Overview]
                            master_plan --> checklist[01_Checklist.md: Task Tracking]
                            master_plan --> techstack[02_Techstack.md: Technology Choices]
                            master_plan --> requirements[03_Requirements 1.md: Specs]
                            master_plan --> requirements[04_Requirements 2.md: Specs]
                            master_plan --> codemap[10_Master_Codemap.mmd: Architecture Diagram]
                            master_plan --> unit_codemap[11_Unit_Codemap 1.mmd: Component Details]
                    end
                    subgraph task_plans[Task Plans/]
                        phase1[01_Phase_1.md: Implementation Steps]
                        phase2[02_Phase_2.md: Implementation Steps]
                    end
                    subgraph Reports["Reports/"]
                        master_log[01_Master_Log.md: Activity Log]
                        master_report[02_Master Report.md: Progress Summary]
                        phase1_report[03_Phase_1.md: Phase Results]

                    end
                end
            subgraph devplans[devplans/ <= This is for your master, only touch with permission] 
            end
        subgraph temp[tmp/ <= Delete tmp files when done] 
        end
        subgraph tools[tools/ <= Keep organized] 
        end
    end
```

### Checklist Structure Example
```
 - [x] {Phase 1}
 -  ├──[x] {task 1}
 -  │   ├──[x] {subtask 1}
 -  │   ├──[~] {subtask 2}
 -  ├──[$] {Locked Accomplishment, blocker, etc}
 - [!] {Phase 2}
```

### Checklist Syntax
```
 - [ ] Task pending
 - [x] Task complete (Verified via test/run)
 - [~] Task in progress
 - [!] CRITICAL ISSUE (Requires human or Architect intervention)
 - [?] BLOCKER (Cannot proceed due to missing info/dependency)
 - [$] GOD MODE (Do not touch/edit this file under any circumstances)
```

### Coding Principles
```
Core Principles:
- DRY: Single source of truth per concept
- YAGNI: Build only what's required now
- Separation of Concerns: Each module does one thing well
- Composition over Inheritance: Combine simple objects vs. deep inheritance
- Rule of Three: Abstract only after 3+ repetitions
- Law of Demeter: Talk to neighbors, not strangers
- CUPID: Write readable, predictable, idiomatic, domain-aligned code

Testing:
- AAA Pattern: Setup → Action → Verify
- Spec-Driven: Define requirements before implementation
- Environment Parity: Test in production-like conditions
- Interface Focus: Verify component interactions and data flow
- Isolation: Separate fast unit tests from slower integration tests
- Critical Paths First: Prioritize core user workflows



```

### Linters, Formatters, Testing Frameworks, etc, by language
```
Any: Playwright, Puppeteer
- Python: PEP 8 + pytest + unittest
- Java: Google Java Style Guide + JUnit 5
- JavaScript: ESLint + TypeScript ESLint + Jest + Mocha
- PHP: PSR-12 (Extended Style Guide) + PHP CodeSniffer
- HTML/CSS: Google HTML/CSS Style Guide + Stylelint + Prettier
- Rust: The Rust Style Guide + clippy + rustfmt
- C++: C++ Core Guidelines (ISO C++)
- C#: Microsoft C# Coding Conventions + .NET MCP Analyzers + NUnit
- Go: Google Go Style Guide + golint
- Ruby: The Community Ruby Style Guide + RuboCop
- R: tidyverse style guide + lintr + styler
```

### Code Comment Conventions

- Guiding Principle: Comments explain why, not what. If you can't write a clear comment, the code may need refactoring.

When to Comment:
- Explain tricky, complex, or non-obvious logic
- Document assumptions, preconditions, side effects
- Mark incomplete implementations and bug fixes
- Reference original sources or helpful external docs

Best Practices:
- Use trailing comments (//) for single-line context
- Keep it concise—plain language, no jargon
- Avoid redundancy; don't restate obvious code
- Prioritize readable code over relying on comments