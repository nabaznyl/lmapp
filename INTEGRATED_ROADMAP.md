# lmapp - Integrated Roadmap (Projects 1-3)

**Vision**: A unified local AI assistant that evolves from simple chat to web access to full system integration.

---

## 🎯 Three-Phase Integration Plan

### PROJECT 1: Local LLM Chat (CURRENT) ✅ Foundation Complete
**Status**: Phase 1 Complete, Phase 2 In Progress  
**Goal**: Basic local AI assistant with automatic setup

**Core Features**:
- ✅ Automated installation (Ollama/llamafile)
- ✅ Consumer-friendly alphabetic menus
- 🚧 AI chat functionality
- 🚧 Model management
- 🚧 Shell customization (bash-it, Oh My Zsh)

---

### PROJECT 2: Web & Terminal Access (FUTURE)
**Status**: Planned  
**Goal**: Access websites and AI chats from terminal

**Planned Features**:
- [ ] Terminal web browser integration (w3m, lynx, browsh)
- [ ] Web scraping capabilities
- [ ] API endpoint access
- [ ] Web-based AI chat integration
- [ ] URL content summarization
- [ ] Bookmark management

**Integration Points** (Bookmarked):
- `src/lmapp/web/` - Web access modules
- `src/lmapp/web/browser.py` - Terminal browser wrapper
- `src/lmapp/web/scraper.py` - Web content extraction
- `src/lmapp/web/api_client.py` - API integrations

**Dependencies to Add**:
```python
# requirements-web.txt (future)
beautifulsoup4>=4.12.0
requests>=2.31.0
selenium>=4.15.0  # If needed for JS-heavy sites
playwright>=1.40.0  # Alternative to Selenium
```

---

### PROJECT 3: System File Access (FUTURE)
**Status**: Planned  
**Goal**: LLM can detect, locate, access, and manage local files/folders

**Planned Features**:
- [ ] File system scanning and indexing
- [ ] Smart file search (by content, type, metadata)
- [ ] File operations (create, edit, delete) with user confirmation
- [ ] Directory structure analysis
- [ ] Permission-based access control
- [ ] Audit logging of all operations
- [ ] Undo/rollback functionality

**Security & Safety** (CRITICAL):
- [ ] User confirmation for ALL destructive operations
- [ ] Sandboxed execution environment
- [ ] File operation whitelist/blacklist
- [ ] Automatic backups before modifications
- [ ] Detailed operation logs
- [ ] Dry-run mode for previewing changes

**Integration Points** (Bookmarked):
- `src/lmapp/filesystem/` - File system modules
- `src/lmapp/filesystem/scanner.py` - File discovery
- `src/lmapp/filesystem/operations.py` - File operations
- `src/lmapp/filesystem/permissions.py` - Access control
- `src/lmapp/filesystem/audit.py` - Operation logging
- `src/lmapp/filesystem/backup.py` - Backup/restore

**Dependencies to Add**:
```python
# requirements-filesystem.txt (future)
watchdog>=3.0.0  # File system monitoring
send2trash>=1.8.0  # Safe file deletion (to trash)
pathlib>=1.0.1  # Advanced path operations
```

---

## 🏗️ Unified Architecture

```
lmapp/
├── src/lmapp/
│   ├── core/              # Core functionality (PROJECT 1)
│   │   ├── chat.py        # Chat interface
│   │   ├── models.py      # Model management
│   │   └── config.py      # Configuration
│   │
│   ├── backend/           # LLM backends (PROJECT 1)
│   │   ├── ollama.py      # Ollama integration
│   │   ├── llamafile.py   # llamafile integration
│   │   └── base.py        # Abstract backend
│   │
│   ├── web/               # Web access (PROJECT 2) 🔖 BOOKMARK
│   │   ├── __init__.py
│   │   ├── browser.py     # Terminal browser wrapper
│   │   ├── scraper.py     # Web scraping
│   │   └── api_client.py  # API integrations
│   │
│   ├── filesystem/        # File system (PROJECT 3) 🔖 BOOKMARK
│   │   ├── __init__.py
│   │   ├── scanner.py     # File discovery
│   │   ├── operations.py  # File operations
│   │   ├── permissions.py # Access control
│   │   ├── audit.py       # Operation logging
│   │   └── backup.py      # Backup/restore
│   │
│   ├── ui/                # User interface
│   │   ├── menu.py        # Main menu
│   │   ├── chat_ui.py     # Chat interface 🔖 BOOKMARK
│   │   ├── web_ui.py      # Web UI (PROJECT 2) 🔖 BOOKMARK
│   │   └── file_ui.py     # File UI (PROJECT 3) 🔖 BOOKMARK
│   │
│   └── utils/             # Utilities
│       ├── system_check.py
│       ├── logger.py      # 🔖 BOOKMARK - Enhanced logging
│       └── safety.py      # 🔖 BOOKMARK - Safety checks
```

---

