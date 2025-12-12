# LMAPP: Interactive Tour & Examples

**[← Back to README](README.md)** | **[🔗 GitHub](https://github.com/nabaznyl/lmapp)** | **[📦 PyPI](https://pypi.org/project/lmapp/)**

> **Experience it yourself:** The best way to see lmapp in action is to run it.
> `pip install lmapp && lmapp chat`

---

## 🎬 The Interactive Tour

Follow this script to experience the core features of lmapp on your own machine.

### Scene 1: The First Chat (30 seconds)

**Action:**
```bash
lmapp chat
```

**Experience:**
1. The CLI launches instantly.
2. You are greeted by the setup wizard (first run only).
3. You select "Download Model" (or use existing Ollama).
4. **You type:** "Explain quantum computing in one sentence."
5. **AI responds:** "Quantum computing uses quantum mechanics to process information in ways that classical computers cannot, enabling exponential speedups for specific problems."

### Scene 2: The "Auditor" (Code Review)

**Action:**
Create a file named `buggy.py`:
```python
def login(user, password):
    if password == "admin123":  # Hardcoded!
        return True
```

**Run:**
```bash
lmapp chat --model mistral
```

**You type:**
"Review this code for security issues: [paste code]"

**AI responds:**
"CRITICAL: Hardcoded password found on line 2. Never store credentials in plain text."

### Scene 3: RAG (Chat with your Data)

**Action:**
```bash
# Index your current directory
lmapp rag index .

# Ask a question about your files
lmapp rag search "how do I install"
```

**Experience:**
The AI scans your `README.md` and `INSTALL.md` and gives you the exact answer based on *your* files, not general knowledge.

---

## 📚 Real-World Use Cases

### 1. The "Offline" Developer
**Scenario:** You are on a plane or train with no WiFi.
**Solution:** `lmapp` runs 100% locally.
**Command:** `lmapp chat`
**Result:** Full coding assistance, documentation lookup, and refactoring support without internet.

### 2. The Privacy-Conscious Enterprise
**Scenario:** You cannot send proprietary code to cloud LLMs.
**Solution:** `lmapp` keeps all data on your machine.
**Verification:** Disconnect your internet. It still works.

### 3. The Automation Engineer
**Scenario:** You need to process 100 text files.
**Solution:** Batch processing.
**Command:** `lmapp batch create inputs.json`
**Result:** The AI processes all files in the background while you work on other things.

---

## 🎥 Visual Demonstrations

*(Coming Soon: Video walkthroughs and asciinema recordings)*

---

**Ready to start?**
[**Return to Quick Start Guide**](QUICKSTART.md)
