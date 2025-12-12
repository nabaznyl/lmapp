# Legal Notice & Third-Party Licenses

## lmapp Project License

**lmapp** is licensed under the **MIT License**.

See [`LICENSE`](./LICENSE) file for full license text.

---

## Dependencies & Compliance

### Direct Python Dependencies

All direct dependencies use **permissive, MIT-compatible licenses**. No GPL or copyleft licenses are included.

| Package | License | Status |
|---------|---------|--------|
| click | BSD 3-Clause | ✓ Compatible |
| rich | MIT | ✓ Compatible |
| pydantic | MIT | ✓ Compatible |
| requests | Apache 2.0 | ✓ Compatible |
| inquirer | MIT | ✓ Compatible |
| prompt-toolkit | BSD 3-Clause | ✓ Compatible |
| psutil | BSD 3-Clause | ✓ Compatible |
| distro | Apache 2.0 | ✓ Compatible |
| python-dotenv | BSD 3-Clause | ✓ Compatible |
| pyyaml | MIT | ✓ Compatible |
| loguru | MIT | ✓ Compatible |

**Conclusion:** Your lmapp MIT license is **safe and uncontaminated**. No GPL dependencies to worry about.

---

## External Runtime Tools

lmapp can integrate with optional external tools. These are **NOT bundled** with lmapp; users download them separately.

### Ollama

- **License:** MIT License
- **Source:** https://github.com/ollama/ollama
- **Distribution:** Users must download separately from ollama.ai
- **User Responsibility:** Users accept Ollama's MIT license when downloading
- **lmapp Responsibility:** None—lmapp just invokes it

### llamafile

- **License:** Apache License 2.0
- **Source:** https://github.com/Mozilla-Ocho/llamafile
- **Distribution:** Users must download separately from Mozilla
- **User Responsibility:** Users accept llamafile's Apache 2.0 license when downloading
- **lmapp Responsibility:** None—lmapp just invokes it

### AI Models

AI models distributed with or accessed through these tools may have their own licenses.

- **User Responsibility:** Users must comply with individual model licenses before use
- **lmapp Responsibility:** Provides guidance via `MODELS.md` (future)

---

## Why This Matters

1. **You Can:**
   - ✓ Distribute lmapp commercially
   - ✓ Modify lmapp and redistribute
   - ✓ Use lmapp in proprietary products (attribution appreciated)
   - ✓ Sublicense lmapp under MIT terms

2. **You Must:**
   - Include original copyright notice and license text
   - Document significant changes

3. **You Cannot:**
   - Hold lmapp developers liable (MIT clause)
   - Trademark the name without permission

---

## Summary for Users

**lmapp itself:** MIT License → Use freely for any purpose ✓

**When users install optional backends:**
- Ollama: MIT License (same as lmapp)
- llamafile: Apache 2.0 (permissive, but requires acknowledgment)
- Models: Vary by model (user responsibility to check)

**Bottom Line:** No legal risk for lmapp distribution. Users are responsible for complying with licenses of tools they voluntarily download.

---

## Questions?

- **MIT License Question:** See https://opensource.org/licenses/MIT
- **Apache 2.0 Question:** See https://opensource.org/licenses/Apache-2.0
- **Open Source Compliance:** See https://choosealicense.com

---

**Last Updated:** 2025-11-24  
**Status:** ✓ Legally Compliant - No GPL Contamination
