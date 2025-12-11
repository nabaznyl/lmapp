"""
LMAPP v0.2.5 Plugin Developer Guide

Complete guide for creating, testing, and publishing LMAPP plugins.
Includes templates, best practices, certification criteria, and marketplace integration.
"""

# PLUGIN DEVELOPER GUIDE - v0.2.5

## Table of Contents
1. [Quick Start](#quick-start)
2. [Plugin Architecture](#plugin-architecture)
3. [Creating Your First Plugin](#creating-your-first-plugin)
4. [Plugin Template](#plugin-template)
5. [Testing Your Plugin](#testing-your-plugin)
6. [Publishing to Marketplace](#publishing-to-marketplace)
7. [Best Practices](#best-practices)
8. [Certification Criteria](#certification-criteria)
9. [FAQ](#faq)

---

## Quick Start

### Create a Plugin in 5 Minutes

```python
# my_plugin.py
from lmapp.plugins.plugin_manager import BasePlugin, PluginMetadata

class MyPlugin(BasePlugin):
    @property
    def metadata(self):
        return PluginMetadata(
            name="my-plugin",
            version="0.1.0",
            description="My awesome plugin",
            author="Your Name",
            license="MIT",
            tags=["my-tag"],
        )
    
    def initialize(self, config=None):
        pass  # Setup code here
    
    def execute(self, *args, **kwargs):
        return {"result": "hello from plugin!"}
    
    def get_commands(self):
        return {"my-command": lambda: self.execute()}
```

### Test It

```python
# test_my_plugin.py
import pytest
from my_plugin import MyPlugin

def test_basic():
    plugin = MyPlugin()
    result = plugin.execute()
    assert result["result"] == "hello from plugin!"
```

### Run Tests

```bash
pytest test_my_plugin.py -v
```

### Publish

1. Add `PLUGIN_MANIFEST` metadata to your plugin
2. Submit to marketplace (see [Publishing](#publishing-to-marketplace))
3. Get certified (see [Certification](#certification-criteria))

---

## Plugin Architecture

### BasePlugin Interface

All plugins must inherit from `BasePlugin` and implement:

```python
class BasePlugin(ABC):
    @property
    @abstractmethod
    def metadata(self) -> PluginMetadata:
        """Return plugin metadata."""
        pass
    
    @abstractmethod
    def initialize(self, config: Optional[Dict[str, Any]] = None) -> None:
        """Initialize the plugin with config."""
        pass
    
    @abstractmethod
    def execute(self, *args, **kwargs) -> Any:
        """Execute plugin's main functionality."""
        pass
    
    def cleanup(self) -> None:
        """Optional: cleanup when plugin unloads."""
        pass
    
    def get_commands(self) -> Dict[str, Callable]:
        """Optional: provide CLI commands."""
        return {}
```

### PluginMetadata

```python
@dataclass
class PluginMetadata:
    name: str                      # Unique identifier
    version: str                   # Semantic versioning
    description: str               # One-line description
    author: str                    # Your name
    license: str = "MIT"           # License (MIT, Apache 2.0, etc.)
    dependencies: List[str] = []   # External packages (NO external deps!)
    entry_point: str = ""          # Module:ClassName
    tags: List[str] = []           # Searchable tags
```

### Execution Flow

```
User Input
    ↓
Plugin.initialize() [once at load]
    ↓
Plugin.execute(*args, **kwargs) [on each use]
    ↓
Plugin.get_commands() [for CLI integration]
    ↓
Plugin.cleanup() [on unload]
```

---

## Creating Your First Plugin

### Step 1: Define Your Plugin

```python
from typing import Dict, Optional, Any, Callable
from lmapp.plugins.plugin_manager import BasePlugin, PluginMetadata

class MyAwesomePlugin(BasePlugin):
    def __init__(self):
        self._metadata = PluginMetadata(
            name="awesome",
            version="0.1.0",
            description="Does awesome things",
            author="Your Name",
            license="MIT",
            dependencies=[],  # IMPORTANT: Keep external deps minimal!
            tags=["awesome", "utility"],
        )
    
    @property
    def metadata(self) -> PluginMetadata:
        return self._metadata
    
    def initialize(self, config: Optional[Dict[str, Any]] = None) -> None:
        """Setup phase - called once when plugin loads."""
        if config:
            self.setting1 = config.get("setting1", "default")
    
    def execute(self, *args, **kwargs) -> Dict[str, Any]:
        """Main execution - called for each action."""
        input_text = kwargs.get("input", "")
        # Process input
        return {"output": f"Processed: {input_text}"}
    
    def cleanup(self) -> None:
        """Cleanup phase - called when plugin unloads."""
        pass
    
    def get_commands(self) -> Dict[str, Callable]:
        """Provide CLI commands."""
        return {
            "awesome": self.execute,
            "awesome-info": self._info,
        }
    
    def _info(self, *args, **kwargs) -> Dict[str, Any]:
        """Example command."""
        return {"info": "I am awesome!"}
```

### Step 2: Add Marketplace Metadata

```python
# At bottom of plugin file
PLUGIN_MANIFEST = {
    "name": "awesome",
    "version": "0.1.0",
    "author": "Your Name",
    "description": "Does awesome things",
    "repository": "https://github.com/yourname/lmapp-awesome",
    "install_url": "https://github.com/yourname/lmapp-awesome/raw/main/awesome.py",
    "tags": ["awesome", "utility"],
    "dependencies": [],
    "license": "MIT",
}
```

### Step 3: Write Tests

```python
import pytest
from my_awesome_plugin import MyAwesomePlugin

class TestAwesomePlugin:
    def test_metadata(self):
        plugin = MyAwesomePlugin()
        assert plugin.metadata.name == "awesome"
    
    def test_execute(self):
        plugin = MyAwesomePlugin()
        result = plugin.execute(input="test")
        assert "output" in result
    
    def test_commands(self):
        plugin = MyAwesomePlugin()
        cmds = plugin.get_commands()
        assert "awesome" in cmds
```

### Step 4: Publish

See [Publishing](#publishing-to-marketplace) section below.

---

## Plugin Template

Use this as a starting point:

```python
\"\"\"
[PLUGIN NAME] Plugin for LMAPP v0.2.5.

[One paragraph description]

Features:
- Feature 1
- Feature 2
- Feature 3

Usage:
    plugin = [PluginClass]()
    plugin.initialize({...})
    result = plugin.execute(...)
\"\"\"

from typing import Dict, Optional, Any, Callable, List
from dataclasses import dataclass
from lmapp.plugins.plugin_manager import BasePlugin, PluginMetadata


class [PluginClass](BasePlugin):
    \"\"\"[Plugin description].\"\"\"
    
    def __init__(self):
        self._metadata = PluginMetadata(
            name="[plugin-name]",
            version="0.1.0",
            description="[One-line description]",
            author="[Your Name]",
            license="MIT",
            dependencies=[],
            tags=["[tag1]", "[tag2]"],
        )
        self.stats = {"executions": 0}
    
    @property
    def metadata(self) -> PluginMetadata:
        return self._metadata
    
    def initialize(self, config: Optional[Dict[str, Any]] = None) -> None:
        if config:
            pass  # Setup code
    
    def execute(self, *args, **kwargs) -> Dict[str, Any]:
        \"\"\"Execute plugin.
        
        Args:
            [args/kwargs documentation]
        
        Returns:
            Dict with results
        \"\"\"
        self.stats["executions"] += 1
        return {"status": "success"}
    
    def cleanup(self) -> None:
        self.stats = {"executions": 0}
    
    def get_commands(self) -> Dict[str, Callable]:
        return {"command": self._command}
    
    def _command(self, *args, **kwargs) -> Dict[str, Any]:
        \"\"\"CLI command.\"\"\"
        return self.execute(*args, **kwargs)


__all__ = ["[PluginClass]"]

PLUGIN_MANIFEST = {
    "name": "[plugin-name]",
    "version": "0.1.0",
    "author": "[Your Name]",
    "description": "[One-line description]",
    "repository": "https://github.com/[user]/[repo]",
    "tags": ["[tag1]", "[tag2]"],
    "dependencies": [],
    "license": "MIT",
}
```

---

## Testing Your Plugin

### Unit Tests

```python
def test_basic_functionality():
    plugin = MyPlugin()
    result = plugin.execute(data="test")
    assert result["success"]

def test_error_handling():
    plugin = MyPlugin()
    result = plugin.execute()  # Missing required arg
    assert result["status"] == "error"
```

### Integration Tests

```python
def test_full_workflow():
    plugin = MyPlugin()
    plugin.initialize({"setting": "value"})
    
    commands = plugin.get_commands()
    result = commands["main"](data="test")
    
    assert result["status"] == "success"
    plugin.cleanup()
```

### Run Tests

```bash
# Single test file
pytest test_my_plugin.py -v

# Specific test
pytest test_my_plugin.py::TestMyPlugin::test_basic -v

# With coverage
pytest test_my_plugin.py --cov=my_plugin
```

### Testing Checklist

- [ ] Metadata is correct
- [ ] initialize() sets config properly
- [ ] execute() handles missing/invalid inputs
- [ ] get_commands() returns callable functions
- [ ] cleanup() resets state
- [ ] All commands work independently
- [ ] Statistics track correctly
- [ ] No external API calls (except in special cases)
- [ ] No hardcoded paths (use config)
- [ ] All dependencies explicitly listed

---

## Publishing to Marketplace

### Step 1: Prepare Your Plugin

```python
# 1. Add PLUGIN_MANIFEST to your plugin file
PLUGIN_MANIFEST = {...}

# 2. Make sure tests pass
pytest test_my_plugin.py -v

# 3. Document usage in docstring
# 4. Add examples to README.md
# 5. Get certified (see below)
```

### Step 2: Submit to Marketplace

```bash
# 1. Create GitHub repo
git clone https://github.com/nabaznyl/lmapp
cd lmapp/marketplace/submissions

# 2. Add your plugin
cp /path/to/my_plugin.py ./plugins/
cp /path/to/test_my_plugin.py ./tests/

# 3. Create submission PR
git checkout -b plugin/my-plugin
git add plugins/ tests/
git commit -m "feat: submit my-plugin for certification"
git push origin plugin/my-plugin

# 4. Open pull request on GitHub
```

### Step 3: Certification Process

Your plugin must pass:

1. **Code Quality** (see [Certification Criteria](#certification-criteria))
2. **Test Coverage** (minimum 80%)
3. **Security Review** (no external API calls, safe dependencies)
4. **Documentation** (README, docstrings, examples)
5. **Performance** (reasonable execution time)

### Step 4: Release

Once certified:

```bash
# 1. Your plugin is added to official marketplace
# 2. Users can install: lmapp plugin install my-plugin
# 3. You're listed as author in marketplace
# 4. Your repo gets LMAPP badge 🏆
```

---

## Best Practices

### 1. No External Dependencies

```python
# ❌ BAD - adds external dependency
import numpy as np
import tensorflow as tf

# ✅ GOOD - use standard library
import re
import json
from dataclasses import dataclass
```

### 2. Clear Naming

```python
# ❌ BAD
def fn(x):
    return x * 2

# ✅ GOOD
def double_value(number: int) -> int:
    \"\"\"Double the input number.\"\"\"
    return number * 2
```

### 3. Error Handling

```python
# ❌ BAD
def process(data):
    return json.loads(data)

# ✅ GOOD
def process(data: str) -> Dict[str, Any]:
    \"\"\"Parse JSON safely.\"\"\"
    if not data:
        return {"status": "error", "message": "No data provided"}
    
    try:
        return {"status": "success", "data": json.loads(data)}
    except json.JSONDecodeError:
        return {"status": "error", "message": "Invalid JSON"}
```

### 4. State Management

```python
# ✅ GOOD - track usage statistics
class MyPlugin(BasePlugin):
    def __init__(self):
        self.stats = {
            "executions": 0,
            "errors": 0,
            "total_time": 0.0,
        }
    
    def cleanup(self):
        self.stats = {...}  # Reset on cleanup
```

### 5. Configuration

```python
# ✅ GOOD - use initialize() for config
def initialize(self, config: Optional[Dict[str, Any]] = None) -> None:
    if config:
        self.timeout = config.get("timeout", 30)
        self.max_retries = config.get("max_retries", 3)
```

### 6. Documentation

```python
def execute(self, *args, **kwargs) -> Dict[str, Any]:
    \"\"\"Execute plugin operation.
    
    Args:
        input_text (str): Text to process
        option_a (bool): Enable option A (default: False)
    
    Returns:
        Dict containing:
            - status: "success" or "error"
            - result: Processed output
            - stats: Execution statistics
    
    Raises:
        ValueError: If input is invalid
    
    Example:
        >>> plugin.execute(input_text="hello", option_a=True)
        {'status': 'success', 'result': 'HELLO', 'stats': {...}}
    \"\"\"
```

---

## Certification Criteria

### Code Quality ✓

- [ ] PEP 8 compliant (use `black` formatter)
- [ ] Type hints for all functions
- [ ] Docstrings for all public methods
- [ ] No hardcoded values (use config)
- [ ] Proper error messages

### Testing ✓

- [ ] 80%+ test coverage
- [ ] Unit tests for each method
- [ ] Integration tests for workflows
- [ ] Error cases handled
- [ ] Tests pass on Python 3.10+

### Security ✓

- [ ] No external API calls (unless documented)
- [ ] Safe dependency list (MIT/Apache/BSD only)
- [ ] Input validation on all args
- [ ] No file system access outside sandbox
- [ ] No subprocess calls (unless necessary)

### Performance ✓

- [ ] Execute < 1 second for typical use
- [ ] Memory footprint < 50MB
- [ ] No memory leaks
- [ ] Efficient algorithms

### Documentation ✓

- [ ] Plugin docstring (50+ words)
- [ ] README.md with usage examples
- [ ] Feature list documented
- [ ] CLI commands documented
- [ ] Configuration options listed

### Maturity ✓

- [ ] Semantic versioning used
- [ ] CHANGELOG.md maintained
- [ ] Issue tracker enabled
- [ ] License clearly stated (MIT or compatible)

---

## FAQ

### Q: Can I use external packages?

A: Avoid them. If necessary:
- Limit to 1-2 small packages (MIT/Apache/BSD)
- Justify in README
- Requires special approval
- Prefer pure Python solutions

### Q: How do I handle configuration?

A:
```python
def initialize(self, config: Optional[Dict[str, Any]] = None) -> None:
    if config:
        self.setting = config.get("setting", "default")
```

### Q: How do I provide CLI commands?

A:
```python
def get_commands(self) -> Dict[str, Callable]:
    return {
        "my-command": self._command_handler,
    }

def _command_handler(self, *args, **kwargs):
    return self.execute(*args, **kwargs)
```

### Q: How do I access files?

A: Use `config` to specify paths:
```python
def initialize(self, config: Optional[Dict[str, Any]] = None) -> None:
    self.data_dir = config.get("data_dir", "./data/")
```

### Q: How do I submit updates?

A: Create a new PR with version bump in PLUGIN_MANIFEST

### Q: Where can I get help?

A:
- Check example plugins in `src/lmapp/plugins/`
- Read BasePlugin implementation
- Open issue on GitHub
- Email: support@lmapp.dev

---

## Examples in This Distribution

Reference implementations of certified plugins:

1. **Translator** (`example_translator.py`)
   - Multi-language support
   - Caching pattern
   - Simple string matching

2. **Code Analyzer** (`example_code_analyzer.py`)
   - Pattern matching
   - Severity classification
   - Statistics tracking

3. **Git Flow** (`example_git_flow.py`)
   - State management
   - Branch automation
   - Commit messaging

4. **Summarizer** (`example_summarizer.py`)
   - Text processing
   - Compression ratio
   - Sentence extraction

5. **Q&A Bot** (`example_qa_bot.py`)
   - Knowledge base
   - Relevance scoring
   - Document indexing

Study these implementations as reference!

---

## Getting Started

1. Pick an example plugin (start with `Translator`)
2. Copy the template above
3. Write your plugin
4. Write tests (copy from examples)
5. Run tests locally: `pytest test_my_plugin.py -v`
6. Submit to marketplace
7. Celebrate! 🎉

---

## Support

For questions or issues:
- GitHub Issues: https://github.com/nabaznyl/lmapp/issues
- Discussion: https://github.com/nabaznyl/lmapp/discussions
- Email: support@lmapp.dev

Happy plugin building! 🚀
