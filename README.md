# LMAPP

> **Local LLM CLI** – Start your AI journey, right now.
> AI made Simple, and Easy to use. Online or Offline. AI your way.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![PyPI](https://img.shields.io/pypi/v/lmapp.svg)](https://pypi.org/project/lmapp/) [![CI](https://github.com/nabaznyl/lmapp/actions/workflows/tests.yml/badge.svg)](https://github.com/nabaznyl/lmapp/actions/workflows/tests.yml) [![codecov](https://codecov.io/gh/nabaznyl/lmapp/branch/mother/graph/badge.svg)](https://codecov.io/gh/nabaznyl/lmapp) [![Status](https://img.shields.io/badge/Status-Production%20Ready-blue.svg)]()

**v0.3.4** - Production Ready. Fully Featured. Free.

See [**Demo & Features**](https://github.com/nabaznyl/lmapp/blob/mother/DEMO.md) for examples and use cases.

---

## 🚀 Quick Start

Full installation and setup: see [QUICKSTART.md](https://github.com/nabaznyl/lmapp/blob/mother/QUICKSTART.md).
Customize your AI's behavior: see [Roles & Workflows Guide](https://github.com/nabaznyl/lmapp/blob/mother/docs/ROLE_WORKFLOW_QUICKSTART.md).

Everyday commands:
```bash
lmapp chat          # Start chatting locally
lmapp server start  # Start API server (for VS Code)
lmapp status        # Check backend/model status
```

---

## 🎥 Demonstrations

> **Recommended:** Check out our [**Feature Tour**](https://github.com/nabaznyl/lmapp/blob/mother/DEMO.md) to see lmapp in action!

We offer two ways to explore lmapp:

1. **[Feature Tour (Read)](https://github.com/nabaznyl/lmapp/blob/mother/DEMO.md)** - A visual walkthrough of features, use cases, and the "first run" experience.
2. **[Interactive Tour (Run)](https://github.com/nabaznyl/lmapp/blob/mother/INTERACTIVE_TOUR.md)** - A script you can run on your own machine to experience lmapp firsthand.

Explore real-world use cases including:
- 📝 **Content Generation** (Blogs, Emails, Code)
- 🔍 **Document Analysis** (Summarization, Q&A)
- 🤖 **Autonomous Agents** (Multi-step reasoning)
- 📊 **Data Extraction** (JSON from text)

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

### � VS Code Integration
Turn VS Code into an AI-powered IDE with our extension.

1. **Start the Server**:
   ```bash
   lmapp server start
   ```
2. **Open Dashboard**: Go to `http://localhost:8000` to see status and chat.
3. **Install Extension**: Install `lmapp-vscode` (coming soon to marketplace).
4. **Enjoy**: Get inline code completions and chat directly in your editor.

### �🔍 RAG (Semantic Search)
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

### Perfect Fit
- **Developers** - Code explanations, debugging, documentation, CLI workflows
- **Students & Researchers** - Study partner, research assistance, offline-first
- **SysAdmins** - Command lookups, automation scripts, system analysis
- **Professionals** - Writing, analysis, research, note-taking
- **Privacy-Conscious Users** - Want AI without cloud dependencies
- **Anyone** who values control over convenience

---

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

**Supported Backends:** Ollama, llamafile (auto-detected). Extensible architecture supports custom backends.

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
| **[QUICKSTART.md](https://github.com/nabaznyl/lmapp/blob/mother/QUICKSTART.md)** | 5-minute setup guide ⭐ Start here |
| **[docs/installation.md](https://github.com/nabaznyl/lmapp/blob/mother/docs/installation.md)** | Installation methods for all platforms |
| **[docs/CONFIGURATION.md](https://github.com/nabaznyl/lmapp/blob/mother/docs/CONFIGURATION.md)** | Configuration, environment, and settings |
| **[docs/development.md](https://github.com/nabaznyl/lmapp/blob/mother/docs/development.md)** | Developer workflow and tips |
| **[TROUBLESHOOTING.md](https://github.com/nabaznyl/lmapp/blob/mother/TROUBLESHOOTING.md)** | Solutions for common issues |
| **[SECURITY.md](https://github.com/nabaznyl/lmapp/blob/mother/SECURITY.md)** | Security policy and vulnerability reporting |
| **[CHANGELOG.md](https://github.com/nabaznyl/lmapp/blob/mother/CHANGELOG.md)** | Release history |
| **[CONTRIBUTING.md](https://github.com/nabaznyl/lmapp/blob/mother/CONTRIBUTING.md)** | Contribution guidelines |
| **[CODE_OF_CONDUCT.md](https://github.com/nabaznyl/lmapp/blob/mother/CODE_OF_CONDUCT.md)** | Community standards |
| **[LICENSE](https://github.com/nabaznyl/lmapp/blob/mother/LICENSE)** | License terms |
| **[DEMO.md](https://github.com/nabaznyl/lmapp/blob/mother/DEMO.md)** | Live examples and feature tour |
| **[API_REFERENCE.md](https://github.com/nabaznyl/lmapp/blob/mother/API_REFERENCE.md)** | Lightweight CLI + HTTP API reference |

Additional references:
- **[docs/ERROR_DATABASE.md](https://github.com/nabaznyl/lmapp/blob/mother/docs/ERROR_DATABASE.md)** - Known errors and fixes

---

**Welcome to the future of local AI.** 🚀 This is the way...
