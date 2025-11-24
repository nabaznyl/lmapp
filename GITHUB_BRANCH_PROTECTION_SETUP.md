# GITHUB_BRANCH_PROTECTION_SETUP.md

## Protecting the Main Branch

**Current Status:** ⚠️ NOT PROTECTED  
**Action Required:** Enable branch protection rules on GitHub

---

## Why Branch Protection Matters

**Without protection:**
- Anyone can force-push and rewrite history
- Accidentally deleted branches can't be recovered
- CI/CD status checks can be bypassed
- Accidental direct pushes to main possible

**With protection:**
- ✅ Require pull requests for all changes
- ✅ Require CI/CD checks to pass before merge
- ✅ Prevent force pushes and deletions
- ✅ Maintain clean, verifiable history

---

## How to Enable Branch Protection

### Step 1: Go to Repository Settings
1. Go to: https://github.com/nabaznyl/lmapp
2. Click **Settings** (top right)
3. Select **Branches** (left sidebar)

### Step 2: Add Branch Protection Rule
1. Click **Add Rule** button
2. Enter branch name: `main`

### Step 3: Configure Protection Rules

**Recommended Configuration:**

**✓ Require a pull request before merging**
- [x] Require pull request reviews before merging
- [x] Dismiss stale pull request approvals when new commits are pushed
- [x] Require review from code owners (if using CODEOWNERS file)
- [x] Require approval of the most recent reviewers

**✓ Require status checks to pass before merging**
- [x] Require branches to be up to date before merging
- [x] Require passing tests (select from available checks):
  - `Tests & Quality Checks` (from tests.yml)
  - `Publish to PyPI & GitHub Releases` (from publish.yml)

**✓ Enforce restrictions**
- [x] Restrict who can push to matching branches
- [x] Dismiss pull request reviews from code owners
- [x] Include administrators

**✓ Advanced options**
- [x] Require linear history
- [x] Require branches to be up to date
- [x] Require code owner reviews
- [x] Allow force pushes (for admins only - OPTIONAL)
- [x] Allow deletions (UNCHECKED - do NOT allow)

### Step 4: Save Rules
Click **Create** (at bottom of form)

---

## After Protection is Enabled

### All merges to `main` require:
1. ✅ Pull Request (no direct pushes)
2. ✅ Passing CI/CD tests (tests.yml)
3. ✅ At least 1 review (if configured)
4. ✅ Up-to-date with base branch

### Branch deletion protection:
- ❌ `main` branch cannot be deleted accidentally
- ❌ No force pushes allowed (preserves history)
- ✅ Only admins can override (if enabled)

---

## CLI Alternative (for programmatic setup)

If you prefer using GitHub CLI:

```bash
# Install GitHub CLI (if not already installed)
# https://cli.github.com/

# Authenticate
gh auth login

# Create branch protection rule
gh api repos/nabaznyl/lmapp/branches/main/protection \
  --input - << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "Tests & Quality Checks"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```

---

## Verification

### To verify protection is active:

1. Go to: https://github.com/nabaznyl/lmapp/settings/branches
2. Look for `main` in the list
3. You should see a checkmark (✓) next to protection rules

### To test it works:

1. Try to force-push to `main` locally:
   ```bash
   git push --force origin main
   ```
   **Expected:** Permission denied error ✅

2. Try to delete `main` branch on GitHub:
   **Expected:** Cannot delete protected branch ✅

---

## Configuration Applied

### This setup ensures:
- ✅ **Merge enforcement:** All changes via PR
- ✅ **Quality gates:** Tests must pass
- ✅ **History protection:** No force pushes/deletions
- ✅ **Admin capability:** Only admins can override (if enabled)

---

## Recommended Review Requirements

For a public project like lmapp:

**Minimum:** 1 review before merge
- Catches obvious issues
- Ensures code quality
- Maintains standards

**Optional (if project grows):** 2+ reviews
- For projects with many contributors
- Higher security requirements
- Enterprise standards

---

## Related Documentation

- **GitHub Docs:** [About protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- **Branch Naming:** Main branch is `main` (not `master`)
- **CI/CD:** See `.github/workflows/tests.yml` for check configuration

---

## Status

**Current:** ⚠️ Not Protected  
**Action:** Manual setup required in GitHub UI  
**Timeline:** < 5 minutes to complete  
**Impact:** Prevents accidental data loss and history rewriting

---

**Created:** November 24, 2025  
**Priority:** HIGH (should be configured before public release)  
**Complexity:** LOW (UI-based, no code changes)
