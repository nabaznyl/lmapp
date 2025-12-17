# GitHub Configuration for PyPI Publishing

This document provides instructions for configuring GitHub to automatically publish lmapp to PyPI.

## Required Secrets

### PyPI Publishing

**For production PyPI publishing (`publish-release.yml`)**:

The workflow uses **trusted publishing** via OpenID Connect (OIDC), which is more secure than tokens. No manual secret configuration required if you:

1. Have a PyPI account
2. Have a project registered on PyPI: [lmapp on PyPI](https://pypi.org/project/lmapp/)
3. Configure a trusted publisher in your PyPI project settings

**How to set up OIDC trusted publishing**:

1. Go to https://pypi.org/manage/projects/lmapp/settings/publishing/
2. Click "Add a new pending publisher"
3. Configure:
   - **GitHub repository owner**: `nabaznyl`
   - **GitHub repository name**: `lmapp`
   - **GitHub workflow name**: `publish-release.yml`
   - **GitHub environment name**: (leave blank unless using)
4. Click "Add"

Once set up, PyPI will automatically trust the `publish-release.yml` workflow.

**No GitHub Secrets needed for OIDC** (more secure than tokens)

## Workflow Behavior

### `build-test.yml`
**Trigger**: Push to `main`/`develop` or PR to `main`/`develop`
**Actions**:
- Tests Python backend on Python 3.8 - 3.11
- Lints code (flake8, black, mypy)
- Runs test suite with coverage
- Builds Python package
- Uploads artifacts

**No secrets required**.

### `publish-release.yml`
**Trigger**: Git tag matching `v*` (e.g., `v0.3.5`)
**Actions**:
- Builds and publishes Python package to PyPI (via OIDC)
- Creates GitHub Release with artifacts

**Requires**: OIDC trusted publisher setup (one-time, manual on PyPI website)

**No GitHub Secrets needed**

## Testing Locally

### Test build without publishing:

```bash
cd /home/anonmaly/projects/lmapp

# Build Python package
pip install build twine
python -m build
twine check dist/*

# Build VS Code extension
cd vscode-extension
npm install -g vsce
vsce package
```

### Test PyPI package locally:

```bash
# Install from local build
pip install dist/lmapp-*.whl

# Verify
python -c "import lmapp; print(lmapp.__version__)"
```

## Troubleshooting

### Build test workflow fails
- Check Python syntax: `python -m py_compile src/**/*.py`
- Install dev dependencies: `pip install -e ".[dev]"`
- Run tests locally: `pytest tests/ -v`

### TestPyPI upload fails
- Verify token is valid and has correct scope
- Check package name isn't already taken on TestPyPI
- Ensure version number is unique

### Marketplace publishing fails
- Verify PAT has "Marketplace > Manage" scope
- Check publisher name matches in `vscode-extension/package.json`
- Verify extension hasn't been published in this version before

## Version Bumping

Before creating a release tag:

1. Update version in `pyproject.toml`:
   ```toml
   version = "0.3.6"  # Bump patch version
   ```

2. Update `vscode-extension/package.json`:
   ```json
   "version": "0.3.6"
   ```

3. Update `VERSION` file if exists:
   ```
   0.3.6
   ```

4. Create git tag:
   ```bash
   git tag -a v0.3.6 -m "Release v0.3.6"
   git push origin v0.3.6
   ```

5. Workflows will automatically:
   - Build and test
   - Publish to PyPI
   - Publish extension to Marketplace
   - Create GitHub Release

## Next Steps

1. [ ] Set up PyPI OIDC trusted publisher
2. [ ] Monitor workflow runs in Actions tab
3. [ ] Create test release tag to verify workflows

## References

- [GitHub Actions - PyPI trusted publishing](https://docs.github.io/actions/publishing-packages/publishing-to-pypi/)
- [GitHub Secrets Documentation](https://docs.github.com/actions/security-guides/encrypted-secrets)
- [PyPI Trusted Publishing](https://docs.pypi.org/trusted-publishers/)
