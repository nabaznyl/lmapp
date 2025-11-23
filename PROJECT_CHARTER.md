# Project lmapp - Charter & Vision

**Codename**: lmapp  
**Status**: Foundation Phase  
**Target Platform**: Debian-based Linux (initial release)  
**License**: MIT (project) + compliance with all dependencies

---

## Vision Statement

Create a downloadable, consumer-friendly application that automatically installs, configures, and runs local LLM models with minimal user interaction. The app provides a simple alphabetic multiple-choice interface for all user decisions.

---

## Core Principles

1. **Automation First**: Minimize user configuration and technical knowledge requirements
2. **Transparency**: Clear communication about downloads, permissions, and processes
3. **Privacy**: Local-first processing, no cloud dependencies by default
4. **Simplicity**: TUI-based alphabetic menus (A/B/C options)
5. **Fail-Safe**: Robust error handling with bash + python fallbacks
6. **Professional**: Industry-standard disclaimers, licensing, compliance

---

## Technical Stack

### Primary Technologies
- **Language**: Python 3.8+ (primary), Bash (bootstrap/failsafe)
- **LLM Backends**: Ollama (managed) + llamafile (portable)
- **CLI Tools**: shell_gpt, gpt-cli (OpenAI-compatible clients)
- **UI Framework**: Python TUI (inquirer/curses/rich) → GUI (future: Textual/PyQt)

### Target Platform
- **Phase 1**: Debian/Ubuntu/Linux Mint (APT-based distros)
- **Future**: Fedora/RHEL, macOS, Windows, Android/Termux

---

## Key Features

### v0.1.0 (MVP)
- [x] Automated dependency detection and installation
- [x] Platform detection (Debian focus)
- [x] RAM/storage validation
- [x] Backend selection (Ollama vs llamafile)
- [x] Small model auto-selection (<4GB RAM devices)
- [x] TUI alphabetic menu system
- [x] User agreement/disclaimer flow
- [x] Shell customization options (bash-it, Oh My Zsh)

### v0.2.0 (Enhanced)
- [ ] Larger model support (8GB+ RAM)
- [ ] Multiple model management
- [ ] Custom endpoint configuration
- [ ] Export/backup conversations
- [ ] Advanced shell integration

### Future Considerations
- [ ] Android/Termux auto-dependency installer
- [ ] GUI option for non-terminal users
- [ ] Cloud model fallback (optional)
- [ ] RAG (retrieval-augmented generation) features
- [ ] Multi-platform packaging (.deb, .rpm, .dmg, .exe)

---

## Architecture Overview

```
lmapp/
├── installer/          # Platform detection, dependency installation
├── backend/            # Ollama/llamafile wrappers and management
├── ui/                 # TUI menus, user interaction flows
├── models/             # Model download, selection, validation
├── shells/             # bash-it, Oh My Zsh integration scripts
├── templates/          # Legal docs, agreements, configs
├── tests/              # Automated testing suite
├── docs/               # User guides, API docs, troubleshooting
└── assets/             # Icons, logos, branding materials
```

---

## Compliance & Legal

### Licenses
- **Project Code**: MIT License
- **Dependencies**: GPL-3.0 (shell_gpt), MIT (Ollama), Apache 2.0 (llamafile)
- **Models**: Individual model licenses (Llama 2, Mistral, etc.)

### Required Disclosures
- End-User License Agreement (EULA)
- Privacy Policy (local processing emphasis)
- Third-Party Licenses compilation
- Export control compliance
- No warranty/liability disclaimers

### Risk Mitigation
- Pre-install user agreement with explicit consent
- Clear RAM/storage warnings before downloads
- Background process notifications
- Port usage and permission disclosures
- Uninstall/cleanup scripts provided

---

## Success Metrics

1. **Installation Success Rate**: >95% on Debian-based systems
2. **User Interaction**: <5 user prompts for full setup
3. **Time to First Chat**: <10 minutes (including model download)
4. **Model Performance**: Usable on 4GB RAM devices
5. **User Satisfaction**: Clear error messages, helpful fallbacks

---

## Development Roadmap

### Phase 1: Foundation (Current)
- Project structure creation
- Core installer scripts (Python + Bash)
- Platform detection and validation
- User agreement templates
- Basic TUI menu system

### Phase 2: Backend Integration
- Ollama installation automation
- llamafile download and execution
- Backend health checks and failover
- Model download automation

### Phase 3: Shell & CLI Integration
- shell_gpt/gpt-cli configuration
- bash-it/Oh My Zsh optional installation
- Terminal customization flows

### Phase 4: Testing & Refinement
- Cross-distro testing (Ubuntu, Debian, Mint)
- Error handling and edge cases
- Documentation completion
- Package creation (.deb)

### Phase 5: Release & Distribution
- Version 0.1.0 release
- User testing and feedback
- Bug fixes and iteration

---

## Open Questions & Decisions

### Naming & Branding
- **Internal**: lmapp (confirmed)
- **Public**: TBD - suggestions: LocalMind, QuickLLM, TinyBrain, ChatBox
- **Logo**: Simple, memorable icon needed

### Default Behavior
- Default to Ollama or llamafile? (Suggest: try Ollama, fallback to llamafile)
- Default model for 4GB systems? (Suggest: Llama 2 3B or Phi-2)
- Auto-update models? (Suggest: prompt user with option)

### Shell Customization
- Make bash-it/Oh My Zsh optional or default?
- Provide minimal/standard/full installation modes?

---

## Notes & Considerations

- **Android Support**: Future feature - auto-install Termux, then bootstrap
- **Model Size**: 3B-7B models for 4GB systems, 13B+ for 8GB+
- **Fallback Strategy**: Always provide bash script alternatives for Python failures
- **Logging**: Verbose mode for debugging, quiet mode for consumers
- **Security**: Verify checksums for all downloads, use HTTPS exclusively

---

**Last Updated**: 2025-11-23  
**Project Lead**: [Your Name]  
**Status**: ✅ Charter Approved - Ready for Implementation
