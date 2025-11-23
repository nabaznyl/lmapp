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
make test          # Run all tests
make lint          # Check code style (flake8)
make format        # Auto-format code with black
make coverage      # Generate coverage report
make all           # Run: clean + install + lint + test
```

### Development

```bash
make install       # Install lmapp
make clean         # Remove build artifacts
make rebuild       # Clean + reinstall

# Manual venv (alternative to make)
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
   make lint          # Check style
   make format        # Auto-fix formatting
   make test          # Run tests
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
- Run `make format` to auto-fix
- Or `pre-commit run --all-files` manually

**"Tests failing locally but passing in CI"**
- Check Python version: `python --version`
- CI tests all versions 3.8-3.12
- Install dev deps: `make dev`

**"Module not found"**
- Make sure you installed with `make dev`
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
