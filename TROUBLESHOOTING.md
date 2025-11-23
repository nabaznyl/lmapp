# Troubleshooting Guide

Common issues and solutions for lmapp.

---

## 📦 Installation Issues

### "externally-managed-environment" Error (Debian/Ubuntu)

**Error:**
```
error: externally-managed-environment

× This environment is externally managed
```

**Cause:** Debian/Ubuntu blocks system-wide pip installs (PEP 668)

**Solutions:**

**Option 1: Use pipx (recommended for CLI tools)**
```bash
sudo apt install pipx
pipx install lmapp
lmapp --help
```

**Option 2: Use a virtual environment**
```bash
python3 -m venv ~/.venv-lmapp
~/.venv-lmapp/bin/pip install lmapp
~/.venv-lmapp/bin/lmapp --help

# Make it easier (add to ~/.bashrc or ~/.zshrc):
alias lmapp='~/.venv-lmapp/bin/lmapp'
```

**Option 3: Use --break-system-packages (not recommended)**
```bash
pip install --break-system-packages lmapp
```

---

## 🔴 Chat Not Starting

### "Backend is not running"
```
❌ Backend 'ollama' is not running.
Please run 'lmapp install' first, or start the backend manually.
```

**Solutions**:
```bash
# Option 1: Run installation wizard
lmapp install

# Option 2: Start backend manually (if installed)
ollama serve          # For Ollama
./llamafile -m model.gguf  # For llamafile

# Option 3: Check what backends are installed
lmapp status
```

### "Model not found"
```
⚠️  Model 'tinyllama' not found
Available models:
  - llama2
  - mistral
```

**Solutions**:
```bash
# Install more models
lmapp install

# Change to an installed model
lmapp config set model llama2

# Check what's installed
lmapp status
```

---

## ⏱️ Response Timeout

### "Request timed out"
```
❌ Backend error: Request timeout
```

**Causes**: Slow hardware, large model, or network issues

**Solutions**:
```bash
# Increase timeout
lmapp config set timeout 600  # 10 minutes instead of 5

# Use a smaller model
lmapp config set model tinyllama

# Check backend health
lmapp status

# Free up system resources
# Close other applications to free RAM
```

---

## 💾 Memory Issues

### "CUDA out of memory"
```
❌ Backend error: CUDA out of memory
```

**Causes**: Model too large for GPU/RAM

**Solutions**:
```bash
# Use smaller model
lmapp config set model tinyllama

# Check available memory
free -h

# Increase RAM or close applications
ps aux | sort -nrk 3,3 | head -10  # Show top processes
```

### "Not enough disk space"
```
❌ Installation failed: Not enough disk space
```

**Solutions**:
```bash
# Check disk space
df -h

# Free up space
rm -rf ~/Downloads/*     # Clear downloads
du -sh ~/.cache/*        # Check cache
rm -rf ~/.cache/pip      # Clear pip cache

# Try installation again
lmapp install
```

---

## 🔌 Connection Issues

### "Connection refused"
```
❌ Cannot connect to ollama.
```

**Solutions**:
```bash
# Start Ollama backend
ollama serve

# Or use llamafile backend
./llamafile -m model.gguf

# Check backend status
lmapp status

# Verify port is not in use
netstat -tlnp | grep 11434  # For Ollama (port 11434)
```

### "Connection timeout"
```
❌ Backend error: Connection timeout
```

**Solutions**:
```bash
# Increase timeout
lmapp config set timeout 600

# Restart backend
lmapp install

# Check network connectivity
ping 127.0.0.1
curl http://localhost:11434/api/tags
```

---

## 📝 Configuration Issues

### "Invalid configuration"
```
✗ Configuration is invalid: 1 validation error
```

**Solutions**:
```bash
# View current config
lmapp config show

# Validate config
lmapp config validate

# Reset to defaults
lmapp config reset

# Manually fix (advanced)
cat ~/.config/lmapp/config.json
nano ~/.config/lmapp/config.json  # Edit manually
```

### "Unknown configuration key"
```
✗ Unknown configuration key: invalid_key
```

**Solutions**:
```bash
# Show valid keys
lmapp config show

# Use correct key
lmapp config set temperature 0.5
```

---

## 🐛 Debug Mode

Enable debug logging for detailed information:

```bash
# Method 1: Environment variable
LMAPP_DEBUG=1 lmapp chat

# Method 2: CLI flag
lmapp --debug chat

# Method 3: Config setting
lmapp config set debug true
lmapp chat

# Watch logs in real-time
tail -f ~/.local/share/lmapp/logs/lmapp.log
```

**Debug Log Location**: `~/.local/share/lmapp/logs/lmapp.log`

---

## 🧪 Testing with Mock Backend

If you're having backend issues, test with mock backend:

```bash
# Use mock backend (no real backend needed)
lmapp config set backend mock

# Start chat
lmapp chat

# Should work instantly with fake responses
```

---

## 📊 System Health Check

```bash
# Check system status
lmapp status

# Shows:
# - System specifications (CPU, RAM, Storage)
# - Available backends (Ollama, llamafile, etc.)
# - Backend status (running, stopped)
# - Installed models
# - Current configuration
```

---

## 🔧 Advanced Debugging

### Check Ollama Status
```bash
# Is Ollama running?
curl http://localhost:11434/api/tags

# List models
curl http://localhost:11434/api/tags | jq

# Check Ollama logs
# On Linux: ~/.ollama/logs/
# On macOS: ~/.ollama/logs/
```

### Check llamafile Status
```bash
# Is llamafile port open?
netstat -tlnp | grep 8000

# Check process
ps aux | grep llamafile

# Kill and restart if stuck
pkill llamafile
./llamafile -m model.gguf
```

### View lmapp Logs
```bash
# Full logs
cat ~/.local/share/lmapp/logs/lmapp.log

# Recent logs
tail -50 ~/.local/share/lmapp/logs/lmapp.log

# Search for errors
grep ERROR ~/.local/share/lmapp/logs/lmapp.log

# Real-time monitoring
tail -f ~/.local/share/lmapp/logs/lmapp.log | grep -i error
```

---

## 🔄 Reset Everything

If you need a clean slate:

```bash
# Backup current config
cp ~/.config/lmapp/config.json ~/.config/lmapp/config.json.backup

# Reset configuration
lmapp config reset

# Reinstall everything
lmapp install

# Start fresh
lmapp chat
```

---

## 📞 Getting More Help

### Check Logs First
```bash
# Enable debug and reproduce issue
LMAPP_DEBUG=1 lmapp chat
# ... do what causes the problem ...
exit

# Check logs
tail -100 ~/.local/share/lmapp/logs/lmapp.log
```

### Report Issues
Include:
1. Your system info: `lmapp status`
2. Last 50 lines of logs: `tail -50 ~/.local/share/lmapp/logs/lmapp.log`
3. Configuration: `lmapp config show`
4. Steps to reproduce

### Resources
- [Configuration Guide](docs/CONFIGURATION.md)
- [Quick Start](QUICK_START.md)
- [Full Documentation](README.md)
- GitHub Issues: [Report a bug](https://github.com/yourusername/lmapp/issues)

---

**Still stuck?** Check the logs - they usually tell you exactly what's wrong! 🔍

