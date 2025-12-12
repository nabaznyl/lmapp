# LMAPP v0.2.4 Release Notes

**Released:** December 11, 2025  
**Status:** Development Release (0.2.4-dev)  
**Test Coverage:** 272/272 tests passing ✅

---

## 🎉 Major Features

### 1. **RAG (Retrieval-Augmented Generation) System** 
Semantic search over your local files without external dependencies.

**What it does:**
- Index text files, code files, markdown, JSON, HTML
- Search indexed documents by semantic similarity (Jaccard-based)
- Extract context for LLM prompt injection
- Automatic persistence to JSON storage

**Example usage:**
```bash
# Index your documents
lmapp rag index ~/documents
lmapp rag index project/src --recursive

# Search for relevant content
lmapp rag search "Python best practices"

# Use in chat with context
lmapp chat --with-context "How should I structure my Python project?"
```

**Key Classes:**
- `Document` - Represents indexed content (doc_id, title, content, metadata)
- `SimpleVectorizer` - Tokenization + Jaccard similarity scoring
- `DocumentIndex` - Persistent storage and search (JSON-based)
- `RAGSystem` - High-level interface for file indexing and context retrieval

**Test Coverage:** 16 tests (100% passing)

---

### 2. **Plugin System**
Extend LMAPP with custom plugins for additional functionality.

**What it does:**
- Plugin discovery from filesystem
- Dynamic module loading with error isolation
- Lifecycle management (initialize, execute, cleanup)
- CLI command registration from plugins
- Plugin metadata tracking and validation

**Example usage:**
```bash
# Discover and list plugins
lmapp plugin list

# Install a plugin
lmapp plugin install ~/plugins/my-translator

# Use plugin commands
lmapp translate "Hello world" --to spanish
```

**Key Classes:**
- `PluginMetadata` - Plugin information (name, version, author, dependencies)
- `BasePlugin` - Abstract base class for all plugins
- `PluginInfo` - Runtime plugin state and tracking
- `PluginManager` - Discovery, loading, and execution

**Architecture:**
- Plugins are Python modules with `plugin.json` metadata
- Each plugin implements `BasePlugin` abstract class
- Safe execution with error isolation
- Optional dependencies with fallback handling

**Test Coverage:** 6 tests (100% passing)

---

### 3. **Batch Processing**
Process multiple inputs efficiently with job management.

**What it does:**
- Create batch jobs from input files
- Process inputs with custom functions
- Track progress and results
- Multiple output formats (JSON, JSONL, CSV, text)
- Job persistence and statistics

**Example usage:**
```bash
# Create batch from file
lmapp batch create inputs.json --job-id my_job

# Process batch
lmapp batch process my_job

# Export results
lmapp batch results my_job --format json --output results.json

# Get statistics
lmapp batch stats my_job
```

**Key Classes:**
- `BatchInput` - Input item with content and metadata
- `BatchResult` - Result with output, status, and error tracking
- `BatchJob` - Collection of inputs with processing status
- `BatchProcessor` - Job manager with persistence

**Output Formats:**
- JSON - Single file with all results
- JSONL - Line-delimited JSON (streaming-friendly)
- CSV - Tabular format with columns
- Text - Plain text with results

**Test Coverage:** 11 tests (100% passing)

---

## 📊 Test Coverage

### New Tests (v0.2.4)
- **RAG System:** 16 tests
  - Document serialization/deserialization
  - Text tokenization and similarity scoring
  - Document indexing and search
  - File/directory indexing
  - Context extraction for prompts
  - Persistence across sessions

- **Plugin System:** 6 tests
  - Plugin metadata management
  - Plugin discovery
  - Plugin listing and stats

- **Batch Processing:** 11 tests
  - Batch job creation
  - Input/result serialization
  - Batch processing workflow
  - Output format conversion
  - File input loading
  - Job statistics

- **Integration:** 1 test
  - RAG + Batch Processing combined workflow

**Total:** 272 tests passing (239 baseline + 33 new)

