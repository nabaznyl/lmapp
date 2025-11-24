# lmapp Installation Guide

> Multiple installation methods to fit your workflow

---

## 🚀 Quick Install (Recommended)

### **Via pip (All Platforms)**
```bash
pip install lmapp
```

Then run:
```bash
lmapp chat
```

**No version pin needed.** Updates are simple:
```bash
pip install --upgrade lmapp
```

See [README.md](./README.md#quick-start-30-seconds) for platform-specific guidance (Debian/Ubuntu with PEP 668).

---

## 💾 Binary Download

> For users who prefer not to use pip or Python environments

### macOS / Linux

1. Download the latest release:
   - **[Release Page](https://github.com/nabaznyl/lmapp/releases)**
   - Look for `lmapp-*.tar.gz` (Linux) or `lmapp-*.dmg` (macOS)

2. Extract and install:
   ```bash
   # Linux
   tar -xzf lmapp-*.tar.gz
   cd lmapp
   sudo ./install.sh

   # macOS
   # Mount the .dmg file and drag lmapp to /Applications
   ```

3. Verify installation:
   ```bash
   which lmapp
   lmapp --version
   ```

### Windows

1. Download the latest `.exe` installer or `.zip` from [Releases](https://github.com/nabaznyl/lmapp/releases)

2. Run the installer or extract and add to PATH

3. Verify:
   ```cmd
   lmapp --version
   ```

---

## 📦 Wheel / Distribution Files

> For developers or custom deployments

### Download Pre-Built Wheels

Visit [PyPI Releases](https://pypi.org/project/lmapp/#files) and download:
- `lmapp-*.whl` (Python wheel, all platforms)
- `lmapp-*.tar.gz` (Source distribution)

### Install from Wheel

```bash
pip install lmapp-0.1.0-py3-none-any.whl
```

### Build Your Own

Clone the repository and build:
```bash
git clone https://github.com/nabaznyl/lmapp.git
cd lmapp
pip install -e .              # Development install
# OR
python -m build               # Requires build package
pip install dist/lmapp-*.whl  # Install built wheel
```

---

## 🐳 Docker (Future Release)

> Docker support coming in v0.2.0

```bash
# Not yet available - check back soon!
docker run -it lmapp:latest lmapp chat
```

---

## ✅ Verify Installation

After any installation method:

```bash
# Check version
lmapp --version

# Run system check
lmapp status

# Start interactive chat
lmapp chat

# View configuration
lmapp config show
```

---

## 🔧 Troubleshooting

### "lmapp: command not found"
- **pip install**: Ensure `~/.local/bin` is in `$PATH`
  ```bash
  export PATH=$PATH:$HOME/.local/bin
  ```
- **Binary install**: Ensure install location is in `$PATH`
  ```bash
  export PATH=$PATH:/usr/local/bin
  ```

### "Permission denied" (Binary)
```bash
chmod +x /path/to/lmapp
```

### "ModuleNotFoundError: No module named 'lmapp'" (After pip install)
```bash
# Reinstall in a clean virtual environment
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install lmapp
```

### Debian/Ubuntu PEP 668 Issues
Use `pipx` instead of `pip`:
```bash
# Install pipx if needed
sudo apt install pipx

# Install lmapp via pipx
pipx install lmapp

# Update
pipx upgrade lmapp
```

---

## 📚 Next Steps

- **[Quick Start Guide](./README.md#quick-start-30-seconds)** - Get running in 30 seconds
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[Contributing Guide](./CONTRIBUTING.md)** - Want to help? Start here

---

## 💡 FAQ

**Q: Which installation method should I use?**  
A: Start with `pip install lmapp`. It's the simplest and most maintainable. Binary download is for users who prefer not to use pip.

**Q: Can I use lmapp without Python installed?**  
A: Not currently. Python 3.8+ is required. Binary distribution support is planned for v1.0+.

**Q: How do I update lmapp?**  
A: `pip install --upgrade lmapp` or re-download the latest binary.

**Q: Is lmapp available on package managers (apt, brew)?**  
A: Not yet. Planned for v1.0+. For now, use pip or binary download.

---

**Version:** 0.1.0  
**Last Updated:** November 24, 2025
