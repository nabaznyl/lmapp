# Quick Start Guide

Get lmapp up and running in 5 minutes.

## 1. Installation

```bash
# Install lmapp
lmapp install

# This will:
# 1. Check your system
# 2. Install dependencies
# 3. Download and start a backend
# 4. Download an AI model
# 5. Launch your first chat
```

**Time**: 5-10 minutes (depending on internet speed)

## 2. First Chat

```bash
# Start chatting
lmapp chat

# Type your message and press Enter
You: What is machine learning?
AI: Machine learning is...

# See available commands
You: /help

# View conversation history
You: /history

# Exit chat
You: /exit
```

## 3. Configure Settings

```bash
# View current configuration
lmapp config show

# Try different settings
lmapp config set temperature 0.3    # More focused
lmapp config set model mistral      # Try another model

# Verify changes
lmapp config validate
```

## 4. Enable Debug (If Issues)

```bash
# Show detailed logs
lmapp --debug chat

# Watch logs in another terminal
tail -f ~/.local/share/lmapp/logs/lmapp.log
```

## 5. Get Help

```bash
# CLI help
lmapp --help
lmapp chat --help
lmapp config --help

# Chat commands
# Inside chat, type: /help

# Full documentation
lmapp status
```

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `lmapp chat` | Start chat session |
| `lmapp config show` | View settings |
| `lmapp config set key value` | Change setting |
| `lmapp install` | Install/update backend |
| `lmapp status` | Show system status |
| `lmapp --debug chat` | Enable debug mode |

---

## Next Steps

- Read [Configuration Guide](CONFIGURATION.md) for advanced options
- Check [Troubleshooting](TROUBLESHOOTING.md) if you hit issues
- See [Full Documentation](README.md) for complete reference

---

**You're all set!** Enjoy chatting with your local AI assistant. 🎉

