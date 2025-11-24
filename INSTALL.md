# lmapp Installation Guide

---

## 🚀 Quick Install

```bash
pip install lmapp
lmapp chat
```

**Update:**
```bash
pip install --upgrade lmapp
```



## 📦 Alternative Installations

### From GitHub Releases
```bash
# Download .whl from https://github.com/nabaznyl/lmapp/releases
pip install lmapp-0.1.0-py3-none-any.whl
```

### From Source
```bash
git clone https://github.com/nabaznyl/lmapp.git
cd lmapp
pip install .
```



## ✅ Verify Installation

```bash
lmapp --version
lmapp status
lmapp chat
```

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| `command not found` | Add `~/.local/bin` to `$PATH` or use `pipx install lmapp` |
| `ModuleNotFoundError` | Reinstall: `pip install --upgrade lmapp` |
| Debian/Ubuntu issues | Use `pipx install lmapp` instead of `pip` |

See [Troubleshooting Guide](./TROUBLESHOOTING.md) for more.

## 📚 Next Steps

- [Quick Start](./README.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
- [Contributing](./CONTRIBUTING.md)
