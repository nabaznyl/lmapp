# Multi-Language Architecture Strategy for lmapp

**Status:** Infrastructure Planning (Pre-v0.2.0)  
**Decision Date:** November 24, 2025  
**Next Review:** Post-v0.2.0 release (user feedback informed)

---

## Executive Summary

As lmapp grows from v0.1.0 (foundation) → v0.2.0 (backends) → v0.3.0+ (extensibility), we should strategically plan for multi-language support while maintaining a clean, maintainable core. This document outlines a **3-phase evolution strategy** that balances immediate practicality with long-term scalability.

**Key Principle:** Don't over-engineer early; let real user needs drive language decisions.

---

## Current State (v0.1.0)

**Architecture:**
- Single language: Python
- Single entry point: Click CLI
- Single target: Unix/Linux/macOS
- Single deployment: pip package

**Advantages:**
- ✅ Simple to maintain
- ✅ Fast iteration
- ✅ Rich Python ecosystem (Rich, Pydantic, etc.)
- ✅ Easy testing and debugging
- ✅ Good for CLI applications

**Limitations:**
- ⚠️ Performance ceiling (Python startup time, GIL constraints)
- ⚠️ Binary dependencies harder to bundle
- ⚠️ Browser/WASM support limited
- ⚠️ Desktop GUI harder (Electron/Tauri easier in JS)
- ⚠️ Mobile platforms (iOS/Android) not supported

---

## Phase 1: Python-First (v0.2.0 - v0.3.0)

**Duration:** 2-4 weeks (v0.2.0), then 1-2 weeks (v0.3.0)

### Strategy: Consolidate Python Core

Keep all implementation in Python. Focus on:

1. **Robust Backend Abstraction**
   ```python
   # Already done
   class BackendBase(ABC):
       @abstractmethod
       async def start() -> None
       @abstractmethod
       async def stop() -> None
       @abstractmethod
       async def chat(message: str, model: str) -> AsyncGenerator[str, None]
       # ...
   ```

2. **Interface Contracts for Future Bindings**
   - Define what backends must implement (JSON schema or Protocol)
   - Document expected lifecycle, error handling, recovery
   - Make MockBackend a full reference implementation

3. **Extensibility Points**
   - Plugin discovery mechanism (e.g., `lmapp/backends/` folder)
   - Configuration-driven backend selection
   - Namespace isolation for third-party plugins

### Advantages
- ✅ No architecture changes needed
- ✅ Fast feature development
- ✅ Single testing matrix
- ✅ Proven Python CLI patterns
- ✅ Community familiarity

### Limitations
- ⚠️ Performance not optimized for stream processing
- ⚠️ Browser/WASM not viable
- ⚠️ Desktop GUI requires separate wrapper

### When to Move Forward
- Real users ask for performance (benchmark results)
- Users request desktop GUI (Electron, Tauri)
- Users want browser-based chat UI

---

## Phase 2: Core + Plugins (v0.4.0)

**Duration:** 4-6 weeks (design in v0.3.0, implement in v0.4.0)

### Strategy: Establish Plugin Contracts, Allow External Backends

**Key Insight:** You don't need to implement Rust/Go yourself. Define interfaces that allow community contributors to build them.

### Backend Plugin System

**Architecture:**
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

