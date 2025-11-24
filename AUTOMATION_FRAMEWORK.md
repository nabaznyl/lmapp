# lmapp Automation Framework

## Overview

This document describes the comprehensive automation infrastructure built for `lmapp` to make future changes easy, catch problems early, and enforce professional standards automatically.

## Automation Components

### 1. Git Hooks (Automatic)

#### Pre-Commit Hook (`/.git/hooks/pre-commit`)
**Runs automatically before every commit.**

Calls `scripts/pre-commit-cleanup.sh` which performs 9-step validation:
1. ✓ Clean workspace caches (Python, pytest, mypy, ruff)
2. ✓ Check for merge conflicts
3. ✓ Check staged file consistency
4. ✓ Remove accidentally staged cache files
5. ✓ Validate Python syntax on staged files
6. ✓ Check for common issues (print statements, TODO/FIXME)
7. ✓ Validate project structure (critical files present)
8. ✓ Check for large files (>1MB)
9. ✓ Check version consistency

**Prevents commits with:**
- Broken Python syntax
- Accidentally staged cache files
- Merge conflicts
- Missing critical files
- Large binary files

#### Post-Merge Hook (`/.git/hooks/post-merge`)
**Runs automatically after merges or pulls.**

Actions:
- Detects VERSION file changes and syncs
- Alerts about dependency changes
- Cleans workspace caches
- Validates critical files still present
- Quick Python syntax validation
- Provides helpful next steps

**Prevents:**
- Broken dependencies after pull
- Stale caches affecting tests
- Silent version mismatches

### 2. Development Utilities

#### Makefile (`/Makefile`)
**Standard development targets:**
- `make install` - Install package
- `make dev` - Install with dev dependencies
- `make test` - Run all tests (128 tests)
- `make test-cov` - Tests with coverage report
- `make lint` - Code quality checks (Black, Flake8, mypy)
- `make format` - Auto-format code
- `make clean` - Remove caches and artifacts
- `make all` - Format, lint, test (full check)
- `make quick-start` - Demo the app
- `make check` - Pre-commit quality checks
- `make doctor` - Diagnose environment

**Usage:**
```bash
make help         # Show all targets
make dev          # Setup dev environment
make test         # Run tests
make all          # Full validation
```

#### Dev Utilities Script (`/scripts/dev-utils.sh`)
**Convenient shortcuts for common tasks:**

**Setup & Verification:**
- `bash dev-utils.sh setup` - Complete dev environment setup
- `bash dev-utils.sh ready` - Verify environment is ready

**Testing & Quality:**
- `bash dev-utils.sh quick-test` - Fast test run (no coverage)
- `bash dev-utils.sh check` - Full quality checks
- `bash dev-utils.sh reformat` - Format and lint all code

**Dependencies:**
- `bash dev-utils.sh deps-update` - Update dev dependencies
- `bash dev-utils.sh deps-audit` - Security audit (pip-audit)

**Maintenance:**
- `bash dev-utils.sh cache-clean` - Clean Python caches
- `bash dev-utils.sh git-cleanup` - Optimize git repository
- `bash dev-utils.sh status` - Show project statistics

**Code Analysis:**
- `bash dev-utils.sh find-todos` - Find TODO/FIXME comments
- `bash dev-utils.sh find-prints` - Find print() statements
- `bash dev-utils.sh check-imports` - Analyze imports
- `bash dev-utils.sh check-complexity` - Check code complexity

**Git Utilities:**
- `bash dev-utils.sh git-stash-wip` - Stash work in progress
- `bash dev-utils.sh git-pop-wip` - Restore work in progress

### 3. Pre-Commit Framework

#### Configuration (`/.pre-commit-config.yaml`)
**Automatic code checks on every staged commit:**

Integrated hooks:
- Black - Code formatting
- Flake8 - Linting
- mypy - Type checking
- Bandit - Security checks
- Standard checks (trailing whitespace, merge conflicts, etc.)

**Installation:**
```bash
make hooks    # or: pre-commit install
```

**Skip for specific commit (if necessary):**
```bash
git commit --no-verify
```

### 4. Existing Automation Infrastructure

#### Scripts
- `scripts/sync-version.sh` - Sync VERSION across all files
- `scripts/gen-changelog.sh` - Generate CHANGELOG from commits
- `scripts/run_tests.sh` - Execute test suite
- `scripts/check_env.sh` - Validate environment
- `scripts/cleanup.sh` - Workspace cleanup

#### GitHub Actions Workflows
- `.github/workflows/tests.yml` - Run tests on Python 3.8-3.12
- `.github/workflows/release-check.yml` - Validate releases (includes pip-audit)
- `.github/workflows/publish.yml` - Auto-publish to PyPI
- `.github/workflows/cleanup.yml` - GitHub Actions cleanup

## Developer Workflows

