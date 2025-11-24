# Contributing to lmapp

Thank you for your interest in contributing to lmapp! This document covers everything you need to know to get started.

> **👉 New contributor?** Start with [GETTING_STARTED.md](./GETTING_STARTED.md) for a quick 5-minute setup guide!

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Making Changes](#making-changes)
5. [Testing & Quality](#testing--quality)
6. [Pull Request Process](#pull-request-process)
7. [Commit Messages](#commit-messages)
8. [Help Wanted](#help-wanted)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We ask that you:

- **Be respectful** - Treat others with dignity and kindness
- **Be inclusive** - Welcome contributors from all backgrounds
- **Be constructive** - Provide helpful feedback, not criticism
- **Assume good faith** - Interpret others' actions charitably
- **Focus on ideas** - Disagree on code, not people

### Unacceptable Behavior

- Harassment, discrimination, or intimidation
- Insulting language or personal attacks
- Unwelcome sexual attention or advances
- Threats or violence

**Report violations** to the maintainers via private message.

---

## Getting Started

### Prerequisites

- Python 3.8+ (we test 3.8, 3.9, 3.10, 3.11, 3.12)
- git
- pip or pipx
- Basic familiarity with command line

### One-Time Setup

**Option 1: Using Makefile (Recommended)**

```bash
git clone https://github.com/nabaznyl/lmapp.git
cd lmapp
make dev              # Install dev deps + pre-commit hooks
make hooks            # Setup pre-commit hooks
make test             # Verify everything works
```

**Option 2: Using Bootstrap Script**

```bash
git clone https://github.com/nabaznyl/lmapp.git
cd lmapp
./scripts/bootstrap_dev_env.sh   # Automated setup
source .venv/bin/activate         # Activate environment
make test                         # Run tests
```

**Option 3: Manual Setup**

```bash
git clone https://github.com/nabaznyl/lmapp.git
cd lmapp

# Create virtual environment
python3 -m venv .venv
source .venv/bin/activate     # On Windows: .venv\Scripts\activate

# Install dev dependencies
pip install -e ".[dev]"

# Install pre-commit hooks
pre-commit install

# Run tests to verify
pytest tests/ -v
```

**Verify Setup:**

```bash
make help             # Shows available commands
make version          # Should show 0.1.0
make test             # All tests should pass (128 tests)
make check            # Full code quality check
```

**Environment Verification:**

```bash
# Check that .venv is active
./scripts/check_env.sh

# Run tests with venv-aware wrapper
./scripts/run_tests.sh
```

---

## Development Workflow

### The Standard Workflow (Quick Version)

```bash
# Step 1: Setup (first time only)
bash scripts/dev-utils.sh setup && bash scripts/dev-utils.sh ready

# Step 2: Create a branch and make your changes
git checkout -b feature/your-feature-name
# ... make your changes ...

# Step 3: Validate before committing
make format          # Auto-format your code
make test            # Run all tests
git add .
git commit -m "description"    # Pre-commit hook validates automatically

# Step 4: Before pushing
make all             # Full validation (format + lint + test)
bash scripts/dev-utils.sh deps-audit    # Security check
git push origin feature/your-feature-name

# Step 5: Submit pull request
# Go to GitHub and open a PR with description
```

**That's it!** The git hooks protect you automatically.

### Finding Something to Work On

**Good first issues** - Perfect for new contributors:
```bash
# Filter on GitHub by label: "good-first-issue"
https://github.com/nabaznyl/lmapp/labels/good-first-issue
```

**Areas we'd love help with:**
- Bug fixes (see open issues)
- Backend integration (Ollama, llamafile)
- Documentation improvements
- Test coverage enhancements
- CLI UX improvements

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Naming conventions:**
- `feature/` - New feature
- `fix/` - Bug fix
- `docs/` - Documentation update
- `refactor/` - Code improvements
- `test/` - Test additions

Examples:
- `feature/ollama-backend-detection`
- `fix/config-validation-error`
- `docs/add-troubleshooting-guide`

---

## Making Changes

### Before You Start

1. **Check the issue** - Read the related GitHub issue to understand requirements
2. **Update yourself** - `git pull origin main` to get latest
3. **Create branch** - See [Creating a Feature Branch](#creating-a-feature-branch)

### Code Structure

```
src/lmapp/
├── backend/          # LLM backend implementations
│   ├── base.py       # Abstract backend interface
│   ├── mock.py       # Mock backend (for testing)
│   ├── ollama.py     # Ollama integration
│   └── detector.py   # Backend auto-detection
├── cli.py            # Click CLI commands
├── core/             # Core business logic
│   ├── config.py     # Configuration management
│   └── chat.py       # Chat functionality
├── ui/               # Terminal UI
│   └── menu.py       # Menu rendering
└── utils/            # Utilities
    ├── logger.py     # Logging setup
    ├── errors.py     # Error handling
    └── system_check.py  # System diagnostics
```

### Code Style Guide

**Python Style:** Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/)

- **Line length:** Max 127 characters (checked by flake8)
- **Indentation:** 4 spaces
- **Type hints:** Add type hints to function signatures
- **Docstrings:** Use Google-style docstrings

**Example:**
```python
def chat_with_backend(message: str, model: str = "default") -> str:
    """Chat with the LLM backend.
    
    Args:
        message: The user's message
        model: Model to use (default: default)
        
    Returns:
        The model's response
        
    Raises:
        BackendError: If backend is not available
    """
    # Implementation here
    pass
```

**Code Quality Tools**

All automated via pre-commit hooks or make commands:

```bash
make format   # Auto-format code (Black)
make lint     # Check style (Flake8)
mypy src/     # Type checking
```

### Adding New Features

**If adding a new backend:**

1. Inherit from `BackendBase` in `src/lmapp/backend/base.py`
2. Implement required methods: `start()`, `stop()`, `is_running()`, `chat()`, etc.
3. Add tests in `tests/test_backends.py`
4. Update detector in `src/lmapp/backend/detector.py`

**If adding a CLI command:**

1. Add to `src/lmapp/cli.py` using Click decorators
2. Follow existing command structure
3. Add comprehensive help text
4. Add tests in `tests/test_cli.py`
5. Update `README.md` with usage examples

**If adding configuration:**

1. Add field to `LMAppConfig` in `src/lmapp/core/config.py`
2. Add validation rules
3. Add tests for validation
4. Document in `CONFIGURATION.md`

---

## Testing & Quality

### Running Tests

```bash
# Run all tests
make test

# Run with coverage report
make coverage

# Run specific test file
pytest tests/test_config.py -v

# Run specific test
pytest tests/test_config.py::test_config_validation -v

# Run with debugging
pytest tests/test_config.py -vv -s
```

### Writing Tests

Tests are in `tests/` directory. Use this pattern:

```python
import pytest
from src.lmapp.core.config import LMAppConfig

class TestConfig:
    """Test configuration management."""
    
    def test_config_initialization(self):
        """Test config initializes with defaults."""
        config = LMAppConfig()
        assert config.temperature == 0.7
        assert config.model == "default"
    
    def test_config_validation(self):
        """Test config validates input."""
        with pytest.raises(ValueError):
            LMAppConfig(temperature=2.0)  # Out of range
```

**Test Coverage Requirement:** Maintain 100% coverage

```bash
make coverage
# Check htmlcov/index.html for coverage report
```

### Code Quality Checks

```bash
# Format code
make format

# Check formatting
make lint

# Type checking
mypy src/

# Security scanning
bandit -r src/

# All checks
make lint && mypy src/ && make test
```

---

## Pull Request Process

### Before Submitting

- [ ] Tests pass: `make test`
- [ ] Coverage is 100%: `make coverage`
- [ ] Code is formatted: `make format`
- [ ] Linting passes: `make lint`
- [ ] No type errors: `mypy src/`
- [ ] Updated relevant docs
- [ ] Commit messages are clear (see [Commit Messages](#commit-messages))

### Creating a Pull Request

1. **Push your branch:**
   ```bash
   git push origin feature/your-feature
   ```

2. **Open PR on GitHub** - Use the PR template (auto-fills)

3. **Fill in the template:**
   - Describe what changes you made and why
   - Link to related issue: `Closes #123`
   - Check the boxes if applicable
   - Add screenshots if relevant

4. **What happens next:**
   - CI runs automatically (tests, lint, coverage)
   - Maintainers review when possible
   - You may need to make changes (that's normal!)
   - Once approved, we merge

### PR Review Tips

**Reviewers look for:**
- Code quality and correctness
- Test coverage
- Documentation
- Backwards compatibility
- Performance impact

**If asked for changes:**
- Don't take it personally - we're improving the code
- Make requested changes in new commits (don't amend)
- Re-request review when ready
- It's OK to ask for clarification

---

## Commit Messages

### Message Format

```
[Type] Brief description (50 chars max)

Detailed explanation if needed (wrap at 72 chars).
- Bullet point 1
- Bullet point 2

Fixes #123
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting/style
- `refactor:` - Code refactoring
- `test:` - Test additions/changes
- `chore:` - Tooling/config changes

### Examples

```
feat: Add Ollama backend detection

Implements automatic detection of Ollama installations
via socket polling. Includes fallback to llamafile.

- Check /var/run/ollama.sock on Linux
- Check ~/.ollama/run.sock on macOS
- Timeout after 5 seconds

Fixes #42
```

```
fix: Handle missing LMAPP_CONFIG_DIR gracefully

Create config directory if it doesn't exist instead
of raising FileNotFoundError.

Fixes #38
```

---

## Help Wanted

### Areas Where We Need Contributors

**Backend Development** 🔧
- Implement Ollama integration
- Implement llamafile support
- Add LocalAI backend
- Improve backend fallback logic

**Documentation** 📚
- Installation guides for different OSes
- Troubleshooting guide expansions
- Architecture documentation
- API documentation

**Testing** 🧪
- Integration tests
- E2E/CLI tests
- Performance benchmarks
- Edge case testing

**CLI/UX** 🎨
- Menu improvements
- Error message clarity
- Color/emoji enhancements
- Accessibility improvements

**Packaging** 📦
- Debian/Ubuntu .deb package
- RPM package for Fedora/RHEL
- Homebrew formula
- Windows installer

### First Time Contributing?

1. Read this file completely
2. Set up your development environment (`make dev`)
3. Look for `good-first-issue` labels
4. Start with a documentation or test contribution
5. Ask questions in PR comments - we're here to help!

---

## Questions?

- **Issue tracker:** https://github.com/nabaznyl/lmapp/issues
- **Discussions:** https://github.com/nabaznyl/lmapp/discussions
- **Documentation:** See README.md and docs/ folder

## Thank You! 💜

Every contribution—code, docs, feedback, ideas—makes lmapp better. We're grateful for you taking the time to help!

---

*Last updated: November 2025*
*For specific questions, open a GitHub issue or discussion.*
````
