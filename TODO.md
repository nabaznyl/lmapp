# Current Todo List (Phase 4: Advanced Capabilities)

**Status:** Ready to Start
**Focus:** Plugin Marketplace, Advanced RAG, Agentic Workflow

## 0. Maintenance & Quality (Ongoing)
- [ ] **Dependency Audit:** Check for outdated or vulnerable packages.
- [ ] **Security Scan:** Run `bandit` or similar security linter.
- [ ] **Test Coverage:** Identify and cover any gaps < 80%.
- [ ] **Documentation:** Ensure all new features (ErrorDB) are fully documented in `docs/`.

## 1. Plugin Marketplace
- [ ] Design centralized registry schema (JSON/YAML).
- [ ] Implement `lmapp plugin search <query>` command.
- [ ] Implement `lmapp plugin install <plugin_id>` command.
- [ ] Create "Featured Plugins" list.

## 2. Advanced RAG
- [ ] Evaluate vector stores (ChromaDB vs FAISS).
- [ ] Implement persistent vector store integration.
- [ ] Add support for PDF and DOCX ingestion.
- [ ] Implement hybrid search (Keyword + Semantic).

## 3. Agentic Workflow
- [ ] Design "Agent" interface/base class.
- [ ] Implement multi-step reasoning loop.
- [ ] Create basic tools (File Read/Write, Web Search).
- [ ] Build "Research Agent" example.

## 4. Performance
- [ ] Profile current startup time.
- [ ] Optimize import times (lazy loading).
- [ ] Implement async I/O for RAG operations.
