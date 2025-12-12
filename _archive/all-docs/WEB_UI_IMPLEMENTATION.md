# LMAPP Web UI Implementation Guide
## GitHub Copilot-Style Self-Hosted Browser Interface

**Status:** Phase 2 High Priority Feature | Approved Dec 11, 2025
**Estimated Effort:** 7-10 hours (1,100+ LOC)
**Target Release:** v0.2.6 (Dec 25, 2025)

---

## 1. Architecture Overview

### Design Philosophy
- **Lightweight:** No build tools (no npm, webpack, bundlers)
- **Offline-first:** Works without internet connection
- **Extensible:** Plugins discoverable via web interface
- **Zero-dependency frontend:** Plain HTML/CSS/JavaScript
- **CLI complement:** Doesn't replace CLI, runs alongside

### Tech Stack
- **Backend:** FastAPI (lightweight async web server)
- **Frontend:** Vanilla HTML5/CSS3/ES6 JavaScript
- **Styling:** Custom CSS with GitHub Copilot dark theme
- **Icons:** Built-in SVG (no icon libraries)
- **Communication:** WebSocket for real-time chat

### File Structure
```
src/lmapp/
  web/                          # NEW - Web UI module
    __init__.py
    server.py                   # FastAPI server (300 LOC)
    routes.py                   # API endpoints (250 LOC)
    websocket_handler.py        # WebSocket chat (150 LOC)
    static/
      index.html                # Main page (200 LOC)
      css/
        style.css               # GitHub Copilot theme (400 LOC)
        dark.css                # Dark mode (150 LOC)
      js/
        app.js                  # Main app logic (350 LOC)
        chat.js                 # Chat UI (250 LOC)
        plugins.js              # Plugin browser (200 LOC)
        utils.js                # Utilities (150 LOC)
```

---

## 2. Frontend Specification

### Color Scheme (GitHub Copilot-Inspired)
```css
--bg-primary:     #0d1117  /* Dark background */
--bg-secondary:   #161b22  /* Slightly lighter */
--bg-tertiary:    #21262d  /* Panel background */
--text-primary:   #c9d1d9  /* Main text */
--text-secondary: #8b949e  /* Secondary text */
--border:         #30363d  /* Borders */
--accent:         #58a6ff  /* GitHub blue */
--success:        #3fb950  /* Green */
--danger:         #f85149  /* Red */
--warning:        #d29922  /* Orange */
```

### Page Structure
```
┌─────────────────────────────────────────────┐
│  LMAPP Web Interface                        │  Header
├───────────┬─────────────────────────────────┤
│ Navigation│                                 │
│ - Chat   │  Main Content Area               │
│ - Docs   │  (Dynamic - changes per section) │
│ - Plugins│                                 │
│ - Config │                                 │
└───────────┴─────────────────────────────────┘
```

### Core Views

#### 1. Chat Interface
- **Message List:** Scrollable message history
- **Input Area:** Text input + send button + file upload
- **Streaming:** Show token-by-token response from LLM
- **Actions:** Copy, regenerate, star favorite messages
- **Citations:** Show sources for RAG-based responses
- **Models:** Dropdown to select LLM model
- **System Prompt:** Optionally show/edit system prompt

**Key Features:**
- Auto-scroll to latest message
- Typing indicator while LLM responds
- Copy to clipboard with button
- Keyboard shortcut: Ctrl+Enter to send
- Message formatting (code blocks, markdown)
- Dark theme by default

#### 2. Document Management
- **Upload Panel:** Drag-and-drop file upload
- **Document List:** Currently loaded documents
- **Search:** Find documents and content
- **Delete:** Remove documents from index
- **Preview:** Show document excerpt
- **Status:** RAG index stats (docs loaded, size)

#### 3. Plugin Marketplace
- **Plugin List:** Available plugins with descriptions
- **Install Button:** One-click plugin installation
- **Status:** Active/inactive plugins
- **Details:** Plugin version, author, description
- **Uninstall:** Remove installed plugins
- **Filter:** By category (productivity, analysis, etc.)

#### 4. Settings Panel
- **Backend Config:**
  - Select active backend (Ollama, llamafile, etc.)
  - Available models dropdown
  - Connection status indicator
