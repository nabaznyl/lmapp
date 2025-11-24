#!/bin/bash
# scripts/sync-version.sh - Sync version across all project files

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Get version from VERSION file
if [ ! -f "$PROJECT_ROOT/VERSION" ]; then
    echo "❌ VERSION file not found at $PROJECT_ROOT/VERSION"
    exit 1
fi

VERSION=$(cat "$PROJECT_ROOT/VERSION" | grep -E "^v?[0-9]+\.[0-9]+\.[0-9]+" | head -1)

if [ -z "$VERSION" ]; then
    echo "❌ Could not parse version from VERSION file"
    exit 1
fi

# Remove 'v' prefix if present
VERSION="${VERSION#v}"

echo "📌 Syncing version: $VERSION"

# Update setup.py
if [ -f "$PROJECT_ROOT/setup.py" ]; then
    sed -i "s/version=\"[^\"]*\"/version=\"$VERSION\"/" "$PROJECT_ROOT/setup.py"
    echo "✓ Updated setup.py"
fi

# Update pyproject.toml
if [ -f "$PROJECT_ROOT/pyproject.toml" ]; then
    sed -i "s/version = \"[^\"]*\"/version = \"$VERSION\"/" "$PROJECT_ROOT/pyproject.toml"
    echo "✓ Updated pyproject.toml"
fi

# Update src/lmapp/__init__.py (if it exists)
if [ -f "$PROJECT_ROOT/src/lmapp/__init__.py" ]; then
    sed -i "s/__version__ = \"[^\"]*\"/__version__ = \"$VERSION\"/" "$PROJECT_ROOT/src/lmapp/__init__.py"
    echo "✓ Updated src/lmapp/__init__.py"
fi

# Update CHANGELOG header
if [ -f "$PROJECT_ROOT/CHANGELOG.md" ]; then
    # Check if version already in changelog
    if ! grep -q "## \[v$VERSION\]" "$PROJECT_ROOT/CHANGELOG.md"; then
        echo "ℹ️  Version $VERSION not in CHANGELOG (add manually if new release)"
    fi
fi

echo "✅ Version sync complete: $VERSION"
