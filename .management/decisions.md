# lmapp - Project Operating Model & Decision Framework

**Purpose:** Reduce micromanagement by establishing clear decision rules and autonomy boundaries.

**Last Updated:** November 24, 2025

---

## Operating Principle

**Default: Act autonomously → Report results → Gather feedback**  
Instead of: Ask permission → Wait → Execute → Repeat

This creates a continuous improvement loop instead of a request loop.

---

## AUTO-COMMIT (No Approval Needed)

These actions are automatically good for the project:

### Documentation
- ✅ Update public docs (README, CONTRIBUTING, SECURITY, CODE_OF_CONDUCT)
- ✅ Consolidate redundant documentation
- ✅ Remove verbose/unnecessary content from public docs
- ✅ Add clarifying sections to existing public docs
- ✅ Fix typos and grammar
- ✅ Update CHANGELOG.md for changes
- ✅ Add quick-start / setup guides

### Code Quality
- ✅ Bug fixes and error handling improvements
- ✅ Add tests (maintain >85% coverage)
- ✅ Refactoring for clarity/performance
- ✅ Code style improvements (black, flake8)
- ✅ Type safety improvements (mypy)
- ✅ Remove dead code

### Workflow & Automation
- ✅ Streamline processes (fewer steps, faster)
- ✅ Consolidate redundant scripts
- ✅ Improve CI/CD efficiency
- ✅ Update .gitignore for local-only files
- ✅ Organize file structure
- ✅ Remove bottlenecks from workflows

### Configuration
- ✅ Update pyproject.toml (dependencies, metadata)
- ✅ Update GitHub workflows (non-breaking)
- ✅ Add scripts that reduce manual work

---

## KEEP LOCAL-ONLY (.gitignore)

These files stay in workspace, never committed:

### Internal Planning
- ✅ ENTERPRISE_FEATURES.md (roadmap)
- ✅ ROADMAP.md (internal planning)
- ✅ PLANNING_*.md (planning docs)
- ✅ TODO.md (project todos)
- ✅ IDEAS_*.md (ideas/brainstorms)

### Session & Analysis
- ✅ SESSION_*.md (session notes)
- ✅ ANALYSIS_*.md (technical analysis)
- ✅ NOTES_*.md (work notes)
- ✅ MEETING_*.md (meeting summaries)

### Automation & Tools
- ✅ scripts/dev-utils.sh (developer tools)
- ✅ scripts/pre-commit-cleanup.sh (git hooks)
- ✅ AUTOMATION_*.md (automation docs)
- ✅ .management/* (this folder)

### Work-in-Progress
- ✅ Draft documentation
- ✅ Feature experiments
- ✅ Performance benchmarks
- ✅ Debugging notes

---

## ASK FIRST (Requires Approval)

These decisions need input before acting:

### Strategic Direction
- ❓ Adding new major features to roadmap
- ❓ Removing features or capabilities
- ❓ Changing project scope or goals
- ❓ New distribution channels or registries

### Architecture Changes
- ❓ Core architecture refactoring
- ❓ Breaking changes to API/CLI
- ❓ Major dependency changes
- ❓ Database/persistence changes

### Operational Changes
- ❓ Removing public documentation
- ❓ Changing installation methods
- ❓ Breaking changes to setup/workflow
- ❓ Major workflow restructuring

### Priority & Resource
- ❓ "Should I do A or B first?"
- ❓ "How much time should I invest?"
- ❓ "Is this worth implementing?"

### Uncertainty
- ❓ Anything unclear or ambiguous
- ❓ When two approaches seem equally good
- ❓ If it affects users significantly

---

## Decision Matrix Examples

### Scenario 1: "Found redundant documentation"
**Decision:** Auto-commit  
**Why:** Redundancy is always bad  
**Action:** Consolidate and merge → commit → report

### Scenario 2: "README is too verbose"
**Decision:** Auto-commit  
**Why:** User experience improves with clarity  
**Action:** Simplify and streamline → commit → report

### Scenario 3: "Should we add structured logging to v0.2?"
**Decision:** Ask first  
**Why:** Strategic feature planning needs input  
**Action:** Propose with analysis → await decision

### Scenario 4: "Installation instructions are outdated"
**Decision:** Auto-commit  
**Why:** Users need accurate info  
**Action:** Update instructions → commit → report

### Scenario 5: "Found typo in enterprise features doc"
**Decision:** Keep local (don't commit)  
**Why:** Enterprise features are internal planning  
**Action:** Fix locally, no git action needed

### Scenario 6: "Should we remove tests for performance?"
**Decision:** Ask first  
**Why:** Tests are core safety mechanism  
**Action:** Propose trade-off analysis → await decision

---

## Communication Pattern

### BEFORE (Current)
```
Me: "Should I consolidate INSTALL.md into README?"
You: "Yes"
Me: [Does work]
You: [Reviews]
Me: "Should I remove X?"
You: "Yes"
[Loop repeats 10x per session]
```

### AFTER (Proposed)
```
Me: [Consolidates INSTALL.md into README]
Me: [Commits with clear message]
Me: "Done consolidating docs. README now has all installation methods.
     Here's what changed: [summary]. Tell me if this pattern is wrong."
You: [Reviews result, provides feedback on approach]
Me: [Adjusts if pattern is wrong, applies to similar issues]
```

**Result:** 80% fewer back-and-forth messages, faster iteration, clearer intent.

---

## Safety Guardrails

Even with autonomy, these are always protected:

- ❌ Never delete code without a new version of it
- ❌ Never commit breaking changes without clear messaging
- ❌ Never reduce test coverage
- ❌ Never change core APIs without discussion
- ❌ Never make security-relevant changes silently
- ✅ Always test before committing
- ✅ Always write clear commit messages
- ✅ Always maintain backward compatibility
- ✅ Always verify no breaking changes

---

## How to Override

If a decision rule doesn't work for you:

1. **Specify:** "For [category], I'd rather you [ask/don't touch/change rule]"
2. **Example:** "For README updates, ask first before committing"
3. **I'll update:** This file immediately reflects the change
4. **Going forward:** I follow the new rule

---

## Feedback Loop

Every 2-3 weeks (or as needed):
- "These patterns are working well"
- "I'd like to change [category] from auto-commit to ask-first"
- "Can you start doing [new pattern]?"

This creates evolution instead of stagnation.

---

**Status:** APPROVED & ACTIVE  
**Autonomy Level:** Medium → High (as feedback confirms patterns work)  
**Review Date:** When patterns stop working or priorities shift