## 🔒 Security Framework (Critical for Projects 2 & 3)

### User Consent & Confirmation
```python
# Pattern for all operations (to be implemented)
def perform_operation(action: str, details: dict) -> bool:
    """
    Universal confirmation pattern for all actions.
    PROJECT 2 & 3 will use this extensively.
    """
    # Show what will happen
    display_operation_preview(action, details)
    
    # Get user confirmation (A/B/C menu)
    choice = prompt_user([
        ("A", "Proceed", "Execute this operation"),
        ("B", "Preview only", "Show what would happen (dry-run)"),
        ("C", "Cancel", "Do not proceed")
    ])
    
    if choice == "A":
        # Log operation
        log_operation(action, details)
        return execute_with_backup(action, details)
    elif choice == "B":
        show_dry_run(action, details)
        return False
    else:
        return False
```

### Audit Trail
All operations in Projects 2 & 3 will be logged:
- Timestamp
- User who approved
- Operation type
- Files/URLs affected
- Success/failure status
- Rollback information

---

## 📋 Multi-Platform Support (Future)

### Platform Priority Order
1. **Debian Linux** (CURRENT - PROJECT 1)
2. **Ubuntu/Mint** (PROJECT 1)
3. **Windows WSL2** (PROJECT 2)
4. **macOS** (PROJECT 2)
5. **Android/Termux** (PROJECT 3)
6. **Windows Native** (PROJECT 3)
7. **iOS** (Far Future)

### Platform-Specific Modules (Bookmarked)
```
src/lmapp/platform/
├── __init__.py
├── linux.py         # Debian/Ubuntu (CURRENT)
├── windows.py       # 🔖 BOOKMARK - Windows support
├── macos.py         # 🔖 BOOKMARK - macOS support
├── android.py       # 🔖 BOOKMARK - Android/Termux
└── detector.py      # Auto-detect platform
```

---

## 🚀 Feature Evolution Timeline

### v0.1.0 - PROJECT 1: Core Chat (Current Focus)
- [x] Foundation and structure
- [ ] Ollama integration
- [ ] llamafile integration
- [ ] Basic chat interface
- [ ] Model management
- [ ] Shell customization

### v0.2.0 - PROJECT 1: Enhanced Chat
- [ ] Conversation history
- [ ] Multi-turn context
- [ ] Export conversations
- [ ] Custom prompts
- [ ] Chat templates

### v0.3.0 - PROJECT 2: Web Access (Phase 1)
- [ ] Terminal browser integration
- [ ] URL content extraction
- [ ] Web search capabilities
- [ ] Basic scraping
- [ ] API client framework

### v0.4.0 - PROJECT 2: Web Access (Phase 2)
- [ ] JavaScript-heavy site support (Browsh/Playwright)
- [ ] Multi-tab management
- [ ] Bookmark system
- [ ] Download manager
- [ ] Cookie/session management

### v0.5.0 - PROJECT 3: File System (Phase 1 - READ ONLY)
- [ ] File scanning and indexing
- [ ] Content search
- [ ] File preview
- [ ] Directory navigation
- [ ] Metadata extraction

### v0.6.0 - PROJECT 3: File System (Phase 2 - SAFE OPERATIONS)
- [ ] File creation (new files only)
- [ ] File copying
- [ ] Safe file deletion (to trash)
- [ ] Directory creation
- [ ] All with user confirmation

### v0.7.0 - PROJECT 3: File System (Phase 3 - ADVANCED)
- [ ] File editing (with backup)
- [ ] Batch operations
- [ ] Advanced search
- [ ] File organization suggestions
- [ ] Duplicate detection

### v1.0.0 - UNIFIED PLATFORM
- [ ] All three projects integrated
- [ ] Cross-platform support (Linux, Windows, macOS)
- [ ] Comprehensive documentation
- [ ] Professional packaging
- [ ] Community features

---

## 🔖 Code Bookmarks for Future Integration

### 1. Menu System Extension Points
**File**: `src/lmapp/ui/menu.py`

```python
# 🔖 BOOKMARK - Add PROJECT 2 menu items here
MenuItem("F", "Web access", self.web_access, "Browse web, search, scrape"),

# 🔖 BOOKMARK - Add PROJECT 3 menu items here  
MenuItem("G", "File manager", self.file_manager, "Browse and manage files"),
```

### 2. Configuration Schema
**File**: `src/lmapp/core/config.py` (to be created)

```python
# 🔖 BOOKMARK - Add web config (PROJECT 2)
web_config = {
    "default_browser": "w3m",  # w3m, lynx, browsh
    "enable_javascript": False,
    "cache_enabled": True,
}

# 🔖 BOOKMARK - Add filesystem config (PROJECT 3)
filesystem_config = {
    "scan_depth": 5,
    "enable_indexing": True,
    "safe_mode": True,  # Require confirmation for all operations
    "backup_before_edit": True,
    "excluded_paths": ["/sys", "/proc", "/dev"],
}
```

