# Advanced Mode Reference

> **Advanced Mode unlocks the full power of LMAPP.**

---

## What is Advanced Mode?

Advanced Mode is a **feature flag** that controls access to LMAPP's advanced capabilities:

- Multi-backend support (8+ LLM providers)
- RAG (Retrieval-Augmented Generation) for document search
- Plugin system for extensibility
- Batch processing for bulk operations
- Web UI for browser-based access
- Session management and persistence
- Experimental features and optimizations

**Without Advanced Mode,** you get the core chat experience with a single backend (Ollama).

---

## Feature Access Gating

### Free Tier (Advanced Mode OFF - enforced)

```
✓ Chat (Ollama backend only)
✓ CLI interface
✓ System diagnostics (status, info)
✓ Basic configuration
✗ RAG system
✗ Plugins
✗ Batch processing
✗ Web UI
✗ Multi-backend support
✗ Sessions
✗ Advanced experimental features
```

**Eligibility:** Default for all users without active trial or paid account

### Trial Tier (Advanced Mode ON - enabled)

```
✓ Full Chat (8+ backends)
✓ RAG system (unlimited documents)
✓ Plugins (all community plugins)
✓ Batch processing
✓ Web UI (full access)
✓ Sessions & conversation history
✓ All experimental features
✓ System prompts library
✓ Advanced configuration
```

**Eligibility:** 30 days auto-renewing trial period (testing purposes)

### Paid Tier (Advanced Mode ON - paid)

```
✓ Everything in Trial
✓ Premium plugins
✓ Priority support
✓ Commercial use rights
✓ Advanced analytics
✓ Custom integrations
```

**Eligibility:** Current paid subscribers (future feature)

---

## Checking Advanced Mode Status

### View Current Status

```bash
lmapp status
```

**Output (Free Tier):**
```
LMAPP Status
============
Version: v0.4.0
Trial Status: Not Active
Advanced Mode: OFF (Free Tier)
Backends Available: ollama
Features: chat, cli
```

**Output (Trial Tier):**
```
LMAPP Status
============
Version: v0.4.0
Trial Status: Active (29 days remaining)
Advanced Mode: ON (Trial Tier)
Backends Available: ollama, llamafile, mistral, openai, anthropic, groq, cohere, replicate
Features: chat, rag, plugins, batch, web-ui, sessions
```

### View Configuration

```bash
lmapp config show
```

Includes:
- `advanced_mode` - Current state (ON/OFF)
- `trial_status` - Active/Expired
- `trial_renewal_count` - Number of renewals
- `trial_start_date` - When trial began

---

## Enabling/Disabling Advanced Mode

### Enable Advanced Mode

```bash
lmapp config set advanced-mode true
```

**Prerequisites:**
- Active trial period, OR
- Paid subscription (when available)

**If neither:** Command succeeds, but feature gating enforces free tier anyway.

### Disable Advanced Mode

```bash
lmapp config set advanced-mode false
```

**Effect:** Immediately reverts to free tier features, even if you have active trial.

**Use case:** Testing free tier experience, reducing system resources

---

## What Features Are Gated?

### Feature: Multi-Backend Support

**Free Tier:**
```bash
$ lmapp chat --model llama2
Available backends: ollama
Error: Only 'ollama' is available in free tier
```

**Trial Tier:**
```bash
$ lmapp chat --model gpt-4
Connecting to OpenAI...
Ready!
```

### Feature: RAG (Document Search)

**Free Tier:**
```bash
$ lmapp rag add myfile.pdf
Error: RAG requires Advanced Mode
(Available in Trial or with paid subscription)
```

**Trial Tier:**
```bash
$ lmapp rag add myfile.pdf
✓ Document indexed (150 pages)
$ lmapp chat
You: Summarize this document
AI: [Searches document and responds]
```

### Feature: Plugins

**Free Tier:**
```bash
$ lmapp plugin list
No plugins available in free tier
```

**Trial Tier:**
```bash
$ lmapp plugin list
Available plugins:
  • translator - Language translation
  • code-reviewer - Code analysis
  • summarizer - Text summarization
  • ...8 more
```

### Feature: Web UI

**Free Tier:**
```bash
$ lmapp web
Web UI requires Advanced Mode
(Available in Trial or with paid subscription)
```

**Trial Tier:**
```bash
$ lmapp web
✓ Web UI running at http://localhost:8000
✓ Open in browser to get started
```

### Feature: Batch Processing

**Free Tier:**
```bash
$ lmapp batch --input queries.txt
Batch processing requires Advanced Mode
(Available in Trial or with paid subscription)
```

