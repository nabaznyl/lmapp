#!/bin/bash
# lmapp Workspace Cleanup Script
# Removes cache, temporary files, and compiled Python artifacts
# Safe to run before commits

set -e

WORKSPACE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
cd "$WORKSPACE"

echo "🧹 Starting workspace cleanup..."

# Remove Python cache
echo "  Cleaning Python cache..."
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
find . -type f -name "*.pyc" -delete 2>/dev/null || true
find . -type f -name "*.pyo" -delete 2>/dev/null || true

# Remove pytest cache
echo "  Cleaning pytest cache..."
find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true

# Remove coverage files
echo "  Cleaning coverage files..."
find . -type f -name ".coverage*" -delete 2>/dev/null || true
rm -f htmlcov/.gitkeep 2>/dev/null || true

# Remove build artifacts
echo "  Cleaning build artifacts..."
rm -rf build/ dist/ *.egg-info 2>/dev/null || true

# Remove editor caches
echo "  Cleaning editor caches..."
find . -type d -name .vscode -prune -o -type d -name .idea -prune 2>/dev/null || true

echo "✓ Workspace cleanup complete!"
echo ""
echo "Cache removed:"
echo "  - Python cache (__pycache__)"
echo "  - Pytest cache (.pytest_cache)"
echo "  - Coverage files (.coverage*)"
echo "  - Compiled bytecode (*.pyc)"
echo "  - Build artifacts"
echo ""
