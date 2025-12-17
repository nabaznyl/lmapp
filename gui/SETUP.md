# lmapp GUI - Setup Instructions

## Prerequisites
- Node.js 18+ and npm
- lmapp Python package installed (`pip install lmapp`)

## Development

```bash
cd gui
npm install
npm start
```

## Building Distributable

```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:mac    # macOS .dmg
npm run build:win    # Windows .exe
npm run build:linux  # Linux AppImage
```

## Architecture

- **Main Process** (main.js): Manages app lifecycle, starts lmapp backend
- **Renderer Process** (renderer/): UI running in Chromium
- **Preload Script** (preload.js): Secure bridge between main and renderer

## Backend Integration

The GUI automatically starts `lmapp serve --port 8000` and connects to:
- POST /v1/chat - Send messages
- GET /v1/models - Get available models
- POST /v1/files/add - Add files to context

## Next Steps

1. Test chat functionality with local models
2. Add streaming support for real-time responses
3. Implement settings persistence
4. Add dark/light theme toggle
5. Package for distribution
