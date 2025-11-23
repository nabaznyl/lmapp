# lmapp Quick Start Guide

## What is lmapp?

**lmapp** is a consumer-friendly application for running local LLM (Large Language Model) AI assistants on your computer with complete privacy and zero technical knowledge required.

---

## Current Status

**Version**: 0.1.0-dev  
**Phase**: Foundation Complete ✓  
**Platform**: Debian-based Linux

### What Works Now
- ✅ System requirement checks
- ✅ Interactive menu interface
- ✅ Professional documentation
- ✅ Legal compliance framework

### Coming Soon
- 🚧 Ollama/llamafile integration
- 🚧 AI model downloads
- 🚧 Chat functionality
- 🚧 Shell customization

---

## Quick Start (Development)

### 1. Prerequisites
```bash
sudo apt update
sudo apt install -y python3 python3-pip python3-venv git curl wget
```

### 2. Setup
```bash
cd /home/anonmaly/projects/lmapp
source .venv/bin/activate  # Virtual environment already created
```

### 3. Available Commands
```bash
lmapp --version    # Check version
lmapp status       # Run system checks
lmapp              # Launch main menu
lmapp install      # Installation wizard (WIP)
lmapp chat         # Chat interface (stub)
```

---

## Project Structure

```
lmapp/
├── src/lmapp/              # Main Python package
│   ├── cli.py              # CLI entry point
│   ├── ui/                 # User interfaces
│   │   └── menu.py         # Main menu
│   └── utils/              # Utilities
│       └── system_check.py # System validation
├── docs/                   # Documentation
├── templates/              # EULA, model licenses
├── scripts/                # Bash installers
└── tests/                  # Test suite (empty)
```

---

## System Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **OS** | Debian, Ubuntu, Mint | Latest LTS |
| **RAM** | 4GB | 8GB+ |
| **Storage** | 5GB free | 10GB+ free |
| **Python** | 3.8 | 3.10+ |
| **Internet** | Yes (initial) | Yes |

---

## Testing Your Installation

```bash
# Activate environment
source .venv/bin/activate

# Run system check
lmapp status

# Expected output:
# ✓ Detected: Debian GNU/Linux 13
# ✓ RAM: 15.6GB (excellent!)
# ✓ Storage: 941.2GB free
# ✓ Python 3.13.5
# ✓ All tools found
# ✓ Internet connection available
```

---

## Development Workflow

### Adding New Features
1. Edit code in `src/lmapp/`
2. Changes reflect immediately (installed with `-e`)
3. Test with `lmapp` commands

### Code Quality
```bash
# Format code
black src/

# Check linting
flake8 src/

# Run tests (when written)
pytest tests/
```

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview |
| `FOUNDATION_SUMMARY.md` | Setup completion report |
| `PROJECT_CHARTER.md` | Vision and roadmap |
| `TODO.md` | Development tasks |
| `CONTRIBUTING.md` | How to contribute |
| `templates/EULA.md` | User agreement |
| `docs/installation.md` | Installation guide |

---

## Next Steps for Developers

1. **Review Architecture**: Read `PROJECT_CHARTER.md`
2. **Check Tasks**: See `TODO.md` Phase 2
3. **Start Coding**: Begin with Ollama integration
4. **Write Tests**: Add to `tests/` directory
5. **Update Docs**: Keep documentation current

---

## FAQ

### Q: Can I use this now?
**A**: The foundation is complete, but core features (AI chat) are not yet implemented. Check `TODO.md` for progress.

### Q: What platforms are supported?
**A**: Currently Debian-based Linux only. Other platforms planned for future releases.

### Q: Is this production-ready?
**A**: No, this is alpha/development stage. Version 0.1.0 is the first planned release.

### Q: How can I help?
**A**: See `CONTRIBUTING.md` for guidelines. Issues and pull requests welcome!

---

## Troubleshooting

### "Command not found: lmapp"
```bash
# Ensure virtual environment is activated
source .venv/bin/activate

# Verify installation
pip list | grep lmapp
```

### Import errors
```bash
# Reinstall dependencies
pip install -r requirements.txt

# Reinstall lmapp in development mode
pip install -e .
```

### System check fails
```bash
# Check individual requirements
python3 --version  # Need 3.8+
free -h            # Need 4GB+ RAM
df -h              # Need 5GB+ free
```

---

## Support

- **GitHub Issues**: [Report bugs/request features]
- **Documentation**: Check `docs/` directory
- **Email**: support@lmapp.dev (coming soon)

---

## License

- **Project Code**: MIT License
- **Dependencies**: Various (see `templates/MODELS.md`)
- **AI Models**: Individual licenses apply

---

**Last Updated**: 2025-11-23  
**Status**: ✅ Foundation Complete - Ready for Phase 2
