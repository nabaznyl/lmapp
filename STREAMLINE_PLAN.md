# 🚀 Streamlined v0.1.0 Plan - All Concerns Addressed

**Goal**: Deliver working chat in 3 days. All recommendations adopted.

---

## 📋 STREAMLINING DECISIONS MADE

### Scope Decisions ✅
| Decision | Chosen | Reason |
|----------|--------|--------|
| **Plan type** | Streamlined (3 days) | Focus, speed, MVP-only |
| **Chat history** | Session-only | Fast to implement, sufficient for v0.1 |
| **Configuration** | Env vars + defaults | Simple, no YAML complexity |
| **Backend target** | Debian-only | Focused testing, easier to expand |
| **Chat style** | Synchronous first | Ship faster, add streaming in v0.2 |

### Red Flags Addressed ✅

#### ❌ RED FLAG 1: "Backend Not Actually Tested"
**Status**: ✅ FIXED  
**Action**: Task #1 = Manual backend testing before any chat code  
**What we'll test**:
```bash
lmapp status                    # Detect backends
lmapp install                   # Full install flow (manual approval)
lmapp status                    # Verify installation
python -c "from lmapp.backend.detector import BackendDetector; d = BackendDetector(); print(d.get_status())"
```
**When**: TODAY (before Task #2)  
**Time**: 30-45 min  
**Success Criteria**: Both Ollama and llamafile can be detected/installed/queried  

#### ❌ RED FLAG 2: "No Test Coverage At All"
**Status**: ✅ FIXED  
**Action**: Task #5 = Write tests as we code (not after)  
**Strategy**: 
- Create mock backend FIRST (enables tests without Ollama)
- Write test alongside each feature
- Target 80% coverage on chat.py + backend
**Files to create**:
- `tests/test_backends.py` - Mock + Ollama/llamafile wrappers
- `tests/test_chat.py` - Chat module
- `tests/test_cli.py` - CLI commands
**When**: During Tasks #2-4  
**Success Criteria**: All critical paths tested, pytest reports 80%+ coverage  

#### ❌ RED FLAG 3: "Config System Overcomplicated"
**Status**: ✅ FIXED  
**Action**: Defer YAML to v0.2, use env vars + code defaults now  
**Simple approach**:
```python
# config.py (simple)
BACKEND = os.getenv("LMAPP_BACKEND", "auto")  # auto|ollama|llamafile
MODEL = os.getenv("LMAPP_MODEL", "tinyllama")
TEMP = float(os.getenv("LMAPP_TEMP", "0.7"))
```
**When**: Task #6  
**Time**: 30 min  
**Benefit**: No schema validation, no migration complexity  

#### ❌ RED FLAG 4: "Chat Implementation Not Detailed"
**Status**: ✅ FIXED  
**Action**: Technical spec below (clear, simple, non-negotiable)  
**When**: NOW  

#### ❌ RED FLAG 5: "No Documentation for Users"
**Status**: ✅ FIXED  
**Action**: Task #7 = User guide + troubleshooting  
**When**: After chat works (Task #4)  

---

## 🎯 TECHNICAL SPECIFICATIONS

### Chat Core (chat.py)
**Purpose**: Manage conversation with a single LLM backend

**Methods**:
```python
class ChatSession:
    def __init__(self, backend: LLMBackend, model: str)
    def send_prompt(prompt: str) -> str  # Synchronous!
    def get_history() -> List[Dict]      # Session-only in memory
    def clear_history() -> None
```

**Constraints**:
- NO streaming (sync only)
- NO file I/O (memory only)
- NO context management (just send → receive)
- Simple error propagation

**Edge cases handled**:
- Backend dies → clear error message
- Model not found → suggest alternatives
- Token limit exceeded → truncate with warning
- Network timeout → retry 2x with backoff

---

### Chat UI (chat_ui.py)
**Purpose**: Interactive terminal interface

**Commands**:
```
User:> hello                    # Send prompt
AI:> response                   # Get response
User:> /history                 # Show session history
User:> /clear                   # Clear history
User:> /help                    # Show commands
User:> /exit                    # Quit
```

**UX Principles**:
- Clear visual separation (User: vs AI:)
- Always show "thinking..." while waiting
- Error messages are actionable
- Simple prompt (just "User:>")

**No features**:
- No markdown rendering
- No syntax highlighting
- No image support
- No persistence

---

### CLI Integration (cli.py)
**Current**:
```bash
@click.command()
def chat():
    """Start interactive chat session."""
    # STUB - needs implementation
    pass
```

**New**:
```bash
@click.command()
@click.option('--model', default=None, help='Model to use')
def chat(model):
    """Start interactive chat session."""
    detector = BackendDetector()
    backend = detector.get_best_available()
    
    if not backend.is_running():
        click.echo(f"❌ {backend.name} not running. Run 'lmapp install' first.")
        raise SystemExit(1)
    
    session = ChatSession(backend, model or 'tinyllama')
    launch_chat_ui(session)
```

**Error handling**:
- No backend available → suggest `lmapp install`
- Wrong model → list available models
- Timeout → retry or suggest manual intervention

---

## 📊 Configuration: Environment Variables

**File**: Already handled in code (no new file needed)

**Variables**:
```bash
export LMAPP_BACKEND=ollama          # auto|ollama|llamafile
export LMAPP_MODEL=tinyllama         # model name
export LMAPP_TEMP=0.7                # temperature 0-1
export LMAPP_DEBUG=0                 # 0|1 for verbose logging
```

**Defaults** (in code):
```python
BACKEND = "auto"        # Try Ollama first, fall back to llamafile
MODEL = "tinyllama"     # Safe default for all systems
TEMP = 0.7              # Standard LLM temperature
DEBUG = False
```

**Why simple**:
- No config file parsing
- No schema validation
- No migration issues
- Just os.getenv()
- Easy to extend to YAML in v0.2

---

## 🧪 Testing Strategy

### Phase 1: Mock Backend (30 min)
Create `src/lmapp/backend/mock.py`:
```python
class MockBackend(LLMBackend):
    def is_installed(self) -> bool: return True
    def get_version(self) -> str: return "1.0.0-mock"
    def is_running(self) -> bool: return True
    def chat(self, prompt: str) -> str:
        return f"Mock response to: {prompt[:50]}"
    # ... other methods return sensible defaults
```

**Why first**:
- Enables unit tests without Ollama installed
- Fast test feedback loop
- Safe for CI/CD

### Phase 2: Unit Tests (as we code)
```
tests/
├── conftest.py          # pytest fixtures
├── test_backends.py     # Mock, Ollama, llamafile
├── test_chat.py         # ChatSession class
├── test_chat_ui.py      # UI command parsing
└── test_cli.py          # CLI command integration
```

**Coverage targets**:
- Backends: 80%+ (all public methods)
- Chat: 90%+ (critical path)
- UI: 60%+ (mostly manual testing)
- CLI: 70%+ (command routing)

### Phase 3: Integration Testing (manual)
```bash
# On fresh Debian VM:
lmapp status            # Detect backends
lmapp install           # Full install flow
lmapp chat              # Actually chat
/history                # Show history
/exit                   # Clean exit
```

---

## 🎯 Error Message Strategy

**Principle**: Every error must be actionable

**Bad example**:
```
Error: Connection refused
```

**Good example**:
```
❌ Ollama is not running.

Options:
  1. Start Ollama manually: ollama serve
  2. Use llamafile instead: lmapp --backend llamafile
  3. Install Ollama: lmapp install --backend ollama

Need help? Run: lmapp --help
```

**Where to implement**:
- Backend errors → wrapped in try/catch with context
- Chat errors → suggest model reload or backend restart
- UI errors → clear guidance on next steps

---

## 📈 Realistic Timeline

| Task | Time | Days | Cumulative |
|------|------|------|-----------|
| Test backend | 45 min | Day 1 | 0.75 days |
| Chat core (chat.py) | 1.5 hr | Day 1-2 | 1.5 days |
| Chat UI (chat_ui.py) | 1.5 hr | Day 2 | 2 days |
| CLI integration | 30 min | Day 2-3 | 2.5 days |
| Unit tests | 2 hr | Day 3 | 3.33 days |
| Config + error handling | 1 hr | Day 3 | 3.67 days |
| Documentation | 1.5 hr | Day 3-4 | 4.25 days |
| **TOTAL** | **~8.5 hr** | **~4 days** | |

**Realistic** (accounting for breaks, debugging): **3-4 days** ✅

---

## ✅ CRITICAL CHECKLIST

Before starting chat implementation, verify ALL of these:

### ✅ Backend Testing
- [ ] `lmapp status` shows backend options
- [ ] `lmapp install` runs without errors
- [ ] Backend is detected as installed
- [ ] Can query models list
- [ ] Can send a simple prompt and get response

### ✅ Code Quality
- [ ] Black formatter passes
- [ ] Flake8 linter passes
- [ ] Type hints on all public methods
- [ ] Docstrings on public methods
- [ ] No TODO comments left behind

### ✅ Error Handling
- [ ] Every exception caught and re-raised with context
- [ ] No bare `except` clauses
- [ ] Error messages are actionable (suggest fixes)
- [ ] Timeouts have reasonable limits (e.g., 30s)

### ✅ Testing
- [ ] Mock backend created and working
- [ ] Unit tests for chat core
- [ ] Unit tests for UI parsing
- [ ] At least 80% coverage on chat.py
- [ ] All tests pass locally

### ✅ Documentation
- [ ] README updated with chat usage
- [ ] QUICKSTART.md has chat example
- [ ] /help command shows available commands
- [ ] Troubleshooting guide updated

### ✅ CLI Integration
- [ ] `lmapp chat` command exists
- [ ] Works end-to-end without crashes
- [ ] Shows clear error if backend unavailable
- [ ] /exit command quits cleanly

---

## 🚀 IMPLEMENTATION ORDER

**Non-negotiable sequence**:

1. ✅ **Test backend** (TODAY) - 45 min
   - Verify Ollama + llamafile work
   - Document any issues found
   
2. ✅ **Mock backend** (TOMORROW) - 30 min
   - Enable tests without real backends
   
3. ✅ **Chat core** (TOMORROW) - 1.5 hr
   - Simple sync chat, error handling
   - Parallel: start writing tests
   
4. ✅ **Chat UI** (DAY 2) - 1.5 hr
   - Interactive terminal, command parsing
   - Parallel: write UI tests
   
5. ✅ **CLI integration** (DAY 2) - 30 min
   - Wire chat_ui into cli.py
   
6. ✅ **Config + errors** (DAY 3) - 1 hr
   - Env vars, clear error messages
   
7. ✅ **Documentation** (DAY 3) - 1.5 hr
   - User guide, troubleshooting, examples
   
8. ✅ **Final testing** (DAY 3-4) - 1 hr
   - Manual end-to-end on clean system
   - Fix any issues found

---

## 🛡️ RISK MITIGATION

| Risk | Mitigation | Owner |
|------|-----------|-------|
| Backend doesn't install | Test NOW (Task 1), debug before chat | Dev |
| Chat is too complex | Keep it simple (sync, no streaming) | Dev |
| Tests take too long | Mock backend first, parallel testing | Dev |
| User confusion | Clear error messages, good docs | Dev |
| Scope creep | Strict adherence to 8-item todo | Dev |
| Time overrun | Strict time-boxing, cut features if needed | Dev |

---

## ✨ DECISIONS FINALIZED

✅ **Scope**: Chat only for v0.1 (no history, no config, no shell, no packaging)  
✅ **Timeline**: 3-4 days realistic (8.5 hours active dev)  
✅ **Configuration**: Simple env vars + code defaults  
✅ **Chat history**: Session-only (memory, no persistence)  
✅ **Chat style**: Synchronous (no streaming)  
✅ **Platform**: Debian-only  
✅ **Testing**: Mock backend first, TDD-style  
✅ **Quality**: Black + Flake8 + 80%+ coverage + clear errors  
✅ **Documentation**: User guide + troubleshooting  

---

**Status**: All concerns addressed ✅  
**Readiness**: Ready to proceed ✅  
**Next step**: Begin Task #1 (backend testing) ✅
