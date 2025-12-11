# LMAPP v0.2.4 - Quick Usage Guide

## Getting Started with v0.2.4 Features

### Installation

```bash
# Install or upgrade to latest version
pip install --upgrade lmapp

# Verify installation
lmapp --version
```

---

## 1️⃣ RAG (Retrieval-Augmented Generation) System

### What is RAG?

RAG allows you to search through your own files and documents, then use the results as context for LLM questions. This is useful for:
- Asking questions about your codebase
- Searching through documentation
- Finding relevant information in markdown files
- Understanding large projects

### Basic Usage

```bash
# Index a directory (all text files)
lmapp rag index ~/Documents

# Index specific file types
lmapp rag index ~/projects/myapp --patterns "*.py,*.md,*.json"

# Search indexed documents
lmapp rag search "how to handle errors"
lmapp rag search "database connection" --top-k 5

# Use RAG context in chat
lmapp chat --with-context "What are the best practices in my codebase?"
```

### Python API Example

```python
from lmapp.rag.rag_system import RAGSystem, Document

# Create RAG system
rag = RAGSystem("~/.lmapp/rag_index")

# Index documents manually
rag.index_file("~/Documents/guide.md")
rag.index_directory("~/projects/myapp")

# Search
results = rag.search("Python best practices", top_k=3)
for result in results:
    print(f"Found: {result.document.title}")
    print(f"Score: {result.relevance_score:.2f}")
    print(f"Content: {result.matched_text}\n")

# Get context for LLM
context = rag.get_context_for_prompt("How should I structure this?")
```

### Advanced Usage

```bash
# View indexed documents
lmapp rag list

# Remove specific document
lmapp rag remove doc_id

# Clear entire index
lmapp rag clear

# Export index
lmapp rag export ~/backup.json
```

---

## 2️⃣ Plugin System

### What are Plugins?

Plugins extend LMAPP's functionality without modifying core code. They're perfect for:
- Custom preprocessing/postprocessing
- Integration with external services
- Domain-specific commands
- Team-specific workflows

### Basic Usage

```bash
# List available plugins
lmapp plugin list

# Show plugin details
lmapp plugin info plugin-name

# Install a plugin
lmapp plugin install ~/my-plugins/translator

# Use plugin
lmapp translate "Hello" --to spanish

# Remove plugin
lmapp plugin remove translator
```

### Creating Your Own Plugin

Create a directory with these files:

```
my-plugin/
├── plugin.json
├── plugin.py
└── requirements.txt (optional)
```

**plugin.json:**
```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My awesome plugin",
  "author": "Your Name",
  "main": "plugin.py",
  "commands": ["mycommand"],
  "dependencies": []
}
```

**plugin.py:**
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
        """Setup plugin - called when plugin loads"""
        self.config = config
        print("Plugin initialized!")
    
    def execute(self, command, *args, **kwargs):
        """Execute plugin command"""
        if command == "mycommand":
            return f"Result from my command: {args}"
        return f"Unknown command: {command}"
    
    def get_commands(self):
        """Register CLI commands"""
        return {
            "mycommand": "Description of my command"
        }
```

### Plugin Examples

**Translator Plugin:**
```python
def execute(self, command, *args, **kwargs):
    text = args[0]
    target_lang = kwargs.get('to', 'en')
    
    # Your translation logic
    translated = translate(text, target_lang)
    return translated
```

**Code Analyzer Plugin:**
```python
def execute(self, command, *args, **kwargs):
    file_path = args[0]
    
    # Analyze code
    issues = analyze_code(file_path)
    return format_issues(issues)
```

### Python API Example

```python
from lmapp.plugins.plugin_manager import PluginManager

# Create plugin manager
manager = PluginManager("~/.lmapp/plugins")

# Discover plugins
plugins = manager.discover_plugins()

# List loaded plugins
for plugin_info in manager.list_plugins():
    print(f"{plugin_info.metadata.name} v{plugin_info.metadata.version}")

# Execute plugin
result = manager.execute_plugin("translator", "mycommand", "Hello")

# Get statistics
stats = manager.get_plugin_stats()
print(f"Total plugins: {stats['total_plugins']}")
```

---

## 3️⃣ Batch Processing

### What is Batch Processing?

Batch processing allows you to process multiple inputs (queries, documents, etc.) efficiently. Perfect for:
- Processing large document collections
- Running multiple queries
- Bulk data transformation
- Generating reports for many items

### Basic Usage

```bash
# Create a batch job from JSON file
lmapp batch create inputs.json --job-id my_analysis

# Process the batch
lmapp batch process my_analysis

# View results
lmapp batch results my_analysis
lmapp batch results my_analysis --format json > results.json

# Get job statistics
lmapp batch stats my_analysis

# List all jobs
lmapp batch list

# Delete job
lmapp batch delete my_analysis
```

### Input File Formats

**JSON:**
```json
[
  {"content": "What is Python?"},
  {"content": "What is Java?"},
  {"content": "What is Go?"}
]
```

**JSONL (JSON Lines):**
```
{"content": "Query 1"}
{"content": "Query 2"}
{"content": "Query 3"}
```

**Plain Text (one item per line):**
```
Query 1
Query 2
Query 3
```

### Output Formats

```bash
# JSON format
lmapp batch results my_analysis --format json --output results.json