---

## 🔧 Technical Details

### Design Principles

1. **No External ML Dependencies**
   - RAG uses Jaccard similarity (pure Python)
   - No numpy, scikit-learn, or transformers required
   - Lightweight and self-contained

2. **JSON-Based Persistence**
   - All data structures serialize to JSON
   - Human-readable storage format
   - Works with standard tools (jq, grep, etc.)

3. **Plugin-Driven Architecture**
   - Core functionality in base modules
   - Community can extend via plugins
   - Safe error isolation per plugin

4. **Batch-First Design**
   - Input/output abstraction
   - Progress tracking built-in
   - Multiple format support out-of-box

### File Structure

```
lmapp/
├── rag/
│   └── rag_system.py          # Document, Index, RAGSystem
├── plugins/
│   └── plugin_manager.py      # PluginManager, BasePlugin
├── batch/
│   └── batch_processor.py     # BatchProcessor, BatchJob
├── core/
│   ├── rag.py                 # Wrapper exports
│   ├── plugins.py             # Wrapper exports
│   └── batch.py               # Wrapper exports
└── tests/
    └── test_v024_features.py  # 33 comprehensive tests
```

---

## 🚀 Usage Examples

### RAG Example: Document Search

```python
from lmapp.rag.rag_system import RAGSystem

# Create RAG system
rag = RAGSystem("~/.lmapp/rag_index")

# Index documents
rag.index_directory("~/Documents")

# Search
results = rag.search("machine learning best practices", top_k=5)
for result in results:
    print(f"{result.document.title}: {result.relevance_score:.2f}")

# Get context for LLM
context = rag.get_context_for_prompt("How do I optimize Python code?")
```

### Plugin Example: Creating a Plugin

```python
from lmapp.plugins.plugin_manager import BasePlugin, PluginMetadata

class MyPlugin(BasePlugin):
    @property
    def metadata(self):
        return PluginMetadata(
            name="my-plugin",
            version="1.0.0",
            description="My custom plugin",
            author="Your Name"
        )
    
    def initialize(self, config):
        """Setup plugin"""
        pass
    
    def execute(self, command, *args, **kwargs):
        """Execute plugin command"""
        return f"Result: {command}"
    
    def get_commands(self):
        """Register CLI commands"""
        return {"mycommand": "My custom command"}
```

### Batch Example: Process Multiple Queries

```python
from lmapp.batch.batch_processor import BatchProcessor, BatchInput

# Create processor
processor = BatchProcessor("~/.lmapp/batch_jobs")

# Create batch
inputs = [
    BatchInput("q1", "What is Python?"),
    BatchInput("q2", "What is Java?"),
]
job = processor.create_batch_job("languages", inputs)

# Process with custom function
def ask_llm(query):
    # Your LLM logic here
    return f"Answer to: {query}"

result_job = processor.process_batch("languages", ask_llm)

# Export results
processor.save_results("languages", "results.json")
```

---

## 📋 Migration from v0.2.3

No breaking changes. All existing features (sessions, system prompts, aliases, error handling) continue to work.

**New capabilities to explore:**
1. Try RAG indexing on your codebase
2. Build a plugin for your workflow
3. Process multiple queries with batch mode

---

## 🐛 Known Issues

- DeprecationWarning for `datetime.utcnow()` (will fix in v0.2.5)
- Plugin system requires Python 3.8+ for module import
- RAG similarity is lexical, not semantic (no ML models)

---

## 📝 Next Steps (v0.2.5 Roadmap)

- [ ] Fix datetime deprecation warnings
- [ ] Add semantic vectorization (optional, lightweight)
- [ ] Web UI for batch job management
- [ ] Plugin marketplace integration
- [ ] Advanced RAG features (chunking, filtering)

---

## 🙏 Contributing

LMAPP is open-source and welcomes contributions:
- Report issues on GitHub
- Submit plugins for community use
- Contribute improvements to core modules

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

**Happy coding with LMAPP v0.2.4! 🎉**
