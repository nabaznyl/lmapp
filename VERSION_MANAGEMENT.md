# Version Management & Release Process

This document provides the release workflow for publishing new versions of lmapp to PyPI and VS Code Marketplace.

## Version Format

lmapp uses **semantic versioning**: `MAJOR.MINOR.PATCH`

Example: `0.3.5` means:
- **MAJOR** (0): Major version (breaking changes)
- **MINOR** (3): New features (backward compatible)
- **PATCH** (5): Bug fixes (backward compatible)

**Current version**: See [VERSION](VERSION) file or `pyproject.toml`

## Files to Update Before Release

When bumping the version, update these 3 files:

### 1. pyproject.toml
```toml
[project]
version = "0.3.6"  # Update this line
```

### 2. vscode-extension/package.json
```json
{
  "version": "0.3.6"  # Update this line
}
```

### 3. VERSION (root)
```
0.3.6
```

## Release Process (Step by Step)

### Step 1: Create Feature Branch
```bash
git checkout -b release/v0.3.6
```

### Step 2: Update Version Files
Update the 3 files listed above to new version `0.3.6`.

### Step 3: Update CHANGELOG
Add entry to [CHANGELOG.md](CHANGELOG.md):
```markdown
## [0.3.6] - 2025-01-15

### Added
- New refactoring suggestion: unused variable detection
- API endpoint for quick fixes

### Fixed
- Fixed Python analyzer edge case handling

### Changed
- Improved performance of JavaScript analyzer

[0.3.6]: https://github.com/nabaznyl/lmapp/releases/tag/v0.3.6
```

### Step 4: Commit Changes
```bash
git add pyproject.toml VERSION CHANGELOG.md
git commit -m "chore: bump version to 0.3.6"
git push origin main
```

### Step 5: Create Release Tag
```bash
git tag -a v0.3.6 -m "Release v0.3.6: Improved code analysis"
git push origin v0.3.6
```

### Step 6: Monitor Workflows
1. Go to GitHub repo: https://github.com/nabaznyl/lmapp
2. Click "Actions" tab
3. Watch "Publish Release" workflow run
4. It will:
   - Build Python package
   - Publish to PyPI
   - Create GitHub Release with artifacts

**Expected time**: 5-10 minutes for workflow to complete

### Step 7: Verify Release

**PyPI**:
```bash
pip install lmapp
python -c "import lmapp; print(lmapp.__version__)"
```

**GitHub Releases**:
1. Visit: https://github.com/nabaznyl/lmapp/releases
2. Verify new release is listed with artifacts

## Hotfix Process (Critical Bugs)

If a critical bug needs fixing in the released version:

### Step 1: Create Hotfix Branch
```bash
git checkout -b hotfix/v0.3.6.1 v0.3.6
```

### Step 2: Fix Bug
Make the bug fix in your code.

### Step 3: Update Version
- Bump PATCH version: `0.3.6` → `0.3.6.1`
- Update: `pyproject.toml`, `package.json`, `VERSION`

### Step 4: Update CHANGELOG
```markdown
## [0.3.6.1] - 2025-01-16

### Fixed
- Critical: Fixed refactoring service crash on empty code input
```

### Step 5: Merge and Tag
```bash
git add -A
git commit -m "fix: crash on empty code input (v0.3.6.1)"
git push origin hotfix/v0.3.6.1

# Get review and merge to main
git checkout main
git merge hotfix/v0.3.6.1
git push origin main

# Tag
git tag -a v0.3.6.1 -m "Hotfix v0.3.6.1"
git push origin v0.3.6.1
```

The publish workflow will run automatically.

## Pre-Release Testing (Optional)

To test publishing before going live:

### Option 1: Manual Local Build
```bash
cd /home/anonmaly/projects/lmapp

# Build Python package
pip install build twine
python -m build
twine check dist/*

# Build extension
cd vscode-extension
npm ci
npm install -g vsce
vsce package
```

### Option 2: Publish to TestPyPI
1. GitHub repo > Actions > Test PyPI Upload
2. Click "Run workflow" button
3. Wait for completion
4. Install from TestPyPI: `pip install -i https://test.pypi.org/simple/ lmapp`

## Rollback Procedure

If a release has critical issues and needs rollback:

### Step 1: Yank the Version
**PyPI**:
```bash
pip install twine
twine yank lmapp==0.3.6
```

**VS Code Marketplace**:
- Contact marketplace support or unpublish extension

### Step 2: Create Hotfix
Follow hotfix process above with version `0.3.6.1`

### Step 3: Re-release
Create new tag `v0.3.6.1` with fixes
Workflows will publish automatically

## Version History

| Version | Release Date | Notable Changes |
|---------|--------------|-----------------|
| 0.3.5   | 2025-01-10   | Current stable release |
| 0.3.4   | 2024-12-20   | Initial refactoring features |
| 0.2.1   | 2024-11-15   | Foundation release |

## Common Issues

### Package upload fails with "already exists"
**Cause**: Version was already published to PyPI
**Solution**: Increment PATCH version and try again

### Workflow shows "OIDC token not found"
**Cause**: OIDC trusted publisher not configured
**Solution**: See [GITHUB_SECRETS_SETUP.md](GITHUB_SECRETS_SETUP.md)

### Marketplace publishing fails with "Invalid PAT"
**Cause**: Token expired or has wrong scope
**Solution**: Regenerate token with "Marketplace > Manage" scope

### GitHub Actions workflow doesn't trigger on tag
**Cause**: Tag format doesn't match `v*` pattern
**Solution**: Ensure tag starts with `v` (e.g., `v0.3.6` not `0.3.6`)

## Checklist Before Release

- [ ] All tests pass locally: `pytest tests/`
- [ ] Build succeeds locally: `python -m build`
- [ ] Extension builds: `vsce package`
- [ ] Version bumped in 3 files (pyproject.toml, package.json, VERSION)
- [ ] CHANGELOG.md updated with release notes
- [ ] No uncommitted changes: `git status`
- [ ] Commit message is clear and meaningful
- [ ] Tag format is correct (starts with `v`)
- [ ] GitHub Secrets are configured (`VSCODE_MARKETPLACE_TOKEN`)
- [ ] PyPI OIDC trusted publisher is configured

## References

- [PyPI Help - Release Management](https://packaging.python.org/tutorials/distributing-packages/)
- [VS Code - Publishing Extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [GitHub - Creating Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/creating-releases)
- [Semantic Versioning](https://semver.org/)

## Quick Reference: To release v0.3.6:
```bash
# 1. Update files
# 2. Update CHANGELOG
# 3. Commit and push
git add -A && git commit -m "chore: bump to 0.3.6"

# 4. Tag and push (triggers workflows)
git tag -a v0.3.6 -m "Release v0.3.6"
git push origin main v0.3.6

# 5. Monitor Actions tab and verify PyPI release
```
