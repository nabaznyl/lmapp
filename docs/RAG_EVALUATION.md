# Advanced RAG Evaluation: ChromaDB vs FAISS

## Overview
LMAPP currently uses a simple Jaccard-similarity based vectorizer (`SimpleVectorizer`). To support advanced semantic search, we need to integrate a proper vector store and embedding model.

## Comparison

| Feature | ChromaDB | FAISS |
| :--- | :--- | :--- |
| **Type** | Vector Database | Vector Search Library |
| **Persistence** | Built-in (SQLite/DuckDB) | Manual (Save/Load Index) |
| **Metadata Filtering** | Excellent (Where clauses) | Limited (ID mapping only) |
| **Ease of Use** | High (Pythonic API) | Medium (Low-level API) |
| **Dependencies** | Heavy (numpy, onnx, etc.) | Medium (numpy) |
| **Performance** | Good for <1M docs | Excellent for >1M docs |
| **Embedding Support** | Built-in (SentenceTransformers) | External only |

## Recommendation for LMAPP
**Winner: ChromaDB**

**Reasons:**
1.  **Metadata Filtering:** LMAPP needs to filter by file type, date, and tags. ChromaDB handles this natively.
2.  **Persistence:** ChromaDB manages storage automatically, whereas FAISS requires manual index serialization.
3.  **Developer Experience:** ChromaDB's API is simpler for a Python CLI tool.
4.  **Scale:** LMAPP targets local workspaces (<100k files), so FAISS's billion-scale advantage is irrelevant.

## Implementation Plan

1.  **Interface:** Create `VectorStore` abstract base class in `lmapp.rag.vector_store`.
2.  **Adapter:** Implement `ChromaDBStore` adapter.
3.  **Embeddings:** Integrate `sentence-transformers` (all-MiniLM-L6-v2) for generating embeddings.
4.  **Migration:** Update `RAGSystem` to use `VectorStore` instead of `SimpleVectorizer`.

## Dependencies
- `chromadb`
- `sentence-transformers`
