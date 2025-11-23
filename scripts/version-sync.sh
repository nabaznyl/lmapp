#!/bin/bash
# lmapp Version Sync Script
# Syncs version from VERSION file to all source files
# Usage: ./scripts/version-sync.sh [version]
# If no version provided, reads from VERSION file

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VERSION_FILE="$PROJECT_ROOT/VERSION"

# Determine version to use
if [ $# -eq 1 ]; then
    NEW_VERSION="$1"
    echo "📝 Setting version to: $NEW_VERSION"
else
    NEW_VERSION=$(cat "$VERSION_FILE" | tr -d ' \n')
    echo "📖 Reading version from VERSION file: $NEW_VERSION"
fi

# Validate version format (semantic versioning)
if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+)?$ ]]; then
    echo "❌ Error: Invalid version format '$NEW_VERSION'"
    echo "   Expected format: X.Y.Z or X.Y.Z-suffix (e.g., 0.1.0 or 0.1.0-alpha)"
    exit 1
fi

echo "🔄 Syncing version to all source files..."

# Update VERSION file (if version was passed as argument)
if [ $# -eq 1 ]; then
    echo "$NEW_VERSION" > "$VERSION_FILE"
    echo "  ✓ Updated VERSION"
fi

# Update pyproject.toml
echo "  Updating pyproject.toml..."
sed -i "s/^version = \"[^\"]*\"/version = \"$NEW_VERSION\"/" "$PROJECT_ROOT/pyproject.toml"
echo "  ✓ Updated pyproject.toml"

# Update setup.py
echo "  Updating setup.py..."
# Handle both 'version=' and versions with .postN suffix
sed -i "s/version=\"[^\"]*\"/version=\"$NEW_VERSION\"/" "$PROJECT_ROOT/setup.py"
echo "  ✓ Updated setup.py"

# Update src/lmapp/__init__.py
echo "  Updating src/lmapp/__init__.py..."
sed -i "s/__version__ = \"[^\"]*\"/__version__ = \"$NEW_VERSION\"/" "$PROJECT_ROOT/src/lmapp/__init__.py"
echo "  ✓ Updated src/lmapp/__init__.py"

# Verify sync
echo ""
echo "✅ Version sync complete! Verification:"
echo "   VERSION file:        $(cat "$VERSION_FILE")"
echo "   pyproject.toml:      $(grep "^version" "$PROJECT_ROOT/pyproject.toml" | head -1 | sed 's/.*version = "\([^"]*\)".*/\1/')"
echo "   setup.py:            $(grep "version=" "$PROJECT_ROOT/setup.py" | sed 's/.*version="\([^"]*\)".*/\1/')"
echo "   __init__.py:         $(grep "__version__" "$PROJECT_ROOT/src/lmapp/__init__.py" | sed 's/.*__version__ = "\([^"]*\)".*/\1/')"

# Check if all versions match
PYPROJECT_VER=$(grep "^version" "$PROJECT_ROOT/pyproject.toml" | head -1 | sed 's/.*version = "\([^"]*\)".*/\1/')
SETUP_VER=$(grep "version=" "$PROJECT_ROOT/setup.py" | sed 's/.*version="\([^"]*\)".*/\1/')
INIT_VER=$(grep "__version__" "$PROJECT_ROOT/src/lmapp/__init__.py" | sed 's/.*__version__ = "\([^"]*\)".*/\1/')

if [ "$PYPROJECT_VER" = "$SETUP_VER" ] && [ "$SETUP_VER" = "$INIT_VER" ] && [ "$INIT_VER" = "$NEW_VERSION" ]; then
    echo ""
    echo "🎉 All versions synchronized successfully!"
    exit 0
else
    echo ""
    echo "⚠️  Warning: Version mismatch detected!"
    exit 1
fi
