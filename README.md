# lmapp - Local LLM Made Simple

**Your personal AI assistant, running locally on your machine.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Platform: Linux](https://img.shields.io/badge/Platform-Debian%20Linux-blue.svg)]()
[![Python: 3.8+](https://img.shields.io/badge/Python-3.8+-green.svg)]()

---

## 🎯 What is lmapp?

**lmapp** is a consumer-friendly application that brings powerful AI language models to your computer with **zero technical knowledge required**. Just download, install, and chat with AI - all running locally on your device with complete privacy.

### ✨ Key Features

- **🚀 One-Click Setup**: Automated installation and configuration
- **🔒 Privacy First**: All processing happens on your device, no cloud required
- **💻 Resource Smart**: Works on devices with as little as 4GB RAM
- **🎨 Simple Interface**: Easy alphabetic menus (choose A, B, or C)
- **⚡ Multiple Backends**: Automatic selection between Ollama and llamafile
- **🛠️ Shell Integration**: Optional bash-it and Oh My Zsh customization

---

## 🏁 Quick Start

### Requirements

- **OS**: Debian, Ubuntu, Linux Mint, or similar APT-based Linux
- **RAM**: Minimum 4GB (8GB+ recommended for larger models)
- **Storage**: 5-10GB free space (varies by model size)
- **Internet**: Required for initial download only

### Installation

```bash
# Download lmapp
wget https://github.com/yourusername/lmapp/releases/latest/download/lmapp-installer.sh

# Make executable
chmod +x lmapp-installer.sh

# Run installer
./lmapp-installer.sh
```

The installer will:
1. Check your system specifications
2. Present the user agreement
3. Install required dependencies
4. Set up the LLM backend
5. Download an appropriate AI model
6. Launch your first chat session

**Total time**: ~5-10 minutes (depending on download speed)

---

## 📖 Usage

### Starting lmapp

```bash
# Start with main menu
lmapp

# Start chat directly
lmapp chat

# Enable debug mode for troubleshooting
lmapp --debug chat
```

### Interactive Chat

```bash
$ lmapp chat

Welcome to lmapp Chat

Type your message and press Enter
Commands: /help, /history, /clear, /stats, /debug, /exit

You: What is quantum computing?
AI: Quantum computing is...

You: /stats
Stats:
  Messages: 2
  Model: tinyllama
  Temperature: 0.7
  Duration: 45 seconds

You: /exit
```

### Configuration

Manage lmapp settings from the command line:

```bash
# View current configuration
lmapp config show

# Change the AI model
lmapp config set model mistral

# Adjust temperature (0.0-1.0, higher = more creative)
lmapp config set temperature 0.3

# Enable debug logging
lmapp config set debug true

# Validate configuration
lmapp config validate

# Reset to defaults (with confirmation)
lmapp config reset
```

**Available Configuration Options**:
- `backend`: LLM backend to use (auto, ollama, llamafile, mock)
- `model`: AI model name (tinyllama, llama2, mistral, etc.)
- `temperature`: Creativity level (0.0-1.0)
- `timeout`: Request timeout in seconds
- `debug`: Enable debug logging

### Debugging

Enable debug mode to see detailed logs:

```bash
# Via environment variable
LMAPP_DEBUG=1 lmapp chat

# Via CLI flag
lmapp --debug chat

# Watch logs in real-time
tail -f ~/.local/share/lmapp/logs/lmapp.log
```

Logs are automatically saved with:
- **Console output**: INFO level (DEBUG if enabled)
- **File storage**: `~/.local/share/lmapp/logs/lmapp.log`
- **Rotation**: Automatic at 10MB, kept for 7 days
- **Location**: `~/.local/share/lmapp/logs/`

### Advanced Usage: Shell Integration

Or use advanced CLI tools for quick queries:

```bash
# Using shell_gpt
sgpt "What is the capital of France?"

# Using gpt-cli
gpt "Explain quantum computing simply"
```

---

## 🏗️ Project Status

**Current Version**: 0.1.0 (Release Candidate - Foundation Complete)

### ✅ Completed Features
- ✅ Project charter and structure
- ✅ Multi-backend support (Ollama, llamafile, mock)
- ✅ Interactive terminal chat interface
- ✅ CLI for starting chat sessions
- ✅ Comprehensive error recovery with fallback
- ✅ Professional logging system
- ✅ Configuration management (persistent, validated)
- ✅ 83 unit tests (100% passing)

### 🚧 In Progress (v0.1.0)
- 🚧 Documentation updates
- 🚧 Integration testing
- 🚧 Release preparation

### ⏳ Planned (v0.2.0+)
- ⏳ Async chat layer (non-blocking responses)
- ⏳ System check caching
- ⏳ Model caching
- ⏳ LocalAI backend
- ⏳ Shell customization
- ⏳ Package distribution

---

## 📚 Documentation

### Getting Started
- [Quick Start Guide](QUICK_START.md) - 5-minute setup
- [Installation Guide](docs/installation.md)
- [Configuration Guide](docs/CONFIGURATION.md)

### Help & Support
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues and solutions
- [User Guide](docs/user-guide.md)
- [FAQ](docs/faq.md)

### For Developers
- [Developer Guide](docs/development.md)
- [Architecture](ARCHITECTURE.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

## 🔐 Privacy & Security

- **100% Local**: No data leaves your device unless you explicitly configure cloud models
- **Open Source**: Full transparency - review all code
- **Model Licenses**: Each AI model comes with its own license (clearly disclosed)
- **No Telemetry**: We don't collect usage data, analytics, or personal information

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

### Third-Party Licenses
- **Ollama**: MIT License
- **llamafile**: Apache 2.0 License
- **shell_gpt**: GPL-3.0 License
- **AI Models**: Individual licenses (see [MODELS.md](MODELS.md))

---

## ⚠️ Disclaimer

This software is provided "as is" without warranty of any kind. Users are responsible for:
- Ensuring adequate system resources
- Compliance with AI model usage terms
- Understanding local processing limitations

See [LICENSE](LICENSE) and [EULA.md](templates/EULA.md) for full terms.

---

## 🗺️ Roadmap

### v0.1.0 (Q1 2026)
- Debian-based Linux support
- Ollama + llamafile integration
- Basic TUI interface
- Small model support (3B-7B)

### v0.2.0 (Q2 2026)
- Larger model options (8GB+ RAM)
- Enhanced shell integration
- Configuration management

### Future
- Multi-platform support (Fedora, macOS, Windows)
- Android/Termux version
- Optional GUI interface
- RAG capabilities

---

## 💬 Support & Community

- **Issues**: [GitHub Issues](https://github.com/yourusername/lmapp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/lmapp/discussions)
- **Email**: support@lmapp.dev (coming soon)

---

## 🙏 Acknowledgments

Built with amazing open-source tools:
- [Ollama](https://ollama.ai/) - LLM management platform
- [llamafile](https://github.com/Mozilla-Ocho/llamafile) - Portable LLM runtime
- [shell_gpt](https://github.com/TheR1D/shell_gpt) - CLI AI assistant
- Meta's [Llama](https://llama.meta.com/), Mistral AI, and other open model creators

---

**Made with ❤️ for the open-source community**
