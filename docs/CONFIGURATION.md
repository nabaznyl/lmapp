# Configuration Guide

## Overview

lmapp stores its configuration in `~/.config/lmapp/config.json`. All settings can be managed through the CLI with automatic validation and persistence.

## Quick Reference

### View Configuration
```bash
lmapp config show
```

### Change Settings
```bash
lmapp config set <key> <value>
```

### Validate Configuration
```bash
lmapp config validate
```

### Reset to Defaults
```bash
lmapp config reset
```

---

## Configuration Options

### `backend` - LLM Backend Selection

Selects which local LLM backend to use.

**Valid Values**: `auto`, `ollama`, `llamafile`, `mock`

```bash
# Auto-detect best available backend
lmapp config set backend auto

# Force specific backend
lmapp config set backend ollama
lmapp config set backend llamafile

# Use mock backend for testing/demo
lmapp config set backend mock
```

**Behavior**:
- `auto` - Automatically selects running backend, or first available
- `ollama` - Use Ollama backend (requires Ollama service running)
- `llamafile` - Use llamafile backend (portable binary)
- `mock` - Use mock backend for testing without real backend

**Default**: `auto`

---

### `model` - AI Model Selection

Selects which AI model to use for chat.

**Valid Values**: Any installed model name (e.g., `tinyllama`, `llama2`, `mistral`)

```bash
# Use TinyLlama (small, fast)
lmapp config set model tinyllama

# Use Llama 2 (larger, more capable)
lmapp config set model llama2

# Use Mistral (7B, excellent quality/speed)
lmapp config set model mistral
```

**Common Models**:
- `tinyllama` - 1.1B parameters, very fast, good for testing
- `llama2` - 7B/13B parameters, good balance
- `mistral` - 7B parameters, high quality
- `neural-chat` - 7B, optimized for chat

**Default**: `tinyllama`

**Note**: The selected model must be installed on your backend. Use `lmapp install` to download models.

---

### `temperature` - Response Creativity

Controls randomness in AI responses.

**Valid Range**: `0.0` to `1.0`

```bash
# Very deterministic (always same response)
lmapp config set temperature 0.0

# Default (balanced)
lmapp config set temperature 0.7

# Very creative (random, varied responses)
lmapp config set temperature 1.0
```

**Effect**:
- **Low (0.0-0.3)**: Deterministic, focused, good for Q&A
- **Medium (0.4-0.7)**: Balanced, natural, recommended
- **High (0.8-1.0)**: Creative, varied, good for brainstorming

**Default**: `0.7`

**Recommendation**: Start with default, adjust based on use case.

---

### `debug` - Debug Logging

Enables detailed debug output for troubleshooting.

**Valid Values**: `true`, `false`

```bash
# Enable debug logging
lmapp config set debug true

# Disable debug logging
lmapp config set debug false
```

**Effect**:
- `true` - Console shows DEBUG level logs, all operations logged to file
- `false` - Console shows INFO level logs only, file still captures DEBUG

**Default**: `false`

**Log Location**: `~/.local/share/lmapp/logs/lmapp.log`

---

### `timeout` - Request Timeout

Maximum seconds to wait for a response.

**Valid Range**: Any positive integer

```bash
# Very short timeout (good for quick models)
lmapp config set timeout 30

# Default timeout
lmapp config set timeout 300

# Long timeout (for larger models)
lmapp config set timeout 600
```

**Default**: `300` (5 minutes)

**When to adjust**:
- **Decrease** if you have fast hardware and small models
- **Increase** if responses are timing out (slow hardware or large models)

---

### `max_tokens` - Response Length (Optional)

Maximum tokens in generated response.

**Valid Values**: Positive integer or null (no limit)

```bash
# No limit on response length
lmapp config set max_tokens null

# Limit to 256 tokens
lmapp config set max_tokens 256

# Limit to 1024 tokens
lmapp config set max_tokens 1024
```

**Default**: `null` (no limit)

**Note**: Implementation depends on backend support. Not all backends enforce this.

---

## Environment Variable Override

All configuration options can be overridden via environment variables, useful for scripting:

