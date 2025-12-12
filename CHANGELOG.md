# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Unreleased

---

## [0.3.4] - 2025-12-12

### Security
- **CSRF Protection**: Added host validation to `/admin/shutdown` endpoint to prevent unauthorized remote shutdowns.

### Changed
- **Performance**: Refactored `create_completion` and `health_check` endpoints to be non-blocking (synchronous functions run in threadpool), improving concurrency handling.
- **Dependencies**: Bumped version to 0.3.4.

---

## [0.3.3] - 2025-12-12

### Added
- **Server Dashboard**: New Web UI at `http://localhost:8000` with status indicators, version info, and a built-in Chat Terminal.
- **Server Management**: New CLI commands for robust server control:
  - `lmapp server start`: Starts the API server (checks for port conflicts).
  - `lmapp server stop`: Gracefully shuts down the running server.
  - `lmapp server list`: Shows active server PID and URL.
  - `lmapp server kill -a`: Forcefully kills all server instances.
- **Global `-y` Flag**: Added `-y` / `--yes` flag to skip confirmation prompts in CLI commands.
- **VS Code Extension**:
  - Added `Lmapp: Toggle Server` command.
  - Added `contextLines` configuration (default: 50).
  - Implemented debouncing (500ms) for inline completions to improve performance.

### Fixed
- **Dependency Issue**: Fixed `ModuleNotFoundError: No module named 'uvicorn'` by moving API dependencies to core requirements.
- **Port Conflicts**: Server now checks if port 8000 is in use before starting and provides helpful error messages.
- **CLI UX**: Removed "Roles & Workflows" prompt from utility commands (only shows in main menu/chat).
- **Config Show**: Fixed `AttributeError` in `lmapp config show` command.

## [0.3.2] - 2025-12-12

### Fixed
- **CLI Regression**: Fixed an issue where the "Roles & Workflows" setup prompt would block non-interactive sessions and automated tests.
- **Documentation**: Updated PyPI links in `README.md` to use absolute URLs for better compatibility.

## [0.3.1] - 2025-12-12

### Changed
- **Roles & Workflows**: Renamed "Calibrations" feature to "Roles & Workflows" for clarity.
- **Documentation**: Renamed `ROLE_QUICKSTART.md` to `ROLE_WORKFLOW_QUICKSTART.md`.
- **UI**: Updated Main Menu and CLI prompts to use "Roles & Workflows" terminology.

### Added
- **Workflow Manager**: New `WorkflowManager` class to handle user preference persistence (`workflow_rules.json`).
- **Architect Role**: Added "Architect" system prompt role with specific communication protocols (Ask First).

---

## [0.3.0-beta] - 2025-12-11 (PHASE 1 COMPLETE ✅)

### Added

- **Menu UI Polish** (Task 1):
  - Enhanced display with clear branding ("LMAPP - Local LLM Chat")
  - Visual hierarchy with console.clear() and formatted header
  - Version display in main menu
  - Advanced/Beginner mode indicator prominently shown
  - Improved menu options with visual separators by category:
    - [Chat] - Start Chat
    - [Explore & Manage] - Plugins, Models, API
    - [Configure] - Settings, Dev Tools
    - [Help & Info] - Help, About

- **First-Run Wizard** (Task 2):
  - Interactive setup wizard for first-time users
  - Hardware detection: RAM, CPU cores, available memory
  - Smart model recommendation based on system specs:
    - <2GB RAM: qwen2.5:0.5b (370MB)
    - 2-4GB RAM: llama3.2:1b (950MB)
    - 4-8GB RAM: llama3.2:3b (1.9GB)
    - 8GB+ RAM: mistral (4GB)
  - Optional model download during setup
  - Persistent setup completion flag in config
  - User-friendly welcome, recommendation, and completion screens

- **Plugin System Integration** (Task 3):
  - Real plugin discovery with actual plugin loading
  - Beginner mode: Categorized plugin discovery with descriptions
  - Advanced mode: Full plugin management with version info and status
  - Plugin execution with metadata display and error handling
  - Integration with existing PluginManager for consistency

