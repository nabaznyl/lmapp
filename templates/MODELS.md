# AI Model Licenses and Usage Terms

This document lists the AI models supported by lmapp and their respective licenses.

---

## Important Notice

**Each AI model has its own license and usage restrictions.** Before using any model:

1. ✓ Review the model's license terms
2. ✓ Understand commercial vs. non-commercial restrictions
3. ✓ Comply with attribution requirements
4. ✓ Respect export control regulations
5. ✓ Check for updates to license terms

**lmapp (the application) is MIT licensed, but the AI models have separate licenses.**

---

## Supported Models

### Meta Llama Models

| Model | Size | License | Commercial Use |
|-------|------|---------|----------------|
| Llama 2 7B | ~4GB | Meta Llama 2 Community License | ✓ Permitted |
| Llama 2 13B | ~7GB | Meta Llama 2 Community License | ✓ Permitted |
| Llama 3.1 8B | ~5GB | Meta Llama 3.1 Community License | ✓ Permitted |

**License**: [Meta Llama Community License Agreement](https://github.com/meta-llama/llama/blob/main/LICENSE)

**Key Terms**:
- Free for research and commercial use
- Attribution required in derivative works
- Cannot use "Llama" in product names without permission
- Export control compliance required

---

### Mistral AI Models

| Model | Size | License | Commercial Use |
|-------|------|---------|----------------|
| Mistral 7B | ~4GB | Apache 2.0 | ✓ Permitted |
| Mixtral 8x7B | ~26GB | Apache 2.0 | ✓ Permitted |

**License**: [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

**Key Terms**:
- Permissive open-source license
- Commercial use allowed
- Modification and redistribution allowed
- Must include license notice

---

### Microsoft Phi Models

| Model | Size | License | Commercial Use |
|-------|------|---------|----------------|
| Phi-2 | ~1.5GB | MIT | ✓ Permitted |
| Phi-3 Mini | ~2GB | MIT | ✓ Permitted |

**License**: [MIT License](https://opensource.org/licenses/MIT)

**Key Terms**:
- Most permissive open-source license
- Free for any use (commercial/non-commercial)
- No restrictions on modification or distribution

---

### Google Gemma Models

| Model | Size | License | Commercial Use |
|-------|------|---------|----------------|
| Gemma 2B | ~1.5GB | Gemma Terms of Use | ✓ Permitted with restrictions |
| Gemma 7B | ~4GB | Gemma Terms of Use | ✓ Permitted with restrictions |

**License**: [Gemma Terms of Use](https://ai.google.dev/gemma/terms)

**Key Terms**:
- Free for research and commercial use
- Prohibited use cases listed in terms
- Cannot be used to improve other LLMs
- Attribution encouraged

---

### TinyLlama

| Model | Size | License | Commercial Use |
|-------|------|---------|----------------|
| TinyLlama 1.1B | ~600MB | Apache 2.0 | ✓ Permitted |

**License**: [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)

---

## License Comparison

| License Type | Commercial Use | Modifications | Redistribution | Attribution |
|--------------|----------------|---------------|----------------|-------------|
| MIT | ✓ | ✓ | ✓ | Optional |
| Apache 2.0 | ✓ | ✓ | ✓ | Required |
| Meta Llama | ✓ | ✓ | ✓ | Required |
| Gemma Terms | ✓ (restricted) | ✓ | ✓ | Encouraged |

---

## Prohibited Use Cases

Most model licenses prohibit:

- ✗ Generating illegal content
- ✗ Creating malware or harmful software
- ✗ Harassing, threatening, or bullying individuals
- ✗ Generating false information with intent to harm
- ✗ Violating privacy rights
- ✗ Infringing intellectual property
- ✗ Certain defense/military applications (varies by license)

**Always review the specific license for complete prohibited use cases.**

---

## Export Control Compliance

AI models may be subject to export control regulations:

- **U.S. Export Administration Regulations (EAR)**
- **International Traffic in Arms Regulations (ITAR)**
- **Country-specific import/export laws**

**Restricted entities/countries**:
- Check OFAC sanctions list
- Verify export eligibility before distribution
- Consult legal counsel for international use

---

## Model Attribution Examples

### For Meta Llama:
```
This product uses Meta Llama 2, licensed under the Meta Llama 2 Community License.
Model: https://github.com/meta-llama/llama
```

### For Mistral:
```
This product uses Mistral 7B, licensed under Apache 2.0.
Model: https://mistral.ai/
```

### For Phi:
```
This product uses Microsoft Phi-2, licensed under MIT.
Model: https://huggingface.co/microsoft/phi-2
```

---

## Updates & Changes

Model licenses may change. Check periodically:

- Model creator's official website
- Hugging Face model card
- GitHub repository license file
- lmapp documentation updates

---

## Liability Disclaimer

**lmapp is not responsible for:**
- User's compliance with model licenses
- Changes to model license terms
- Model output or generated content
- Violations of model usage restrictions
- Legal consequences of model misuse

**Users are solely responsible for ensuring compliance with all applicable licenses.**

---

## Resources

- [Hugging Face Model Hub](https://huggingface.co/models)
- [Ollama Model Library](https://ollama.ai/library)
- [Meta Llama](https://ai.meta.com/llama/)
- [Mistral AI](https://mistral.ai/)
- [Google AI Gemma](https://ai.google.dev/gemma)

---

## Questions?

For license questions:
- Contact the model creator directly
- Review model documentation
- Consult legal counsel for commercial use

For lmapp-specific questions:
- GitHub Issues: https://github.com/yourusername/lmapp/issues
- Email: support@lmapp.dev

---

**Last Updated**: November 23, 2025