```bash
# Override backend
LMAPP_BACKEND=ollama lmapp chat

# Override model
LMAPP_MODEL=mistral lmapp chat

# Override temperature
LMAPP_TEMP=0.3 lmapp chat

# Enable debug mode
LMAPP_DEBUG=1 lmapp chat

# Combine multiple overrides
LMAPP_DEBUG=1 LMAPP_MODEL=llama2 LMAPP_TEMP=0.5 lmapp chat
```

**Environment Variables**:
- `LMAPP_BACKEND` - Override backend selection
- `LMAPP_MODEL` - Override model
- `LMAPP_TEMP` - Override temperature (0.0-1.0)
- `LMAPP_DEBUG` - Enable debug (0 or 1)

---

## Configuration File

Configuration is persisted to JSON:

**Location**: `~/.config/lmapp/config.json`

**Format**:
```json
{
  "backend": "auto",
  "model": "tinyllama",
  "temperature": 0.7,
  "debug": false,
  "max_tokens": null,
  "timeout": 300
}
```

**Manual Editing**: You can edit this file directly, but validation errors will occur on next command.

---

## Error Messages & Solutions

### "Unknown configuration key"
```
✗ Unknown configuration key: invalid_key
Valid keys: backend, model, temperature, debug, max_tokens, timeout
```
**Solution**: Check spelling. Use `lmapp config show` to see valid keys.

### "Backend must be one of..."
```
✗ Failed to set backend: Invalid value
  Backend must be one of ['auto', 'ollama', 'llamafile', 'mock']
```
**Solution**: Use one of the four valid backend options.

### "Input should be less than or equal to 1"
```
✗ Failed to set temperature: Invalid value
  Input should be less than or equal to 1
```
**Solution**: Temperature must be 0.0-1.0. Example: `lmapp config set temperature 0.5`

### "Model name cannot be empty"
```
✗ Failed to set model: Invalid value
  Model name cannot be empty
```
**Solution**: Provide a model name. Example: `lmapp config set model tinyllama`

---

## Common Workflows

### For Fast, Deterministic Responses (Q&A)
```bash
lmapp config set temperature 0.2
lmapp config set model tinyllama
lmapp config set backend auto
```

### For Creative Brainstorming
```bash
lmapp config set temperature 0.8
lmapp config set model mistral
```

### For Debugging Issues
```bash
lmapp config set debug true
LMAPP_DEBUG=1 lmapp chat
tail -f ~/.local/share/lmapp/logs/lmapp.log
```

### For Testing Without Backend
```bash
lmapp config set backend mock
lmapp chat
# Will use mock responses for testing
```

### Scripted Configuration
```bash
#!/bin/bash
# Production settings
lmapp config set model llama2
lmapp config set temperature 0.3
lmapp config set debug false
lmapp config validate
```

---

## Troubleshooting

### Configuration won't save
1. Check file permissions: `ls -la ~/.config/lmapp/`
2. Ensure directory exists: `mkdir -p ~/.config/lmapp`
3. Try resetting: `lmapp config reset`

### Invalid configuration on startup
1. View current config: `lmapp config show`
2. Validate: `lmapp config validate`
3. Reset if corrupted: `lmapp config reset`

### Changes not taking effect
1. Verify changes saved: `lmapp config show`
2. Environment variables override config: `env | grep LMAPP`
3. Singleton instance caches settings - restart lmapp

### Model not found error
1. Check installed models: `lmapp status`
2. Install missing model: `lmapp install`
3. Update config with correct name: `lmapp config show`

---

## Advanced Topics

### Profile-Based Configuration (Future)
```bash
# Coming in v0.2.0
lmapp config load-profile demo
lmapp config save-profile myconfig
lmapp config list-profiles
```

### Configuration Inheritance (Future)
```bash
# System config
/etc/lmapp/config.json

# User config (overrides system)
~/.config/lmapp/config.json

# Per-project config (overrides both)
./lmapp.config.json
```

### Metrics & Analytics
```bash
# View usage statistics
lmapp stats

# Export configuration history
lmapp config export-history
```

---

## References

- [CLI Usage Guide](CLI.md)
- [Troubleshooting](TROUBLESHOOTING.md)
- [Developer Guide](DEVELOPMENT.md)

