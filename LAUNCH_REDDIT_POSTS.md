# Reddit Launch Posts - lmapp v0.1.0

## Post 1: r/Python - Technical Focus

**Title:** `lmapp - Simple Local LLM CLI (Just Released on PyPI)`

**Content:**

Hi r/Python! 👋

I just published **lmapp** - a lightweight CLI for running local LLMs without complexity.

**The Problem:** Setting up local LLMs (Ollama, llamafile) is unnecessarily complicated for most people. They just want to chat with an AI model locally.

**The Solution:** `lmapp` is a pure Python CLI that:
- 🎯 Auto-detects available LLM backends (Ollama, llamafile, mock for testing)
- 💻 Works on macOS, Linux, Windows
- 📦 Single `pip install lmapp` → ready to go
- 🚀 No Docker, no heavy setup
- 🧪 100% test coverage, fully documented

**Install & Try:**
```bash
pip install lmapp
lmapp                    # Start interactive menu
lmapp status             # Check system
lmapp chat               # Chat with your local LLM
```

**Project Goals:**
- Phase 1 (Done): Solid foundation, CLI, system detection
- Phase 2 (In Progress): Ollama + llamafile integration
- Phase 3: Model management, shell integration, plugins

**GitHub:** https://github.com/nabaznyl/lmapp
**PyPI:** https://pypi.org/project/lmapp/

The code is open, contributions welcome. Looking for feedback from the community!

---

## Post 2: r/opensource - Community Focus

**Title:** `[LAUNCH] lmapp - Open Source Local LLM CLI (v0.1.0 on PyPI)`

**Content:**

Excited to announce the release of **lmapp** - an open-source CLI for local LLMs! 🚀

This is a community project focused on simplicity. No giant frameworks, no Docker requirements—just Python and a clean CLI.

**What's Included:**
- ✅ CLI built with Click & Rich (beautiful terminal UI)
- ✅ Auto-detection for LLM backends (Ollama, llamafile, etc.)
- ✅ 100% test coverage, full docs, Apache 2.0 license
- ✅ Cross-platform (macOS, Linux, Windows)
- ✅ GitHub Actions CI/CD + pre-commit automation
- ✅ Easy contribution setup with `make dev && make test`

**Current Status:**
- v0.1.0 live on PyPI (pip installable)
- Fully tested and documented
- Ready for contributors

**Roadmap:**
- Ollama integration (in progress)
- llamafile support (planned)
- Model management & shell integration (next phases)

**Getting Started:**
```bash
pip install lmapp          # or: pipx install lmapp (Debian/Ubuntu)
make dev                   # For contributors
```

**Links:**
- GitHub: https://github.com/nabaznyl/lmapp
- PyPI: https://pypi.org/project/lmapp/
- Docs: https://github.com/nabaznyl/lmapp/blob/main/README.md

We're looking for feedback, bug reports, and contributors!

What would YOU like to see in a local LLM CLI?

---

## Post 3: r/LocalLLM - Domain Focus

**Title:** `lmapp - Local LLM CLI Tool (Just Released - Simple & Pythonic)`

**Content:**

Hey r/LocalLLM! Just released **lmapp** - a Python CLI for running local LLMs with minimal friction.

**The Pitch:**
If you've struggled with complex Ollama/llamafile setups, this might be for you. `lmapp` abstracts away the complexity:

```bash
pip install lmapp
lmapp                      # Interactive menu
lmapp chat                 # Start chatting
```

**Backend Support:**
- ✅ Ollama (auto-detected)
- ✅ llamafile (auto-detected)
- 🔧 Mock backend (for testing/demo)

**What Makes It Different:**
- Single-file installation (pip or pipx)
- No Docker needed
- Smart backend fallback
- Beautiful terminal UI (Rich library)
- Fully documented & tested

**For Contributors:**
- 100% test coverage
- GitHub Actions CI/CD
- Pre-commit hooks (black, flake8, mypy, bandit)
- Easy setup: `git clone → make dev → make test`

**Current Limitations:**
- Ollama integration still in progress (beta)
- Single-turn chat (multi-turn planned)
- No model downloading yet (use Ollama/llamafile directly)

**Links:**
- GitHub: https://github.com/nabaznyl/lmapp
- PyPI: https://pypi.org/project/lmapp/

Looking for feedback from the local LLM community! What's your take—useful or overengineered? 😄

---

## Posting Strategy

**Timing:** Space out posts by 1-2 hours to avoid triggering anti-spam filters

**Subreddit Rules:**
1. **r/Python** - Follow self-promotion rules, focus on technical implementation
2. **r/opensource** - Emphasize openness, community, contributions
3. **r/LocalLLM** - Focus on backend integration and use cases

**Response Engagement:**
- Monitor comments for 2-3 hours after posting
- Answer technical questions promptly
- Take feedback constructively
- Link to CONTRIBUTING.md for interested contributors

**Key Points to Emphasize:**
- Simplicity over complexity
- Community-driven development
- Easy contribution path
- Real use case solving

---

## Follow-Up Actions After Posting

1. Monitor upvotes/engagement
2. Respond to all questions within 24 hours
3. Document common questions for FAQ
4. Create GitHub issues from suggestions
5. Plan v0.2.0 features based on feedback
