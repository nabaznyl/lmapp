# GitHub Release Automation Guide

**Purpose**: Automate releases for both PyPI packages and VS Code extension  
**Status**: ⏳ TODO  
**Priority**: High (Phase 3)

---

## 📋 Overview

Automated release workflows for:
1. **Backend** - lmapp Python package to PyPI
2. **VS Code Extension** - lmapp-vscode to Visual Studio Code Marketplace
3. **Coordination** - Unified release versioning across all components

---

## 🔧 Missing Tools

### Backend Publishing
- ❌ `twine` - For PyPI publishing
- ❌ GitHub Actions workflow - Automated PyPI releases
- ❌ Version synchronization - Keeping VERSION file and tags in sync

### VS Code Extension Publishing
- ❌ `vsce` - VS Code extension CLI tool
- ❌ GitHub Actions workflow - Automated marketplace publishing
- ❌ Extension credentials - Marketplace PAT (Personal Access Token)

### Coordination
- ❌ Unified version management
- ❌ Release notes generation
- ❌ Multi-component release validation

---

## 🔄 Release Workflow Architecture

```
Developer creates tag (v0.3.5)
    ↓
GitHub detects new release tag
    ↓
┌───────────────────────────────────┐
│ Trigger automated release workflow │
└───────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ Parallel Jobs:                                          │
├─────────────────────────────────────────────────────────┤
│ 1. PyPI Publishing (Backend)                            │
│    ├─ Build Python package (wheel + sdist)              │
│    ├─ Run tests                                         │
│    ├─ Upload to PyPI via twine                          │
│    └─ Verify installation                               │
│                                                          │
│ 2. VS Code Extension Publishing                         │
│    ├─ Build VSIX package                                │
│    ├─ Run tests                                         │
│    ├─ Update marketplace via vsce                       │
│    └─ Verify marketplace listing                        │
│                                                          │
│ 3. Release Notes & Documentation                        │
│    ├─ Create GitHub release                             │
│    ├─ Generate CHANGELOG                                │
│    └─ Update documentation links                        │
└─────────────────────────────────────────────────────────┘
    ↓
All jobs complete
    ↓
✅ Release successful
```

---

## 📦 Setup Requirements

### 1. Install vsce (VS Code Extension CLI)

```bash
# Global installation (recommended)
npm install -g @vscode/vsce

# Or local in project
npm install --save-dev @vscode/vsce

# Verify installation
vsce --version
```

### 2. Install twine (PyPI Publishing)

```bash
# In projects/lmapp
pip install --upgrade twine build

# Verify installation
twine --version
```

### 3. Create VS Code Marketplace PAT

1. Go to https://marketplace.visualstudio.com/manage/publishers
2. Sign in with your GitHub account
3. Create or select your publisher
4. Generate Personal Access Token (PAT)
   - Name: `github-release-automation`
   - Scopes: `Publish`
   - Expiration: Annual (keep renewable)
5. Copy token and store in GitHub Secrets as `VSCODE_MARKETPLACE_PAT`

### 4. Create PyPI API Token

1. Go to https://pypi.org/account/
2. Generate API token
3. Store in GitHub Secrets as `PYPI_API_TOKEN`

---

## 🔄 GitHub Actions Workflows

### Workflow 1: Build & Test on Push

**File**: `.github/workflows/build-test.yml`

```yaml
name: Build & Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - name: Install dependencies
        run: |
          cd projects/lmapp
          pip install -r requirements.txt
      - name: Run tests
        run: |
          cd projects/lmapp
          pytest tests/

  test-extension:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: |
          cd projects/lmapp/vscode-extension
          npm install
      - name: Build extension
        run: |
          cd projects/lmapp/vscode-extension
          npm run compile
      - name: Run tests
        run: |
          cd projects/lmapp/vscode-extension
          npm test
```

### Workflow 2: Publish on Release Tag

**File**: `.github/workflows/publish-release.yml`

```yaml
name: Publish Release

on:
  push:
    tags:
      - 'v*'  # Trigger on version tags like v0.3.5

jobs:
  publish-pypi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install build tools
        run: |
          pip install --upgrade build twine
      
      - name: Build package
        run: |
          cd projects/lmapp
          python -m build
      
      - name: Check package
        run: |
          cd projects/lmapp
          twine check dist/*
      
      - name: Publish to PyPI
        env:
          TWINE_USERNAME: __token__
          TWINE_PASSWORD: ${{ secrets.PYPI_API_TOKEN }}
        run: |
          cd projects/lmapp
          twine upload dist/*

  publish-extension:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd projects/lmapp/vscode-extension
          npm install
      
      - name: Build extension
        run: |
          cd projects/lmapp/vscode-extension
          npm run compile
          npm run package
      
      - name: Publish to Marketplace
        run: |
          cd projects/lmapp/vscode-extension
          vsce publish --pat ${{ secrets.VSCODE_MARKETPLACE_PAT }}

  create-release:
    needs: [publish-pypi, publish-extension]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          files: projects/lmapp/dist/**
          body_path: CHANGELOG.md
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 📝 Release Procedures

### For Backend Releases

```bash
# 1. Update version
cd projects/lmapp
echo "0.3.6" > VERSION

