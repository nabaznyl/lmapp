# PyPI Publishing Configuration Guide

**Purpose**: Configure lmapp for PyPI package publishing  
**Status**: ⏳ TODO  
**Priority**: High (Phase 3)

---

## 📦 Overview

lmapp needs to be properly configured for PyPI publishing to enable:
- Easy installation via `pip install lmapp`
- Version management and dependency tracking
- Automated releases
- Distribution of both backend server and CLI tools

---

## 🔧 Current Setup Status

### ✅ Already Configured
- [x] `pyproject.toml` exists with basic metadata
- [x] `setup.py` exists for installation
- [x] `requirements.txt` lists dependencies
- [x] Version management in `VERSION` file

### ❌ Missing Components
- [ ] PyPI credentials configured in CI/CD
- [ ] `twine` for publishing (needs to be added to dev dependencies)
- [ ] GitHub Actions workflow for automated publishing
- [ ] Build system configuration (wheel/sdist)
- [ ] Test PyPI publishing setup
- [ ] Release checklist and procedures

---

## 📋 Implementation Steps

### Step 1: Configure Publishing Tools

#### Add to development dependencies:
```bash
# In projects/lmapp/requirements.txt (dev section)
# Add:
twine>=4.0.0
build>=0.10.0
wheel>=0.38.0
```

#### OR in pyproject.toml:
```toml
[project.optional-dependencies]
dev = [
    "twine>=4.0.0",
    "build>=0.10.0",
    "wheel>=0.38.0",
    "pytest>=7.0",
    "black",
    "flake8",
]
publish = [
    "twine>=4.0.0",
    "build>=0.10.0",
]
```

### Step 2: Verify pyproject.toml Configuration

```toml
[build-system]
requires = ["setuptools>=45", "wheel", "setuptools_scm[toml]>=6.2"]
build-backend = "setuptools.build_meta"

[project]
name = "lmapp"
version = "0.3.5"  # or use dynamic versioning
description = "Local AI Assistant - Run LLMs locally"
readme = "README.md"
requires-python = ">=3.8"
license = {text = "MIT"}
authors = [
    {name = "lmapp team"}
]
keywords = ["ai", "llm", "local", "assistant"]
classifiers = [
    "Development Status :: 3 - Alpha",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
]

[project.urls]
Homepage = "https://github.com/nabaznyl/lmapp"
Documentation = "https://github.com/nabaznyl/lmapp#readme"
Repository = "https://github.com/nabaznyl/lmapp"
"Bug Tracker" = "https://github.com/nabaznyl/lmapp/issues"
```

### Step 3: Create PyPI Account

1. Go to https://pypi.org/account/register/
2. Create account for lmapp
3. Enable two-factor authentication
4. Generate API token for automated publishing
5. Store token securely in GitHub Secrets

### Step 4: Configure GitHub Secrets

Add to repository:
```
PYPI_API_TOKEN: <generated-token>
TESTPYPI_API_TOKEN: <test-token>  # for testing
```

Via GitHub UI:
1. Repository → Settings → Secrets and Variables → Actions
2. Add new secret: `PYPI_API_TOKEN`
3. Paste the API token from PyPI

### Step 5: Build and Test Locally

```bash
cd projects/lmapp

# Install build tools
pip install build twine

# Build distribution
python -m build

# Test with twine (dry run)
twine check dist/*

# View what would be uploaded
twine upload --repository testpypi dist/* --dry-run

# Actually test on TestPyPI
twine upload --repository testpypi dist/*

# Install from TestPyPI to verify
pip install --index-url https://test.pypi.org/simple/ lmapp

# Test functionality
lmapp --version
```

### Step 6: Publish to PyPI

```bash
# Upload to production PyPI
twine upload dist/*

# Or use the GitHub Actions workflow (recommended)
# Just push a release tag
git tag v0.3.5
git push origin v0.3.5
```

---

## 🔄 Automated Publishing Workflow

See: [GITHUB_RELEASE_AUTOMATION.md](./GITHUB_RELEASE_AUTOMATION.md)

---

## 📝 Publishing Checklist

