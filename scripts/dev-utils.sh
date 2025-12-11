#!/bin/bash
# scripts/dev-utils.sh
# Developer utilities and shortcuts for common tasks
# Makes it easier for contributors to work with the project

set -e

PROJECT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Functions for common tasks

show_help() {
    cat <<EOF
${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}
${BLUE}║              lmapp Developer Utilities                         ║${NC}
${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}

${CYAN}Usage:${NC}
  bash dev-utils.sh [command] [options]

${CYAN}Common Tasks:${NC}
  setup              Complete dev environment setup
  ready              Verify development environment is ready
  quick-test         Run tests quickly (no coverage)
  check              Run all quality checks
  reformat           Format and lint all code
  deps-update        Update development dependencies
  deps-audit         Security audit of dependencies
  cache-clean        Clean all Python caches and artifacts
  git-cleanup        Clean and optimize git repository
  status             Show project status and statistics
  help               Show this help message

${CYAN}Code Analysis:${NC}
  find-todos         Find TODO/FIXME comments in code
  find-prints        Find print() statements left in code
  check-imports      Analyze import statements
  check-complexity   Check code complexity

${CYAN}Git Utilities:${NC}
  git-fresh          Remove tracking of build artifacts
  git-stash-wip      Save work in progress
  git-pop-wip        Restore work in progress

${CYAN}Examples:${NC}
  bash dev-utils.sh setup              # First-time developer setup
  bash dev-utils.sh quick-test         # Fast test run
  bash dev-utils.sh check              # Full quality check
  bash dev-utils.sh find-todos         # Find unfinished work

EOF
}

# 1. Setup complete dev environment
setup_dev() {
    echo -e "${CYAN}Setting up development environment...${NC}"
    echo ""

    # Check for venv
    if [ ! -d "$PROJECT_ROOT/.venv" ]; then
        echo -e "${YELLOW}→ Creating virtual environment...${NC}"
        python3 -m venv "$PROJECT_ROOT/.venv"
    fi

    # Activate venv
    if [ -f "$PROJECT_ROOT/.venv/bin/activate" ]; then
        source "$PROJECT_ROOT/.venv/bin/activate"
        echo -e "${GREEN}✓ Virtual environment activated${NC}"
    fi

    # Install dev dependencies
    echo -e "${YELLOW}→ Installing dev dependencies...${NC}"
    pip install -q -e ".[dev]" 2>/dev/null
    echo -e "${GREEN}✓ Dependencies installed${NC}"

    # Install pre-commit hooks
    if command -v pre-commit &> /dev/null; then
        echo -e "${YELLOW}→ Installing pre-commit hooks...${NC}"
        pre-commit install > /dev/null 2>&1
        echo -e "${GREEN}✓ Pre-commit hooks installed${NC}"
    fi

    echo ""
    echo -e "${GREEN}✅ Development environment ready!${NC}"
    echo -e "${YELLOW}Next: Run 'bash dev-utils.sh ready' to verify${NC}"
}

# 2. Verify environment is ready
ready_check() {
    echo -e "${CYAN}Verifying development environment...${NC}"
    echo ""

    local READY=true

    # Check Python
    if command -v python &> /dev/null; then
        local PY_VERSION=$(python --version 2>&1)
        echo -e "${GREEN}✓${NC} Python: $PY_VERSION"
    else
        echo -e "${RED}✗${NC} Python not found"
        READY=false
    fi

    # Check key dependencies
    for pkg in click rich pydantic pytest black flake8; do
        if python -c "import $pkg" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} $pkg installed"
        else
            echo -e "${YELLOW}⚠${NC} $pkg not installed"
        fi
    done

    # Check git
    if command -v git &> /dev/null; then
        echo -e "${GREEN}✓${NC} Git available"
    else
        echo -e "${RED}✗${NC} Git not found"
        READY=false
    fi

    # Run tests
    echo ""
    echo -e "${CYAN}Running test verification...${NC}"
    if pytest tests/ -q > /dev/null 2>&1; then
        local TEST_COUNT=$(pytest tests/ -q 2>&1 | tail -1)
        echo -e "${GREEN}✓${NC} Tests passing ($TEST_COUNT)"
    else
        echo -e "${YELLOW}⚠${NC} Some tests may be failing"
    fi

    echo ""
    if [ "$READY" = true ]; then
        echo -e "${GREEN}✅ Environment is ready for development!${NC}"
    else
        echo -e "${YELLOW}⚠️  Some issues detected${NC}"
    fi
}

