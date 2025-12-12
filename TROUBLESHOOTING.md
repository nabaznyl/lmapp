# LMAPP Troubleshooting Guide

**Solutions for common issues and problems you might encounter.**

## Table of Contents
1. [Installation Issues](#installation-issues)
2. [Backend & Model Issues](#backend--model-issues)
3. [Chat & Performance Issues](#chat--performance-issues)
4. [Web UI Issues](#web-ui-issues)
5. [Plugin Issues](#plugin-issues)
6. [RAG & Document Issues](#rag--document-issues)
7. [System & Environment Issues](#system--environment-issues)
8. [Advanced Troubleshooting](#advanced-troubleshooting)

---

## Installation Issues

### Problem: "pip: command not found"
**Cause:** Python pip is not installed or not in PATH.

**Solutions:**
```bash
# Check if Python is installed
python3 --version

# Install pip
sudo apt install python3-pip              # Linux (Debian/Ubuntu)
brew install python3                      # macOS

# Upgrade pip
python3 -m pip install --upgrade pip

# Install LMAPP with python3 -m pip
python3 -m pip install lmapp
```

### Problem: "Permission denied" when installing
**Cause:** Installing to system Python without sudo.

**Solutions:**
```bash
# Option 1: Use virtual environment (RECOMMENDED)
python3 -m venv ~/lmapp-env
source ~/lmapp-env/bin/activate  # or: ~/lmapp-env\Scripts\activate (Windows)
pip install lmapp

# Option 2: User installation
pip install --user lmapp

# Option 3: Use sudo (not recommended)
sudo pip install lmapp
```

### Problem: "ModuleNotFoundError: No module named 'lmapp'"
**Cause:** LMAPP not installed or wrong Python environment.

**Solutions:**
```bash
# Check installation
pip list | grep lmapp

# Reinstall
pip install --force-reinstall lmapp

# Check Python path
python3 -c "import sys; print(sys.path)"

# Activate virtual environment if using one
source ~/lmapp-env/bin/activate

# Try development install
git clone https://github.com/yourusername/lmapp.git
cd lmapp
pip install -e .
```

### Problem: "Requirement already satisfied" but command not found
**Cause:** Installed in different Python environment.

**Solutions:**
```bash
# Find where it's installed
pip show lmapp | grep Location

# Check which Python lmapp uses
which lmapp

# Verify Python path
python3 -c "import lmapp; print(lmapp.__file__)"
```

---

## Backend & Model Issues

### Problem: "No backends available"
**Cause:** Ollama/llamafile not running or not detected.

**Solutions:**
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Check if llamafile is running
curl http://localhost:8000/api/tags

# Force backend
export LMAPP_BACKEND=ollama
lmapp chat

# Use mock backend for testing
export LMAPP_BACKEND=mock
lmapp chat
```

### Problem: "Model not found" or "Could not find model"
**Cause:** Model not downloaded or doesn't exist.

**Solutions:**
```bash
# List available models
ollama list

# Download model
ollama pull llama2          # 3.8GB
ollama pull mistral         # 3.7GB
ollama pull neural-chat     # 3.8GB
ollama pull orca-mini       # 1.3GB (faster, smaller)

# Set default model
export LMAPP_DEFAULT_MODEL=mistral

# See available models in LMAPP
lmapp status
```

### Problem: "Connection refused" or "Cannot connect to backend"
**Cause:** Backend service not running or wrong port.

**Solutions:**
```bash
# Check if service is running
ps aux | grep ollama
ps aux | grep llamafile

# Check if port is open
lsof -i :11434              # Ollama
lsof -i :8000               # Llamafile or LMAPP

# Start Ollama in background
ollama serve &

# Check network connectivity
curl http://localhost:11434/api/tags
curl -v http://localhost:11434           # Verbose output

# Try different host
export LMAPP_OLLAMA_HOST=http://127.0.0.1:11434
```

### Problem: "Backend is running but models show empty list"
**Cause:** Models not downloaded yet.

**Solutions:**
```bash
# Download at least one model
ollama pull llama2

# Check with ollama
ollama list

# Restart LMAPP
lmapp chat

# Force refresh
export LMAPP_DEBUG=1
lmapp status
```

### Problem: "Out of memory" or "CUDA out of memory"
**Cause:** Model too large for available GPU/RAM.

**Solutions:**
```bash
# Use smaller model
ollama pull orca-mini       # 1.3GB
ollama pull phi             # 2.7GB

# Remove unused models
ollama rm llama2
ollama rm neural-chat

# Check memory
free -h                     # Linux
top                         # macOS/Linux
Get-Process | Sort -Property WorkingSet | Select -Last 5  # Windows

# Reduce token limit
export LMAPP_DEFAULT_MAX_TOKENS=256

# Unload model from GPU
ollama ps
ollama unload               # Release GPU memory
```

### Problem: Slow model responses
**Cause:** Using CPU instead of GPU, or model too slow.

**Solutions:**
```bash
# Check if GPU is being used
ollama ps                   # See processor usage

# Ensure GPU is enabled for Ollama
# Linux: NVIDIA - should work by default
# macOS: Metal - works automatically
# Windows: CUDA - check NVIDIA driver installed

# Use faster model
ollama pull mistral         # Faster than llama2
ollama pull neural-chat     # Similar speed
ollama pull orca-mini       # Very fast

# Reduce context size
export LMAPP_CONTEXT_SIZE=2048

# Check backend performance
time ollama run llama2 "test"
```

---

## Chat & Performance Issues

### Problem: "Connection timeout" or chat hangs
**Cause:** Backend slow or overwhelmed.

**Solutions:**
```bash
# Check if backend is responsive
curl http://localhost:11434/api/tags

# Try simple message
lmapp chat
# Type: "hi"

# Check system resources
top
df -h

# Increase timeout
export LMAPP_REQUEST_TIMEOUT=120

# Stop other processes using resources
killall node  # Stop Node.js
killall java  # Stop Java
```

### Problem: "Blank response" or empty reply
**Cause:** Backend error or malformed request.

**Solutions:**
```bash
# Enable debug mode
export LMAPP_DEBUG=1
lmapp chat

# Check model is working
ollama run llama2 "test"

# Try with different model
export LMAPP_DEFAULT_MODEL=mistral
lmapp chat

# Check logs
cat ~/.local/share/lmapp/lmapp.log

# Try simple prompt
# Just type: "hello"
```

### Problem: "Max tokens exceeded" error
**Cause:** Response would exceed token limit.

**Solutions:**
```bash
# Increase max tokens
export LMAPP_DEFAULT_MAX_TOKENS=2048

# Or reduce context size
export LMAPP_CONTEXT_SIZE=2048

# Check what setting is used
lmapp status
```

### Problem: Inconsistent or random responses
**Cause:** Temperature too high, randomness settings.

**Solutions:**
```bash
# Lower temperature for consistent responses
export LMAPP_DEFAULT_TEMPERATURE=0.3

# In chat, check actual temperature
lmapp status

# Reset to defaults
unset LMAPP_DEFAULT_TEMPERATURE
```

---

## Web UI Issues

### Problem: "Web UI won't start" or "Address already in use"
**Cause:** Port 8000 already in use.

**Solutions:**
```bash
# Check what's using port 8000
lsof -i :8000
netstat -tuln | grep 8000

# Kill the process
kill -9 <PID>

# Use different port
lmapp web --port 8001

# Check if LMAPP is already running
ps aux | grep lmapp | grep -v grep
```

### Problem: "Web UI shows blank page"
**Cause:** Frontend failed to load or JavaScript error.

**Solutions:**
```bash
# Check browser console (F12)
# Look for errors in Console tab

# Clear browser cache
# Ctrl+Shift+Delete (Chrome/Firefox)
# Cmd+Shift+Delete (Safari)

# Try incognito/private window
# Ctrl+Shift+N (Chrome)
# Ctrl+Shift+P (Firefox)

# Check backend is running
curl http://localhost:8000/api/health

# Check if static files exist
ls -la ~/.local/share/lmapp/static/
```

### Problem: "Chat in web UI doesn't work"
**Cause:** Backend not connected or API error.

**Solutions:**
```bash
# Check backend is running
curl http://localhost:8000/api/health

# Check models available
curl http://localhost:8000/api/models

# Open browser console (F12)
# Check Network tab for failed requests

# Try API directly
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hi", "model": "llama2"}'

# Enable debug
export LMAPP_DEBUG=1
lmapp web
```

### Problem: "CORS error" in browser console
**Cause:** Cross-origin request blocked.

**Solutions:**
```bash
# Configure CORS origins
export LMAPP_CORS_ORIGINS="['http://localhost:3000']"

# Or disable CORS check (development only)
export LMAPP_ENV=development

# Check that backend is on same origin
# If accessing from different port, configure proxy

# Nginx proxy example (not needed for localhost)
# location /api {
#   proxy_pass http://localhost:8000;
# }
```

### Problem: "Models dropdown empty" in web UI
**Cause:** Models not loaded or API issue.

**Solutions:**
```bash
# Check models exist
lmapp status

# Download model if needed
ollama pull llama2

# Check API endpoint
curl http://localhost:8000/api/models

# Refresh browser
F5 or Cmd+R

# Check console for errors (F12)
```

---

## Plugin Issues

### Problem: "Plugin not found" or "Plugin installation failed"
**Cause:** Plugin doesn't exist or network error.

**Solutions:**
```bash
# List available plugins
lmapp plugin list

# Check if plugin exists
lmapp plugin info translator

# Try installing again
lmapp plugin install translator

# Enable debug mode
export LMAPP_DEBUG=1
lmapp plugin install translator

# Check plugin directory
ls -la ~/.local/share/lmapp/plugins/

# Check logs
cat ~/.local/share/lmapp/lmapp.log | grep -i plugin
```

### Problem: "Plugin command doesn't work" or "/command not recognized"
**Cause:** Plugin not installed or command syntax wrong.

**Solutions:**
```bash
# Verify plugin is installed
lmapp plugin list

# Check plugin commands
lmapp plugin info translator

# Use correct syntax (with /)
/translate en-es "hello"

# Not:
translate en-es "hello"

# Try reinstalling
lmapp plugin uninstall translator
lmapp plugin install translator

# Check for plugin errors
export LMAPP_DEBUG=1
lmapp chat
# Then run: /translator en-es "hello"
```

### Problem: "Plugin execution error"
**Cause:** Plugin has bug or bad input.

**Solutions:**
```bash
# Check input format
lmapp plugin info translator
# Shows required parameters

# Try with example parameters
/translator en-es "Hello world"

# Check logs for detailed error
export LMAPP_DEBUG=1
lmapp chat

# Try with different plugin
lmapp plugin list
lmapp plugin install cache-manager

# Report issue
# GitHub Issues with: plugin name, command, error message, LMAPP version
```

---

## RAG & Document Issues

### Problem: "Cannot upload document" or "File too large"
**Cause:** File size or format issue.

**Solutions:**
```bash
# Check file size
ls -lh guide.pdf

# Maximum file size: 100MB
# If larger, split document:
pdfseparate input.pdf output-%d.pdf  # Split PDF
split -l 1000 text.txt text_        # Split text

# Try different format
# Supported: PDF, TXT, DOCX, MD

# Check permissions
chmod 644 guide.pdf

# Try via command line
# Or retry in web UI
```

### Problem: "Document indexed but search returns nothing"
**Cause:** Document not properly indexed or search term mismatch.

**Solutions:**
```bash
# Check document was indexed
lmapp status  # Shows RAG info

# Test search
lmapp rag search "test"

# Reindex document
lmapp rag clear
# Re-upload document

# Check chunk size
export LMAPP_RAG_CHUNK_SIZE=512

# Enable debug
export LMAPP_DEBUG=1
lmapp chat
# Then ask about document
```

### Problem: "Search results irrelevant"
**Cause:** Similarity threshold too low or bad chunks.

**Solutions:**
```bash
# Adjust threshold
export LMAPP_RAG_THRESHOLD=0.7  # Higher = stricter

# Reindex with different chunk size
export LMAPP_RAG_CHUNK_SIZE=256  # Smaller chunks
lmapp rag clear

# Try more specific search terms
# Instead of: "document"
# Try: "installation process" or "getting started"

# Check document quality
lmapp rag stats
```

### Problem: "RAG index corrupted" or missing data
**Cause:** Unexpected shutdown or file corruption.

**Solutions:**
```bash
# Clear and rebuild
lmapp rag clear

# Re-upload documents
lmapp documents upload guide.pdf

# Check index directory
ls -la ~/.local/share/lmapp/rag_index/

# If corrupted, delete and recreate
rm -rf ~/.local/share/lmapp/rag_index/
mkdir -p ~/.local/share/lmapp/rag_index/

# Restart LMAPP
lmapp chat
```

---

## System & Environment Issues

### Problem: "Python version not compatible"
**Cause:** Python too old (need 3.9+).

**Solutions:**
```bash
# Check Python version
python3 --version

# Upgrade Python
# macOS
brew install python@3.11

# Linux (Ubuntu/Debian)
sudo apt update
sudo apt install python3.11 python3.11-venv

# Windows: Download from python.org

# Use specific Python version
python3.11 -m pip install lmapp
python3.11 -m venv venv
source venv/bin/activate
```

### Problem: "Virtual environment issues"
**Cause:** venv corrupted or not activated.

**Solutions:**
```bash
# Check if activated (look for (venv) in prompt)
which python

# Activate virtual environment
# Linux/macOS
source venv/bin/activate
source ~/lmapp-env/bin/activate

# Windows
venv\Scripts\activate

# Recreate if corrupted
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -e .
```

### Problem: "Port already in use" (multiple services)
**Cause:** Multiple services on same port.

**Solutions:**
```bash
# List all processes on port 8000
lsof -i :8000
netstat -tuln | grep 8000

# Kill specific process
kill -9 <PID>

# Use different ports
lmapp web --port 8000  # Web UI
ollama serve           # Ollama (default 11434)

# Check port is free before starting
nc -zv localhost 8000
```

### Problem: "Disk space full"
**Cause:** Models or cache consuming space.

**Solutions:**
```bash
# Check disk usage
df -h
du -sh ~/.local/share/lmapp/

# Remove unused models
ollama rm llama2
ollama rm mistral

# Clear cache
rm -rf ~/.cache/lmapp/

# Clean up old sessions
lmapp session list
lmapp session delete old-session
```

---

## Advanced Troubleshooting

### Enable Debug Logging
```bash
# Enable verbose logging
export LMAPP_DEBUG=1
export LMAPP_LOG_LEVEL=DEBUG

# Run command
lmapp chat

# View detailed logs
tail -f ~/.local/share/lmapp/lmapp.log
```

### Check Configuration
```bash
# View current configuration
cat ~/.local/share/lmapp/config.json

# Check environment variables
echo $LMAPP_BACKEND
echo $LMAPP_OLLAMA_HOST
echo $LMAPP_DEFAULT_MODEL

# Reset configuration
rm ~/.local/share/lmapp/config.json
lmapp config show  # Will recreate default
```

### Test Backend Directly
```bash
# Test Ollama API
curl -X POST http://localhost:11434/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2",
    "prompt": "Hello world",
    "stream": false
  }'

# Test llamafile API
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama2",
    "messages": [{"role": "user", "content": "hello"}]
  }'
```

### Reinstall LMAPP
```bash
# Remove completely
pip uninstall lmapp

# Clear cache
pip cache purge

# Delete configuration
rm -rf ~/.local/share/lmapp/

# Fresh install
pip install lmapp

# Reinitialize
lmapp status
```

### Check System Resources During Execution
```bash
# Monitor in real-time
top -p $(pgrep -f 'python.*lmapp')

# Check memory leak
ps aux | grep lmapp | grep -v grep

# Profile CPU usage
python3 -m cProfile -s cumulative -m lmapp.cli chat
```

### Getting Help
1. **Check logs:** `~/.local/share/lmapp/lmapp.log`
2. **Enable debug:** `export LMAPP_DEBUG=1`
3. **Post issue on GitHub** with:
   - Error message (full)
   - LMAPP version (`lmapp --version`)
   - Python version (`python3 --version`)
   - Backend being used
   - OS (Linux/macOS/Windows)
   - Steps to reproduce

---

**Version:** 0.3.0-beta  
**Last Updated:** Dec 11, 2025  
**Status:** ✅ Production Ready

Can't find answer? [File an issue on GitHub](https://github.com/yourusername/lmapp/issues)
