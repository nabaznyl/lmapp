# GitHub Launch Verification Checklist

Complete this before executing launch for professional repository setup.

---

## ✅ Repository Settings

### Visibility & Access
- [ ] Repository is **PUBLIC** (check Settings > Visibility)
- [ ] Confirm Settings > General shows "Public"
- [ ] No private/secret files in commit history (check git log)
- [ ] .gitignore is properly configured

### Repository Description
- [ ] Add to Settings > General > Description:
  ```
  Local AI chat in your terminal. Privacy-first, production-ready.
  ```
- [ ] Add to Settings > General > Website (optional):
  ```
  Link to documentation or project page
  ```
- [ ] Add Topics (Settings > General > Topics):
  - `python`
  - `llm`
  - `ai`
  - `local-llm`
  - `privacy`
  - `cli`
  - `open-source`
  - `chat`

---

## ✅ GitHub Features

### Discussions (Community Engagement)
- [ ] Enable Settings > Features > Discussions ✓
- [ ] Create discussion categories:
  - [ ] **Announcements** - Product updates, releases
  - [ ] **General** - Off-topic chat
  - [ ] **Ideas** - Feature requests & suggestions
  - [ ] **Q&A** - Questions & how-to help
  - [ ] **Troubleshooting** - Bug reports & solutions

### Issue Templates (Structure Bug Reports)
Create `.github/ISSUE_TEMPLATE/` folder with:

#### bug_report.md
- [ ] Create file at `.github/ISSUE_TEMPLATE/bug_report.md`
```markdown
---
name: Bug report
about: Report a bug to help us improve
labels: bug
---

## Description
Brief description of the bug.

## Steps to Reproduce
1. First step
2. Second step
3. ...

## Expected Behavior
What should happen?

## Actual Behavior
What actually happens?

## Environment
- OS: [e.g., Ubuntu 22.04]
- Python: [e.g., 3.10]
- lmapp version: [e.g., 0.1.0]

## Additional Context
Any additional information (logs, error messages, etc.)
```

#### feature_request.md
- [ ] Create file at `.github/ISSUE_TEMPLATE/feature_request.md`
```markdown
---
name: Feature request
about: Suggest an idea for lmapp
labels: enhancement
---

## Problem
Describe the problem this feature would solve.

## Solution
Describe your ideal solution.

## Alternatives
Any alternative solutions you've considered?

## Additional Context
Why is this important? Who would benefit?
```

### Labels (Organization)
Create/verify labels in Issues > Labels:
- [ ] `bug` - Red label, critical issues
- [ ] `enhancement` - Blue label, feature requests
- [ ] `documentation` - Green label, docs improvements
- [ ] `help wanted` - Purple label, community help needed
- [ ] `good first issue` - Yellow label, new contributor friendly
- [ ] `in progress` - Orange label, actively being worked on
- [ ] `question` - Gray label, questions from users

### Branches (Workflow)
- [ ] Main branch: `main` (production-ready)
- [ ] Development branch: `develop` (optional, for parallel work)
- [ ] Protection rule: Require PR review before merge (if team)

---

## ✅ Documentation Files

### Root Level
- [ ] **README.md** - Present and professional ✓
  - [ ] Badges (tests, coverage, license)
  - [ ] Quick start (under 5 lines)
  - [ ] Feature list
  - [ ] Installation
  - [ ] Usage examples
  
- [ ] **CONTRIBUTING.md** - Present and clear
  - [ ] How to set up development environment
  - [ ] Code style guidelines
  - [ ] How to submit PRs
  - [ ] Acknowledgement of contributors

- [ ] **LICENSE** - MIT or your choice
  - [ ] Clearly visible
  - [ ] Matches license in package

- [ ] **SECURITY.md** - Security policy (optional but recommended)
  ```markdown
  # Security Policy

  ## Reporting Security Vulnerabilities

  Please email security@yourdomain.com instead of using the issue tracker.
  
  We will respond within 48 hours.
  ```

### docs/ Folder (if applicable)
- [ ] Architecture guide (optional)
- [ ] API documentation (optional)
- [ ] Troubleshooting guide

---

## ✅ Release Management

### Releases
- [ ] GitHub Releases page configured
- [ ] v0.1.0 release created (or about to create)
  - [ ] Tag: `v0.1.0`
  - [ ] Title: "v0.1.0 - Foundation Release"
  - [ ] Description: Copy from RELEASE_v0.1.0.md
  - [ ] Mark as "Latest release"

### Tags
- [ ] Verify `v0.1.0` tag exists: `git tag` shows it
- [ ] Tag is signed (optional but professional)