Before publishing to PyPI:

```
Pre-Publication Checklist:
  [ ] Version updated in VERSION file
  [ ] CHANGELOG.md updated
  [ ] README.md updated
  [ ] All tests passing
  [ ] No uncommitted changes
  [ ] Build succeeds locally
  [ ] twine check passes

Local Testing:
  [ ] pip install dist/lmapp-*.whl
  [ ] lmapp --version works
  [ ] Basic commands execute
  [ ] Help text displays correctly

TestPyPI Testing:
  [ ] Upload to test.pypi.org
  [ ] Install from TestPyPI
  [ ] Verify functionality
  [ ] Check package metadata

Production Publishing:
  [ ] Tag commit: git tag v0.3.5
  [ ] Push tag: git push origin v0.3.5
  [ ] Verify on PyPI website
  [ ] Test installation: pip install lmapp
  [ ] Announce release
  [ ] Update documentation links
```

---

## 🔐 Security Best Practices

### API Token Security
- ✅ Use GitHub Secrets, never commit tokens
- ✅ Use API tokens, not password
- ✅ Regenerate token annually
- ✅ Use separate tokens for TestPyPI vs Production
- ✅ Limit token scope to publishing only

### Version Management
- ✅ Use semantic versioning (major.minor.patch)
- ✅ Update VERSION before release
- ✅ Tag every release in git
- ✅ Keep CHANGELOG.md updated

### Package Verification
- ✅ Always run `twine check` before publishing
- ✅ Test installation in clean virtual environment
- ✅ Verify dependencies resolve correctly
- ✅ Check package contents with `unzip -l dist/*.whl`

---

## 📚 Files to Create/Update

### Configuration Files
```
projects/lmapp/
├── pyproject.toml          (VERIFY/UPDATE)
├── setup.py                (VERIFY)
├── setup.cfg               (CREATE - optional)
├── MANIFEST.in             (CREATE - if needed)
└── VERSION                 (VERIFY format)
```

### CI/CD Files
```
.github/workflows/
├── publish-pypi.yml        (CREATE)
├── test-pypi.yml           (CREATE)
└── build-test.yml          (UPDATE)
```

### Documentation
```
projects/lmapp/docs/
├── PYPI_PUBLISHING.md      (THIS FILE)
├── GITHUB_RELEASES.md      (CREATE)
└── RELEASE_PROCEDURE.md    (CREATE)
```

---

## 🎯 Success Criteria

- [x] PyPI account created and configured
- [x] API token stored in GitHub Secrets
- [x] Build system working locally
- [x] TestPyPI publishing successful
- [x] Documentation complete
- [x] Team trained on publishing process

---

## 📞 Troubleshooting

### Issue: "twine check" fails
**Solution**: Fix errors shown in output:
- Check classifiers format
- Verify README renders as rst/markdown
- Check metadata syntax

### Issue: Upload to TestPyPI fails
**Solution**: Verify:
- TestPyPI account created
- Token is for TestPyPI
- Package name matches (use test name if needed)
- Version format is correct

### Issue: Package not found after upload
**Solution**:
- Wait 1-2 minutes for indexing
- Check exact package name matches
- Verify version in URL matches

### Issue: Dependencies not resolved
**Solution**:
- Verify all dependencies on PyPI
- Check version constraints
- Update requirements.txt
- Run `pip check` locally

---

## 📖 Related Documentation

- [GITHUB_RELEASE_AUTOMATION.md](./GITHUB_RELEASE_AUTOMATION.md)
- [BACKEND_IMPLEMENTATION_GUIDE.md](./BACKEND_IMPLEMENTATION_GUIDE.md)
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## ⏭️ Next Steps

1. **Create PyPI account** (if not already done)
2. **Update pyproject.toml** with complete metadata
3. **Add build dependencies** to requirements
4. **Test locally** with TestPyPI
5. **Create GitHub Actions workflows** for automated publishing
6. **Document release procedures** for team

---

**Status**: Ready to Implement  
**Estimated Time**: 4-6 hours  
**Priority**: High  
**Depends On**: None (independent task)