# 3. Quick test run
quick_test() {
    echo -e "${CYAN}Running quick tests...${NC}"
    pytest tests/ -q --tb=short
}

# 4. Full quality check
full_check() {
    echo -e "${CYAN}Running full quality checks...${NC}"
    echo ""

    local FAILED=0

    # Format check
    echo -e "${YELLOW}→ Checking code formatting...${NC}"
    if black --check src/ tests/ 2>&1 | grep -q "would reformat"; then
        echo -e "${YELLOW}⚠${NC} Code needs formatting (run: black src/ tests/)"
        ((FAILED++))
    else
        echo -e "${GREEN}✓${NC} Code formatting OK"
    fi

    # Lint check
    echo -e "${YELLOW}→ Linting code...${NC}"
    if flake8 src/ tests/ > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Lint check passed"
    else
        echo -e "${YELLOW}⚠${NC} Lint issues found (run: flake8 src/)"
        ((FAILED++))
    fi

    # Type check
    echo -e "${YELLOW}→ Checking types...${NC}"
    if mypy src/ --ignore-missing-imports > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Type check passed"
    else
        echo -e "${YELLOW}⚠${NC} Type issues found"
    fi

    # Tests
    echo -e "${YELLOW}→ Running tests...${NC}"
    if pytest tests/ -q > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} All tests passing"
    else
        echo -e "${RED}✗${NC} Some tests failing"
        ((FAILED++))
    fi

    echo ""
    if [ $FAILED -eq 0 ]; then
        echo -e "${GREEN}✅ All checks passed!${NC}"
    else
        echo -e "${RED}❌ $FAILED checks failed${NC}"
    fi
}

# 5. Reformat and lint
reformat_all() {
    echo -e "${CYAN}Reformatting and linting code...${NC}"
    black src/ tests/
    echo -e "${GREEN}✓${NC} Code formatted with Black"
}

# 6. Update dependencies
update_deps() {
    echo -e "${CYAN}Updating dependencies...${NC}"
    pip install --upgrade -e ".[dev]"
    echo -e "${GREEN}✓${NC} Dependencies updated"
}

# 7. Security audit
audit_deps() {
    echo -e "${CYAN}Running security audit...${NC}"
    if command -v pip-audit &> /dev/null; then
        pip-audit
    else
        echo -e "${YELLOW}⚠${NC} pip-audit not installed (run: pip install pip-audit)"
    fi
}