**Plugin Discovery:**
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
  "methods": [
    "start",
    "stop", 
    "is_running",
    "chat",
    "list_models",
    "get_info"
  ],
  "execution": "subprocess|ffi|grpc",
  "platforms": ["linux", "macos", "windows"]
}
```

### Concrete Examples

**Example 1: Rust Stream Processor Plugin**
- Written in Rust, compiled to WASM or native binary
- Installed as: `lmapp backends install rust-tokenizer`
- Called via: Python subprocess or PyO3 FFI
- Used for: Real-time token counting, stream processing
- No changes needed to core lmapp code

**Example 2: Go Microservice Plugin**
- Written in Go, runs as separate HTTP service
- Installed as: Docker container or standalone binary
- Called via: Async HTTP requests
- Used for: Standalone API, horizontal scaling
- No changes needed to core lmapp code

**Example 3: Node.js Desktop App Plugin**
- Written in JavaScript, runs in Electron/Tauri
- Installed as: NPM package wrapping Python core
- Called via: Subprocess to Python CLI
- Used for: Native desktop GUI
- No changes needed to core lmapp code

### Advantages
- ✅ Core stays simple and maintainable
- ✅ Community can contribute backends in any language
- ✅ Each backend can use best-fit language
- ✅ Independent release cycles for plugins
- ✅ Scales to 50+ backends without core bloat

### Limitations
- ⚠️ Need to establish and maintain plugin contracts
- ⚠️ Version coordination more complex
- ⚠️ Plugin quality varies (community responsibility)

### When to Move Forward
- Core Python backends (Ollama, llamafile) are stable
- 5+ community requests for specific languages
- Clear use case for multi-language support

---

## Phase 3: Multi-Repo Strategy (v1.0+)

**Duration:** 6+ weeks (design, new repos, migration)

### Strategy: Separate Orgs/Repos for Each Major Backend

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

**Release Coordination:**
- Semantic versioning for core and each backend
- Interface versioning (v1.0, v1.1 compatible)
- GitHub CLI or script orchestrates multi-repo release

### Advantages
- ✅ Maximum flexibility
- ✅ Each team owns their backend
- ✅ Independent performance optimization
- ✅ Language-native best practices per repo
- ✅ Scales to enterprise adoption

### Limitations
- ⚠️ Significant maintenance overhead
- ⚠️ Version coordination complexity
- ⚠️ User experience fragmentation risk
- ⚠️ Only viable if 10+ active contributors

### When to Move Forward
- Project is mature (v1.0+)
- 10+ active contributors
- Enterprise customers need separate backends
- Community forks becoming popular

---

## Recommended Evolution Path

**v0.2.0 (Now - 4 weeks):** ✅
- Implement Ollama and llamafile as Python backends
- Establish `BackendBase` interface (already done)
- Document plugin expectations in ROADMAP

**v0.3.0 (6-8 weeks out):**
- Stabilize Python backends
- Design plugin system (Phase 2)
- Create backend interface specification
- Write plugin development guide

**v0.4.0 (3+ months out):**
- Release plugin system
- Accept first community backend proposals
- Support Rust, Go, or Node.js backend contributor

**v1.0+ (6+ months out):**
- Evaluate multi-repo strategy if community demand warrants

---

## Language Selection Rationale

### Why NOT Each Language Right Now

**C++** - Performance but complex, limited benefit for CLI apps
**Rust** - Excellent but adds build complexity, save for WASM (Phase 5)
**Go** - Great for microservices but not needed yet, defer to v0.4+
**Node.js** - Good for GUI, premature for headless CLI
**Java/C#** - Heavy, unnecessary overhead for this project

### Why Python First, Then Strategic Others

**Python (v0.2):**
- ✅ Fastest to iterate
- ✅ Ecosystem supports LLM work
- ✅ Easy for contributors to learn
- ✅ Small installation footprint (binary compatibility key)

**Rust (v0.4+):**
- ✅ WASM support for browser UI
- ✅ Stream processing performance
- ✅ Zero-cost abstractions
- ✅ Growing LLM ecosystem (Tokenizers library)

**Go (v0.4+, optional):**
- ✅ Lightweight, cross-platform
- ✅ Excellent for microservices/APIs
- ✅ Binary deployment simpler than Python
- ✅ If users need standalone HTTP service

**Node.js (v0.5+, if desktop needed):**
- ✅ Unified CLI + GUI codebase (Electron/Tauri)
- ✅ Browser compatibility
- ✅ WebAssembly integration point
- ✅ If desktop adoption is significant

---

## Infrastructure for Multi-Language Support

### Already Built (v0.1.0)
- ✅ Subprocess abstraction in `BackendBase`
- ✅ Async I/O via asyncio (ready for subprocess backends)
- ✅ JSON-based configuration (language-agnostic)
- ✅ Error handling and logging (extensible)

### Need to Add (v0.2-0.3)
- [ ] Plugin discovery mechanism (filesystem scan)
- [ ] Plugin registration in CLI (`lmapp backends list`)
- [ ] Plugin interface specification (JSON schema)
- [ ] Plugin installation helper (`lmapp backends install`)
- [ ] Multi-platform binary detection (Linux/macOS/Windows)
- [ ] Version compatibility checks

### Nice-to-Have (v0.4+)
- [ ] Plugin marketplace/registry
- [ ] Automated plugin testing in CI
- [ ] Plugin update mechanism
- [ ] Community feedback loop on plugins

---

## Decision Framework

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

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Too many languages fragments project | Strict plugin interface, deprecate slow language |
| Version hell (core + backends) | Semantic versioning, compatibility matrix docs |
| Unmaintained backends accumulate | Deprecation policy, community governance |
| Performance optimization needed later | Start with profiling, defer Rust until bottleneck proven |
| Users overwhelmed by choices | Clear recommendation ("Use Python backend unless you need X") |

---

## Success Metrics

**v0.2.0:**
- ✅ Python backends stable
- ✅ Interface contracts documented
- ✅ 100+ users

**v0.3.0:**
- ✅ Plugin system functional
- ✅ 3+ community backend proposals
- ✅ Documentation clear for plugin authors

**v0.4.0:**
- ✅ First non-Python backend published
- ✅ Plugin install/discovery working
- ✅ 500+ users

**v1.0+:**
- ✅ 5+ maintained backends
- ✅ Enterprise adoption path clear
- ✅ Multi-repo strategy if community warrants

---

## Conclusion

**Keep v0.2.0 focused on Python backends.** The infrastructure you have (BackendBase, subprocess abstraction, async I/O) is already future-proof. 

Don't add Rust/Go/Node.js now. Let real user needs drive those decisions in v0.4+. When they come, use the plugin system—let community contributors build them, not core team.

**This approach:**
- ✅ Ships v0.2.0 faster (2-4 weeks vs 4-6 weeks)
- ✅ Maintains code quality (no complexity debt)
- ✅ Scales with community (plugins, not forks)
- ✅ Maximizes learning (real users guide decisions)

---

## Questions for Review

1. **Does this strategy align with your v0.2.0 timeline?** (Recommend yes—Python only)
2. **When should plugin system launch?** (Recommend v0.3.0, not blocking v0.2.0)
3. **Which language would users most want first?** (After v0.2.0 launch, survey users)
4. **Should we pre-commit to supporting Language X?** (Recommend no—let demand decide)

