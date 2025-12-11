#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_DIR="$SCRIPT_DIR/../vscode-extension"

# Find the latest vsix
VSIX=$(find "$EXT_DIR" -name "lmapp-vscode-*.vsix" | sort -V | tail -n 1)

if [ -z "$VSIX" ]; then
    echo "No .vsix file found. Running package script..."
    bash "$SCRIPT_DIR/package_extension.sh"
    VSIX=$(find "$EXT_DIR" -name "lmapp-vscode-*.vsix" | sort -V | tail -n 1)
fi

if ! command -v code &> /dev/null; then
    echo "Error: 'code' command not found. Is VS Code installed and in your PATH?"
    exit 1
fi

echo "Installing $VSIX..."
code --install-extension "$VSIX" --force
echo "Extension installed successfully."