# 8. Clean caches
clean_cache() {
    echo -e "${CYAN}Cleaning Python caches...${NC}"
    find "$PROJECT_ROOT" -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
    find "$PROJECT_ROOT" -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
    find "$PROJECT_ROOT" -type d -name .mypy_cache -exec rm -rf {} + 2>/dev/null || true
    find "$PROJECT_ROOT" -type f -name "*.pyc" -delete
    rm -rf "$PROJECT_ROOT/build" "$PROJECT_ROOT/dist" "$PROJECT_ROOT"/*.egg-info 2>/dev/null || true
    echo -e "${GREEN}✓${NC} Caches cleaned"
}

# 9. Git cleanup
git_cleanup() {
    echo -e "${CYAN}Optimizing git repository...${NC}"
    cd "$PROJECT_ROOT"
    git gc --aggressive
    git prune
    echo -e "${GREEN}✓${NC} Git repository optimized"
}

# 10. Project status
project_status() {
    echo -e "${CYAN}Project Status${NC}"
    echo ""
    echo "Version: $(cat $PROJECT_ROOT/VERSION 2>/dev/null || echo 'unknown')"
    echo "Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')"
    echo "Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')"
    echo ""
    echo "📊 Statistics:"
    echo "  Python files: $(find "$PROJECT_ROOT/src" -name "*.py" 2>/dev/null | wc -l)"
    echo "  Test files: $(find "$PROJECT_ROOT/tests" -name "test_*.py" 2>/dev/null | wc -l)"
    echo "  Documentation: $(find "$PROJECT_ROOT" -maxdepth 1 -name "*.md" 2>/dev/null | wc -l) markdown files"
    echo ""
    echo "🔧 Environment:"
    echo "  Python: $(python --version 2>&1)"
    echo "  Virtual env: $([ -n "$VIRTUAL_ENV" ] && echo "$(basename $VIRTUAL_ENV)" || echo "not active")"
}

# 11. Find TODO/FIXME
find_todos() {
    echo -e "${CYAN}Finding TODO/FIXME comments...${NC}"
    grep -r "TODO\|FIXME" "$PROJECT_ROOT/src" 2>/dev/null || echo -e "${GREEN}✓${NC} No TODOs found"
}

# 12. Find print statements
find_prints() {
    echo -e "${CYAN}Finding print() statements...${NC}"
    grep -r "print(" "$PROJECT_ROOT/src" 2>/dev/null || echo -e "${GREEN}✓${NC} No print statements found"
}

# 13. Check imports
check_imports() {
    echo -e "${CYAN}Analyzing imports...${NC}"
    if command -v python &> /dev/null; then
        python << 'PYTHON'
import ast
import os
from collections import defaultdict

imports = defaultdict(int)
for root, dirs, files in os.walk('src'):
    dirs[:] = [d for d in dirs if d != '__pycache__']
    for file in files:
        if file.endswith('.py'):
            with open(os.path.join(root, file)) as f:
                try:
                    tree = ast.parse(f.read())
                    for node in ast.walk(tree):
                        if isinstance(node, (ast.Import, ast.ImportFrom)):
                            if isinstance(node, ast.Import):
                                for alias in node.names:
                                    imports[alias.name.split('.')[0]] += 1
                            else:
                                imports[node.module.split('.')[0]] += 1
                except:
                    pass

print("\n📦 Top imported modules:")
for module, count in sorted(imports.items(), key=lambda x: -x[1])[:15]:
    print(f"  {module}: {count} imports")
PYTHON
    fi
}

# 14. Check complexity
check_complexity() {
    echo -e "${CYAN}Checking code complexity...${NC}"
    if command -v flake8 &> /dev/null; then
        flake8 src/ --select=C901 --max-complexity=10 || true
    else
        echo -e "${YELLOW}⚠${NC} flake8 not installed"
    fi
}

# 15. Git stash for WIP
git_stash_wip() {
    echo -e "${CYAN}Stashing work in progress...${NC}"
    git stash push -m "WIP: $(date +%Y-%m-%d\ %H:%M:%S)"
    echo -e "${GREEN}✓${NC} Work stashed (run: git stash pop to restore)"
}

# 16. Git pop WIP
git_pop_wip() {
    echo -e "${CYAN}Restoring work in progress...${NC}"
    git stash pop
    echo -e "${GREEN}✓${NC} Work restored"
}

# Main command dispatcher
case "${1:-help}" in
    setup)              setup_dev ;;
    ready)              ready_check ;;
    quick-test)         quick_test ;;
    check)              full_check ;;
    reformat)           reformat_all ;;
    deps-update)        update_deps ;;
    deps-audit)         audit_deps ;;
    cache-clean)        clean_cache ;;
    git-cleanup)        git_cleanup ;;
    status)             project_status ;;
    find-todos)         find_todos ;;
    find-prints)        find_prints ;;
    check-imports)      check_imports ;;
    check-complexity)   check_complexity ;;
    git-stash-wip)      git_stash_wip ;;
    git-pop-wip)        git_pop_wip ;;
    *)                  show_help ;;
esac
