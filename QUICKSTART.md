# LMAPP Quick Start Guide (5 Minutes)

**Get started with LMAPP in 5 minutes. This guide covers the essentials.**

## Installation (1 minute)

### Option 1: Pip (Recommended)
```bash
pip install lmapp
```

### Option 2: Development Mode
```bash
git clone https://github.com/yourusername/lmapp.git
cd lmapp
pip install -e .
```

## Backend Setup (2 minutes)

LMAPP needs an LLM backend. Choose one:

### Ollama (Most Popular)
1. Download: https://ollama.ai
2. Start: `ollama serve`
3. Pull a model: `ollama pull llama2` (or mistral, neural-chat, etc.)
4. LMAPP will auto-detect it

### Llamafile (Single Binary)
1. Download: https://llamafile.ai
2. Extract and run: `./llamafile -m model.gguf`
3. LMAPP will auto-detect it

## First Chat (1 minute)

```bash
# Start LMAPP
lmapp chat

# You'll see:
# 1. Main Menu (select "Chat")
# 2. Model Selector (pick Ollama model)
# 3. Type your message and press Enter
# 4. Response streams in real-time
```

## Web UI (1 minute - v0.3.0-beta+)

```bash
# Start the web server
lmapp web

# Opens automatically:
# http://localhost:8000
```

### Web UI Features
- **Chat Tab:** Real-time streaming chat
- **Documents Tab:** Upload PDFs/text for RAG search
- **Plugins Tab:** Install community plugins
- **Settings:** Configure model, temperature, context size

## Essential Commands

```bash
# Start main menu
lmapp

# Quick chat (no menu)
lmapp chat

# Start web UI
lmapp web

# System diagnostics
lmapp status

# View configuration
lmapp config show

# Create new session
lmapp session create my-session
lmapp session list
```

## Common Recipes

### 1. Document Analysis
```bash
# Start chat with RAG enabled
lmapp chat

# Upload document in web UI (Documents tab)
# Ask: "What does this document contain?"
```

### 2. Use Custom Prompts
```bash
lmapp chat --system "You are a Python expert who explains code clearly"
```

### 3. Batch Processing
```bash
# Create input file
echo "What is AI?" > input1.txt
echo "What is ML?" > input2.txt

# Process batch
lmapp batch process *.txt
```

### 4. Plugin Usage
```bash
# List available plugins
lmapp plugin list

# Install a plugin
lmapp plugin install translator

# Use plugin in chat
# Start chat, then /translator en-es "Hello"
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No backends available" | Ensure Ollama or llamafile is running |
| "Model not found" | Download model: `ollama pull llama2` |
| "Web UI won't start" | Check port 8000 not in use: `lsof -i :8000` |
| "Slow responses" | Reduce token count or use smaller model |
| "Out of memory" | Close other apps or use CPU backend |

## Next Steps

- **Read:** [README.md](README.md) - Full feature list and examples
- **Deploy:** [DEPLOYMENT.md](DEPLOYMENT.md) - Production setup
- **API:** [API_REFERENCE.md](API_REFERENCE.md) - REST endpoints
- **Plugins:** [PLUGIN_DEVELOPER_GUIDE.md](src/lmapp/plugins/PLUGIN_DEVELOPER_GUIDE.md) - Create your own
- **Config:** [CONFIGURATION.md](CONFIGURATION.md) - Advanced setup

## Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/lmapp/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/lmapp/discussions)
- **Documentation:** [Full Docs](README.md)

---

**Version:** 0.3.0-beta  
**Last Updated:** Dec 11, 2025  
**Status:** ✅ Production Ready