---

## ✅ Community Setup

### GitHub Discussions (for questions)
- [ ] Discussions tab visible
- [ ] Categories created (Announcements, Q&A, Ideas, General)
- [ ] "Welcome" discussion post
  ```markdown
  # Welcome to lmapp discussions!

  This is where we discuss:
  - **Ideas** for new features
  - **Questions** about usage
  - **General** feedback
  
  For bugs, please use Issues.
  ```

### About Section
- [ ] Add to repository home (gear icon > About)
  - [ ] Description: "Local AI chat in your terminal"
  - [ ] Website: (optional)
  - [ ] Topics: python, llm, ai, privacy, cli
  - [ ] Release: v0.1.0
  - [ ] License: MIT

---

## ✅ Workflow Files (Optional but Professional)

### .github/workflows/ Folder (CI/CD)
- [ ] Tests run automatically on push (if GitHub Actions setup)
- [ ] Coverage reports generated (if available)
- [ ] Deploy workflow (if applicable)

---

## ✅ Quality Signals

### Code Quality
- [ ] 100% tests passing (confirm locally: `pytest`)
- [ ] Code follows consistent style (check with `black`)
- [ ] All imports organized (check with `isort`)

### Documentation Quality
- [ ] README is comprehensive but concise
- [ ] Code examples actually work
- [ ] All commands tested
- [ ] Links are correct

### User Experience
- [ ] Installation is simple (30 seconds max)
- [ ] Error messages are helpful
- [ ] First-time experience is smooth
- [ ] Demo scripts work without modification

---

## ✅ Pre-Launch Verification

### Settings Review
- [ ] Run through all steps above ✓
- [ ] Repository is definitely public
- [ ] Issue templates appear when creating new issue
- [ ] Discussions are enabled
- [ ] Release will be visible

### GitHub Pages (Optional)
- [ ] Enable if you have docs site
- [ ] Deploy from `gh-pages` or `docs/` folder
- [ ] Test that docs site works

### Notifications Setup (Personal)
- [ ] Configure your GitHub notifications
  - [ ] Watch repository for important updates
  - [ ] Set email for immediate notifications
  - [ ] Mute irrelevant notifications

---

## ✅ Security Checklist

- [ ] No secrets in code (API keys, passwords, tokens)
- [ ] No large binaries in repository
- [ ] No malicious dependencies
- [ ] All dependencies documented in requirements.txt
- [ ] Python version specified (e.g., 3.8+)

### Additional Security (If Needed)
- [ ] Enable branch protection rules
- [ ] Require status checks to pass
- [ ] Require code review (for team projects)
- [ ] Enable vulnerability scanning

---

## ⚡ Quick Setup Script (if not done manually)

```bash
# Verify repository is public
curl -I https://github.com/yourusername/lmapp

# List current topics
# (Currently done via GitHub web UI)

# Verify v0.1.0 tag exists
git tag | grep v0.1.0

# Verify tests pass
pytest -v

# Verify docs build (if applicable)
# (Depends on your setup)
```

---

## 📋 Pre-Launch Checklist (Final)

Run through this 30 minutes before launching:

- [ ] All items above completed ✓
- [ ] README visible and professional
- [ ] Tests passing locally (`pytest`)
- [ ] v0.1.0 release created on GitHub
- [ ] First social media post ready
- [ ] Reddit posts prepared
- [ ] Dev.to draft ready
- [ ] Notifications configured
- [ ] You're logged into GitHub as correct user
- [ ] Repository shows as public
- [ ] Topics visible on repository

---

## 🚀 You're Ready When

✅ All checkboxes above are checked  
✅ You've personally verified the repository looks good  
✅ You're ready to post to communities  
✅ You have 2-3 hours available for launch day  

**Time to launch! 🎉**

---

## 📞 Troubleshooting

### "Discussion tab not showing"
- Settings > Features > Discussions (toggle on)

### "Issue templates not appearing"
- Verify folder is `.github/ISSUE_TEMPLATE/`
- Verify files are `.md` format
- Files must have YAML frontmatter
- May need to reload page

### "Release not visible"
- Verify tag exists: `git tag | grep v0.1.0`
- Create Release from Releases page
- Copy from existing tag

### "Repository showing as private"
- Settings > Visibility > Public (change and confirm)
- Wait 5 minutes for cache to clear
- Verify in incognito window

### "Links in README not working"
- Test each link manually
- Verify file paths are correct
- Check relative vs absolute paths

---

**Questions? See LAUNCH_STRATEGY.md for detailed guidance.**
