# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## Unreleased

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