- **Comprehensive Test Suites** (Task 4 & 5):
  - REST API test suite (35 tests covering 17+ endpoints):
    - Chat, models, sessions, configuration, plugins, system endpoints
    - Error handling, response format validation, performance tests
    - Integration workflows
  - First-Run Wizard test suite (21 tests):
    - Hardware detection validation
    - Model recommendation logic (5 RAM tiers, boundaries, edge cases)
    - Config integration and completed_setup flag handling
    - BackendDetector initialization and integration

### Changed

- **Config Management**:
  - Added `completed_setup: bool` field to track first-run wizard completion
  - Persists setup state across sessions

- **Menu System**:
  - Rewrote `_manage_plugins_beginner()` with real plugin discovery
  - Rewrote `_manage_plugins_advanced()` with full management capabilities
  - Added `_execute_plugin()` method with error isolation
  - Enhanced `display()` method with visual improvements
  - Enhanced `show_about()` method with hardware info panel

### Test Coverage

- **New Tests**: 56 tests added (35 API + 21 First-Run Wizard)
- **Total Tests**: 587 passing, 2 skipped
- **Test Coverage**: 55% overall code coverage
- **Key Modules Tested**:
  - REST API endpoints: 17+ endpoints, 30+ scenarios
  - First-Run Wizard: Hardware detection, model recommendation, config integration
  - Menu system: Plugin discovery and execution
  - Backend integration: Configuration, detector

### Fixed

- Fixed import paths in test files (tests.mock_backend)
- Fixed BackendInfo type assertions in API tests
- Enhanced hardware detection with proper console output suppression in tests

### Performance

- Menu display improvements maintain <50ms startup overhead
- Hardware detection: <200ms execution time
- Model recommendation: <10ms lookup time

### Commits This Phase

- ce133d8: feat(ui): Enhance menu display with visual hierarchy, hardware info, separators
- 7e63a2f: feat(ux): Implement First-Run Wizard with hardware detection
- 625dc9c: feat(plugins): Integrate real plugin system into menu UI
- c44c7b4: test(api): Create comprehensive REST API test suite (17+ endpoints, 35 tests)
- 35cb97e: test(ux): Add comprehensive First-Run Wizard test suite (21 tests)

### Notes

- Phase 1 (Tasks 1-6) completed in ~3 hours (ahead of 12-hour estimate)
- All code maintains 100% backward compatibility with v0.2.6
- Ready for v0.3.0-beta public testing and community feedback
- Phase 2 starts with Advanced Mode testing and plugin ecosystem expansion

---

## [0.2.6] - 2025-12-11 (RELEASED ✅)

### Added
- **Web UI - Self-Hosted Interface** (FastAPI + HTML/CSS/JavaScript):
  - Modern GitHub Copilot-inspired dark theme
  - Single-page application with tab-based navigation
  - 400+ lines of CSS for responsive design
  - 350+ lines of modular JavaScript (utils, chat, plugins, app modules)
  - Pre-formatted for 29 integration tests (100% passing)

- **FastAPI Backend Server** (`web.server` module, 360 LOC):
  - REST API for chat, documents, models, plugins
  - WebSocket endpoint for streaming chat responses
  - Static file serving for HTML/CSS/JavaScript
  - Error handling with proper HTTP status codes
  - CORS middleware for localhost development
  - Comprehensive API endpoints:
    - `/api/health` - Health check
    - `/api/status` - System status and statistics
    - `/api/models` - Available LLM models
    - `/api/chat` - Non-streaming chat
    - `/api/documents/*` - Document management
    - `/api/plugins/*` - Plugin discovery and management
    - `/ws/chat` - WebSocket streaming chat

- **Frontend Application** (950+ LOC across 5 files):
  - **index.html** (200 LOC): Layout with sidebar navigation, tabs, modals
  - **style.css** (550 LOC): Dark theme with GitHub Copilot inspiration, responsive design
  - **utils.js** (250 LOC): API client, WebSocket client, DOM helpers, storage, notifications
  - **chat.js** (220 LOC): Chat manager with message history, streaming responses, WebSocket
  - **plugins.js** (180 LOC): Plugin manager and document manager with file upload
  - **app.js** (150 LOC): Main application initialization, tab management, settings

- **Advanced Features**:
  - Streaming chat responses via WebSocket with token-by-token display
  - Document upload and management for RAG
  - Plugin discovery and one-click installation
  - Auto-saving chat history to localStorage
  - Keyboard shortcuts (Enter to send, Shift+Enter for new line)
  - Dark theme with smooth animations and transitions
  - Desktop notifications support
  - Chat export to JSON
  - System information display (version, message count, document count)

