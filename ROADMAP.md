# lmapp Roadmap

## Current Status

**v0.1.0** ✅ Released on PyPI  
- 128/128 tests passing
- 100% test coverage
- MIT-licensed, production-ready

---

## Phase 2: Backend Integration (v0.2.0)

**Status:** 🎯 Awaiting infrastructure decisions before implementation  
**Infrastructure-First Approach:** Establish extensible architecture before building backends

### Core Objectives
- Establish interface contracts for backend abstraction (✅ Complete: `BackendBase`)
- Design plugin/adapter pattern for future language bindings
- Implement Ollama as reference backend
- Build comprehensive test coverage for backend lifecycle

### Ollama Support
- [ ] Detect Ollama installation
- [ ] Execute Ollama service
- [ ] List available models
- [ ] Stream LLM responses in chat
- [ ] Implement error recovery and health checks

### llamafile Support
- [ ] Auto-download llamafile binary
- [ ] Execute and manage lifecycle
- [ ] Model selection and switching
- [ ] Platform-specific binary detection (Linux/macOS/Windows)

### Quality Gates & Automation
- [ ] All tests passing (target: ≥95% coverage for new features)
- [ ] Documented error scenarios and recovery paths
- [ ] Health checks and failover logic
- [ ] CI/CD pipeline validates all backends on each release
- [ ] Version automation triggers on tag creation

**Expected Duration:** 2-4 weeks (after infrastructure review)

### Release Checklist (Automated)
- [x] Version sync: `./scripts/sync-version.sh`
- [x] Pre-commit validation: `.git/hooks/pre-commit`
- [x] GitHub Actions validation: `.github/workflows/release-check.yml`
- [ ] Backend integration tests pass
- [ ] CHANGELOG updated
- [ ] Tag and publish triggered

---

## Phase 3: Chat & UX Improvements

- [ ] Multi-turn conversation history
- [ ] Model management CLI (`lmapp models list`, `lmapp models switch`)
- [ ] Chat export (Markdown, JSON)
- [ ] Configuration UI improvements

**Expected Duration:** 1-2 weeks

---

## Phase 4: Multi-Language Support & Extensibility (v0.3.0+)

### Python Backend (v0.1-0.2)
- [x] Core CLI and abstraction layer
- [x] Backend interface contracts
- [ ] Real LLM backends (Ollama, llamafile)

### Future Language Bindings (Phase 4+)

**Rust Backend Adapter** (Performance-critical operations)
- Rationale: WASM for browser-based chat UI (Phase 5)
- Use case: Stream processing, real-time tokenization
- Integration: Python→Rust FFI via PyO3 or subprocess

**Go Microservice** (Optional, deployment-focused)
- Rationale: Lightweight, cross-platform deployment
- Use case: Standalone HTTP API, Docker containerization
- Integration: Async subprocess calls or gRPC

**JavaScript/Node.js** (CLI alternative, future electron app)
- Rationale: Single codebase for CLI + GUI
- Use case: Native desktop app, browser extension
- Integration: Electron or Tauri wrapper around Python core

### Platform Integration
- [ ] Shell customization (bash, zsh, fish)
- [ ] Plugin system (architecture: JSON config + subprocess or FFI)
- [ ] Custom prompts and personas
- [ ] API for external tools
- [ ] Containerized deployment (Docker/Podman)

**Expected Duration:** 4+ weeks (design phase in v0.3.0, implementation v0.4.0+)

---

## Infrastructure Decisions (Awaiting Review)

### Multi-Language Strategy
**Question:** How should lmapp evolve to support multiple languages while maintaining a clean core?

**Options:**
1. **Python-First (Current):** Keep core in Python, add language bindings as optional modules
   - Pros: Simpler to maintain, faster iteration, ecosystem stability
   - Cons: Performance ceiling for some operations
   - Recommended path for v0.2-0.3

2. **Core + Plugins:** Establish strict interface contracts, allow community backends in any language
   - Pros: Extensible, decoupled, scalable
   - Cons: More complex architecture, version coordination
   - Recommended path for v0.4+

3. **Multi-Repo Strategy:** Separate language implementations, unified API contract
   - Pros: Maximum flexibility, independent release cycles
   - Cons: Significant overhead, fragmentation risk
   - Recommended path for v1.0+

**Recommendation:** Pursue **Option 1 → Option 2 → Option 3** as project matures

### Automation Opportunities
- **Version Sync:** Already automated via `scripts/sync-version.sh` ✅
- **Pre-Commit Validation:** Already automated via `.git/hooks/pre-commit` ✅
- **Release Validation:** Already automated via `.github/workflows/release-check.yml` ✅
- **CHANGELOG Generation:** (Planned) Auto-generate from commits using conventional-commits
- **Dependency Audit:** (Planned) Auto-run license compliance check on each release
- **Multi-Language CI:** (Future) Test backends in Python, Rust, Go, Node.js on each tag

---

## Community & Feedback Loop

- Gather user feedback from v0.1.0 launch
- Iterate based on real-world usage patterns
- Prioritize most-requested features
- Monitor GitHub issues for language/platform requests

---

## How to Contribute

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

For language binding discussions or infrastructure proposals, open an issue or discussion on GitHub.
