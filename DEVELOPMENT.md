# Development Guide

> Comprehensive guide for developers working on lmapp

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Development Workflow](#development-workflow)
4. [Running Tests](#running-tests)
5. [Code Quality](#code-quality)
6. [Architecture Overview](#architecture-overview)
7. [Common Tasks](#common-tasks)
8. [Debugging](#debugging)

---

## Quick Start

Get the development environment running in under 5 minutes:

```bash
git clone https://github.com/nabaznyl/lmapp.git
cd lmapp

# Automated setup (recommended)
./scripts/bootstrap_dev_env.sh
source .venv/bin/activate

# Or use Makefile
make dev
make test
```

That's it! You're ready to start developing.

---

## Environment Setup

### Option 1: Automated (Recommended)

```bash
./scripts/bootstrap_dev_env.sh
source .venv/bin/activate
```

This script:
- Creates `.venv` if missing
- Installs pip, setuptools, wheel
- Installs all dev dependencies with editable install
- Ready to go!

### Option 2: Using Make

```bash
make dev
```

This runs:
- Creates `.venv`
- Installs all dependencies
- Installs pre-commit hooks

### Option 3: Manual Setup

```bash
# Create virtualenv
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install --upgrade pip setuptools wheel
pip install -e ".[dev]"

# Install git hooks (optional)
pre-commit install
```

### Verify Environment

```bash
# Check that .venv is active
./scripts/check_env.sh
# Output: [lmapp] Virtualenv active: /path/to/.venv

# Test the CLI
python -m lmapp.cli --help
# Output: Usage: python -m lmapp.cli [OPTIONS] COMMAND [ARGS]...
```

---

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming:
- `feature/` - New feature
- `fix/` - Bug fix
- `docs/` - Documentation
- `test/` - Tests
- `refactor/` - Code improvements

### 2. Make Changes

Edit files in `src/lmapp/` or `tests/`

### 3. Run Tests

```bash
# Quick test run
pytest tests/ -q

# With coverage
pytest tests/ --cov=lmapp

# Specific test file
pytest tests/test_cli.py -v

# Specific test
pytest tests/test_cli.py::test_main_menu -v
```

### 4. Check Code Quality

```bash
# All checks at once
make check

# Individual checks
flake8 src/ --max-line-length=127
black --check src/ tests/
mypy --ignore-missing-imports src/lmapp
```

### 5. Auto-format Code

```bash
black src/ tests/
```

### 6. Commit Changes

```bash
git add .
git commit -m "feature: add awesome feature"

# Or use make
make test  # Ensures all tests pass first
```

### 7. Push & Create PR

```bash
git push origin feature/your-feature-name
```

Then open a PR on GitHub with a clear description.

---

## Running Tests

### Test Suite Overview

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=lmapp --cov-report=html

# Run specific test file
pytest tests/test_backends.py -v

# Run specific test
pytest tests/test_backends.py::test_mock_backend_chat -v

# Run with output capture
pytest tests/ -s  # Shows print() statements

# Run with markers
pytest -m integration       # Run integration tests only
pytest -m "not integration" # Skip integration tests
```

### Test Statistics

Current state:
- **128 tests** total
- **100% pass rate**
- **0 failures**
- **~14 seconds** runtime
- **Full coverage** for implemented features

### Monitoring Tests

```bash
# Watch for changes and re-run
pytest-watch tests/

# Or use Make wrapper
./scripts/run_tests.sh
```

---

## Code Quality

### Standards We Follow

- **Format**: Black (line-length=127)
- **Lint**: Flake8 (max-line-length=127)
- **Types**: Mypy (--ignore-missing-imports)
- **Style**: PEP 8 (enforced by Black)

### Quality Metrics

```
✓ Flake8:    0 errors
✓ Mypy:      0 errors (no type violations)
✓ Black:     Formatted (24 files)
✓ Tests:     128/128 passing
✓ Coverage:  100% for implemented features
```

### Running Quality Checks

```bash
# Everything at once
make check

# Format code
black src/ tests/

# Check formatting (don't modify)
black --check src/ tests/

# Lint check
flake8 src/ --max-line-length=127

# Type check
mypy --ignore-missing-imports src/lmapp
```

### Pre-commit Hooks

Git hooks run automatically before each commit:

```bash
# Install hooks
pre-commit install

# Run manually on all files
pre-commit run --all-files

# Skip hooks (not recommended)
git commit --no-verify
```

---

## Architecture Overview

### Directory Structure

```
lmapp/
├── src/lmapp/              # Main source code
│   ├── backend/            # LLM backend implementations
│   │   ├── base.py         # Abstract backend interface
│   │   ├── detector.py     # Backend detection logic
│   │   ├── mock.py         # Mock backend (testing)
│   │   ├── ollama.py       # Ollama integration
│   │   └── llamafile.py    # Llamafile integration
│   ├── core/               # Core business logic
│   │   ├── chat.py         # Chat session management
│   │   └── config.py       # Configuration management
│   ├── ui/                 # Terminal UI
│   │   ├── cli.py          # CLI entry point
│   │   ├── chat_ui.py      # Chat interface
│   │   └── menu.py         # Menu system
│   └── utils/              # Utilities
│       ├── logging.py      # Logging setup
│       ├── error_recovery.py  # Error handling
│       └── system_check.py    # System diagnostics
├── tests/                  # Test suite (128 tests)
├── scripts/                # Development scripts
│   ├── bootstrap_dev_env.sh  # Setup virtualenv
│   ├── check_env.sh         # Verify .venv
│   └── run_tests.sh         # Run tests
├── Makefile                # Common commands
├── README.md               # User guide
├── CONTRIBUTING.md         # Contribution guide
└── DEVELOPMENT.md          # This file
```

### Core Components

#### Backend System
- **Base**: `BackendBase` abstract class defines interface
- **Implementations**: Ollama, Llamafile, Mock
- **Detector**: Auto-detects available backends
- **Detection**: Tries backends in priority order

#### Chat System
- **ChatSession**: Manages conversation state
- **ChatMessage**: Represents single message
- **MessageHistory**: Tracks conversation

#### Configuration
- **LMAppConfig**: Pydantic model for settings
- **ConfigManager**: Persistence and loading
- **Validation**: Type-safe with env var overrides

#### Error Handling
- **Retry wrapper**: Exponential/linear backoff
- **Fallback strategy**: Defaults to mock if needed
- **Health checks**: Validates backends before use
- **Custom exceptions**: Specific error types

---

## Common Tasks

### Add a New Backend

1. Create file: `src/lmapp/backend/newbackend.py`
2. Inherit from `BackendBase`
3. Implement required methods:
   - `backend_name()` - Machine name
   - `backend_display_name()` - Human name
   - `is_installed()` - Check if available
   - `is_running()` - Check if active
   - `start()` - Start service
   - `stop()` - Stop service
   - `chat()` - Send message, get response

4. Add tests in `tests/test_backends.py`
5. Register in detector: `src/lmapp/backend/detector.py`

### Add a New CLI Command

1. Edit `src/lmapp/cli.py`
2. Use Click decorators:
   ```python
   @click.command()
   @click.option('--option', help='Help text')
   def new_command(option):
       """Command description"""
       pass
   ```
3. Add help text and examples
4. Add tests in `tests/test_cli.py`

### Add Configuration Option

1. Add field to `LMAppConfig` in `src/lmapp/core/config.py`
2. Include `Field()` with validation
3. Add to example config
4. Update docs in CONFIGURATION.md
5. Add tests in `tests/test_config.py`

### Fix a Bug

1. Create issue describing the bug
2. Create branch: `git checkout -b fix/bug-description`
3. Write test that reproduces bug
4. Fix the bug (test should pass)
5. Run `make check` to verify
6. Commit and create PR

### Improve Documentation

1. Edit `.md` files directly
2. Run spell-check if available
3. Test links work
4. Commit with `docs:` prefix

---

## Debugging

### Enable Debug Logging

```bash
# Via environment variable
LMAPP_DEBUG=1 lmapp chat

# Via CLI flag
lmapp --debug chat

# View logs
tail -f ~/.local/share/lmapp/logs/lmapp.log
```

### Debug in Python

```python
# Add to code
from lmapp.utils.logging import logger

logger.debug("Debug message")
logger.info("Info message")
logger.error("Error message")

# Check logs
tail -f ~/.local/share/lmapp/logs/lmapp.log
```

### Debug Tests

```bash
# Run test with output
pytest tests/test_cli.py::test_name -s

# Run with debugging
pytest tests/test_cli.py::test_name -vv --tb=long

# Run with pdb debugger
pytest tests/test_cli.py::test_name --pdb
```

### Common Issues

#### `ModuleNotFoundError: No module named 'lmapp'`
```bash
# Solution: Install package in dev mode
pip install -e .
```

#### Tests fail with "Wrong virtualenv"
```bash
# Solution: Activate the right venv
./scripts/check_env.sh
source .venv/bin/activate
```

#### Import errors in IDE
```bash
# Solution: Configure IDE to use project venv
# In VS Code: Ctrl+Shift+P → "Python: Select Interpreter"
# Choose: ./.venv/bin/python
```

#### Flake8 formatting issues
```bash
# Solution: Auto-format with black
black src/ tests/
```

---

## Documentation Guide

### Quick Navigation

**"Where do I start?"**
→ [README.md](./README.md) - Project overview and quick start

**"How do I install lmapp?"**
→ [INSTALL.md](./INSTALL.md) - Installation methods

**"How do I contribute?"**
→ [CONTRIBUTING.md](./CONTRIBUTING.md) - Contribution guidelines

**"What are the design decisions?"**
→ [ROADMAP.md](./ROADMAP.md) - Architecture and roadmap

**"I'm stuck, where do I look?"**
→ [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions

### For Users
- **[README.md](./README.md)** - Overview, features, use cases
- **[INSTALL.md](./INSTALL.md)** - Installation instructions
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - FAQ and common issues
- **[ROADMAP.md](./ROADMAP.md)** - Feature roadmap and future plans

### For Contributors
- **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute
- **[DEVELOPMENT.md](./DEVELOPMENT.md)** - This file (dev setup, workflows)
- **[LEGAL_NOTICE.md](./LEGAL_NOTICE.md)** - License and dependency info

### For Maintainers
- **[MULTI_LANGUAGE_STRATEGY.md](./MULTI_LANGUAGE_STRATEGY.md)** - Long-term architecture vision

---

## Resources

- **Python 3.8+ Docs**: https://docs.python.org/3.8/
- **Pydantic**: https://docs.pydantic.dev/latest/
- **Pytest**: https://docs.pytest.org/
- **Click**: https://click.palletsprojects.com/
- **Rich**: https://rich.readthedocs.io/
- **Ollama API**: https://github.com/ollama/ollama/blob/main/docs/api.md

---

## Getting Help

- **Questions?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) or open a Discussion
- **Found a bug?** Open an Issue with reproduction steps
- **Want feedback?** Create a Draft PR and ask for review
- **Stuck?** Comment on an issue and ask for help

---

## Code Review Guidelines

When reviewing code:

1. **Tests**: Do they pass? Is coverage maintained?
2. **Quality**: Does it pass `make check`?
3. **Style**: Does it follow conventions?
4. **Docs**: Are changes documented?
5. **Backwards compat**: Does it break existing functionality?

When submitting code:

1. **Tests**: Include tests for new features
2. **Quality**: Run `make check` before committing
3. **Docs**: Update relevant documentation
4. **Commit messages**: Be clear and descriptive
5. **PR description**: Explain why, not just what

---

## Performance Considerations

### Target Metrics

- Chat response latency: < 5 seconds for typical queries
- Startup time: < 2 seconds
- Memory usage: < 200MB idle
- Test suite: < 15 seconds

### Profiling

```bash
# Profile Python code
python -m cProfile -s cumtime -m lmapp.cli chat

# Memory profiling
pip install memory-profiler
python -m memory_profiler lmapp/cli.py
```

---

**Happy coding! 🚀**

Questions? Refer to this guide or ask in the Discussion section.
