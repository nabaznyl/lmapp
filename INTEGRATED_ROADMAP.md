# Integrated Roadmap & Developer Guide

**Status:** Active Development
**Version:** 0.3.5
**Last Updated:** December 12, 2025

This document serves as the central source of truth for `lmapp` development, roadmap, and maintenance. It is intended for local development use.

---

## 1. Current Status (v0.3.5)

**Core Features:**
- **CLI:** Robust Click-based interface with Rich UI.
- **Backend:** Auto-detection and support for Ollama and llamafile.
- **API:** Lightweight FastAPI server (`lmapp serve`) for integrations.
- **Documentation:** Consolidated and version-aligned.
- **CI/CD:** GitHub Actions for testing, linting, and publishing.
- **Roles & Workflows:** Configurable behavior rules and "Architect" mode.
- **Error Recovery:** Failsafe ErrorDB and intelligent suggestions.

**Quality Metrics:**
- **Tests:** 100% pass rate (613 tests passing).
- **Coverage:** >80% target (Codecov configured).
- **Linting:** Flake8 + Black + MyPy enforced via UAFT.
- **Links:** Dead-link checking in CI.

---

## 2. Roadmap

### Phase 3: Ecosystem & Polish (Completed)
- [x] **Documentation Overhaul:** Consolidate to root and `docs/`.
- [x] **Version Alignment:** Unified `v0.3.5` across all files.
- [x] **CI Enhancements:** Codecov, Dead-link checks.
- [x] **Plugin System:** Community extensions enabled.
- [x] **Roles & Workflows:** "Architect" role and rule persistence.
- [x] **Hotfix v0.3.2:** Fixed CLI prompt blocking tests/automation.
- [x] **RAG Improvements:** Implemented Smart Chunking and cleaned up deprecations.
- [x] **Developer Experience:** Added `lmapp tests` and `lmapp src` aliases.
- [x] **PyPI Prep:** Fixed relative links for PyPI compatibility.
- [x] **Error Recovery:** Implemented ErrorDB and context-aware suggestions.
- [x] **UAFT Integration:** Full linting/testing orchestration.

### Phase 4: Advanced Capabilities (Next)
- **Plugin Marketplace:**
  - Centralized registry for plugins.
  - `lmapp plugin search/install` commands.
- **Advanced RAG:**
  - Persistent vector store (ChromaDB or FAISS).
  - Hybrid search (Keyword + Semantic).
  - Support for more document types (PDF, DOCX).
- **Agentic Workflow:**
  - Multi-step reasoning loops.
  - Autonomous tool usage (file editing, web search).
- **Performance:**
  - Async I/O optimization for RAG and Chat.
  - Startup time reduction (<100ms).

---

## 3. Developer Guide

### Setup
```bash
# Clone and setup
git clone <repo>
cd lmapp
pip install -e ".[dev]"

# Run tests
pytest tests/ -v

# Run linting
flake8 src/
black --check src/
```

### Release Process
1. **Update Version:** Bump version in `src/lmapp/__init__.py` and `setup.py`.
2. **Update Changelog:** Add entry to `CHANGELOG.md`.
3. **Tag:** Create a git tag (e.g., `v0.3.0`).
4. **Push:** `git push origin v0.3.0`.
5. **CI/CD:** GitHub Actions will build and publish to PyPI (requires `PYPI_API_TOKEN` secret).

### Maintenance
- **Dependencies:** Audit `requirements.txt` and `setup.py` regularly.
- **Documentation:** Keep `API_REFERENCE.md` and `README.md` in sync with code.
- **Tests:** Add tests for every new feature.

---

## 4. Troubleshooting & FAQ

**Q: How do I debug the CLI?**
A: Set `LMAPP_DEBUG=1` or use `lmapp --debug <command>`.

**Q: How do I add a new backend?**
A: Implement `BackendBase` in `src/lmapp/backend/` and register it in `BackendDetector`.

**Q: Where are logs?**
A: `~/.local/share/lmapp/logs/lmapp.log`.

---

## 5. Audit Summary (Dec 12, 2025)

- **Documentation:** Clean, consolidated, and accurate.
- **Code:** Modular, typed, and tested.
- **CI:** Robust with linting, testing, coverage, and link checking.
- **Security:** No secrets in code. PyPI publishing via OIDC/Secrets.
- **Status:** v0.3.2 Hotfix applied. All tests passing.

**Recommendation:** Monitor v0.3.2 release. Begin planning Phase 4.
