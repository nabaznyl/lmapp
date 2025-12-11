#!/bin/bash
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXT_DIR="$SCRIPT_DIR/../vscode-extension"

cd "$EXT_DIR"
echo "Packaging VS Code extension..."
# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
    npm install
fi
npx vsce package
echo "Done. Package is at $EXT_DIR/lmapp-vscode-*.vsix"