- **UI Settings:**
  - Font size adjustment
  - Theme toggle (light/dark)
  - Auto-scroll toggle
- **RAG Settings:**
  - Vector model selection
  - Chunk size adjustment
  - Max results per query

### Responsive Design
- **Desktop:** Full layout (1200px+)
- **Tablet:** Single column with collapsible nav (768px+)
- **Mobile:** Optimized touch interface (320px+)

---

## 3. Backend Implementation Plan

### FastAPI Server (`server.py`)

```python
from fastapi import FastAPI, WebSocket, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import asyncio
import json

app = FastAPI(title="LMAPP Web UI")

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    """Serve main HTML page"""
    return FileResponse("static/index.html")

# REST API endpoints
@app.get("/api/models")
async def get_models():
    """Get available LLM models"""

@app.post("/api/chat")
async def chat(message: str, model: str):
    """Single-turn chat (non-streaming)"""

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload document for RAG"""

@app.get("/api/documents")
async def list_documents():
    """Get uploaded documents"""

@app.delete("/api/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Delete document from RAG"""

@app.get("/api/plugins")
async def list_plugins():
    """Get available plugins"""

@app.post("/api/plugins/{plugin_name}/install")
async def install_plugin(plugin_name: str):
    """Install plugin"""

@app.post("/api/plugins/{plugin_name}/uninstall")
async def uninstall_plugin(plugin_name: str):
    """Uninstall plugin"""

# WebSocket for streaming chat
@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket):
    """Real-time chat with streaming responses"""

@app.get("/api/status")
async def status():
    """Get system status"""
```

### Key Endpoints (Estimated LOC)

| Endpoint | Purpose | LOC |
|----------|---------|-----|
| GET / | Serve HTML | 5 |
| GET /api/models | List models | 20 |
| POST /api/chat | Single-turn chat | 30 |
| POST /api/documents/upload | Upload RAG docs | 40 |
| GET /api/documents | List docs | 20 |
| DELETE /api/documents/{id} | Delete doc | 15 |
| GET /api/plugins | List plugins | 20 |
| POST /api/plugins/{name}/install | Install plugin | 35 |
| POST /api/plugins/{name}/uninstall | Uninstall plugin | 25 |
| WS /ws/chat | Streaming chat | 80 |
| GET /api/status | System status | 30 |
| POST /api/plugins/{name}/execute | Run plugin | 40 |
| **Total** | | **360** |

### Integration Points

1. **LLM Backend System**
   - Reuse existing `BackendDetector` to find available backends
   - Use `ChatSession` for chat functionality
   - Handle streaming responses for WebSocket

2. **RAG System**
   - Reuse `RAGSystem` for document indexing
   - Leverage semantic search for document queries
   - Return citations with each response

3. **Plugin Manager**
   - List available plugins
   - Handle installation/uninstallation
   - Execute plugins with parameters

4. **Cache Manager**
   - Cache LLM responses
   - Cache RAG search results
   - Show cache stats in UI

---

## 4. Frontend Implementation Details

### HTML Structure (`index.html`)
- Single-page HTML file (no template engine)
- Semantic HTML5 markup
- Inline critical CSS (fast load)
- Deferred JavaScript loading
- Mobile-first responsive design

### CSS Styling (`style.css`)
- CSS Grid layout for main container
- Flexbox for components
- CSS variables for theming
- Dark theme by default
- Animations (fade-in, slide-out, pulse)
- Smooth transitions

### JavaScript Architecture (`app.js`)
```javascript
// Main app controller
class LMAppUI {
  constructor() {
    this.currentView = 'chat'
    this.chatHistory = []
    this.documents = []
    this.plugins = []
    this.socket = null
  }

  init() {
    // Initialize UI
    this.setupEventListeners()
    this.setupWebSocket()
    this.loadStatus()
  }

  setupEventListeners() {
    // Nav click handlers
    // Send button click
    // File upload drag-drop
  }

  setupWebSocket() {
    // Connect to chat WebSocket
    // Handle incoming messages
  }

  async loadStatus() {
    // Fetch available models
    // Fetch available documents
    // Fetch available plugins
  }

  async sendMessage(text) {
    // Send chat message
    // Stream response
    // Update UI
  }

  async uploadDocument(file) {
    // Upload file
    // Update document list
  }

  async installPlugin(pluginName) {
    // Install plugin
    // Show confirmation
  }
}
```