**Trial Tier:**
```bash
$ lmapp batch --input queries.txt
Processing 100 queries...
✓ Complete (see results.json)
```

---

## Understanding Feature Gating

### How It Works

At startup, LMAPP checks:

```python
# On every run:
if not trial.is_active() and not paid.is_active():
    advanced_mode = False  # Force free tier

if not advanced_mode:
    features.disable('rag', 'plugins', 'batch', 'web_ui')
    backends.limit_to(['ollama'])
```

### Why This Approach?

1. **Simple:** Single feature flag controls all gating
2. **Fair:** Even paid users can test free tier
3. **Flexible:** Easy to adjust what's gated
4. **Honest:** No hidden restrictions, all documented

---

## Advanced Mode Settings

### In Configuration File

Edit `~/.local/share/lmapp/config.json`:

```json
{
  "advanced_mode": true,
  "trial": {
    "is_active": true,
    "days_remaining": 29,
    "renewal_count": 0
  },
  "paid": {
    "is_active": false,
    "subscription_tier": null
  }
}
```

### Via CLI

```bash
# Enable
lmapp config set advanced-mode true

# Disable
lmapp config set advanced-mode false

# Check
lmapp config show | grep advanced-mode
```

---

## Migration Path: Free → Trial → Paid

### Phase 1: Free Tier
User installs LMAPP, gets 30-day trial automatically.

```
$ pip install lmapp
✓ Installed
✓ 30-day trial activated automatically
$ lmapp status
Advanced Mode: ON (Trial)
Days Remaining: 30
```

### Phase 2: Trial Active (30 days)
User evaluates full features, discovers value.

```
$ lmapp chat  # Full access to all backends
$ lmapp rag add docs.pdf  # RAG works
$ lmapp plugin list  # All plugins available
```

### Phase 3: Trial Expires or Disables
User reverts to free tier, can upgrade.

```
$ lmapp status
Trial Status: Expired
Advanced Mode: OFF (Free Tier)

Upgrade? lmapp subscribe  # (when available)
```

### Phase 4: Paid Subscription (Future)
User subscribes, Advanced Mode permanently ON.

```
$ lmapp subscribe --tier pro
✓ Subscribed (pro tier)
$ lmapp status
Advanced Mode: ON (Paid - Pro)
```

---

## Troubleshooting

### Advanced Mode Shows OFF but Trial is Active

**Cause:** Configuration mismatch

**Solution:**
```bash
# Re-sync config
lmapp config reset
lmapp status
```

### Feature Access Denied Despite Trial

**Cause:** Trial expired (no auto-renewal triggered)

**Solution:**
```bash
# Check trial status
lmapp status

# Manually trigger renewal (if needed)
lmapp trial renew
```

### Can't Enable Advanced Mode

**Cause:** No active trial or paid subscription

**Solution:**
```bash
# Check eligibility
lmapp status

# Options:
# 1. Wait for trial to activate
# 2. Reinstall to start fresh trial
# 3. Wait for paid subscription feature
```

---

## For Developers

### Feature Flag in Code

```python
from lmapp.core.config import load_config

config = load_config()

if config.advanced_mode:
    # Enable advanced features
    enable_rag()
    enable_plugins()
    enable_multi_backend()
else:
    # Restrict to free tier
    disable_rag()
    disable_plugins()
    limit_backends(['ollama'])
```

### Testing Advanced Mode

```bash
# Force Advanced Mode ON
lmapp config set advanced-mode true

# Force Advanced Mode OFF
lmapp config set advanced-mode false

# Test feature gating
lmapp --test-gating
```

---

## FAQ

### Q: Can I use Advanced Mode features without a trial?

**A:** Only if you have an active trial or paid subscription. Free users cannot access advanced features.

### Q: Does disabling Advanced Mode delete my RAG data?

**A:** No, data is preserved. Re-enable Advanced Mode and your data is accessible again.

### Q: Can I switch between free/trial/paid without reinstalling?

**A:** Yes. Advanced Mode automatically adjusts based on your trial/subscription status.

### Q: Will my plugins stop working if I disable Advanced Mode?

**A:** Yes, they'll be unavailable. They resume working when you re-enable Advanced Mode.

### Q: What happens to my Web UI sessions if I disable Advanced Mode?

**A:** Web UI is inaccessible, but session data is preserved. Sessions resume when you re-enable.

---

## See Also

- [TRIAL_AND_FREEMIUM.md](TRIAL_AND_FREEMIUM.md) - Trial period details
- [README.md](README.md) - Main documentation
- [QUICKSTART.md](QUICKSTART.md) - Getting started guide

---

**Last Updated:** December 11, 2025  
**Version:** LMAPP v0.4.0+
