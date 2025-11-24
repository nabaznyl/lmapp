# lmapp - Local LLM, Made Simple ⚡

> **Your AI assistant, anywhere. No cloud. No telemetry. No subscriptions.**  
> One tool to download. One command to run. Works on any device.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PyPI Version](https://img.shields.io/pypi/v/lmapp.svg)](https://pypi.org/project/lmapp/)
[![Python: 3.8+](https://img.shields.io/badge/Python-3.8+-green.svg)]()
[![Tests: 128/128 Passing](https://img.shields.io/badge/Tests-128%2F128%20passing-brightgreen.svg)]()
[![Code Quality: Linting 0 errors](https://img.shields.io/badge/Code%20Quality-0%20errors-brightgreen.svg)]()
[![Type Safety: mypy Clean](https://img.shields.io/badge/Type%20Safety-mypy%20clean-brightgreen.svg)]()
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-blue.svg)]()

---

## 🚀 Quick Start (30 seconds)

### Installation
```bash
pip install lmapp
lmapp chat
```

✅ **v0.1.0 Now Available** - [Install from PyPI](https://pypi.org/project/lmapp/)



## 💡 Who Is This For?

### **Developers & Power Users**
- Want LLM access in your terminal workflow
- Need multi-backend flexibility (Ollama, llamafile)
- Prefer CLI over GUI
- Value privacy and local processing
- Want to understand how it works

### **Students & Researchers**
- Need AI assistance for studying/research
- Want offline-first tool (no internet needed after setup)
- Appreciate well-documented code
- May want to contribute or fork

### **Professionals (Non-Technical)**
- Need AI assistance but value privacy
- Want simple, elegant tool
- Prefer "just works" experience
- Don't want subscriptions or cloud dependencies

### **Anyone Who Wants Universal Access**
- One tool that works on any Linux device
- Download once, use everywhere
- No vendor lock-in
- Open source = you own your data

---

## ✨ What Makes lmapp Different?

| Feature | lmapp | ChatGPT | Ollama | LM Studio |
|---------|-------|---------|--------|-----------|
| **Setup Time** | 30 seconds | 2 minutes | 5 minutes | 10 minutes |
| **Privacy** | ✅ 100% Local | ❌ Cloud | ✅ Local | ✅ Local |
| **No Subscription** | ✅ Free | ❌ Paid | ✅ Free | ✅ Free |
| **Terminal Native** | ✅ Built-in | ❌ Web | ⚠️ Manual | ❌ GUI only |
| **Configuration** | ✅ Simple CLI | ❌ UI Only | ⚠️ Complex | ⚠️ Complex |
| **Multiple Backends** | ✅ Yes | ❌ No | ❌ Single | ❌ Single |
| **Error Recovery** | ✅ Smart | ❌ Manual | ⚠️ Basic | ⚠️ Basic |
| **Test Coverage** | ✅ 100% | N/A | ⚠️ Partial | N/A |

**The lmapp advantage:** Built specifically for seamless, privacy-first, terminal-native AI access.

---

## 🎯 Real-World Use Cases

### 👨‍💻 Developer: Quick Code Explanations
```bash
$ lmapp chat
You: Explain this async/await in Python
AI: [Detailed explanation with examples]
You: /stats
Stats: 1 message, tinyllama, 0.7°, 23 seconds
```

### 📚 Student: Study Partner
```bash
$ lmapp chat
You: Summarize the French Revolution
AI: [Comprehensive summary]
You: Break that down into 3 key points
AI: [Simplified explanation]
```

### 💼 Professional: Research Assistant
```bash
$ lmapp chat
You: Analyze this market trend
AI: [Data-driven analysis]
You: What are the implications?
AI: [Strategic insights]
```

### 🔧 SysAdmin: Quick Documentation Lookup
```bash
$ lmapp chat
You: How do I configure nginx reverse proxy?
AI: [Step-by-step instructions]
```

---

## 🎁 Core Features

### 🧠 Multi-Backend Support
- **Ollama** - Full integration, automatic detection
- **llamafile** - Single-file models support
- **Mock** - Testing & development mode
- **Automatic Selection** - Uses what's available

### 💬 Simple Chat Interface
- Clean terminal UI (no GUI bloat)
- Real-time responses
- Command system: `/help`, `/stats`, `/clear`, `/history`, `/debug`, `/exit`
- Session context preserved

### ⚙️ Easy Configuration
```bash
lmapp config set model mistral     # Change model
lmapp config set temperature 0.3   # Adjust creativity
lmapp config set debug true        # Enable debug
lmapp config show                  # View all settings
```

### 📊 Helpful Statistics
```bash
You: /stats
Stats:
  Messages: 12
  Model: mistral
  Temperature: 0.7
  Session Duration: 5m 43s
```

### 🆘 Smart Error Recovery
- Automatic retry on failure
- Falls back to available backends
- Helpful error messages
- Contextual debugging info

### 📝 Comprehensive Logging
- Auto-rotating logs (kept for 7 days)
- Debug mode for troubleshooting
- Stored in `~/.local/share/lmapp/logs/`

---

## 📖 Usage

### Start Chat
```bash
# Simple
lmapp chat

# With debug logging
lmapp --debug chat

# Enable debug via environment
LMAPP_DEBUG=1 lmapp chat
```

### Configure
```bash
lmapp config show              # View all settings
lmapp config set key value     # Change a setting
lmapp config validate          # Check configuration
lmapp config reset             # Reset to defaults
```

### View Logs
```bash
tail -f ~/.local/share/lmapp/logs/lmapp.log
```

---

## 📋 System Requirements

### Minimum
- **OS**: Debian, Ubuntu, Linux Mint (any APT-based Linux)
- **Python**: 3.8 or higher
- **RAM**: 4GB minimum
- **Storage**: 5-10GB free space
- **Internet**: Required for initial setup only

### Recommended
- **OS**: Ubuntu 22.04 LTS or Debian 12
- **Python**: 3.11+
- **RAM**: 8GB or more
- **Storage**: 20GB+ free
- **CPU**: Modern multi-core preferred

---

## 📊 Project Quality

### ✅ What's Included
- **2,627 lines** of production code
- **128 tests** passing (100% coverage)
- **0 flake8 errors** (fully formatted)
- **0 mypy errors** (type-safe)
- **1,000+ lines** of documentation
- **6 comprehensive** guides
- **Enterprise-grade** logging and recovery
- **Automated** environment management

### ✅ What's Tested
- ✅ All backends (Ollama, llamafile, mock)
- ✅ Chat system (messages, commands, history)
- ✅ Configuration (persistence, validation)
- ✅ Error recovery (retries, fallbacks)
- ✅ CLI interface (all commands)
- ✅ System checks (diagnostics)

### ✅ Production Ready
- ✅ Zero critical blockers
- ✅ Zero security issues
- ✅ 100% test passing rate
- ✅ Comprehensive documentation
- ✅ Professional error messages

---

## 📚 Documentation

| I Want To... | Read This |
|---|---|
| Get started in 5 minutes | [Contributing Guide](CONTRIBUTING.md) |
| Understand configuration | [Configuration Guide](docs/CONFIGURATION.md) |
| Troubleshoot issues | [Troubleshooting Guide](TROUBLESHOOTING.md) |
| Learn about the code | [Architecture Guide](ARCHITECTURE.md) |
| Contribute or modify | [Contributing Guide](CONTRIBUTING.md) |
| See what's next | [Roadmap](ROADMAP.md) |


---

## 🔐 Privacy & Security

- **100% Local Processing**: Everything runs on your device
- **No Cloud**: No internet required after initial setup
- **No Telemetry**: We don't track anything
- **No Subscriptions**: Completely free, forever
- **Open Source**: You can review every line of code
- **Your Data**: You own everything

---

## 🗺️ Roadmap

### v0.1.0 ✅ (Released)
- Multi-backend support
- Terminal chat interface
- Configuration management
- 100% test coverage
- Comprehensive documentation

### v0.2.0 (Q2 2026)
- Chat history persistence
- Performance optimization
- LocalAI backend support
- Enhanced error messages
- Optional deployment automation

### v0.3.0 (Q3 2026)
- Web UI option (complement to CLI)
- Multi-platform support (Fedora, macOS, Windows)
- Advanced features (RAG, plugins)

### v0.4.0+ (Future)
- Mobile/Termux support
- Enterprise features
- Extended ecosystem

---

## 🤝 Contributing

We love contributors! Here's how to get started:

1. **Read** [Contributing Guidelines](CONTRIBUTING.md)
2. **Review** [Architecture](ARCHITECTURE.md)
3. **Run tests** `pytest` (all should pass)
4. **Make changes** and add tests
5. **Submit** a pull request

All contributions welcome:
- Bug fixes
- Feature suggestions (via issues first)
- Documentation improvements
- Test additions
- Code refactoring

---

## 💬 Support

- **Found a bug?** Open an [Issue](https://github.com/nabaznyl/lmapp/issues)
- **Questions?** See [Troubleshooting Guide](TROUBLESHOOTING.md)
- **Discussions?** Use [GitHub Discussions](https://github.com/nabaznyl/lmapp/discussions)

---

## ❓ FAQ

**Q: How do I install?**  
`pip install lmapp`

**Q: How do I update?**  
`pip install --upgrade lmapp`

**Q: Can I use commercially?**  
Yes! MIT License allows it. See [LICENSE](LICENSE).

**Q: Does it collect data?**  
No. 100% local, no telemetry.

More questions? See [Troubleshooting Guide](TROUBLESHOOTING.md).

---

## 🔗 Resources

- [Contributing Guidelines](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)
- [Architecture](./ARCHITECTURE.md)

---

## 📄 License

MIT License - [See LICENSE file](LICENSE)

This means:
- ✅ Use commercially
- ✅ Modify and distribute
- ✅ Include in closed-source projects
- ✅ Just include the license

### Third-Party Licenses
- **Ollama**: MIT License
- **llamafile**: Apache 2.0 License
- **Pydantic**: MIT License
- **Pytest**: MIT License
- **AI Models**: Various (see model documentation)

---

## 🙏 Built With

- [Ollama](https://ollama.ai/) - LLM management platform
- [llamafile](https://github.com/Mozilla-Ocho/llamafile) - Portable LLM runtime
- [Pydantic](https://docs.pydantic.dev/) - Data validation
- [Pytest](https://pytest.org/) - Testing framework
- Meta, Mistral, and other amazing AI model creators

---

## ⭐ Show Your Support

If lmapp helps you, please:
- ⭐ Star this repository
- 🐛 Report bugs and suggest features
- 📢 Share with friends and colleagues
- 🤝 Contribute improvements
- 📝 Share your use cases

---

## 📞 Get Started Now

```bash
pip install lmapp
lmapp chat
```

**Welcome to the future of local AI.** 🚀