### Key JS Modules

| Module | Purpose | LOC |
|--------|---------|-----|
| app.js | Main app controller | 350 |
| chat.js | Chat UI logic | 250 |
| plugins.js | Plugin manager UI | 200 |
| utils.js | Helper functions | 150 |
| **Total** | | **950** |

---

## 5. Implementation Timeline

### Phase 1: Backend Server (2-3 hours)
- [x] Set up FastAPI app
- [x] Create static file serving
- [x] Implement status endpoint
- [x] Implement model listing
- [x] Implement chat endpoint (non-streaming)
- [x] Implement WebSocket for streaming
- [x] Integration with existing backends
- [ ] Tests (15-20 tests)

### Phase 2: Frontend Skeleton (2-3 hours)
- [x] Create HTML structure
- [x] Implement dark theme CSS
- [x] Set up main layout (nav + content)
- [x] Responsive design (mobile, tablet, desktop)
- [x] Create navigation UI
- [ ] Tests (responsive design verification)

### Phase 3: Chat Interface (2 hours)
- [x] Chat message display
- [x] Message input box
- [x] Send button + Ctrl+Enter shortcut
- [x] Streaming message updates
- [x] Citations display
- [x] Model selector
- [x] File upload integration
- [ ] Tests (10-12 tests)

### Phase 4: Document Management (1-1.5 hours)
- [x] Document upload
- [x] Document list display
- [x] Delete document
- [x] Search documents
- [x] RAG integration
- [ ] Tests (8-10 tests)

### Phase 5: Plugin Marketplace (1-1.5 hours)
- [x] Plugin list display
- [x] Install/uninstall buttons
- [x] Plugin details view
- [x] Category filter
- [x] Run plugin from UI
- [ ] Tests (8-10 tests)

### Phase 6: Settings Panel (1 hour)
- [x] Backend selection
- [x] Model selection
- [x] Theme toggle
- [x] Font size adjustment
- [x] RAG settings
- [ ] Tests (5-8 tests)

### Phase 7: Testing & Polish (1-2 hours)
- [ ] End-to-end tests
- [ ] Performance optimization
- [ ] Browser compatibility
- [ ] Mobile responsiveness verification
- [ ] Error handling
- [ ] Loading states

---

## 6. Integration Checklist

### With Existing Systems
- [ ] Connect to existing `BackendDetector`
- [ ] Use existing `ChatSession` for chat
- [ ] Leverage `RAGSystem` for documents
- [ ] Use `PluginManager` for plugin ops
- [ ] Cache responses via `CacheManager`
- [ ] Log activity via existing logger

### API Contract
```python
# Expected from backend
{
  "models": ["model1", "model2"],
  "default_model": "model1",
  "backend_name": "ollama",
  "backend_status": "running",
  "documents": [
    {
      "id": "doc1",
      "name": "example.pdf",
      "size": 1024,
      "chunks": 10
    }
  ],
  "plugins": [
    {
      "name": "translator",
      "version": "0.1.0",
      "author": "community",
      "description": "...",
      "installed": True
    }
  ]
}
```

---

## 7. GitHub Copilot Aesthetic Guide

### Key Design Principles
1. **Minimalism:** Remove unnecessary UI elements
2. **Dark Theme:** Reduce eye strain in low-light
3. **Whitespace:** Plenty of breathing room
4. **Typography:** Clear hierarchy with 2-3 font sizes
5. **Contrast:** High contrast for readability
6. **Icons:** Simple, clear SVG icons

### Color Palette Reference
```
GitHub Copilot (Reference)
- Primary bg: #0d1117
- Secondary bg: #161b22
- Panel bg: #21262d
- Text: #c9d1d9
- Muted text: #8b949e
- Border: #30363d
- Accent blue: #58a6ff
- Success: #3fb950
- Danger: #f85149
```

### Typography
```css
Font Stack: 
  - Code: "SF Mono", "Monaco", "Inconsolata", "Courier New", monospace
  - Text: -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif

Sizes:
  - H1: 32px (bold)
  - H2: 24px (bold)
  - H3: 20px (semi-bold)
  - Body: 14px (regular)
  - Small: 12px (regular)
```

