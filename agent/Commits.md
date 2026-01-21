---
description: Runs commits
mode: primary
permission:
  edit: ask
  write: ask
  webfetch: ask
  bash:
    "*": ask
    "git diff": allow
    "git add*": allow
    "git commit*": allow
    "git pull": allow
    "git push": allow
    "git log*": allow
    "git status*": allow
    "git show*": allow
    "git fetch*": allow
    "git show*": allow
    "git branch -r": allow
    "grep *": allow
---

### How to commit

1. Observe the full range of active changes
2. gitignore and untrack any build/dist/temp files
3. Observe files that should be committed together due to shared functionality
4. Add them and commit them
5. Return to stop 2 until there are no more files
6. Do another check for active changes - if there are any more, return to step 2 for more commits.
7. After you confirm there is nothing more to commit, git push.


### Git Style Guide

## Use Verbose 'Upgraded' Conventional Commits

The Conventional Commits specification is a lightweight convention on top of commit messages. It provides an easy set of rules for creating an explicit commit history; which makes it easier to write automated tools on top of. This convention dovetails with SemVer, by describing the features, fixes, and breaking changes made in commit messages.


The commit message should be structured as follows:
```
<type>[scope]: <description>

[body]

[optional footer]

[User-facing description]
```

The commit contains the following structural elements, to communicate intent to the consumers of your library:
```
fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in semantic versioning).
feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in semantic versioning).
BREAKING CHANGE: a commit that has the text BREAKING CHANGE: at the beginning of its optional body or footer section introduces a breaking API change (correlating with MAJOR in semantic versioning). A BREAKING CHANGE can be part of commits of any type.
chore:
docs:
style:
refactor:
perf:
test:
improvement:
etc
```

Specification
```
The key words “MUST”, “MUST NOT”, “REQUIRED”, “SHALL”, “SHALL NOT”, “SHOULD”, “SHOULD NOT”, “RECOMMENDED”, “MAY”, and “OPTIONAL” in this document are to be interpreted as described in RFC 2119.

Commits MUST be prefixed with a type, which consists of a noun, feat, fix, etc., followed by an OPTIONAL scope, and a REQUIRED terminal colon and space.
The type feat MUST be used when a commit adds a new feature to your application or library.
The type fix MUST be used when a commit represents a bug fix for your application.
A scope MAY be provided after a type. A scope MUST consist of a noun describing a section of the codebase surrounded by parenthesis, e.g., fix(parser):
A description MUST immediately follow the space after the type/scope prefix. The description is a short summary of the code changes, e.g., fix: array parsing issue when multiple spaces were contained in string.
A longer commit body MAY be provided after the short description, providing additional contextual information about the code changes. The body MUST begin one blank line after the description.
A footer of one or more lines MAY be provided one blank line after the body. The footer MUST contain meta-information about the commit, e.g., related pull-requests, reviewers, breaking changes, with one piece of meta-information per-line.
Breaking changes MUST be indicated at the very beginning of the body section, or at the beginning of a line in the footer section. A breaking change MUST consist of the uppercase text BREAKING CHANGE, followed by a colon and a space.
A description MUST be provided after the BREAKING CHANGE: , describing what has changed about the API, e.g., BREAKING CHANGE: environment variables now take precedence over config files.
Types other than feat and fix MAY be used in your commit messages.
The units of information that make up conventional commits MUST NOT be treated as case sensitive by implementors, with the exception of BREAKING CHANGE which MUST be uppercase.
A ! MAY be appended prior to the : in the type/scope prefix, to further draw attention to breaking changes. BREAKING CHANGE: description MUST also be included in the body or footer, along with the ! in the prefix.
```

User-facing description:
```
Commits should include concise user-facing descriptions that explain how the changes effect UX, UI, and other user-facing experiences wherever applicable.
```