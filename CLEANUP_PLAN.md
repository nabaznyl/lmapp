# Workspace Cleanup & Organization Plan

## Archive Strategy

### Phase 1 Documents (Archive to `/archive/`)
These were needed for project execution but are now obsolete:
- PHASE_1_COMPLETION.md
- PHASE_1b_COMPLETION.md
- PHASE_1_OPTIMIZATION_COMPLETE.md
- AUTOMATION_COMPLETE.md
- AUTOMATION_TASKS.md
- IMPLEMENTATION_COMPLETE.md
- OPTION_A_COMPLETE.md
- CHECKPOINT.md
- SAVEPOINT.md
- CONTINUATION_GUIDE.md
- REEVALUATION.md
- GAP_ANALYSIS_REPORT.md
- DISCUSSION_SUMMARY.md
- FOUNDATION_SUMMARY.md
- TASK_6a_CONFIG_CLI.md
- TASK_6b_DOCUMENTATION.md
- TASK_8_RELEASE.md
- README_OLD.md

### Keep (Active Development)
- README.md (current, primary)
- CONTRIBUTING.md (guidelines)
- CHANGELOG.md (release notes)
- RELEASE_NOTES.md (current release info)
- PROJECT_CHARTER.md (project vision)
- QUICKSTART.md (user-facing)
- TODO.md (current work)
- DOCUMENTATION_INDEX.md (reference)
- INTEGRATED_ROADMAP.md (future planning)

### Keep (Launch/Current Phase)
- LAUNCH_STRATEGY.md (high-level plan)
- LAUNCH_EXECUTION_LOG.md (tracking)
- LAUNCH_REDDIT_POSTS_FILTER_SAFE.md (current campaign)
- REDDIT_STRATEGY_FIX.md (active strategy)

## Cache Cleanup
- `__pycache__/` (all)
- `.pytest_cache/` (all)
- `.coverage` (testing cache)
- `*.pyc` files (all)

## File Organization

### Current Root Structure (Keep Clean)
```
lmapp/
├── README.md                    # Main entry point
├── CONTRIBUTING.md             # Dev guidelines
├── TODO.md                      # Current work
├── CHANGELOG.md                 # Release history
├── LAUNCH_EXECUTION_LOG.md      # Launch tracking
├── LAUNCH_REDDIT_POSTS_FILTER_SAFE.md
├── REDDIT_STRATEGY_FIX.md
├── PROJECT_CHARTER.md
├── QUICKSTART.md
├── DOCUMENTATION_INDEX.md
├── INTEGRATED_ROADMAP.md
├── VERSION
├── setup.py
├── requirements.txt
├── pytest.ini
├── .gitignore
├── .github/
├── src/
├── tests/
├── docs/
├── demos/
├── archive/                    # Consolidated old docs
└── scripts/
```

## New Files to Create

### `lmapp/WORKSPACE_CLEANUP.sh` - Automated cleanup script
```bash
#!/bin/bash
# Clean cache and temporary files
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null
find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null
find . -type f -name "*.pyc" -delete 2>/dev/null
find . -type f -name ".coverage*" -delete 2>/dev/null
find . -type f -name "*.egg-info" -delete 2>/dev/null
echo "✓ Cache cleaned"
```

### `.gitignore` additions (ensure coverage files ignored)
```
# Build and cache
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
.pytest_cache/
.coverage
.coverage.*
htmlcov/
```

## Consolidation

### Archive Manifest (for reference)
Create `archive/README.md` listing all archived files with dates and purpose.

### Launch Materials (Consolidated)
- `/lmapp/LAUNCH_STRATEGY.md` - Overview
- `/lmapp/LAUNCH_EXECUTION_LOG.md` - Daily tracking
- `/lmapp/LAUNCH_REDDIT_POSTS_FILTER_SAFE.md` - Post templates
- `/lmapp/REDDIT_STRATEGY_FIX.md` - Strategic alternatives

## Automation Setup

### Pre-commit Hook
Clean cache before commits automatically.

### GitHub Copilot Instructions Update
Point to active files only, not archived.

### .github/workflows (if exists)
Should already ignore cache files.

---

## Execution Steps

1. Create `/archive/` directory
2. Move Phase 1 documents to archive/
3. Clean all cache files
4. Create cleanup scripts
5. Update .gitignore
6. Create archive manifest
7. Update GitHub Copilot Instructions
8. Verify git status is clean
9. Commit cleanup

---

**After cleanup:**
- Cleaner workspace (only active files visible)
- Smaller repository size
- Faster git operations
- Automated cache cleanup
- Clear launch tracking