### Spacing (8px grid)
```css
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
```

---

## 8. Testing Strategy

### Unit Tests
- API endpoint tests (mock backends)
- Chat message formatting
- Document upload validation
- Plugin listing/filtering

### Integration Tests
- Full chat flow (upload doc → ask question → receive answer)
- Plugin installation flow
- Settings persistence

### End-to-End Tests
- Browser automation (optional, use simple checks)
- Chat interface responsiveness
- Document management workflow

### Test File: `tests/test_web_ui.py`
```python
# Estimated: 30-40 tests
- TestWebServer
  - test_root_returns_html()
  - test_models_endpoint()
  - test_chat_endpoint()
  - test_invalid_model_error()
- TestDocumentUpload
  - test_upload_file()
  - test_invalid_file_type()
  - test_max_file_size()
- TestPlugins
  - test_list_plugins()
  - test_install_plugin()
  - test_plugin_not_found()
- TestWebSocket
  - test_connect_websocket()
  - test_receive_message()
  - test_streaming_response()
```

---

## 9. Performance Considerations

### Optimization Targets
- **First load:** <2 seconds
- **Chat response:** <100ms (UI update)
- **File upload:** <5s for typical docs
- **Plugin list:** <500ms

### Optimization Strategies
1. **Frontend:**
   - Minify CSS/JS
   - Lazy-load plugin list
   - Debounce search inputs
   - Compress image assets

2. **Backend:**
   - Cache model list (5 min TTL)
   - Use existing RAGSystem cache
   - Stream responses (don't buffer)
   - Async operations

### Metrics to Track
- Page load time
- Time to first chat
- Document upload duration
- WebSocket latency

---

## 10. Security Considerations

### Local-Only by Default
- Serve only on `localhost:5000`
- No authentication needed (developer machine)
- CORS headers permit localhost only

### Input Validation
- File upload size limits (default: 50MB)
- File type whitelist (PDF, TXT, MD, etc.)
- Chat message length limits
- Plugin name validation

### CSRF Protection
- Use SameSite cookies
- CSRF tokens for POST requests (optional for localhost)
- Validate origins

### Data Handling
- Don't log sensitive data
- Clear cache on shutdown
- No telemetry by default

---

## 11. Launch Checklist

### Pre-Release
- [ ] All 30-40 tests passing
- [ ] Documentation complete
- [ ] Browser compatibility verified (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness tested
- [ ] Performance benchmarks met

### Documentation
- [ ] README with screenshots
- [ ] Quick start guide
- [ ] UI tour/walkthrough
- [ ] Keyboard shortcuts reference

### GitHub Release
- [ ] Release notes with feature descriptions
- [ ] Installation instructions
- [ ] Screenshots/GIFs of UI

---

## 12. Future Enhancements (Post-v0.2.6)

### UI Improvements
- Light theme option
- Customizable color schemes
- Multi-tab support for conversations
- Conversation sharing (export as PDF)
- Voice input/output

### Performance
- Service Worker for offline support
- Local IndexedDB for chat history
- Cached plugin list

### Community
- Plugin UI marketplace (with reviews)
- Shared prompt templates
- User-contributed themes

### Integration
- GitHub integration (read repos)
- VSCode extension integration
- Slack bot via plugins

---

## Implementation Notes

### Starting Point
1. Copy this file structure
2. Start with FastAPI server (`server.py`)
3. Create minimal HTML (`index.html`)
4. Build chat interface first (core feature)
5. Add other views incrementally

### Testing as You Go
- Test each API endpoint
- Test each UI section
- Integration test the whole flow

### Design Decisions
- **No build tools:** Direct HTML/CSS/JS for simplicity
- **FastAPI:** Already in dependencies, perfect for async
- **Vanilla JS:** No React/Vue needed for this use case
- **Dark theme only initially:** Can add light theme later
- **Localhost only:** No auth overhead

---

**Status:** Ready for implementation phase
**Estimated Start:** Dec 11, 2025
**Target Completion:** Dec 25, 2025
**Priority:** High (v0.2.6 Phase 2)
