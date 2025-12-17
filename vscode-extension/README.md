# lmapp VS Code Extension

**lmapp Copilot** - Local AI Assistant for VS Code, powered by lmapp

[![Version](https://img.shields.io/badge/version-0.3.5-blue.svg)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Features

### ✨ Phase 1: Code Analysis
- **Real-time Code Analysis**: Detect issues in your code as you type
- **Multi-language Support**: Python, JavaScript, TypeScript, Java, C/C++
- **Issue Categories**: Syntax errors, style violations, performance anti-patterns
- **Integration**: Diagnostics panel with detailed explanations
- **Smart Filtering**: Ignore specific issues or configure per-file

### 🔧 Phase 2: Refactoring & Quick Fixes
- **Quick Fix Integration**: VS Code lightbulb (💡) with suggested fixes
- **One-Click Refactoring**: Auto-apply fixes with a single click
- **Batch Refactoring**: Analyze and fix entire files
- **Selection Refactoring**: Analyze selected code snippets
- **Auto-Fixable Detection**: Knows which issues can be automatically fixed

### ✍️ Inline Completions
- **Ghost-text Suggestions**: See completions before accepting
- **Context Aware**: Uses surrounding code for better suggestions
- **Customizable**: Toggle on/off, adjust debounce timing
- **Fast**: Cached results for improved performance

## Quick Start

### Installation

1. Install the extension from VS Code Marketplace (search for "lmapp")
2. Or install from command line:
   ```bash
   code --install-extension lmapp.lmapp-vscode
   ```

### Setup

1. **Start lmapp server** (backend required):
   ```bash
   lmapp serve --port 8000
   ```

2. **Configure extension** (optional):
   - Open VS Code settings (`Ctrl+,`)
   - Search for "lmapp"
   - Set server URL if different from default

3. **Use extension**:
   - Press `Ctrl+Shift+L` to start analyzing
   - Look for lightbulb (💡) for quick fixes
   - Check Diagnostics panel (View → Problems)

## Commands

### Available Commands

| Command | Description | Keyboard Shortcut |
|---------|-------------|-------------------|
| `lmapp.startServer` | Start local API server | - |
| `lmapp.stopServer` | Stop local API server | - |
| `lmapp.toggleServer` | Toggle server on/off | - |
| `lmapp.refactorSelection` | Refactor selected code | `Ctrl+Shift+R` |
| `lmapp.quickFixOnFile` | Quick fix current file | `Ctrl+Shift+F` |

### Command Palette

Access all commands via Command Palette (`Ctrl+Shift+P`):
```
lmapp: Start API Server
lmapp: Stop API Server
lmapp: Refactor Selection
lmapp: Quick Fix Current File
```

## Configuration

All settings are under `lmapp.*` prefix:

```json
{
  "lmapp.serverUrl": "http://localhost:8000",
  "lmapp.model": "tinyllama",
  "lmapp.enableInlineCompletion": true,
  "lmapp.contextLines": 50,
  "lmapp.debounceMs": 500,
  "lmapp.requestTimeout": 5000,
  "lmapp.enableCompletionCache": true
}
```

### Configuration Details

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `serverUrl` | string | `http://localhost:8000` | URL of lmapp API server |
| `model` | string | `tinyllama` | Model to use for completions |
| `enableInlineCompletion` | boolean | `true` | Enable ghost-text suggestions |
| `contextLines` | number | `50` | Lines of context to send |
| `debounceMs` | number | `500` | Debounce interval (100-5000ms) |
| `requestTimeout` | number | `2000` | API request timeout (1000-10000ms) |
| `enableCompletionCache` | boolean | `true` | Cache completion results |

## Usage Examples

### Example 1: Code Analysis

1. **Write code with issues**:
   ```python
   import os
   def hello():
       x = 5
       y = 10
       print(y)
   ```

2. **See issues in Diagnostics panel**:
   ```
   [W] Unused import 'os'
   [W] Unused variable 'x'
   ```

3. **Understand the issues** via detailed explanations

### Example 2: Quick Fix via Lightbulb

1. **Click on line with issue** (lightbulb appears)
2. **Select quick fix**:
   ```
   💡 Quick Fix
     🔧 Remove unused import os
     🔧 Remove unused variable x
   ```
3. **Code automatically fixed**:
   ```python
   def hello():
       y = 10
       print(y)
   ```

### Example 3: Selection Refactoring

1. **Select problematic code**:
   ```javascript
   var x=1+2;
   ```

2. **Run "lmapp: Refactor Selection"** (`Ctrl+Shift+R`)

3. **See suggestions**:
   ```
   Found 3 refactoring suggestions:
   2 whitespace, 1 naming_convention
   ```

4. **Manually or auto-apply fixes** (follow up with quick fix)

## Status Bar

The extension shows a status indicator in the status bar:

- 🟢 **Ready**: Extension is active and ready
- 🟡 **⏳ Running...**: Analysis in progress
- 🔴 **Stopped**: Server is not running
- 🔴 **Error**: Connection error (check server URL)

Click the status bar item to toggle server on/off.

## Keyboard Shortcuts

| Shortcut | Command |
|----------|---------|
| `Ctrl+Shift+R` | Refactor Selection |
| `Ctrl+Shift+F` | Quick Fix Current File |
| Click lightbulb | Show quick fixes |

## Troubleshooting

### Issue: Extension is inactive

**Solution**: 
1. Check if lmapp server is running: `lmapp serve`
2. Check server URL in settings matches running server
3. Reload VS Code window (`Ctrl+Shift+P` → "Reload Window")

### Issue: Slow analysis

**Solutions**:
1. Increase `requestTimeout` in settings
2. Decrease `contextLines` for smaller context
3. Check server is not overloaded (try reducing debounce ms)

### Issue: Quick fixes not working

**Solutions**:
1. Verify backend has refactoring endpoints implemented
2. Check `/v1/refactor/quick-fixes` endpoint is accessible
3. Try a simple file with obvious issues (unused import)

### Issue: Wrong suggestions

**Solutions**:
1. Code must be syntactically valid
2. Check language is correctly detected
3. Review fix explanation for context

### Debug Mode

Enable debug logging:
```json
{
  "lmapp.debugMode": true
}
```

Check output in "lmapp Extension" tab in Output panel.

## Performance

### Expected Response Times

| Operation | Time |
|-----------|------|
| Inline completion | 200-500ms |
| Code analysis | 500ms-2s |
| Quick fixes detection | 100-300ms |
| Fix application | 50-100ms |

### Optimization Tips

1. **Reduce context lines** if analysis is slow
2. **Increase debounce** to reduce API calls
3. **Cache completions** enabled by default
4. **Disable inline** if you don't use it
5. **Use smaller files** for faster analysis

## Supported Languages

- ✅ **Python** - Full support (analysis + refactoring)
- ✅ **JavaScript** - Full support (analysis + refactoring)
- ✅ **TypeScript** - Full support (analysis + refactoring)
- ✅ **Java** - Partial (analysis only)
- ✅ **C/C++** - Partial (analysis only)
- ✅ **Generic** - Basic support for other languages

## File Size Limits

- **Analysis**: Up to 100,000 lines
- **Inline Completion**: Up to 50,000 lines
- **Quick Fixes**: Up to 100,000 lines

## Privacy & Security

- All code is processed **locally** on your lmapp server
- No data is sent to external services
- Code is not stored or logged by default
- Configure logging options in backend settings

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## Documentation

- [PHASE_2_FEATURE_2_SUMMARY.md](./PHASE_2_FEATURE_2_SUMMARY.md) - Feature implementation details
- [REFACTORING_API.md](./docs/REFACTORING_API.md) - Backend API specifications
- [BACKEND_IMPLEMENTATION_GUIDE.md](./BACKEND_IMPLEMENTATION_GUIDE.md) - Backend setup guide
- [FEATURE_COMPARISON.md](./FEATURE_COMPARISON.md) - Features comparison

## License

MIT - See [LICENSE](./LICENSE)

## Support

- **Issues**: Report bugs on [GitHub](https://github.com/nabaznyl/lmapp/issues)
- **Discussions**: Ask questions on [GitHub Discussions](https://github.com/nabaznyl/lmapp/discussions)
- **Documentation**: Visit [lmapp docs](https://github.com/nabaznyl/lmapp/wiki)

## Roadmap

### Phase 3: Advanced Features
- [ ] Batch project refactoring
- [ ] Custom rules configuration
- [ ] Team-wide standards
- [ ] Refactoring history & undo
- [ ] AI-powered suggestions

### Phase 4: Integration
- [ ] ESLint/Prettier integration
- [ ] Pylint/Black integration
- [ ] Custom linter support
- [ ] Version control hooks

### Phase 5: Analytics
- [ ] Code quality metrics
- [ ] Team refactoring stats
- [ ] Trend analysis
- [ ] Compliance reporting

---

**Made with ❤️ by the lmapp team**

For more information, visit [lmapp on GitHub](https://github.com/nabaznyl/lmapp)
