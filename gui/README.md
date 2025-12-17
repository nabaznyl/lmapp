# lmapp GUI - Desktop Application

**Status:** Phase 2A - Initial Development
**Target:** Q1 2026
**Goal:** Make lmapp accessible to non-technical users

## Technology Choice: Electron + React

**Rationale:**
- Familiar web tech stack (HTML/CSS/JS)
- Cross-platform by default (Windows, macOS, Linux)
- Easy to prototype and iterate
- Large community and ecosystem
- Can reuse existing FastAPI backend

## Architecture

```
lmapp/
├── src/lmapp/          # Existing Python backend
├── gui/                # New Electron frontend
│   ├── main.js         # Electron main process
│   ├── preload.js      # Bridge between main/renderer
│   ├── renderer/       # React app
│   │   ├── App.jsx
│   │   ├── Chat.jsx
│   │   ├── Settings.jsx
│   │   └── Workflows.jsx
│   └── package.json
```

## Features (v1.0)

### Core
- [ ] Chat interface (simple, clean)
- [ ] Model selection (Ollama/llamafile)
- [ ] File picker (drag & drop)
- [ ] Settings panel

### Nice-to-Have
- [ ] Dark/light theme
- [ ] Chat history
- [ ] Export conversations
- [ ] Keyboard shortcuts

## Development Plan

### Phase 2A-1: Scaffold (Week 1)
- Set up Electron + React boilerplate
- Connect to lmapp backend
- Basic chat UI

### Phase 2A-2: Integration (Week 2-3)
- File picker integration
- Model selection
- Settings persistence

### Phase 2A-3: Polish (Week 4)
- UI/UX improvements
- Error handling
- Installation packaging

## Installation Target

**User Journey:**
1. Download `.dmg` / `.exe` / `.AppImage`
2. Double-click to install
3. Open app → Chat starts
4. No Python, no CLI, no config

**< 3 clicks to working chat**
