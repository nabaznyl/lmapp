# lmapp GUI - Quick Start Guide

## Installation & Setup

### Prerequisites
```bash
# 1. Install lmapp backend
pip install lmapp

# 2. Install/start LLM backend (choose one)
# Option A: Ollama
ollama pull llama2

# Option B: llamafile
# Download from https://github.com/Mozilla-Ocho/llamafile
chmod +x llamafile
./llamafile
```

### Start Development Mode
```bash
# Terminal 1: Backend
cd ~/projects/lmapp
lmapp serve

# Terminal 2: GUI
cd ~/projects/lmapp/gui
npm install  # First time only
npm start
```

**App opens in ~3 seconds** ✅

---

## Quick Tour (5 minutes)

### 1. Chat Tab
- Type: "Hello, how are you?"
- Press Enter or click Send
- AI responds in 3-5 seconds
- Try: "What is Python?"

### 2. Model Selection
- Dropdown in sidebar shows available models
- Select different model
- Send another message
- Model persists after restart

### 3. File Attachment
- Click 📁 button
- Select any .txt or .md file
- Ask: "What is in this file?"
- AI reads and references content

### 4. Workflows Tab
- Click Workflows in sidebar
- See 5 preset automation templates
- Try "Game Help" workflow:
  - Game: GTA San Andreas
  - Platform: PC
  - Question: Best cheat codes?
- Get instant results

### 5. Settings
- Click ⚙️ button
- Toggle dark/light theme
- Adjust temperature (0.1-1.0)
- Enable/disable RAG and Agent mode

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+C` | Open Chat tab |
| `Ctrl+Shift+W` | Open Workflows tab |
| `Ctrl+Shift+S` | Open Settings |
| `Enter` | Send message |
| `Shift+Enter` | New line (doesn't send) |

---

## Features Overview

### Core Features (Phase 2A)
- ✅ Chat with local LLMs (Ollama, llamafile)
- ✅ Model selection and switching
- ✅ File attachment and context
- ✅ Streaming responses (real-time)
- ✅ Settings persistence
- ✅ Dark/light themes
- ✅ Backend auto-start

### Workflow Features (Phase 2B)
- ✅ 5 preset workflows:
  - Write Paper (students)
  - Search Files (researchers)
  - Game Help (gamers)
  - Email Automation (professionals)
  - Document Analysis (analysts)
- ✅ Step-by-step execution
- ✅ Progress tracking
- ✅ Category filtering
- ✅ Recent workflows (auto-tracked)
- ✅ Favorites/pins (star to save)

### Proficiency Features
- ✅ Keyboard shortcuts
- ✅ Recent workflows badge
- ✅ Favorite workflows (⭐)
- ⏳ Caching (coming soon)
- ⏳ Smart defaults (coming soon)

---

## Testing Checklist

**Quick Smoke Test (2 minutes):**
- [ ] App launches
- [ ] Chat sends/receives messages
- [ ] Model selection works
- [ ] Workflows tab loads 5 workflows
- [ ] Settings panel opens

**Full Test Suite:**
See [INTEGRATION_TESTING.md](INTEGRATION_TESTING.md) for 22 comprehensive tests.

---

## Building Installers

### All Platforms
```bash
cd gui
npm run build
```
Output: `gui/dist/` with installers for all platforms

### Platform-Specific
```bash
npm run build:mac     # macOS .dmg
npm run build:win     # Windows .exe
npm run build:linux   # Linux AppImage + .deb
```

**Build time:** 5-10 minutes per platform

---

## Troubleshooting

### App won't start
```bash
# Check backend is running
curl http://localhost:8000/health

# Restart backend
lmapp serve
```

### No models in dropdown
```bash
# Verify Ollama/llamafile is running
ollama list  # Should show installed models

# Pull a model if none available
ollama pull tinyllama
```

### Workflows won't execute
- Check backend connection (green status indicator)
- Verify LLM is running
- Check console (F12) for errors

### Settings not saving
- Check write permissions: `~/.config/lmapp-gui/`
- Restart app

---

## File Locations

**Config:** `~/.config/lmapp-gui/settings.json`  
**Cache:** `~/.lmapp/workflow_cache/`  
**Logs:** `~/.lmapp/logs/`

---

## Next Steps

1. **Test workflows:** Try all 5 workflows with real LLM
2. **Customize settings:** Adjust temperature, enable features
3. **Star favorites:** Pin your most-used workflows
4. **Report bugs:** Open issue on GitHub

---

## Performance Targets

✅ **Met:**
- App startup: < 3 seconds
- Message send: < 1 second
- Settings save: < 500ms
- Memory usage: < 200MB idle

🎯 **Target:**
- Workflow execution: < 30 seconds
- File processing: < 2 seconds
- Model switching: < 1 second

---

## Development Commands

```bash
# Development mode
npm start

# Run tests
npm test

# Run tests with UI visible
npm run test:headed

# Build for distribution
npm run build

# Format code
npm run format

# Lint
npm run lint
```

---

**Version:** 0.4.0-beta  
**Status:** Testing Phase  
**Target Release:** Q1 2026

**Documentation:** [MASTER_ROADMAP.md](../MASTER_ROADMAP.md) | [INTEGRATION_TESTING.md](INTEGRATION_TESTING.md)
