# Security Policy

## Reporting Vulnerabilities

The lmapp project takes security seriously. If you discover a security vulnerability, **please do not create a public GitHub issue**. Instead, follow this process:

### 🔐 Private Disclosure

**Email:** security@nabaznyl.dev (or open a private security advisory on GitHub)

**Include in your report:**
1. Description of the vulnerability
2. Steps to reproduce (if applicable)
3. Impact assessment (what can be exploited)
4. Your name and contact information (optional)
5. Whether you'd like to be credited in the advisory

### Response Timeline

- **Acknowledgment:** Within 48 hours
- **Assessment:** Within 1 week
- **Fix development:** Within 2 weeks (depending on severity)
- **Disclosure:** After patch release and 30-day embargo period

---

## Supported Versions

| Version | Status | Security Updates |
|---------|--------|-------------------|
| 0.1.0+ | Current | ✅ Active |
| < 0.1.0 | EOL | ❌ No longer supported |

---

## Security Best Practices for Users

### Installation & Updates

- ✅ Always use `pip install --upgrade lmapp` to get the latest version
- ✅ Monitor GitHub releases for security announcements
- ✅ Review CHANGELOG.md for security fixes
- ⚠️ Avoid pinning old versions (e.g., `pip install lmapp==0.1.0`)

### Configuration & Usage

- ✅ Keep API credentials secure (don't commit to git)
- ✅ Use environment variables for sensitive config
- ✅ Review backend configurations before sharing
- ⚠️ Don't log sensitive prompts or conversations
- ⚠️ Be cautious with model outputs (LLMs can generate harmful content)

### Local Deployment

- ✅ Run lmapp behind authentication if exposed
- ✅ Firewall model endpoints (Ollama, llamafile)
- ✅ Use HTTPS if exposing over network
- ⚠️ Don't run untrusted backends
- ⚠️ Validate all user inputs before processing

---

## Known Issues & Advisories

Currently, no known security vulnerabilities in lmapp 0.1.0.

For the latest advisories, see: [GitHub Security Advisories](https://github.com/nabaznyl/lmapp/security/advisories)

---

## Dependency Security

### Vulnerability Scanning

- **Tool:** pip-audit (integrated in CI/CD)
- **Frequency:** Every release
- **Status:** ✅ Active
- **Process:**
  1. Run on every version bump
  2. Block releases if vulnerabilities found
  3. Notify maintainers immediately

### Current Dependencies

All dependencies use permissive licenses (MIT, BSD, Apache 2.0):

```
click==8.1.7              # MIT
rich==13.6.0              # MIT
pydantic==2.5.0           # MIT
requests==2.31.0          # Apache 2.0
loguru==0.7.2             # MIT
setuptools==68.0.0        # MIT
pytest==7.4.3             # MIT
black==23.11.0            # MIT
flake8==6.1.0             # MIT
mypy==1.7.0               # MIT
pre-commit==3.5.0         # MIT
```

**Last Audit:** November 24, 2025 ✅

---

## Security Hardening

### Current Measures

- ✅ Dependency pinning (requirements.txt with exact versions)
- ✅ Automated vulnerability scanning (CI/CD)
- ✅ Code quality checks (Black, Flake8, mypy)
- ✅ Comprehensive test coverage (128 tests, 100%)
- ✅ Pre-commit hooks (lint & type checks)
- ✅ Type safety enforcement (mypy)

### Planned Improvements (v1.0+)

- 🔄 Code signing (Windows .exe, macOS DMG)
- 🔄 SBOM (Software Bill of Materials)
- 🔄 Runtime security sandbox (for model execution)
- 🔄 End-to-end encryption (for conversation export)

---

## What's NOT in Scope

lmapp delegates security responsibilities to its backends:

- **Ollama:** Managed by Ollama project (see [Ollama Security](https://github.com/ollama/ollama#security))
- **llamafile:** Managed by llamafile project (see [llamafile Documentation](https://github.com/Mozilla-Ocho/llamafile))
- **Model Safety:** Your responsibility to understand and audit model outputs

---

## Questions?

- **Have a security concern?** Email security@nabaznyl.dev (private)
- **Want security best practices?** See section above
- **Found a dependency issue?** Report via GitHub Issues (non-security) or email (security)
- **Questions about policy?** Open a Discussion on GitHub

---

## Attribution & References

This security policy is based on:
- [OWASP Security Guidelines](https://owasp.org)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Python Security Standards](https://www.python.org/dev/peps/pep-0566/)

---

**Last Updated:** November 24, 2025  
**Version:** 1.0  
**Policy Review:** Quarterly (every 3 months)
