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

## Infrastructure Decisions & Multi-Language Strategy

### Evolution Path for Multi-Language Support

As lmapp grows from v0.1.0 (foundation) → v0.2.0 (backends) → v0.3.0+ (extensibility), we strategically plan for multi-language support while maintaining a clean, maintainable core. This follows a **3-phase evolution strategy** that balances immediate practicality with long-term scalability.

**Key Principle:** Don't over-engineer early; let real user needs drive language decisions.

#### Phase 1: Python-First (v0.2.0 - v0.3.0)

**Duration:** 2-4 weeks (v0.2.0), then 1-2 weeks (v0.3.0)

**Strategy:** Consolidate Python Core
- Implement Ollama and llamafile as Python backends
- Establish robust `BackendBase` interface (already done ✅)
- Design plugin system for future bindings
- Document plugin expectations and interface contracts

**Advantages:**
- ✅ No architecture changes needed
- ✅ Fast feature development
- ✅ Single testing matrix
- ✅ Proven Python CLI patterns
- ✅ Community familiarity

**When to Move Forward:**
- Real users ask for performance (benchmark results)
- Users request desktop GUI (Electron, Tauri)
- Users want browser-based chat UI

#### Phase 2: Core + Plugins (v0.4.0)

**Duration:** 4-6 weeks (design in v0.3.0, implement in v0.4.0)

**Strategy:** Establish Plugin Contracts, Allow External Backends

**Key Insight:** You don't need to implement Rust/Go yourself. Define interfaces that allow community contributors to build them.

**Backend Plugin System Architecture:**
```
lmapp/
├── core/                   # Core CLI, config, abstraction
├── backends/
│   ├── base.py            # Abstract interface
│   ├── mock.py            # Reference implementation (Python)
│   ├── ollama.py          # Python subprocess
│   ├── llamafile.py       # Python subprocess
│   └── plugins/           # Community backends (any language)
│       ├── rust-adapter/
│       ├── go-api/
│       └── node-cli/
└── specs/
    ├── backend-interface.json  # Plugin contract
    └── lifecycle.md             # Expected behavior
```

**Plugin Discovery Mechanism:**
1. Local plugins: `~/.lmapp/backends/` folder
2. Registered plugins: `lmapp backends install <name>`
3. Package plugins: PyPI packages with `lmapp_backend_*` naming convention

**Interface Contract (JSON):**
```json
{
  "name": "ollama",
  "version": "0.2.0",
  "language": "python",
  "interface_version": "1.0",
  "methods": ["start", "stop", "is_running", "chat", "list_models", "get_info"],
  "execution": "subprocess|ffi|grpc",
  "platforms": ["linux", "macos", "windows"]
}
```

**Example Plugins:**
- Rust stream processor (WASM support, performance)
- Go microservice (HTTP API, containerization)
- Node.js desktop app (Electron/Tauri, GUI)

**Advantages:**
- ✅ Core stays simple and maintainable
- ✅ Community can contribute backends in any language
- ✅ Each backend uses best-fit language
- ✅ Independent release cycles for plugins
- ✅ Scales to 50+ backends without core bloat

#### Phase 3: Multi-Repo Strategy (v1.0+)

**Duration:** 6+ weeks (design, new repos, migration)

**Strategy:** Separate Orgs/Repos for Each Major Backend

**Architecture:**
```
github.com/nabaznyl/
├── lmapp-core/              # Core CLI, config, interface specs
├── lmapp-backend-rust/      # Rust stream processor
├── lmapp-backend-go/        # Go HTTP API
├── lmapp-backend-node/      # Node.js desktop wrapper
├── lmapp-spec/              # Unified interface documentation
└── lmapp/                   # Metarepo (orchestrates releases)
```

**Advantages:**
- ✅ Maximum flexibility
- ✅ Each team owns their backend
- ✅ Independent performance optimization
- ✅ Language-native best practices per repo
- ✅ Scales to enterprise adoption

**Limitations:**
- ⚠️ Significant maintenance overhead
- ⚠️ Version coordination complexity
- ⚠️ Only viable if 10+ active contributors

### Language Selection Rationale

**Python (v0.2+):** ✅ Fastest to iterate, rich LLM ecosystem, easy for contributors

**Rust (v0.4+):** ✅ WASM support, stream processing performance, zero-cost abstractions, growing LLM ecosystem

**Go (v0.4+, optional):** ✅ Lightweight, cross-platform, excellent for microservices/APIs

**Node.js (v0.5+, if desktop):** ✅ Unified CLI + GUI codebase (Electron/Tauri), browser compatibility

### Recommended Evolution Path

- **v0.2.0 (Now - 4 weeks):** ✅ Implement Ollama and llamafile as Python backends
- **v0.3.0 (6-8 weeks):** Design plugin system, stabilize Python backends
- **v0.4.0 (3+ months):** Release plugin system, accept first community backends
- **v1.0+ (6+ months):** Evaluate multi-repo strategy if community demand warrants

### Decision Framework

**Should we add Language X to lmapp?**

Ask:
1. **Is Python too slow for this task?** (Yes → Consider Rust/Go)
2. **Do multiple users ask for it?** (No → Don't do it yet)
3. **Does it fit a clear phase?** (No → Defer to future phase)
4. **Can we do it via plugins?** (Yes → Prefer plugin)
5. **Do we have maintainers for it?** (No → Don't add)

**Example Decisions:**
- Rust tokenizer: ✅ Yes (performance, WASM, plugin)
- Go API: ⚠️ Maybe (nice but optional, defer to v0.4)
- Node.js GUI: ⚠️ Maybe (wait for GUI demand)
- Java backend: ❌ No (too heavy, no clear use case)

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