- **Production Plugins - Phase 2A** (5 plugins total in v0.2.6):
  - **Plugin 4: Code Refactoring Assistant** (350 LOC, 22 tests):
    - Static code analysis with AST-based pattern detection
    - Dead code detection, naming convention validation
    - Cyclomatic complexity calculation
    - Issue severity levels (low, medium, high, critical)
  - **Plugin 5: Knowledge Base Builder** (380 LOC, 28 tests):
    - Auto-tagging from hashtags and concepts
    - Query expansion with synonym mappings
    - Related entry detection
    - Multi-format export (JSON, Markdown)
    - Importance rating system (1-10)

### Improved
- Test coverage expanded to **531 total tests** (272 v0.2.4 + 100 v0.2.5 + 79 v0.2.6)
  - 29 Web UI backend tests (all passing)
  - 50 new plugin tests (Plugins 4-5)
  - Zero regressions from previous versions
- Architecture proven scalable with 5 production plugins
- User experience enhanced with self-hosted web interface
- Plugin ecosystem now features production-ready examples

### Performance
- Web UI loads in <1s on localhost
- API endpoints respond in <50ms
- WebSocket streaming enables real-time chat
- Frontend uses localStorage for instant chat history
- Modular JavaScript for code splitting and efficiency

---

## [0.2.5] - 2025-12-11

### Added
- **Plugin Marketplace System** (`plugins.plugin_marketplace` module):
  - Central registry for discovering and managing plugins
  - Plugin metadata validation (name, version, author, compatibility)
  - Plugin certification workflow (core-reviewed, verified, community)
  - Integration hooks for marketplace services
  - 271 lines of production code, fully tested

- **Example Production Plugins** (5 plugins, 1,520+ LOC, 100 tests):
  - **Translator Plugin**: Multi-language translation with caching (370 LOC, 27 tests)
  - **Code Analyzer Plugin**: Static code analysis and pattern detection (440 LOC, 28 tests)
  - **Git Flow Helper**: Branch automation and workflow management (380 LOC, 20 tests)
  - **Summarizer Plugin**: Text summarization and content condensing (130 LOC, 12 tests)
  - **Q&A Bot Plugin**: Document-based question answering (200 LOC, 12 tests)

- **Plugin Developer Guide** (700+ lines):
  - Architecture overview and design patterns
  - Step-by-step plugin creation tutorial
  - Testing and validation guidelines
  - Certification and publishing workflows
  - Best practices and performance optimization tips

### Improved
- Test coverage expanded to 372 total tests (272 v0.2.4 + 100 v0.2.5)
- Plugin ecosystem foundation fully documented
- Developer experience enhanced with examples and guides

---

## [0.2.4] - 2025-12-11

### Added
- **Retrieval-Augmented Generation (RAG) System** (`rag.rag_system` module):
  - `Document` class for storing indexed content with metadata and timestamps
  - `SearchResult` class for ranking search results with relevance scores
  - `SimpleVectorizer` for semantic similarity calculation (Jaccard-based, no ML libraries)
  - `DocumentIndex` for persistent document storage and retrieval
  - `RAGSystem` high-level interface for file/directory indexing and context injection
  - Automatic file format detection (txt, py, json, md, html, etc.)
  - Full-text search without external dependencies
  - Context extraction for LLM prompt injection
  - 16 comprehensive tests for RAG functionality (100% passing)

- **Plugin System** (`plugins.plugin_manager` module):
  - `PluginMetadata` for plugin registration and versioning
  - `BasePlugin` abstract class for extensible plugin architecture
  - `PluginManager` for discovery, loading, lifecycle management
  - Plugin error isolation and safe execution
  - CLI command registration from plugins
  - Plugin statistics and listing
  - 6 comprehensive tests for plugin functionality (100% passing)

- **Batch Processing** (`batch.batch_processor` module):
  - `BatchInput` for input items with metadata support
  - `BatchResult` for tracking individual results with error handling
  - `BatchJob` for managing batch collections with status tracking
  - `BatchProcessor` for job management and parallel processing
  - Multiple output formats: JSON, JSONL, CSV, text
  - Progress callbacks during batch processing
  - Input loading from files (JSON, JSONL, text)
  - Result persistence and job statistics
  - 11 comprehensive tests for batch functionality (100% passing)