# JSONL format (line-delimited JSON)
lmapp batch results my_analysis --format jsonl --output results.jsonl

# CSV format
lmapp batch results my_analysis --format csv --output results.csv

# Text format
lmapp batch results my_analysis --format text --output results.txt
```

### Python API Example

```python
from lmapp.batch.batch_processor import (
    BatchProcessor, BatchInput, OutputFormat
)

# Create processor
processor = BatchProcessor("~/.lmapp/batch_jobs")

# Create batch from inputs
inputs = [
    BatchInput("q1", "What is machine learning?"),
    BatchInput("q2", "How does deep learning work?"),
    BatchInput("q3", "What is transfer learning?"),
]

job = processor.create_batch_job("ml_questions", inputs)

# Process with custom function
def ask_llm(query):
    # Your LLM logic here
    return f"Answer to: {query}"

# Add progress callback
def on_progress(current, total):
    print(f"Progress: {current}/{total}")

result_job = processor.process_batch(
    "ml_questions",
    ask_llm,
    on_progress=on_progress
)

# Save results in different formats
processor.save_results("ml_questions", "results.json", OutputFormat.JSON)
processor.save_results("ml_questions", "results.csv", OutputFormat.CSV)

# Get statistics
stats = processor.get_job_stats("ml_questions")
print(f"Processed: {stats['total_processed']}")
print(f"Success rate: {stats['success_rate']:.1%}")
```

### Advanced: Using RAG + Batch Processing Together

```python
from lmapp.rag.rag_system import RAGSystem
from lmapp.batch.batch_processor import BatchProcessor

# Setup
rag = RAGSystem("~/.lmapp/rag_index")
processor = BatchProcessor("~/.lmapp/batch_jobs")

# Index documents
rag.index_directory("~/my_knowledge")

# Create batch
inputs = [
    BatchInput("q1", "How to deploy?"),
    BatchInput("q2", "How to debug?"),
]
job = processor.create_batch_job("help_questions", inputs)

# Process using RAG context
def ask_with_context(query):
    context = rag.get_context_for_prompt(query)
    # Use context in LLM response
    return f"Based on your docs: {context}"

processor.process_batch("help_questions", ask_with_context)
```

---

## 🔗 Combining All Features

### Real-World Example: Document Analysis Pipeline

```python
from lmapp.rag.rag_system import RAGSystem
from lmapp.batch.batch_processor import BatchProcessor, BatchInput
from lmapp.plugins.plugin_manager import PluginManager

# Setup all components
rag = RAGSystem("~/.lmapp/rag_index")
processor = BatchProcessor("~/.lmapp/batch_jobs")
plugin_manager = PluginManager("~/.lmapp/plugins")

# Step 1: Index your documents with RAG
rag.index_directory("~/documents")

# Step 2: Create batch of analysis questions
analysis_questions = [
    BatchInput("doc_1", "Summarize the main points"),
    BatchInput("doc_2", "What are the key findings?"),
    BatchInput("doc_3", "Identify risks mentioned"),
]

job = processor.create_batch_job("doc_analysis", analysis_questions)

# Step 3: Process with RAG context
def analyze_with_context(query):
    # Get relevant documents
    context = rag.get_context_for_prompt(query)
    
    # Use plugin for analysis
    analysis = plugin_manager.execute_plugin(
        "analyzer",
        "analyze",
        query,
        context=context
    )
    
    return analysis

processor.process_batch("doc_analysis", analyze_with_context)

# Step 4: Export results
processor.save_results("doc_analysis", "analysis_results.json")
print("✅ Analysis complete!")
```

---

## ⚙️ Configuration

### RAG Configuration

```bash
# Set RAG index location
lmapp config set rag.index_dir ~/.custom_rag_index

# Set similarity threshold
lmapp config set rag.min_score 0.3

# Set supported file types
lmapp config set rag.extensions "*.py,*.md,*.txt"
```

### Batch Configuration

```bash
# Set batch jobs directory
lmapp config set batch.jobs_dir ~/.custom_batch_jobs

# Set default output format
lmapp config set batch.output_format json

# Set max parallel jobs
lmapp config set batch.max_parallel 4
```

### Plugin Configuration

```bash
# Set plugins directory
lmapp config set plugins.dir ~/.custom_plugins

# Enable/disable plugins
lmapp config set plugins.enabled true
```

---

## 🔍 Troubleshooting

### RAG not finding documents?
```bash
# Check indexed documents
lmapp rag list

# Clear and re-index
lmapp rag clear
lmapp rag index ~/Documents
```

### Plugin not loading?
```bash
# Check plugin directory structure
ls -la ~/.lmapp/plugins/plugin_name/

# View plugin errors
lmapp plugin info plugin_name --debug
```

### Batch processing slow?
```bash
# Check job status
lmapp batch stats job_id

# Reduce batch size and try again
# or increase max_parallel in config
```

---

## 📚 Resources

- Full documentation: [README.md](./README.md)
- Release notes: [RELEASE_NOTES_v0.2.4.md](./RELEASE_NOTES_v0.2.4.md)
- GitHub: https://github.com/nabaznyl/lmapp
- Issues/Questions: https://github.com/nabaznyl/lmapp/issues

---

**Happy coding with LMAPP v0.2.4! 🚀**
