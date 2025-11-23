# lmapp Demos

**Interactive demonstrations of lmapp capabilities.**

This folder contains runnable demo scripts that showcase different aspects of lmapp. Perfect for learning, testing, and understanding how everything works together.

---

## 🚀 Quick Start

All demos can be run from the project root:

```bash
# Make sure you're in the lmapp directory
cd /path/to/lmapp

# Run any demo
python demos/demo_chat_basic.py
python demos/demo_multi_backend.py
python demos/demo_config.py
python demos/demo_error_recovery.py
```

---

## 📚 Available Demos

### 1. **Basic Chat Usage** (`demo_chat_basic.py`)

**Learn:** How to start a chat session and send messages.

**Perfect for:** First-time users, understanding basic flow.

**What it shows:**
- Loading configuration
- Detecting backend
- Creating a chat session
- Sending a message
- Viewing session statistics

**Run:**
```bash
python demos/demo_chat_basic.py
```

---

### 2. **Multi-Backend Support** (`demo_multi_backend.py`)

**Learn:** How lmapp automatically detects and switches between backends.

**Perfect for:** Understanding backend flexibility, DevOps engineers.

**What it shows:**
- Backend detection for Ollama
- Backend detection for llamafile
- Mock backend availability
- Automatic backend selection
- Health checking

**Run:**
```bash
python demos/demo_multi_backend.py
```

---

### 3. **Configuration Management** (`demo_config.py`)

**Learn:** How to view and modify lmapp settings.

**Perfect for:** Power users, configuration workflows.

**What it shows:**
- Current configuration display
- Available options and their purpose
- CLI configuration commands
- Configuration file location
- Configuration validation

**Run:**
```bash
python demos/demo_config.py
```

---

### 4. **Error Recovery & Resilience** (`demo_error_recovery.py`)

**Learn:** How lmapp handles errors and recovers gracefully.

**Perfect for:** Understanding reliability, system administrators.

**What it shows:**
- Error recovery strategies
- Automatic retry mechanisms
- Backend fallback behavior
- Common error scenarios
- Debug mode for troubleshooting

**Run:**
```bash
python demos/demo_error_recovery.py
```

---

## 🎓 Learning Path

**Recommended order for learning:**

1. **Start here:** `demo_chat_basic.py`
   - Understand the basic flow
   - See how chat works

2. **Then:** `demo_config.py`
   - Learn how to customize lmapp
   - Understand configuration options

3. **Then:** `demo_multi_backend.py`
   - See how lmapp handles multiple backends
   - Understand flexibility

4. **Finally:** `demo_error_recovery.py`
   - Learn about reliability
   - Understand how problems are handled

---

## 💡 Using Demos as Learning Material

Each demo is a complete, runnable example that:
- ✅ Works standalone (no additional setup)
- ✅ Contains detailed comments
- ✅ Shows realistic use cases
- ✅ Demonstrates best practices
- ✅ Can be modified and experimented with

### Try these experiments:

**For `demo_chat_basic.py`:**
```python
# Modify to ask different questions
user_message = "Explain machine learning in simple terms"
```

**For `demo_config.py`:**
```python
# Try changing a setting
config.temperature = 0.1
config.save()
# Then run demo again to see it changed
```

**For `demo_multi_backend.py`:**
```python
# Check a specific backend
backend_name = "ollama"  # Try: "llamafile", "mock"
```

---

## 🔧 Technical Details

### Requirements
- Python 3.8+
- lmapp source code accessible
- No external dependencies needed (beyond lmapp requirements)

### Environment Variables
- `LMAPP_DEBUG=1` - Enable debug output in demos
- `LMAPP_CONFIG_DIR` - Override config directory (if needed)

### Running with Debug
```bash
LMAPP_DEBUG=1 python demos/demo_chat_basic.py
```

---

## 📖 Integration with Documentation

Demos complement the main documentation:

| Demo | Related Documentation |
|---|---|
| `demo_chat_basic.py` | [Quick Start Guide](../QUICK_START.md), [User Guide](../docs/user-guide.md) |
| `demo_config.py` | [Configuration Guide](../docs/CONFIGURATION.md) |
| `demo_multi_backend.py` | [Architecture](../ARCHITECTURE.md) |
| `demo_error_recovery.py` | [Troubleshooting](../TROUBLESHOOTING.md) |

---

## ❓ FAQ

**Q: Can I use these demos as a starting point for my own code?**  
A: Absolutely! All demos are MIT licensed. Copy and modify as needed.

**Q: What if a demo fails?**  
A: Check the error message and [Troubleshooting Guide](../TROUBLESHOOTING.md). Most issues are environment setup related.

**Q: Can I create my own demos?**  
A: Yes! We'd love to see them. Submit a pull request following [Contributing Guidelines](../CONTRIBUTING.md).

**Q: Do I need to run tests first?**  
A: Not necessary for demos. But if you want: `pytest` from project root.

---

## 🚀 Next Steps

After running the demos:

1. **Try the actual CLI:**
   ```bash
   lmapp chat
   ```

2. **Explore configuration:**
   ```bash
   lmapp config show
   lmapp config set temperature 0.5
   ```

3. **Read the guides:**
   - [Quick Start](../QUICK_START.md) - Full getting started
   - [Configuration](../docs/CONFIGURATION.md) - All options explained
   - [Architecture](../ARCHITECTURE.md) - Deep dive into design

4. **Contribute:**
   - Report bugs → [GitHub Issues](https://github.com/yourusername/lmapp/issues)
   - Suggest features → [Discussions](https://github.com/yourusername/lmapp/discussions)
   - Improve code → [Contributing](../CONTRIBUTING.md)

---

## 📝 Demo Template

Want to create your own demo? Use this template:

```python
#!/usr/bin/env python3
"""
Demo: [Your Demo Name]
=====================

[Description of what this demo shows]
Perfect for: [Who should use this]

Run: python demos/demo_your_name.py
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

# Your imports here

def main():
    """Demonstrate your feature."""
    print("\n" + "="*70)
    print("lmapp Demo: [Your Demo Name]")
    print("="*70 + "\n")
    
    # Your demo code here
    
    print("\n" + "="*70)
    print("✅ Demo completed!")
    print("="*70 + "\n")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

---

## 💬 Support

- Questions about demos? → [FAQ](../docs/faq.md)
- Found an issue? → [GitHub Issues](https://github.com/yourusername/lmapp/issues)
- Want to discuss? → [GitHub Discussions](https://github.com/yourusername/lmapp/discussions)

---

**Happy learning!** 🎓
