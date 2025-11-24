# Release Management Guide

## Current Status

- **Version:** 0.1.0 ✅
- **PyPI:** Available via `pip install lmapp`
- **GitHub:** Tagged as v0.1.0
- **Build Artifacts:** In `/dist/` directory

## Installation Methods for Users

### Method 1: PyPI (Recommended - Most Users)
```bash
pip install lmapp
lmapp chat
```
This is the easiest method. Package is already published to PyPI.

### Method 2: Direct Download from GitHub Release
Users can download `.whl` or `.tar.gz` directly from:
https://github.com/nabaznyl/lmapp/releases/tag/v0.1.0

Then install locally:
```bash
pip install lmapp-0.1.0-py3-none-any.whl
# or
pip install lmapp-0.1.0.tar.gz
```

### Method 3: From GitHub Source
```bash
git clone https://github.com/nabaznyl/lmapp.git
cd lmapp
pip install .
```

### Method 4: For Development
```bash
git clone https://github.com/nabaznyl/lmapp.git
cd lmapp
bash scripts/dev-utils.sh setup
```

## How Releases Work

### Automated Release Process

The GitHub Actions workflow (`.github/workflows/publish.yml`) **automatically**:

1. **Triggers** when a new version tag is pushed (e.g., `git push origin v0.1.0`)
2. **Builds** the distribution packages (wheel + source)
3. **Publishes to PyPI** automatically
4. **Creates GitHub Release** with download links
5. **Uploads artifacts** (wheel + tar.gz files)

### Manual Release Process (if needed)

```bash
# 1. Build packages
bash scripts/github-release.sh build

# 2. Create draft release (requires GitHub CLI)
bash scripts/github-release.sh draft

# 3. Publish (via gh CLI or GitHub web UI)
gh release edit v0.1.0 --draft=false
```

## Next Release (v0.2.0)

When ready to release v0.2.0:

```bash
# 1. Update VERSION file
echo "v0.2.0" > VERSION

# 2. Update version in all files
bash scripts/sync-version.sh

# 3. Update CHANGELOG.md with new features

# 4. Commit changes
git add VERSION setup.py pyproject.toml CHANGELOG.md
git commit -m "release: v0.2.0"

# 5. Tag the commit
git tag -a v0.2.0 -m "Release v0.2.0"

# 6. Push tag (triggers automated release)
git push origin v0.2.0

# The GitHub Actions workflow will:
# - Build packages
# - Publish to PyPI
# - Create GitHub Release
# - Upload assets
```

## Checking Release Status

### Check if Release Exists
```bash
git tag -l                                    # List local tags
git describe --tags --exact-match             # Current tag

# Or check on GitHub:
https://github.com/nabaznyl/lmapp/releases
```

### Check PyPI
```bash
pip index versions lmapp                      # Check available versions on PyPI
```

### Verify Workflow Ran
Go to: https://github.com/nabaznyl/lmapp/actions
Look for "Publish to PyPI & GitHub Releases" workflow

## Troubleshooting

### "No releases found" but tag exists

**Possible cause:** Workflow didn't run or failed

**Solution:**
1. Check GitHub Actions (link above)
2. If workflow shows error, fix it and re-push the tag:
   ```bash
   git tag -d v0.1.0                         # Delete local tag
   git push origin :refs/tags/v0.1.0         # Delete remote tag
   git tag -a v0.1.0 -m "Release v0.1.0"    # Recreate locally
   git push origin v0.1.0                     # Push again (triggers workflow)
   ```

### "Package not found on PyPI" but GitHub release exists

**Possible cause:** Workflow ran but PyPI publish step failed

**Solution:**
1. Check workflow logs for error
2. Manually publish (if credentials available):
   ```bash
   bash scripts/github-release.sh build
   twine upload dist/*
   ```

### Want to manually create release on GitHub

If GitHub Actions workflow failed:

```bash
# Build packages
bash scripts/github-release.sh build

# Create draft release (requires GitHub CLI installed)
bash scripts/github-release.sh draft

# Review at: https://github.com/nabaznyl/lmapp/releases/tag/v0.1.0
# Then publish via web UI or CLI
```

## Key Files

- **VERSION** - Source of truth for version
- **setup.py** - Synced from VERSION automatically
- **pyproject.toml** - Synced from VERSION automatically
- **scripts/sync-version.sh** - Keeps version files in sync
- **scripts/github-release.sh** - Helper for manual releases
- **.github/workflows/publish.yml** - Automated release workflow
- **CHANGELOG.md** - Release notes

## For Contributors

Contributors should **never** manually change version numbers or create releases. That's handled automatically by CI/CD.

See [GETTING_STARTED.md](./GETTING_STARTED.md) for contributor workflow.

---

**Questions?** Check the workflow logs or see [CONTRIBUTING.md](./CONTRIBUTING.md).