- **Integration Tests**:
  - RAG + Batch Processing integration test
  - 33 new tests total for v0.2.4 advanced features

### Changed
- Updated all config files to version 0.2.4-dev
- Test suite expanded to 272 total tests (33 new v0.2.4 tests)

### Test Coverage
- **Previous (v0.2.3):** 239/239 tests passing
- **Current (v0.2.4):** 272/272 tests passing (+33 new tests)
- All new modules: 100% test coverage

---

## [0.2.3] - 2025-12-11

### Added
- **Conversation Sessions** (`core.sessions` module):
  - `Session` class for managing multi-turn conversations with full history
  - `SessionManager` for creating, loading, and managing session files (~/.lmapp/sessions/)
  - Message storage with timestamps and metadata tracking
  - Session context retrieval for LLM API integration
  - Automatic session cleanup for sessions older than 30 days (configurable)
  - Complete session serialization/deserialization with JSON storage
  - 14 comprehensive tests for session management (100% passing)

- **Custom System Prompts** (`core.system_prompts` module):
  - `SystemPromptManager` for managing system prompts with multiple roles
  - Default prompts for different contexts: default, code, analysis, creative
  - User-customizable system prompts stored in ~/.lmapp/system_prompt.txt
  - Per-role prompt retrieval with fallback to defaults
  - 5 comprehensive tests for prompt management (100% passing)

- **Enhanced Error Messages** (`utils.enhanced_errors` module):
  - `HelpfulError` class with detailed error information and suggestions
  - `ErrorMessageLibrary` with 8 common error patterns (model not found, out of memory, GPU errors, etc.)
  - `ErrorContextExtractor` to automatically extract context from error messages
  - User-friendly error formatting with actionable suggestions
  - Error severity levels (INFO, WARNING, ERROR, CRITICAL)
  - 9 comprehensive tests for error handling (100% passing)

- **Command Aliases** (`utils.command_aliases` module):
  - `CommandAliasManager` for managing command shortcuts
  - 27 built-in aliases for faster workflow (e.g., `c` → `chat`, `m` → `models`)
  - Custom alias support with persistent storage in ~/.lmapp/aliases.json
  - Alias resolution with argument handling
  - 9 comprehensive tests for alias management (100% passing)

- **Test Suite**:
  - 37 new tests in `test_v023_features.py` (100% passing)
  - Total test count: 239 passing (up from 202 in v0.2.2)
  - 100% test pass rate maintained
  - Tests include message handling, sessions, prompts, errors, aliases, and integration tests

### Changed
- README updated with v0.2.3 features and examples
- Version bumped to 0.2.3-dev
- Enhanced documentation with new feature examples

### Performance
- Session context retrieval: <5ms for typical conversations
- Alias resolution: <1ms per command
- Error message formatting: <2ms per error

---

## [0.2.1] - 2025-12-10

### Changed
- Version bumped to 0.2.1 (following 0.2.1-0.2.9 stepping before 0.3.0)

### Removed
- Internal roadmap/documentation files from public repo (cleaned for public distribution)

---

## [0.2.0] - 2025-12-10

### Added
- **Backend Integration - Ollama Support**:
  - Full Ollama backend implementation with automatic detection
  - Real-time service status monitoring and health checks
  - Model listing and chat functionality
  - Backend detector automatically selects best available backend
  - Integration tests for Ollama backend (6 new tests)
  - Production-ready error recovery and fallback strategies

- **Test Suite Improvements**:
  - Removed mock backend from production code (now test-only)
  - Added comprehensive Ollama integration tests
  - All 140 tests passing (134 unit + 6 integration)
  - Mock backend properly isolated in test directory

### Changed
- **Backend Architecture**:
  - Cleaned up backend detector to exclude test mocks from production
  - Improved error handling in backend lifecycle operations
  - Enhanced backend status reporting with rich table display

### Fixed
- Mock backend no longer included in production builds
- Backend imports properly organized
- Error recovery module no longer depends on deleted mock backend

---

## [0.1.1] - Previous Release

