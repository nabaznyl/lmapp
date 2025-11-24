#!/bin/bash
# Generate CHANGELOG.md from conventional commits
# Usage: ./scripts/gen-changelog.sh [output_file]
# Default output file: CHANGELOG.md

set -e

OUTPUT_FILE="${1:-CHANGELOG.md}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Generating changelog from conventional commits...${NC}"

cd "$PROJECT_ROOT"

# Get the last tag
LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")

if [ -z "$LAST_TAG" ]; then
    echo -e "${YELLOW}No previous tags found, including all commits${NC}"
    COMMITS=$(git log --pretty=format:"%h|%s|%b|%an" --reverse)
else
    echo -e "${YELLOW}Generating changelog since tag: $LAST_TAG${NC}"
    COMMITS=$(git log --pretty=format:"%h|%s|%b|%an" --reverse "${LAST_TAG}..HEAD")
fi

# Prepare temporary changelog
TEMP_CHANGELOG=$(mktemp)

# Start new changelog section
echo "# Changelog" > "$TEMP_CHANGELOG"
echo "" >> "$TEMP_CHANGELOG"

# Get current version from sync-version.sh output
CURRENT_VERSION=$(grep -oP 'VERSION = "\K[^"]+' "$PROJECT_ROOT/scripts/sync-version.sh" || echo "Unreleased")
CURRENT_DATE=$(date +"%Y-%m-%d")

echo "## [Unreleased]" >> "$TEMP_CHANGELOG"
echo "" >> "$TEMP_CHANGELOG"

# Parse commits and categorize them
FEATURES=""
FIXES=""
DOCS=""
REFACTORS=""
OTHER=""

while IFS='|' read -r HASH SUBJECT BODY AUTHOR; do
    # Skip empty lines
    [ -z "$HASH" ] && continue
    
    # Extract commit type and message
    if [[ $SUBJECT =~ ^feat\((.+)\):\ (.+)$ ]]; then
        SCOPE="${BASH_REMATCH[1]}"
        MESSAGE="${BASH_REMATCH[2]}"
        FEATURES="${FEATURES}  - **${SCOPE}**: ${MESSAGE}\n"
    elif [[ $SUBJECT =~ ^feat:\ (.+)$ ]]; then
        MESSAGE="${BASH_REMATCH[1]}"
        FEATURES="${FEATURES}  - ${MESSAGE}\n"
    elif [[ $SUBJECT =~ ^fix\((.+)\):\ (.+)$ ]]; then
        SCOPE="${BASH_REMATCH[1]}"
        MESSAGE="${BASH_REMATCH[2]}"
        FIXES="${FIXES}  - **${SCOPE}**: ${MESSAGE}\n"
    elif [[ $SUBJECT =~ ^fix:\ (.+)$ ]]; then
        MESSAGE="${BASH_REMATCH[1]}"
        FIXES="${FIXES}  - ${MESSAGE}\n"
    elif [[ $SUBJECT =~ ^docs\((.+)\):\ (.+)$ ]]; then
        SCOPE="${BASH_REMATCH[1]}"
        MESSAGE="${BASH_REMATCH[2]}"
        DOCS="${DOCS}  - **${SCOPE}**: ${MESSAGE}\n"
    elif [[ $SUBJECT =~ ^docs:\ (.+)$ ]]; then
        MESSAGE="${BASH_REMATCH[1]}"
        DOCS="${DOCS}  - ${MESSAGE}\n"
    elif [[ $SUBJECT =~ ^refactor\((.+)\):\ (.+)$ ]]; then
        SCOPE="${BASH_REMATCH[1]}"
        MESSAGE="${BASH_REMATCH[2]}"
        REFACTORS="${REFACTORS}  - **${SCOPE}**: ${MESSAGE}\n"
    elif [[ $SUBJECT =~ ^refactor:\ (.+)$ ]]; then
        MESSAGE="${BASH_REMATCH[1]}"
        REFACTORS="${REFACTORS}  - ${MESSAGE}\n"
    else
        OTHER="${OTHER}  - ${SUBJECT} (by ${AUTHOR})\n"
    fi
done <<< "$COMMITS"

# Write categorized sections
if [ -n "$FEATURES" ]; then
    echo "### Features" >> "$TEMP_CHANGELOG"
    echo -e "$FEATURES" >> "$TEMP_CHANGELOG"
    echo "" >> "$TEMP_CHANGELOG"
fi

if [ -n "$FIXES" ]; then
    echo "### Bug Fixes" >> "$TEMP_CHANGELOG"
    echo -e "$FIXES" >> "$TEMP_CHANGELOG"
    echo "" >> "$TEMP_CHANGELOG"
fi

if [ -n "$REFACTORS" ]; then
    echo "### Refactoring" >> "$TEMP_CHANGELOG"
    echo -e "$REFACTORS" >> "$TEMP_CHANGELOG"
    echo "" >> "$TEMP_CHANGELOG"
fi

if [ -n "$DOCS" ]; then
    echo "### Documentation" >> "$TEMP_CHANGELOG"
    echo -e "$DOCS" >> "$TEMP_CHANGELOG"
    echo "" >> "$TEMP_CHANGELOG"
fi

if [ -n "$OTHER" ]; then
    echo "### Other Changes" >> "$TEMP_CHANGELOG"
    echo -e "$OTHER" >> "$TEMP_CHANGELOG"
    echo "" >> "$TEMP_CHANGELOG"
fi

# Append existing changelog if it exists (skip the header)
if [ -f "$OUTPUT_FILE" ]; then
    echo "" >> "$TEMP_CHANGELOG"
    tail -n +2 "$OUTPUT_FILE" >> "$TEMP_CHANGELOG"
fi

# Replace the original file
mv "$TEMP_CHANGELOG" "$OUTPUT_FILE"

echo -e "${GREEN}✅ Changelog updated: ${OUTPUT_FILE}${NC}"
echo -e "${BLUE}Changes generated from commits since: ${LAST_TAG:-project start}${NC}"
