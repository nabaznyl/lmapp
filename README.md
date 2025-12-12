# lmapp - Local LLM CLI

> **Private AI in your terminal. No cloud. No subscriptions. Just you and your models.**  
> Download once. Run anywhere. Own your data.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![PyPI](https://img.shields.io/pypi/v/lmapp.svg)](https://pypi.org/project/lmapp/) [![Tests](https://img.shields.io/badge/Tests-587%2F587%20passing-brightgreen.svg)]() [![Status](https://img.shields.io/badge/Status-Production%20Ready-blue.svg)]()

**v0.3.0-beta** - Web UI, 8 Plugins, RAG System, Batch Processing, Sessions, 587 Tests

**[→ See Demo & Features](DEMO.md)**

---

## 🚀 Quick Start (30 seconds)

### Installation

```bash
pip install lmapp
lmapp install  # Automatically installs and configures Ollama
lmapp chat     # Start chatting!
```

### Update

```bash
pip install --upgrade lmapp
```

### Verify Installation

```bash
lmapp --version && lmapp status
```

See [Installation Guide](./INSTALL.md) for more options or [QUICKSTART.md](QUICKSTART.md) for detailed setup.

---

## 🎯 Core Features

### 💬 Chat
```bash
lmapp chat                          # Start interactive chat
lmapp chat --model mistral          # Use specific model
lmapp c "What is AI?"               # Shortcut: lmapp c for chat
```

### 🔍 RAG (Semantic Search)
```bash
lmapp rag index ~/documents         # Index your documents
lmapp rag search "Python tips"      # Find relevant content
lmapp chat --with-context "Help"    # Use RAG in conversation
```

### 📦 Batch Processing
```bash
lmapp batch create inputs.json      # Process multiple queries
lmapp batch results job_id --json   # Export results
```

### 🔌 Plugins
```bash
lmapp plugin list                   # See installed plugins
lmapp plugin install translator     # Add new plugin
```

### ⚙️ Configuration
```bash
lmapp config show                   # View all settings
lmapp config set temperature 0.3    # Customize behavior
lmapp config --set-prompt           # Custom system prompt
```

---

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
---

## 💡 Why LMAPP?

- ✅ **30-second setup** (vs. 10+ minutes for competitors)
- ✅ **100% private** - No cloud, no tracking
- ✅ **Terminal-native** - Seamless CLI workflow
- ✅ **Multiple backends** - Ollama, llamafile, and more
- ✅ **Production-ready** - 587 tests, 100% coverage
- ✅ **Free forever** - MIT licensed, no subscriptions

---

## 🎯 Use Cases

Works great for:
- **Developers** - Code explanations, debugging, documentation
- **Students** - Study partner, homework help
- **Professionals** - Research, analysis, writing
- **SysAdmins** - Quick command lookups, automation
- **Anyone** who wants AI without cloud dependence

---

## 📖 Basic Usage

```bash
# Start chat
lmapp chat

# Use specific model
lmapp chat --model mistral

# Check status
lmapp status

# View configuration
lmapp config show
```

**Supported Backends:** Ollama, llamafile (auto-detected)

See [QUICKSTART.md](QUICKSTART.md) for complete usage guide.

---

## ✅ Quality & Features

- 🧪 **587 tests** (100% coverage)
- 🔒 **100% private** (no cloud, no tracking)
- ⚡ **Fast & lightweight** (<200ms startup)
- 🔌 **8 production plugins**
- 🔍 **RAG system** (semantic search)
- 📦 **Batch processing**
- 💾 **Session persistence**
- 🌐 **Web UI** (optional)

---

## 🔐 Privacy & Security

- **100% Local** - Everything runs on your device
- **No Cloud** - No internet after setup
- **No Telemetry** - Zero tracking
- **Open Source** - MIT licensed
- **Your Data** - You own it all

---

## 🗺️ Roadmap

**v0.3.0** (Current) - Production ready  
**v0.4.0+** - Mobile/desktop apps, team features, enterprise tier

---

## 🤝 Contributing

Help wanted! See [Contributing Guide](CONTRIBUTING.md) for code contributions, bug reports, or feature ideas.

---

All contributions welcome: bug fixes, features, documentation, tests, and ideas.

---

## 💬 Support

- **Found a bug?** Open an [Issue](https://github.com/nabaznyl/lmapp/issues)
- **Questions?** See [Troubleshooting Guide](TROUBLESHOOTING.md)
- **Discussions?** Use [GitHub Discussions](https://github.com/nabaznyl/lmapp/discussions)

---

## ⚙️ Troubleshooting

| Issue | Solution |
|-------|----------|
| `command not found` | Add `~/.local/bin` to `$PATH` or use `pipx install lmapp` |
| `ModuleNotFoundError` | Reinstall: `pip install --upgrade lmapp` |
| Debian/Ubuntu issues | Use `pipx install lmapp` instead of `pip` |

See [Troubleshooting Guide](TROUBLESHOOTING.md) for more.

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

## 📚 Documentation

- [Security Policy](./SECURITY.md)
- [License](LICENSE)
- [Changelog](CHANGELOG.md)

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

---

## 📖 Documentation Map

| Document | Purpose |
|----------|---------|
| **[QUICKSTART.md](QUICKSTART.md)** | 5-minute setup guide ⭐ Start here |
| **[INSTALL.md](INSTALL.md)** | Installation methods for all platforms |
| **[CONTRIBUTING.md](CONTRIBUTING.md)** | Developer guidelines and contribution workflow |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | Solutions for common issues |
| **[SECURITY.md](SECURITY.md)** | Security policy and vulnerability reporting |
| **[API_REFERENCE.md](API_REFERENCE.md)** | REST API endpoint documentation |
| **[CHANGELOG.md](CHANGELOG.md)** | Complete release history |
| **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** | Community standards |
| **[FILE_ORGANIZATION_GUIDE.md](FILE_ORGANIZATION_GUIDE.md)** | Where to find documentation |

### Additional Resources
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment (Docker, Kubernetes, Nginx)
- **[PLUGIN_DEVELOPER_GUIDE.md](src/lmapp/plugins/PLUGIN_DEVELOPER_GUIDE.md)** - Build your own plugins
- **[ROADMAP.md](ROADMAP.md)** - Feature roadmap and future plans

---

**Welcome to the future of local AI.** 🚀