### Added
- **Error Database & Fail-Safe System**:
  - New `ErrorDB` module (`src/lmapp/core/error_db.py`) to persist errors and suggest solutions.
  - Global exception handler in CLI to catch crashes and log them.
  - `lmapp errors` command to view error history and suggested fixes.
  - "Knowledge Base" of known issues (e.g., Ollama connection errors) with auto-suggestions.

- **Environment Automation Scripts**: Simplify setup and ensure correct venv usage

  - `scripts/bootstrap_dev_env.sh` - Automated virtualenv creation and dependency installation
  - `scripts/check_env.sh` - Verify correct .venv activation
  - `scripts/run_tests.sh` - Run tests with automatic venv management

- **Makefile Enhancements**: Integrated venv-aware targets
  - `make test` now uses venv wrapper for consistent testing
  - `make check` requires active .venv for static checks

### Changed
- **Code Quality Improvements**:
  - Applied black formatting to all 24 source files
  - Removed 20+ unused imports for cleaner codebase
  - Fixed 8 f-string placeholder issues
  - Cleaned 300+ lines of trailing whitespace
  - Split long URL for line-length compliance
  - Result: **0 flake8 errors** ✓

- **Type Safety**:
  - Added None guard checks in `backend/ollama.py`
  - Fixed return type annotations in `core/config.py`
  - Aligned method signatures across backend implementations
  - Result: **0 mypy errors** ✓

- **Documentation**:
  - Updated README with accurate code quality metrics
  - Enhanced CONTRIBUTING guide with automation scripts
  - Fixed version mismatch (all files now at 0.1.0)

### Fixed
- Test collection no longer fails with "ModuleNotFoundError: No module named 'src'"
  - Tests now use correct `lmapp.*` imports instead of `src.lmapp.*`
- GitHub Actions CI/CD now passes all checks
- Local and CI environments now consistent

---

## 🎉 v0.1.0 NOW AVAILABLE ON PyPI!

```bash
pip install lmapp
```

