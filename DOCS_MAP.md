# lmapp Documentation Map

Quick reference for all active documentation files.

## 🚀 Getting Started
- **README.md** - Project overview, installation, quick start
- **QUICKSTART.md** - 5-minute guide to running lmapp
- **CONTRIBUTING.md** - How to contribute, development setup

## 📚 Documentation
- **DOCUMENTATION_INDEX.md** - Complete documentation index and structure
- **TROUBLESHOOTING.md** - Common issues and solutions
- **CHANGELOG.md** - Release history and changes

## 📋 Current Development
- **TODO.md** - Current work items and milestones
- **PROJECT_CHARTER.md** - Project vision and mission

## 🎯 Launch & Marketing
- **LAUNCH_STRATEGY.md** - Community launch overview and plan
- **LAUNCH_EXECUTION_LOG.md** - Daily launch execution tracking
- **LAUNCH_REDDIT_POSTS_FILTER_SAFE.md** - Reddit post templates
- **REDDIT_STRATEGY_FIX.md** - Strategic alternatives for Reddit
- **LAUNCH_DEVTO_ARTICLE.md** - Dev.to blog article
- **LAUNCH_SOCIAL_MEDIA.md** - Twitter/social media content

## 🛣️ Planning & Roadmap
- **INTEGRATED_ROADMAP.md** - Full roadmap and milestones

## 🧹 Maintenance
- **CLEANUP_PLAN.md** - Workspace cleanup and organization strategy

---

## 📦 Archived Documentation

Historical documentation from Phase 1 and development is in `/archive/`. See `archive/README.md` for details.

### Archive Contents Include:
- Phase 1 completion documents
- Task tracking files
- Development checkpoints
- Gap analysis and planning documents
- Legacy documentation

---

## 🗂️ Directory Structure

```
lmapp/
├── README.md                      # Start here
├── CONTRIBUTING.md                # Dev guidelines
├── TODO.md                         # Current work
├── CHANGELOG.md                    # Release history
│
├── src/lmapp/                      # Main source code
│   ├── backend/                    # Backend abstraction
│   ├── cli.py                      # CLI entry point
│   ├── ui/                         # Terminal UI
│   ├── core/                       # Core configuration
│   └── utils/                      # Utilities
│
├── tests/                          # Test suite (100% coverage)
├── docs/                           # Additional docs
├── scripts/                        # Build and utility scripts
│   └── cleanup.sh                  # Cleanup automation
│
├── archive/                        # Phase 1 docs (archived)
└── .github/
    └── copilot-instructions.md     # AI agent guidance
```

---

## 🎯 Quick Commands

### Development
```bash
cd lmapp
pytest tests/ -v                    # Run tests
black src/ tests/                   # Format code
flake8 src/                         # Lint check
LMAPP_DEBUG=1 python -m lmapp.cli   # Run with debug
```

### Cleanup
```bash
./scripts/cleanup.sh                # Clean cache
```

### Documentation
```bash
cat DOCUMENTATION_INDEX.md          # See all docs
cat INTEGRATED_ROADMAP.md           # View roadmap
```

---

## 📌 Key Files by Purpose

| Purpose | File |
|---------|------|
| **Start here** | README.md |
| **Installation** | README.md (Quick Start section) |
| **Development setup** | CONTRIBUTING.md |
| **Troubleshooting** | TROUBLESHOOTING.md |
| **Current tasks** | TODO.md |
| **Future plans** | INTEGRATED_ROADMAP.md |
| **Community launch** | LAUNCH_EXECUTION_LOG.md |
| **Reddit posts** | LAUNCH_REDDIT_POSTS_FILTER_SAFE.md |
| **All documentation** | DOCUMENTATION_INDEX.md |

---

**Last Updated:** November 23, 2025  
**Status:** Phase 1 Complete ✅ → Phase 2 In Progress 🚧
