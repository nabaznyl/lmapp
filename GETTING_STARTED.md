# Getting Started with lmapp Development

Welcome! This guide will get you set up to develop on lmapp in **5 minutes**.

## 🚀 Quick Start (Choose One)

### Option A: For Users (Just Install)
```bash
pip install lmapp
lmapp chat
```
Done! No development setup needed.

---

### Option B: For Contributors (Clone & Develop)

**First Time Setup:**
```bash
# Clone the repository
git clone https://github.com/nabaznyl/lmapp.git
cd lmapp

# Setup development environment (one command)
bash scripts/dev-utils.sh setup

# Verify everything is ready
bash scripts/dev-utils.sh ready
```

That's it! You now have:
- ✅ Python virtual environment configured
- ✅ All dev dependencies installed
- ✅ Pre-commit hooks activated
- ✅ Ready to start developing

---

## 📝 Daily Workflow for Contributors

### Making Changes
```bash
# Make your changes to the code
# Then validate before committing:

make lint          # Check code style
make test          # Run tests
git add .
git commit -m "Your message"    # Pre-commit hook validates automatically
```

### One-Command Quality Check
```bash
make all           # Format code, lint, run tests (all at once)
```

### Before Submitting a Pull Request
```bash
# Full quality assurance
make all

# Check for any security issues
bash scripts/dev-utils.sh deps-audit

# Find any unfinished work
bash scripts/dev-utils.sh find-todos
```

---

## 🛠️ Common Commands

### Testing
```bash
make test              # Run all 128 tests
make test-cov          # Run tests with coverage report
make test-quick        # Fast test run (no coverage)
pytest tests/ -v       # Manual pytest with verbose output
```

### Code Quality
```bash
make format            # Auto-format code with Black
make lint              # Check code style (Black, Flake8, mypy)
make check             # Pre-commit checks before committing
```

### Project Info
```bash
make help              # Show all Makefile targets
make doctor            # Diagnose your environment setup
make version           # Show current version
```

### Maintenance
```bash
make clean             # Remove caches and build artifacts
bash scripts/dev-utils.sh status    # See project statistics
bash scripts/dev-utils.sh cache-clean    # Deep clean workspace
```

---

## 🔍 Developer Utilities

We provide convenient shortcuts for all common tasks:

```bash
bash scripts/dev-utils.sh help         # See all utilities

# Setup & verification
bash scripts/dev-utils.sh setup        # Setup dev environment
bash scripts/dev-utils.sh ready        # Verify environment ready

# Code analysis
bash scripts/dev-utils.sh find-todos   # Find TODO/FIXME comments
bash scripts/dev-utils.sh find-prints  # Find print() statements
bash scripts/dev-utils.sh check-imports    # Analyze imports

# Git utilities
bash scripts/dev-utils.sh git-cleanup  # Optimize git repository
bash scripts/dev-utils.sh git-stash-wip    # Save work in progress
bash scripts/dev-utils.sh git-pop-wip  # Restore work in progress
```

---

## 🎯 Development Checklist

Before submitting a PR:

- [ ] Ran `make format` (code is formatted)
- [ ] Ran `make all` (all checks passed)
- [ ] Ran `pytest tests/ -v` (all 128 tests pass)
- [ ] Ran `bash scripts/dev-utils.sh deps-audit` (no security issues)
- [ ] Ran `bash scripts/dev-utils.sh find-todos` (no incomplete work)
- [ ] Updated `CHANGELOG.md` (if adding features)

---

## 📚 More Information

- **Contributing Guidelines:** See [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Code of Conduct:** See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- **Security Policy:** See [SECURITY.md](./SECURITY.md)
- **Architecture:** See [README.md](./README.md) → "Architecture" section
- **Installation:** See [INSTALL.md](./INSTALL.md)

---

## ❓ Troubleshooting

### Setup failed / tests not working?

Run the diagnostics:
```bash
make doctor        # Comprehensive environment check
```

This will tell you exactly what's missing or misconfigured.

### Pre-commit hook is rejecting my commit?

The hook found a real issue. Read the error message—it will tell you exactly what to fix:
```bash
make format        # Fix formatting issues
make test          # Verify tests pass
git add .
git commit -m "Your message"
```

### "Permission denied" when running bash scripts?

Make sure they're executable:
```bash
chmod +x scripts/dev-utils.sh
chmod +x scripts/pre-commit-cleanup.sh
```

---

## 💡 Tips for Smooth Development

1. **Always run `make format` before committing** - Catches most issues
2. **Use `make all` before pushing** - Full validation in one command
3. **Read error messages carefully** - They tell you exactly what to fix
4. **Run `bash scripts/dev-utils.sh ready`** - If anything feels off

---

## 🤝 Need Help?

- **Issue:** Check [existing issues](https://github.com/nabaznyl/lmapp/issues)
- **Question:** Start a [discussion](https://github.com/nabaznyl/lmapp/discussions)
- **Bug:** Report it with [issue template](https://github.com/nabaznyl/lmapp/issues/new)

---

## 🚀 First-Time Contributor?

Welcome! Here's your path:

1. ✅ Follow "Quick Start" above
2. ✅ Pick a ["good first issue"](https://github.com/nabaznyl/lmapp/issues?q=label%3A%22good+first+issue%22)
3. ✅ Make your change locally
4. ✅ Run checks: `make all`
5. ✅ Submit PR with description of what you changed and why
6. ✅ Wait for feedback (we're friendly!)

**That's it!** 🎉

---

## 📊 Project Status

- **Version:** 0.1.0 ✅ (Live on PyPI)
- **Tests:** 128/128 passing (100% coverage)
- **Code Quality:** 0 lint errors, 0 type errors
- **Status:** Production-ready

**Ready to contribute?** Start with: `bash scripts/dev-utils.sh setup`