**Release Date:** November 23, 2025  
**Status:** ✅ Production Ready - Available on [PyPI](https://pypi.org/project/lmapp/)

---

## [0.1.0] - 2025-11-23

### Foundation Release: Production-Ready Local LLM Chat

**Major Focus**: Establishing a solid foundation with production-grade features, comprehensive error handling, and user-friendly documentation.

### Added

#### Core Features
- **Local LLM Integration**: Direct support for Ollama, llamafile, and mock backends
- **Chat System**: Interactive chat sessions with message history and statistics
- **Multi-Backend Support**: Automatic backend detection and selection with fallback strategies
- **Configuration Management**: Persistent, validated configuration with environment variable overrides
- **CLI Interface**: Complete command-line interface with subcommands and help system

#### Logging & Monitoring
- **Unified Logging System**: loguru-based logging with console and file output
- **Debug Mode**: Toggle debug mode via CLI flag or environment variable (LMAPP_DEBUG)
- **Log Files**: Automatic log rotation (10MB) and 7-day retention
- **Rich Formatting**: Color-coded console output with detailed context

#### Error Handling & Recovery
- **Retry Mechanism**: Automatic retry with exponential/linear/immediate backoff strategies
- **Fallback Strategy**: Graceful degradation to mock backend when primary unavailable
- **Health Checks**: Backend health verification with automatic recovery
- **Custom Exceptions**: Specialized exception types for different error scenarios
  - BackendError: General backend failures
  - ConnectionError: Connection-related issues
  - ModelNotFoundError: Missing model specifications
  - TimeoutError: Request timeout situations
- **Contextual Error Messages**: User-friendly error messages with recovery suggestions

#### Configuration Features
- **Type-Safe Config**: Pydantic V2 schema with full validation
- **Persistent Storage**: JSON-based configuration at `~/.config/lmapp/config.json`
- **Singleton Pattern**: Global configuration instance for application-wide access
- **Configuration Options**:
  - `backend`: Backend selection (auto|ollama|llamafile|mock)
  - `model`: Model name selection
  - `temperature`: Response creativity (0.0-1.0)
  - `debug`: Debug logging toggle
  - `timeout`: Request timeout (seconds)
  - `max_tokens`: Maximum response length (optional)

#### CLI Commands
- **`lmapp chat`**: Launch interactive chat session
- **`lmapp status`**: Display backend status and system info
- **`lmapp config show`**: Display current configuration
- **`lmapp config set <key> <value>`**: Update configuration with validation
- **`lmapp config reset`**: Reset to default configuration
- **`lmapp config validate`**: Validate current configuration
- **`lmapp --version`**: Display version information
- **`lmapp --debug`**: Enable debug mode

#### Documentation
- **README.md**: Updated with features, installation, and usage examples
- **Quick Start Guide**: 5-minute setup guide for new users
- **Configuration Guide**: Comprehensive configuration reference with examples
- **Troubleshooting Guide**: Common issues and solutions

### Technical Details

#### Architecture
- **Modular Design**: Separate concerns (backends, chat, config, logging, error recovery)
- **Type Hints**: Full type hints throughout codebase for better IDE support
- **async/await**: Async support for backend operations
- **Dependency Injection**: Configuration passed to components rather than globals

#### Testing
- **83 Unit Tests**: Comprehensive test coverage
  - 5 Backend tests
  - 5 Backend detector tests
  - 12 Chat session tests
  - 4 CLI basic tests
  - 18 CLI config tests
  - 13 Configuration tests
  - 21 Error recovery tests
- **100% Pass Rate**: All tests passing consistently
- **Integration Testing**: End-to-end feature validation

#### Dependencies
- **loguru**: Unified logging system
- **pydantic**: Type-safe configuration (V2)
- **click**: CLI framework
- **rich**: Terminal formatting
- **pytest**: Testing framework
- **pytest-asyncio**: Async test support

### Fixed
- Pydantic V2 compatibility issues (migrated from V1 patterns)
- Configuration validation on CLI set operations
- Test isolation and fixture management
- Error message formatting and context

### Changed
- Migrated to Pydantic V2 for better type safety and performance
- Enhanced error messages with recovery suggestions
- Improved logging integration throughout codebase
- Updated CLI interface for consistency

### Deprecated
- None (initial release)

### Removed
- None (initial release)

### Security
- Configuration file permissions (user-only read/write)
- Sensitive information handling in logs
- Input validation for all CLI commands
- Type-safe operations preventing injection attacks

---

## Release Notes for v0.1.0

### What's New in v0.1.0

This is the **foundation release** of lmapp, providing a solid base for local LLM interaction with production-grade features.

#### Key Achievements

1. **Production-Ready Core**
   - Robust backend management with automatic detection
   - Reliable chat system with full message history
   - Persistent configuration with validation

2. **Enterprise-Grade Error Handling**
   - Automatic retry with intelligent backoff
   - Graceful fallback strategies
   - Clear, actionable error messages

3. **Developer-Friendly Logging**
   - Comprehensive logging throughout codebase
   - Debug mode for troubleshooting
   - Persistent log files with rotation

4. **User-Focused Documentation**
   - Quick Start guide for immediate use
   - Configuration reference for customization
   - Troubleshooting guide for common issues

### Supported Backends

- **Ollama**: Full support for local Ollama instances
- **llamafile**: Built-in support for llamafile deployments
- **Mock**: Included mock backend for testing and fallback

### Getting Started

```bash
# Install lmapp
pip install -e .

# Quick start
lmapp chat

# View configuration
lmapp config show

# Customize settings
lmapp config set model llama2
lmapp config set temperature 0.8

# Enable debug mode
LMAPP_DEBUG=1 lmapp chat
```

### Breaking Changes

None (initial release)

### Migration Guide

N/A - Initial release with no previous version.

### Known Limitations

- Single-user configuration (per-user, not system-wide)
- Models must be pre-installed on backend
- No built-in model management (use backend's native tools)
- Chat UI is terminal-based (no GUI in v0.1.0)

### Future Roadmap

- **v0.2.0**: Configuration profiles and templates
- **v0.3.0**: Model management integration
- **v0.4.0**: Web UI interface
- **v0.5.0**: Multi-user support and cloud integration

### Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

### Support

- **Documentation**: See docs/ folder
- **Troubleshooting**: See TROUBLESHOOTING.md
- **Issues**: Report on GitHub

---

## Versions

- **[0.1.0]** - November 23, 2025 - Foundation Release (THIS RELEASE)

[Unreleased]: https://github.com/yourusername/lmapp/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/yourusername/lmapp/releases/tag/v0.1.0

