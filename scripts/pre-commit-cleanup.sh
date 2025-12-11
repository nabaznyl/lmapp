#!/bin/bash
# scripts/pre-commit-cleanup.sh
# Advanced pre-commit cleanup and validation
# Runs automatically via git hook before commits
# Ensures clean state, no conflicts, no cache leaks

set -e

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
ISSUES_FOUND=0
FIXES_APPLIED=0

echo -e "${BLUE}🧹 Pre-Commit Cleanup & Validation${NC}"
echo ""

# 1. Clean workspace caches (non-destructive)
echo -e "${YELLOW}→ Cleaning workspace caches...${NC}"
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
find . -type d -name .mypy_cache -exec rm -rf {} + 2>/dev/null || true
find . -type d -name .ruff_cache -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true
find . -type f -name "*.pyo" -delete 2>/dev/null || true
find . -type f -name ".coverage*" -delete 2>/dev/null || true
find . -type d -name htmlcov -exec rm -rf {} + 2>/dev/null || true
echo -e "${GREEN}✓ Caches cleaned${NC}"
FIXES_APPLIED=$((FIXES_APPLIED+1))

# 2. Check for merge conflicts
echo -e "${YELLOW}→ Checking for merge conflicts...${NC}"
CONFLICTS=$(git diff --name-only --diff-filter=U 2>/dev/null | wc -l)
if [ "$CONFLICTS" -gt 0 ]; then
    echo -e "${RED}❌ Found $CONFLICTS files with merge conflicts${NC}"
    git diff --name-only --diff-filter=U
    ISSUES_FOUND=$((ISSUES_FOUND+1))
else
    echo -e "${GREEN}✓ No merge conflicts${NC}"
fi

# 3. Check for uncommitted changes in staged files
echo -e "${YELLOW}→ Checking staged file consistency...${NC}"
UNSTAGED=$(git diff --name-only 2>/dev/null | wc -l)
if [ "$UNSTAGED" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Warning: $UNSTAGED files have unstaged changes${NC}"
    echo "   Run 'git add .' to stage all changes"
    ISSUES_FOUND=$((ISSUES_FOUND+1))
else
    echo -e "${GREEN}✓ All changes staged consistently${NC}"
fi

# 4. Remove accidentally staged cache files
echo -e "${YELLOW}→ Removing staged cache artifacts...${NC}"
CACHE_FILES=$(git diff --cached --name-only | grep -E "(__pycache__|\.pyc|\.pyo|\.mypy_cache|\.pytest_cache|\.coverage)" | wc -l)
if [ "$CACHE_FILES" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Removing $CACHE_FILES cache files from staging${NC}"
    git reset HEAD -- '*__pycache__*' 2>/dev/null || true
    git reset HEAD -- '*.pyc' 2>/dev/null || true
    git reset HEAD -- '.coverage*' 2>/dev/null || true
    FIXES_APPLIED=$((FIXES_APPLIED+1))
else
    echo -e "${GREEN}✓ No cache artifacts in staging${NC}"
fi

# 5. Validate Python syntax on staged files
echo -e "${YELLOW}→ Validating Python syntax...${NC}"
PYTHON_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep '\.py$' | wc -l)
if [ "$PYTHON_FILES" -gt 0 ]; then
    SYNTAX_ERRORS=0
    while IFS= read -r file; do
        if python -m py_compile "$file" 2>/dev/null; then
            :
        else
            echo -e "${RED}  ✗ Syntax error in: $file${NC}"
            SYNTAX_ERRORS=$((SYNTAX_ERRORS+1))
        fi
    done < <(git diff --cached --name-only --diff-filter=ACM | grep '\.py$')
    
    if [ "$SYNTAX_ERRORS" -gt 0 ]; then
        echo -e "${RED}❌ Found $SYNTAX_ERRORS Python syntax errors${NC}"
        ISSUES_FOUND=$((ISSUES_FOUND+1))
    else
        echo -e "${GREEN}✓ Python syntax valid ($PYTHON_FILES files)${NC}"
    fi
else
    echo -e "${YELLOW}ℹ️  No Python files staged${NC}"
fi

# 6. Check for common issues in staged files
echo -e "${YELLOW}→ Checking for common issues...${NC}"
ISSUES=0

# Check for debug statements
if git diff --cached | grep -q "print(" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Warning: Found print() statements in staged code${NC}"
    ISSUES=$((ISSUES+1))
fi

# Check for TODO/FIXME without issue reference
if git diff --cached | grep -qE "TODO|FIXME" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Warning: Found TODO/FIXME comments without issue reference${NC}"
    ISSUES=$((ISSUES+1))
fi

if [ "$ISSUES" -eq 0 ]; then
    echo -e "${GREEN}✓ No common issues detected${NC}"
fi

# 7. Validate file structure integrity
echo -e "${YELLOW}→ Validating project structure...${NC}"
CRITICAL_FILES=("setup.py" "pyproject.toml" "VERSION" ".gitignore")
MISSING=0
for file in "${CRITICAL_FILES[@]}"; do
    if [ ! -f "$PROJECT_ROOT/$file" ]; then
        echo -e "${RED}❌ Missing critical file: $file${NC}"
        MISSING=$((MISSING+1))
        ISSUES_FOUND=$((ISSUES_FOUND+1))
    fi
done
if [ "$MISSING" -eq 0 ]; then
    echo -e "${GREEN}✓ All critical files present${NC}"
fi

# 8. Check for large files
echo -e "${YELLOW}→ Checking for large files...${NC}"
LARGE_FILES=$(git diff --cached --name-only | while read file; do
    if [ -f "$file" ]; then
        SIZE=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null || echo 0)
        # Flag files larger than 1MB (1048576 bytes)
        if [ "$SIZE" -gt 1048576 ]; then
            echo "$file ($((SIZE/1024))K)"
        fi
    fi
done)
if [ -z "$LARGE_FILES" ]; then
    echo -e "${GREEN}✓ No large files detected${NC}"
else
    echo -e "${YELLOW}⚠️  Large files detected:${NC}"
    echo "$LARGE_FILES" | sed 's/^/   /'
    ISSUES_FOUND=$((ISSUES_FOUND+1))
fi

# 9. Check version file consistency
echo -e "${YELLOW}→ Checking version consistency...${NC}"
if git diff --cached --name-only | grep -qE "^VERSION$"; then
    VERSION=$(cat "$PROJECT_ROOT/VERSION" | grep -E "^v?[0-9]+\.[0-9]+\.[0-9]+" | head -1)
    if grep -q "version=\"$VERSION\"" "$PROJECT_ROOT/setup.py" 2>/dev/null; then
        echo -e "${GREEN}✓ Version consistent in tracked files${NC}"
    else
        echo -e "${YELLOW}⚠️  Version file changed but setup.py not updated${NC}"
        echo "   Run: scripts/sync-version.sh"
        ISSUES_FOUND=$((ISSUES_FOUND+1))
    fi
else
    echo -e "${GREEN}✓ Version file not being modified${NC}"
fi

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Fixes Applied:  ${GREEN}$FIXES_APPLIED${NC}"
echo -e "Issues Found:   $([ "$ISSUES_FOUND" -eq 0 ] && echo -e "${GREEN}0${NC}" || echo -e "${RED}$ISSUES_FOUND${NC}")"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ "$ISSUES_FOUND" -gt 0 ]; then
    echo -e "${RED}⚠️  Please fix issues before committing${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Pre-commit checks passed!${NC}"
    exit 0
fi