### First-Time Setup
```bash
# Clone and setup
git clone <repo>
cd lmapp

# Complete setup
bash scripts/dev-utils.sh setup

# Verify ready
bash scripts/dev-utils.sh ready
```

### Daily Development
```bash
# Make changes, then validate
make lint          # Check code style
make format        # Auto-format if needed
make test          # Run tests

# Or use shortcut:
make all           # Do all three

# Or use dev-utils:
bash scripts/dev-utils.sh check
```

### Before Committing
```bash
# Pre-commit hook runs automatically
git add .
git commit -m "Your message"
# ← Hook runs here, prevents bad commits

# If issues found, fix them:
make format        # Fix formatting
make test          # Verify tests
git add .
git commit -m "Your message"
```

### After Pulling Changes
```bash
git pull
# ← Post-merge hook runs here
# ← Detects VERSION changes, syncs, validates
```

### Code Maintenance
```bash
# Find issues in code
bash scripts/dev-utils.sh find-todos      # Find unfinished work
bash scripts/dev-utils.sh find-prints     # Find debug prints
bash scripts/dev-utils.sh check-imports   # Analyze dependencies

# Clean up workspace
bash scripts/dev-utils.sh cache-clean     # Remove caches
bash scripts/dev-utils.sh git-cleanup     # Optimize repo
```

### Security Checks
```bash
# Audit dependencies
bash scripts/dev-utils.sh deps-audit

# Or use GitHub Actions (automatic on push)
# See .github/workflows/release-check.yml
```

## Common Issues & Solutions

### Issue: Pre-commit hook rejects commit
**Solution:** Hook found a real issue. Follow the output:
```bash
# Most issues auto-fix:
make format        # Fix formatting
make test          # Verify syntax
git add .
git commit -m "Your message"
```

### Issue: Post-merge validation fails
**Solution:** Pull had breaking changes. Run:
```bash
bash scripts/dev-utils.sh ready    # Diagnose
make dev                            # Update env
make test                           # Verify
```

### Issue: "Large file" warning in pre-commit
**Solution:** Don't commit large binary files. Use:
```bash
git lfs track "*.bin"   # For large binary files
# or
.gitignore              # For temporary large files
```

### Issue: VERSION out of sync after merge
**Solution:** Post-merge hook should sync automatically. If not:
```bash
bash scripts/sync-version.sh    # Manual sync
git add setup.py pyproject.toml  # Stage changes
git commit -m "Sync version"     # Commit
```

## For Contributors

**When you start:**
```bash
bash scripts/dev-utils.sh setup
bash scripts/dev-utils.sh ready
```

**During development:**
- Git hooks protect you automatically
- Run `make lint` before committing
- Run `make test` to verify changes
- Run `bash scripts/dev-utils.sh status` to see project health

**Before submitting PR:**
```bash
make all                              # Full validation
bash scripts/dev-utils.sh check-imports  # Verify no unused imports
bash scripts/dev-utils.sh find-todos     # No incomplete TODOs
```

## Automation Status Checklist

✅ **Pre-commit Validation** - 9-step validation on every commit
✅ **Post-merge Automation** - Auto-sync, cleanup, validation after pulls
✅ **Development Commands** - Makefile with 15+ targets
✅ **Developer Utilities** - 16 convenience functions
✅ **Pre-commit Hooks** - 9 automatic code checks
✅ **GitHub Actions** - 4 workflows for testing, release, publish
✅ **Code Cleanup** - Automatic cache and artifact removal
✅ **Version Management** - Automatic sync across files
✅ **Security Audit** - Integrated pip-audit in workflows

## Statistics

- **Total Automation Scripts**: 8 (sync-version, gen-changelog, run_tests, check_env, cleanup, pre-commit-cleanup, dev-utils, post-merge)
- **Git Hooks**: 2 (pre-commit, post-merge)
- **GitHub Workflows**: 4 (tests, release-check, publish, cleanup)
- **Pre-commit Hooks**: 9 (Black, Flake8, mypy, Bandit, + 5 standard checks)
- **Makefile Targets**: 20+ development targets
- **Dev Utilities**: 16 convenience functions

## Philosophy

This automation framework follows these principles:

1. **Automatic Protection** - Prevent problems before they happen
2. **Developer Friendly** - Make good practices the easiest path
3. **Non-Intrusive** - Hooks don't slow down workflow
4. **Self-Documenting** - Scripts are readable and well-commented
5. **Conventional** - Follow industry best practices
6. **Extensible** - Easy to add more checks as project grows

## Maintenance

The automation framework requires minimal maintenance:

- **Pre-commit configs**: Reviewed annually
- **GitHub workflows**: Updated with Python version releases
- **Scripts**: Updated as project structure changes
- **Makefile**: Extended as new targets are needed

**Last Updated**: 2024
**Current Status**: Production-ready ✅

---

**Questions?** See individual script files for detailed documentation, or run:
```bash
bash scripts/dev-utils.sh help
make help
```
