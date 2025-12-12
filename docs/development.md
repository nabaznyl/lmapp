# Development Setup Guide - lmapp

Quick start for contributors.

## Prerequisites

- Python 3.8+
- git
- (Debian/Ubuntu): `pipx` or virtual environment

## One-Time Setup

```bash
# Clone the repo
git clone https://github.com/nabaznyl/lmapp.git
cd lmapp

# Install with dev dependencies
make dev

# Set up pre-commit hooks
pre-commit install
```

## Common Commands

### Testing & Quality

```bash
# Using UAFT (Standard)
uaft test          # Run all tests
uaft fix           # Auto-format code (black + flake8)
uaft cleanup       # Clean artifacts

# Using lmapp CLI (Convenience)
lmapp tests        # Run pytest
lmapp lint         # Run flake8
lmapp format       # Run black
lmapp types        # Run mypy
```

### Development

```bash
uaft install       # Install lmapp
uaft cleanup       # Remove build artifacts
uaft rebuild       # Clean + reinstall

# Manual venv (alternative to uaft)
python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
pytest tests/ -v
```

## Git Workflow

1. **Create branch** (for features/fixes):
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Code & Test**:
   ```bash
   uaft lint          # Check style
   uaft fix           # Auto-fix formatting
   uaft test          # Run tests
   ```

3. **Pre-commit hooks run automatically** on `git commit`
   - Formatting checks
   - Linting
   - Type checking
   - Security scan

4. **Push & Create PR**:
   ```bash
   git push origin feature/my-feature
   ```

5. **GitHub Actions runs**:
   - Full test suite (Python 3.8-3.12)
   - Coverage reporting
   - Code quality checks

## CI/CD Pipeline

### On Every Push

- `tests.yml` runs:
  - Flake8 linting
  - Black format check
  - Mypy type checking
  - Pytest (all tests)
  - Coverage upload

### On Tag (v0.1.0)

- `publish.yml` auto-publishes to PyPI

### On Merge to Main

- `cleanup.yml` removes old artifacts

## Pre-Commit Hooks

Automatically run before each commit:

- Trim trailing whitespace
- Fix end-of-file issues
- Validate YAML
- Check for large files
- Black code formatting
- Flake8 linting
- Mypy type checking
- Bandit security scan

Skip hooks if needed (not recommended):
```bash
git commit --no-verify
```

## Troubleshooting

**"pre-commit hooks failed"**
- Run `uaft fix` to auto-fix
- Or `pre-commit run --all-files` manually

**"Tests failing locally but passing in CI"**
- Check Python version: `python --version`
- CI tests all versions 3.8-3.12
- Install dev deps: `uaft dev`

**"Module not found"**
- Make sure you installed with `uaft dev`
- Check: `pip list | grep lmapp`

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for:
- Code style guidelines
- Commit message format
- Pull request process
- How to report issues

## Questions?

Check out:
- [Architecture Guide](../ARCHITECTURE.md)
- [Troubleshooting](../TROUBLESHOOTING.md)
- GitHub Discussions or Issues
