# Installation Guide

## System Requirements

### Minimum Requirements
- **OS**: Debian, Ubuntu, Linux Mint, or similar APT-based Linux
- **RAM**: 4GB (for small models)
- **Storage**: 5GB free space
- **Python**: 3.8 or higher
- **Internet**: Required for initial setup

### Recommended Requirements
- **RAM**: 8GB+ (for larger, more capable models)
- **Storage**: 10GB+ free space
- **CPU**: Multi-core processor

---

## Quick Installation

### Option 1: Automated Installer (Coming Soon)

```bash
wget https://github.com/yourusername/lmapp/releases/latest/download/lmapp-installer.sh
chmod +x lmapp-installer.sh
./lmapp-installer.sh
```

### Option 2: Manual Installation (Current)

1. **Install Python dependencies**:
```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv curl wget git
```

2. **Clone repository**:
```bash
git clone https://github.com/yourusername/lmapp.git
cd lmapp
```

3. **Create virtual environment**:
```bash
python3 -m venv .venv
source .venv/bin/activate
```

4. **Install lmapp**:
```bash
pip install -r requirements.txt
pip install -e .
```

5. **Run system check**:
```bash
lmapp status
```

6. **Start lmapp**:
```bash
lmapp
```

---

## Post-Installation

### First Run

On first run, lmapp will:
1. Check system requirements
2. Present the EULA
3. Ask you to select a backend (Ollama or llamafile)
4. Download a recommended model
5. Launch the main menu

### Selecting a Backend

**Ollama** (Recommended):
- Easier model management
- Persistent service
- Better for regular use

**llamafile** (Alternative):
- More portable
- No system service required
- Better for testing or restricted environments

### Choosing a Model

For **4GB RAM systems**:
- TinyLlama 1.1B (~600MB)
- Phi-2 (~1.5GB)
- Gemma 2B (~1.5GB)

For **8GB+ RAM systems**:
- Llama 2 7B (~4GB)
- Mistral 7B (~4GB)
- Phi-3 Mini (~2GB)

---

## Troubleshooting

### "Command not found: lmapp"

Ensure virtual environment is activated:
```bash
source .venv/bin/activate
```

Or install globally (not recommended):
```bash
pip install --user -e .
export PATH="$HOME/.local/bin:$PATH"
```

### "Insufficient RAM" Error

Try a smaller model:
```bash
lmapp config --model tinyllama
```

### Import Errors

Reinstall dependencies:
```bash
pip install --upgrade -r requirements.txt
```

---

## Uninstallation

```bash
# Remove lmapp
pip uninstall lmapp

# Remove models (if using Ollama)
ollama rm <model-name>

# Remove configuration
rm -rf ~/.lmapp

# Remove virtual environment
deactivate
rm -rf .venv
```

---

## Next Steps

- Read the [User Guide](user-guide.md)
- Check the [FAQ](faq.md)
- Join [GitHub Discussions](https://github.com/yourusername/lmapp/discussions)
