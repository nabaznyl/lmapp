# LMAPP Trial & Freemium Model

> **Get 30 days of full access. Then enjoy powerful free features forever.**

---

## Overview

LMAPP uses a **trial + freemium** model to balance accessibility with sustainability:

- **Trial Period:** 30 days of **full features** (all backends, RAG, plugins, batch, web UI)
- **Auto-Renewal:** Trial automatically renews every 30 days (for testing purposes)
- **Free Tier:** After trial (or if you disable Advanced Mode), access core chat with 1 backend
- **No Paywall Yet:** Currently 100% free to use; paid tier planned for future

---

## Feature Breakdown

### Free Tier Features
These are **always available**, regardless of trial status:

- ✅ **Chat** - Limited to Ollama backend only
- ✅ **CLI** - Full command-line interface
- ✅ **Help & Status** - System diagnostics
- ✅ **Basic Configuration** - Adjust settings
- ❌ RAG (Retrieval-Augmented Generation)
- ❌ Plugins
- ❌ Batch Processing
- ❌ Web UI
- ❌ Multi-backend support

**Use case:** Users who want simple AI chat locally

### Trial Tier Features
**Available for 30 days after first install** (infinite auto-renewal):

- ✅ **Full Chat** - All 8 backends (Ollama, LlamaFile, Mistral, OpenAI, etc.)
- ✅ **RAG System** - Upload documents, semantic search
- ✅ **Plugins** - Community & advanced plugins
- ✅ **Batch Processing** - Process multiple inputs
- ✅ **Web UI** - Beautiful browser-based interface
- ✅ **Sessions** - Save & restore conversations
- ✅ **Advanced Mode** - All experimental features
- ✅ **System Prompts** - Custom role-based behavior

**Use case:** New users evaluating LMAPP's full capabilities

---

## How Trial Works

### Starting a Trial

```bash
# Install LMAPP
pip install lmapp

# First run automatically starts 30-day trial
lmapp chat

# Check trial status
lmapp status
```

**Output:**
```
LMAPP Status Report
===================
Version: v0.4.0
Trial Status: Active
Days Remaining: 29 days
Advanced Mode: ON
```

### Trial Auto-Renewal

Your trial **automatically renews every 30 days** for testing and development purposes.

```bash
# Check renewal info
lmapp config show

# Output:
# Trial Status: Active
# Started: 2025-12-11
# Renewal Count: 0
# Next Renewal: 2026-01-10
```

### What Happens When Trial Expires

If you **don't** renew or downgrade Advanced Mode:

```
"Your 30-day trial has ended.
Advanced Mode is now OFF.
Reverting to Free Tier features.
You still have access to chat with Ollama!"
```

You **can still use LMAPP** with free tier features indefinitely.

---

## Advanced Mode

**Advanced Mode** is the key to unlocking trial/paid features.

### Enabling/Disabling

```bash
# Check status
lmapp config show | grep "Advanced Mode"

# Enable Advanced Mode (trial/paid users)
lmapp config set advanced-mode true

# Disable Advanced Mode (revert to free tier)
lmapp config set advanced-mode false
```

### Important

- **Free users:** Advanced Mode is always OFF (enforced)
- **Trial users:** Advanced Mode is ON (can disable if you want)
- **Paid users:** Advanced Mode is ON (can disable if you want)
- Even paid users turning OFF Advanced Mode = free tier experience

---

## Trial Persistence & Reinstallation

Your trial tracker is stored locally:

```
Primary:   ~/.lmapp/trial_tracker.json
Backup:    ~/.lmapp_backup/trial_tracker.json
System:    /var/lmapp/trial_tracker.json (Linux only)
```

### If You Uninstall & Reinstall

The trial tracker is **saved in a backup location** so reinstalling doesn't reset your trial:

```bash
# Uninstall
pip uninstall lmapp

# Reinstall (trial counter preserved from backup)
pip install lmapp

# Trial state restored automatically
lmapp status
```

### Manual Trial Reset

If you want to start a fresh trial:

```bash
# Option 1: Delete tracker file
rm ~/.lmapp/trial_tracker.json
rm ~/.lmapp_backup/trial_tracker.json
sudo rm /var/lmapp/trial_tracker.json  # Linux

# Reinstall
pip install lmapp

# New 30-day trial begins
```

---

## Future: Paid Tier (Coming Soon)

When paid tier launches:

- **Free tier** remains free forever ✅
- Trial behavior may change (limited time instead of infinite renewal)
- Paid subscription unlocks Advanced Mode permanently
- CLI remains open-source and free

---

## FAQ

### Q: Can I use LMAPP forever for free?

**A:** Yes! Free tier is always available. You get core chat with Ollama indefinitely.

### Q: Will my trial ever expire?

**A:** Not while you're using it for testing. The trial renews automatically every 30 days.

### Q: What happens when paid tier launches?

**A:** Free tier unchanged. Trial may become time-limited (30 days max). You can pay to unlock Advanced Mode permanently.

### Q: Can I delete the trial tracker to reset?

**A:** Yes, but we ask you not to. We trust honest users. The trial system is for legitimate evaluation, not to circumvent future paywalls.

### Q: Why limit free tier to Ollama only?

**A:** Keeps the product simple for beginners and demonstrates the value of advanced features.

### Q: Can I use LMAPP at work/commercially on free tier?

**A:** Yes, free tier is unrestricted. Use it however you want. (Future paid tier may have commercial licensing terms.)

### Q: Does trial tracking phone home?

**A:** No. Everything is local. We never collect or send trial data anywhere. (This may change when paid tier launches.)

---

## Support & Feedback

Have questions about trial/freemium?

- **GitHub Issues:** [Report a bug](https://github.com/nabaznyl/lmapp/issues)
- **Discussions:** [Ask a question](https://github.com/nabaznyl/lmapp/discussions)
- **Documentation:** [See ADVANCED_MODE.md](ADVANCED_MODE.md) for feature details

---

**Last Updated:** December 11, 2025  
**Version:** LMAPP v0.4.0+
