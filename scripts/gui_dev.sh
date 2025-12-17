#!/bin/bash
# GUI Development and Build Script

set -e

cd "$(dirname "$0")/.."

echo "🚀 lmapp GUI Development & Build"
echo "================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✓ Node.js $(node --version) found"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✓ npm $(npm --version) found"

# Navigate to gui directory
cd gui

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✓ Dependencies already installed"
fi

# Show available commands
echo ""
echo "📋 Available Commands:"
echo ""
echo "  npm start          - Start development mode"
echo "  npm run dev        - Start with auto-reload"
echo "  npm run build      - Build for all platforms"
echo "  npm run build:mac  - Build for macOS (.dmg)"
echo "  npm run build:win  - Build for Windows (.exe)"
echo "  npm run build:linux - Build for Linux (AppImage)"
echo ""

# If argument provided, run that command
if [ $# -gt 0 ]; then
    echo "Running: npm run $1"
    npm run "$1"
else
    echo "💡 Tip: Run './scripts/gui_dev.sh start' to launch development mode"
fi