### 3. Safety Validator
**File**: `src/lmapp/utils/safety.py` (to be created)

```python
# 🔖 BOOKMARK - Safety checks for PROJECT 3
def validate_file_operation(operation: str, path: str) -> bool:
    """
    Validate file operations before execution.
    Returns True if safe, False otherwise.
    """
    # Check if path is in excluded list
    # Check if user has permissions
    # Verify operation is not destructive without backup
    pass
```

### 4. Backend Capabilities
**File**: `src/lmapp/backend/base.py` (to be created)

```python
class LLMBackend:
    # 🔖 BOOKMARK - Add capabilities flags
    supports_web_access: bool = False      # PROJECT 2
    supports_file_operations: bool = False  # PROJECT 3
    supports_code_execution: bool = False   # PROJECT 3
```

---

## 📦 Dependency Management Strategy

### Current: requirements.txt (PROJECT 1)
Basic dependencies for chat functionality

### Future: Split Dependencies
```
requirements.txt           # Core (always installed)
requirements-web.txt       # PROJECT 2 (optional)
requirements-filesystem.txt # PROJECT 3 (optional)
requirements-dev.txt       # Development tools
```

### Installation Modes
```bash
# Minimal install (PROJECT 1 only)
pipx install lmapp

# With web support (PROJECT 1 + 2)
pipx install lmapp[web]

# Full install (all features)
pipx install lmapp[full]
```

---

## 🎨 UI/UX Consistency Across Projects

### Alphabetic Menu Pattern (All Projects)
```
A) Option 1 - Brief description
B) Option 2 - Brief description
C) Option 3 - Brief description
...
Q) Quit - Return to previous menu
```

### Confirmation Pattern (Projects 2 & 3)
```
About to: [ACTION]
Files affected: [LIST]
Estimated time: [TIME]

A) Proceed - Execute this action
B) Preview - Show detailed plan (dry-run)
C) Cancel - Do not proceed

Choose:
```

### Progress Indicators (All Projects)
```
[████████████░░░░░░░░] 60% - Downloading model...
[██████████████████░░] 90% - Scanning files...
[████████████████████] 100% Complete!
```

---

## 🛡️ Risk Mitigation Strategy

### PROJECT 1 (Low Risk)
- Local processing only
- No system modifications
- Main risk: Resource consumption

### PROJECT 2 (Medium Risk)
- Network access required
- Potential for malicious content
- Privacy concerns (sites visited)

**Mitigations**:
- [ ] Content filtering
- [ ] HTTPS enforcement
- [ ] Cookie isolation
- [ ] Privacy mode (no history)

### PROJECT 3 (High Risk)
- File system access
- Potential for data loss
- Security vulnerabilities

**Mitigations**:
- [ ] Mandatory user confirmation
- [ ] Automatic backups
- [ ] Safe mode (read-only default)
- [ ] Operation whitelist
- [ ] Detailed audit logs
- [ ] Rollback capability
- [ ] Sandboxed execution

---

## 📊 Success Metrics

### PROJECT 1
- [ ] Installation success rate >95%
- [ ] Time to first chat <10 minutes
- [ ] User satisfaction with menu system

### PROJECT 2
- [ ] Successful web page loads >90%
- [ ] Content extraction accuracy >85%
- [ ] No privacy leaks

### PROJECT 3
- [ ] Zero data loss incidents
- [ ] User confirmation for 100% of operations
- [ ] Successful rollback rate >99%

---

## 🔄 Automation Priorities

### Immediate (PROJECT 1)
1. ✅ Virtual environment creation
2. ✅ Dependency installation
3. 🚧 Backend detection and installation
4. 🚧 Model download and selection
5. 🚧 Configuration generation

### Short-term (PROJECT 1 & 2)
6. [ ] Platform detection and adaptation
7. [ ] Update checking and installation
8. [ ] Log rotation and cleanup
9. [ ] Performance optimization

### Long-term (PROJECT 3)
10. [ ] Intelligent file organization suggestions
11. [ ] Automatic backup scheduling
12. [ ] Smart cache management
13. [ ] Security scan automation

---

## 📝 Documentation Strategy

### User Documentation
- Installation guide (per platform)
- Quick start guide
- Feature tutorials
- Troubleshooting guide
- FAQ

### Developer Documentation
- Architecture overview
- API reference
- Contributing guide
- Security guidelines (especially for PROJECT 3)
- Testing guide

### Safety Documentation (PROJECT 3)
- File operation best practices
- Permission model explanation
- Backup and recovery procedures
- Incident response plan

---

## 🎯 Next Immediate Steps

See `AUTOMATION_TASKS.md` for detailed automation priorities.

---

**Last Updated**: 2025-11-23  
**Current Focus**: PROJECT 1 - Automating backend integration  
**Next Milestone**: Complete PROJECT 1 v0.1.0, begin PROJECT 2 planning