# 2. Update CHANGELOG.md with release notes

# 3. Commit changes
git add VERSION CHANGELOG.md
git commit -m "chore: bump version to 0.3.6"

# 4. Create and push tag
git tag v0.3.6
git push origin main v0.3.6

# 5. GitHub Actions automatically:
#    - Builds the package
#    - Runs tests
#    - Publishes to PyPI
#    - Creates GitHub release
```

### For VS Code Extension Releases

```bash
# 1. Update version in package.json
cd projects/lmapp/vscode-extension
npm version patch  # or minor/major

# 2. Commit and push
git add package.json package-lock.json
git commit -m "chore: bump extension version"
git push origin main

# 3. Create release tag (if not using npm version)
git tag v0.3.6-vscode
git push origin v0.3.6-vscode
```

### Coordinated Releases (Recommended)

```bash
# 1. Update both backend and extension versions
# 2. Create matching tags
git tag v0.3.6
git push origin v0.3.6

# GitHub Actions handles:
# - PyPI publishing
# - VS Code marketplace publishing
# - GitHub release creation
```

---

## 🔐 Security Considerations

### Token Management
- ✅ Store tokens in GitHub Secrets only
- ✅ Use minimal scope tokens
- ✅ Rotate annually
- ✅ Never commit tokens to repository
- ✅ Use environment-specific tokens

### Release Validation
- ✅ All tests must pass before release
- ✅ Code review required for release branches
- ✅ Tag must be signed (recommended)
- ✅ Release notes must be approved

### Rollback Procedures
- ✅ Document how to yank PyPI versions
- ✅ Document how to unpublish extensions
- ✅ Maintain previous versions
- ✅ Quick fix branch procedure

---

## 📊 Publishing Checklist

```markdown
Before Creating Release Tag:
  [ ] All tests passing locally
  [ ] PR reviewed and merged
  [ ] Version updated in VERSION file
  [ ] CHANGELOG.md updated
  [ ] package.json version updated (for extension)
  [ ] README.md checked for outdated info
  [ ] Dependencies verified
  [ ] No uncommitted changes

Creating Release:
  [ ] Create annotated tag: git tag -a v0.3.6 -m "Release 0.3.6"
  [ ] Sign tag: git tag -s v0.3.6 -m "Release 0.3.6"
  [ ] Push tag: git push origin v0.3.6

Post-Release (automated, but verify):
  [ ] PyPI package appears on pypi.org
  [ ] VS Code extension updates on marketplace
  [ ] GitHub release created with notes
  [ ] Installation works: pip install lmapp
  [ ] Extension installable from marketplace
  [ ] Documentation links updated
```

---

## 🎯 Implementation Timeline

| Phase | Task | Time | Status |
|-------|------|------|--------|
| 1 | Install tools (vsce, twine) | 30min | ⏳ TODO |
| 2 | Create PyPI account & token | 1hr | ⏳ TODO |
| 3 | Create VS Code Marketplace account & PAT | 1hr | ⏳ TODO |
| 4 | Create GitHub Actions workflows | 2-3hrs | ⏳ TODO |
| 5 | Test locally with TestPyPI | 1hr | ⏳ TODO |
| 6 | Test extension packaging locally | 1hr | ⏳ TODO |
| 7 | Document procedures & train team | 1hr | ⏳ TODO |
| 8 | Dry-run full release workflow | 1hr | ⏳ TODO |
| **Total** | | **8-10 hrs** | |

---

## 📚 Files to Create

```
.github/workflows/
├── build-test.yml          (Create - daily tests)
├── publish-release.yml     (Create - on tag push)
└── test-pypi.yml           (Create - test publishing)

projects/lmapp/
├── MANIFEST.in             (Update/Create)
├── setup.cfg               (Update/Create)
└── pyproject.toml          (Update)

projects/lmapp/vscode-extension/
├── .vscodeignore           (Update)
└── package.json            (Verify)

Documentation/
├── RELEASE_PROCEDURE.md    (Create)
└── GITHUB_RELEASES.md      (Create)
```

---

## ⏭️ Next Steps

1. Install vsce and twine
2. Create PyPI and Marketplace accounts
3. Generate and store tokens in GitHub Secrets
4. Create GitHub Actions workflows
5. Test with TestPyPI
6. Document release procedures
7. Train team on release process

---

**Status**: ⏳ Ready to Implement  
**Estimated Effort**: 8-10 hours  
**Priority**: High (Phase 3)  
**Blocking**: Marketplace release (intentionally postponed)
