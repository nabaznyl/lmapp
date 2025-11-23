# Development TODO

## Phase 1: Foundation ✅ IN PROGRESS

### Core Structure
- [x] Project charter and documentation
- [x] Directory structure
- [x] License and legal documents (EULA, MODELS.md)
- [x] README and CONTRIBUTING guides
- [x] Python package setup (setup.py, requirements.txt)
- [x] Virtual environment setup
- [x] Basic CLI entry point
- [x] System check module
- [x] Main menu UI
- [x] Bootstrap installer script (Bash)

### Documentation
- [x] Installation guide (docs/installation.md)
- [ ] User guide (docs/user-guide.md)
- [ ] FAQ (docs/faq.md)
- [ ] Troubleshooting guide (docs/troubleshooting.md)
- [ ] Developer guide (docs/development.md)

---

## Phase 2: Backend Integration 🚧 NEXT

### Ollama Integration
- [ ] Ollama detection and validation
- [ ] Ollama installation automation
- [ ] Ollama service management (start/stop/status)
- [ ] Ollama model management (list/pull/remove)
- [ ] Ollama health checks

### llamafile Integration
- [ ] llamafile download automation
- [ ] llamafile execution wrapper
- [ ] llamafile model management
- [ ] llamafile health checks

### Backend Selection
- [ ] Auto-detect best backend for system
- [ ] User preference selection
- [ ] Failover between backends
- [ ] Configuration persistence

---

## Phase 3: Model Management 📦 PLANNED

- [ ] Model size calculator (based on RAM)
- [ ] Model recommendation engine
- [ ] Automated model download
- [ ] Download progress indicators
- [ ] Model verification (checksums)
- [ ] Model listing and info display
- [ ] Model removal/cleanup

---

## Phase 4: CLI Tool Integration 🔧 PLANNED

### shell_gpt
- [ ] shell_gpt installation
- [ ] Configuration for Ollama endpoint
- [ ] Configuration for llamafile endpoint
- [ ] Testing and validation

### gpt-cli
- [ ] gpt-cli installation (optional)
- [ ] Configuration
- [ ] Testing and validation

---

## Phase 5: Shell Customization 🎨 PLANNED

### bash-it
- [ ] bash-it installation script
- [ ] Theme selection menu
- [ ] Plugin selection menu

### Oh My Zsh
- [ ] Oh My Zsh installation script
- [ ] Theme selection menu
- [ ] Plugin selection menu

### Integration
- [ ] Optional vs required flow
- [ ] User preferences
- [ ] Configuration backup

---

## Phase 6: Chat Functionality 💬 PLANNED

- [ ] Chat session management
- [ ] Conversation history
- [ ] Multi-turn conversations
- [ ] Context management
- [ ] Export conversations
- [ ] Chat commands (/help, /clear, /exit, etc.)

---

## Phase 7: Configuration Management ⚙️ PLANNED

- [ ] Config file structure (YAML/JSON)
- [ ] Default config generation
- [ ] Config editor interface
- [ ] Backend selection persistence
- [ ] Model preference persistence
- [ ] CLI tool preference persistence
- [ ] Config validation
- [ ] Config migration (version updates)

---

## Phase 8: Testing & Quality 🧪 PLANNED

### Unit Tests
- [ ] System check tests
- [ ] Menu navigation tests
- [ ] Backend integration tests
- [ ] Model management tests
- [ ] Configuration tests

### Integration Tests
- [ ] End-to-end installation test
- [ ] Backend failover tests
- [ ] Model download tests
- [ ] Chat session tests

### Code Quality
- [ ] Linting (flake8)
- [ ] Formatting (black)
- [ ] Type checking (mypy)
- [ ] Code coverage >80%

---

## Phase 9: Packaging & Distribution 📦 PLANNED

- [ ] .deb package creation
- [ ] Automated build pipeline
- [ ] GitHub Actions CI/CD
- [ ] Release automation
- [ ] Version tagging
- [ ] Changelog generation

---

## Phase 10: Documentation Polish 📚 PLANNED

- [ ] Complete API documentation
- [ ] Architecture diagrams
- [ ] Sequence diagrams
- [ ] Video tutorials (optional)
- [ ] Screenshot gallery
- [ ] Comprehensive FAQ

---

## Future Enhancements 🚀 BACKLOG

### Multi-Platform
- [ ] Fedora/RHEL support (.rpm packages)
- [ ] macOS support
- [ ] Windows support (WSL2)
- [ ] Android/Termux support

### Advanced Features
- [ ] GUI option (Textual/PyQt)
- [ ] RAG (Retrieval-Augmented Generation)
- [ ] Multi-model support
- [ ] Custom prompt templates
- [ ] Cloud model fallback (OpenAI API)
- [ ] Plugin system
- [ ] WebUI interface

### Community
- [ ] Community model repository
- [ ] User-submitted configurations
- [ ] Plugin marketplace
- [ ] Discussion forum

---

## Known Issues 🐛

- None yet (development just started!)

---

## Questions & Decisions Needed ❓

1. Default backend: Ollama or llamafile?
2. Default model for 4GB systems?
3. Required vs optional shell customization?
4. GUI vs TUI priority?
5. Package naming convention?

---

**Last Updated**: 2025-11-23  
**Current Phase**: Phase 1 (Foundation)  
**Next Milestone**: Complete Phase 1, begin Backend Integration
