# lmapp - Local LLM CLI

> **Private AI in your terminal. No cloud. No subscriptions. Just you and your models.**  
> Download once. Run anywhere. Own your data.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![PyPI](https://img.shields.io/pypi/v/lmapp.svg)](https://pypi.org/project/lmapp/) [![Tests](https://img.shields.io/badge/Tests-587%2F587%20passing-brightgreen.svg)]() [![Status](https://img.shields.io/badge/Status-Production%20Ready-blue.svg)]()

**v0.4.0-beta** - 30-Day Full-Feature Trial, Freemium Model, Desktop GUI, Web UI

> 🎉 **Try all features for 30 days, free. Then enjoy powerful free tier forever.**  
> See [Trial & Freemium Model](TRIAL_AND_FREEMIUM.md) | [Advanced Mode](ADVANCED_MODE.md) | [Legal Terms](LEGAL_TERMS.md)

See [**Demo & Features**](DEMO.md) for examples and use cases.

---

## 🚀 Quick Start

### Install

```bash
pip install lmapp
lmapp install  # Automatically installs and configures Ollama
lmapp chat     # Start chatting! (30-day trial begins)
```

### Check Trial Status

```bash
lmapp status
```

**Output (first run):**
```
LMAPP Status Report
===================
Version: v0.4.0
Trial Status: Active
Days Remaining: 30 days
Advanced Mode: ON
```

### Example

```bash
$ lmapp chat
╔════════════════════════════════════════════╗
║           LMAPP Chat Interface             ║
║  Type 'help' for commands, 'exit' to quit  ║
╚════════════════════════════════════════════╝

You: What is machine learning?

AI: Machine learning is a subset of artificial intelligence that 
focuses on enabling computer systems to learn and improve from 
experience without explicit programming...

---

You: Give me a Python example

AI: Here's a simple ML example:

```python
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier

# Load data
iris = load_iris()
X, y = iris.data, iris.target

# Train model
clf = DecisionTreeClassifier()
clf.fit(X, y)

# Predict
prediction = clf.predict([[5.1, 3.5, 1.4, 0.2]])
print(f"Predicted: {iris.target_names[prediction[0]]}")
```

---

You: exit
Goodbye! 👋
```

### Verify

```bash
lmapp --version && lmapp status
```

See [Installation Guide](./INSTALL.md) for details or [QUICKSTART.md](QUICKSTART.md) for step-by-step setup.

---

## 🎯 Features

### 💬 Chat
```bash
$ lmapp chat --model mistral
╔════════════════════════════════════════════╗
║        Chat with Mistral (Local)           ║
╚════════════════════════════════════════════╝

You: Explain quantum computing in simple terms

AI: Quantum computers use quantum bits (qubits) instead of regular bits.
While regular bits are 0 or 1, qubits can be both at once (superposition).
This lets them solve certain problems exponentially faster...

You: What are the use cases?

AI: Key use cases include:
  • Drug discovery (molecular simulation)
  • Finance (portfolio optimization)
  • Cryptography (breaking encryption)
  • Machine learning (optimization)
```

### 🔍 RAG (Semantic Search)
```bash
$ lmapp rag index ~/my_docs
📁 Indexing documents...
✓ Processed: README.md (1,234 tokens)
✓ Processed: GUIDE.pdf (5,678 tokens)
✓ Processed: NOTES.txt (892 tokens)
✓ Index created: 7,804 tokens in 12 documents

$ lmapp rag search "how to optimize python code"
📊 Search Results (3 matches):

1. GUIDE.pdf - Line 45 (score: 0.92)
   "Optimization techniques include: list comprehensions,
    caching, and using built-in functions instead of loops"

2. NOTES.txt - Line 12 (score: 0.88)
   "Profile code with cProfile before optimizing"

3. README.md - Line 89 (score: 0.81)
   "Performance tips for production code"

$ lmapp chat --with-context
You: Summarize the best Python optimization tips from my docs

AI: Based on your documents, here are the key optimization tips:
  1. Use list comprehensions instead of loops
  2. Profile with cProfile before optimizing
  3. Leverage built-in functions (map, filter, etc.)
  4. Implement caching for expensive operations
```

### 📦 Batch Processing
```bash
$ lmapp batch create inputs.json
Processing 5 queries in batch...
[████████████████████] 100% (5/5)

Job created: batch_20250211_143022
Estimated time: 45 seconds

$ lmapp batch results batch_20250211_143022 --json
{
  "job_id": "batch_20250211_143022",
  "status": "completed",
  "results": [
    {"input": "Explain AI", "output": "AI is..."},
    {"input": "What is ML?", "output": "Machine learning..."},
    ...
  ],
  "completed_at": "2025-02-11T14:30:47Z"
}
```

### 🔌 Plugins
```bash
$ lmapp plugin list
Available Plugins:
  ✓ translator     - Real-time translation (8 languages)
  ✓ summarizer     - Extract key points from long text
  ✓ code-reviewer  - Analyze code and suggest improvements
  ✓ sql-generator  - Write SQL queries from descriptions
  ✓ regex-helper   - Build and test regex patterns
  ✓ json-validator - Validate and format JSON
  ✓ git-helper     - Explain git commands and operations
  ✓ api-tester     - Test REST APIs interactively

$ lmapp plugin install translator
Installing translator plugin...
✓ Downloaded (245 KB)
✓ Installed successfully
Ready to use: lmapp translate --help

$ lmapp translate --text "Hello World" --to spanish
Translation (Spanish):
"¡Hola Mundo!"
```

### ⚙️ Configuration
```bash
$ lmapp config show
Current Configuration:
  Model: mistral (7B)
  Temperature: 0.7
  Max Tokens: 2048
  Context Size: 4096
  System Prompt: You are a helpful AI assistant

$ lmapp config set temperature 0.3
✓ Configuration updated

$ lmapp config --set-prompt
Enter your custom system prompt:
> You are a Python expert. Help with code, explain concepts clearly.
✓ System prompt saved

$ lmapp status
Status Report:
  ✓ Backend: Ollama (running)
  ✓ Model: mistral (7.4B)
  ✓ Memory: 6.2 GB / 16 GB
  ✓ Performance: 45 tokens/sec
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
