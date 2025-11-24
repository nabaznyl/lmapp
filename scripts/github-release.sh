#!/bin/bash
# scripts/github-release.sh
# Helper to create GitHub releases with build artifacts

set -e

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
DIST_DIR="$PROJECT_ROOT/dist"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_help() {
    cat <<EOF
${BLUE}GitHub Release Helper${NC}

Usage: bash scripts/github-release.sh [command] [options]

Commands:
  build          Build distribution packages (wheel + tar.gz)
  draft          Create draft release on GitHub (requires gh CLI)
  help           Show this help message

Examples:
  bash scripts/github-release.sh build      # Build packages
  bash scripts/github-release.sh draft      # Create draft release

Prerequisites:
  - GitHub CLI installed: https://cli.github.com/
  - Authenticated: gh auth login
  - On a tagged commit (v0.1.0, etc.)

EOF
}

build_packages() {
    echo -e "${BLUE}🔨 Building distribution packages...${NC}"
    
    # Clean old builds
    rm -rf "$DIST_DIR" build *.egg-info
    
    # Build wheel and source distribution
    echo -e "${YELLOW}→ Building wheel...${NC}"
    python -m build --wheel
    
    echo -e "${YELLOW}→ Building source distribution...${NC}"
    python -m build --sdist
    
    # Verify
    if [ -f "$DIST_DIR"/*.whl ] && [ -f "$DIST_DIR"/*.tar.gz ]; then
        echo -e "${GREEN}✓ Packages built successfully${NC}"
        echo -e "${BLUE}Files in dist/:${NC}"
        ls -lh "$DIST_DIR"
    else
        echo -e "${RED}✗ Build failed${NC}"
        exit 1
    fi
}

create_draft_release() {
    echo -e "${BLUE}📝 Creating draft release on GitHub...${NC}"
    
    # Check if gh CLI is available
    if ! command -v gh &> /dev/null; then
        echo -e "${RED}✗ GitHub CLI (gh) not found${NC}"
        echo "Install from: https://cli.github.com/"
        exit 1
    fi
    
    # Get current tag
    TAG=$(git describe --tags --exact-match 2>/dev/null || echo "")
    if [ -z "$TAG" ]; then
        echo -e "${RED}✗ Not on a tagged commit${NC}"
        echo "Create a tag first: git tag -a v0.1.0 -m 'Release v0.1.0'"
        exit 1
    fi
    
    # Get version from tag
    VERSION="${TAG#v}"
    
    echo -e "${YELLOW}→ Creating release for tag: $TAG${NC}"
    
    # Build if not already built
    if [ ! -f "$DIST_DIR"/*.whl ] || [ ! -f "$DIST_DIR"/*.tar.gz ]; then
        echo -e "${YELLOW}→ Packages not found, building...${NC}"
        build_packages
    fi
    
    # Create release with artifacts
    echo -e "${YELLOW}→ Uploading assets...${NC}"
    
    # Create the release (draft)
    gh release create "$TAG" \
        --draft \
        --title "Release $TAG" \
        --notes "## Release $TAG

### Installation

\`\`\`bash
pip install lmapp
\`\`\`

Or install directly from this release:

\`\`\`bash
pip install https://github.com/nabaznyl/lmapp/releases/download/$TAG/lmapp-${VERSION}-py3-none-any.whl
\`\`\`

### What's New

See [CHANGELOG.md](https://github.com/nabaznyl/lmapp/blob/main/CHANGELOG.md) for details.

### Getting Started

New to lmapp? Start with:

\`\`\`bash
pip install lmapp
lmapp chat
\`\`\`

Want to contribute? See [GETTING_STARTED.md](https://github.com/nabaznyl/lmapp/blob/main/GETTING_STARTED.md)" \
        "$DIST_DIR"/lmapp-*.whl \
        "$DIST_DIR"/lmapp-*.tar.gz 2>&1 || {
        echo -e "${YELLOW}Note: Release may already exist. Updating assets...${NC}"
    }
    
    echo -e "${GREEN}✓ Release created/updated (draft mode)${NC}"
    echo ""
    echo -e "${BLUE}To publish:${NC}"
    echo "  gh release edit $TAG --draft=false"
    echo ""
    echo -e "${BLUE}To view:${NC}"
    echo "  https://github.com/nabaznyl/lmapp/releases/tag/$TAG"
}

case "${1:-help}" in
    build)       build_packages ;;
    draft)       create_draft_release ;;
    *)           show_help ;;
esac
