# Error Database & Knowledge Base

**Purpose:** To store past issues, errors, and their solutions to mitigate recurrence and speed up future repairs.

## How to Use
1.  **Search** this document before debugging a recurring issue.
2.  **Log** new unique errors using the template below.
3.  **Review** periodically to identify systemic weaknesses.

---

## Template

### [ERR-00X] Short Description of Error
*   **Date:** YYYY-MM-DD
*   **Context:** (e.g., "Running `uaft test` on fresh install")
*   **Error Message:**
    ```text
    Paste error trace here
    ```
*   **Root Cause:** (Why did it happen?)
*   **Solution:** (How was it fixed?)
*   **Prevention:** (What was done to prevent recurrence?)

---

## Log

### [ERR-001] Example: Backend Connection Refused
*   **Date:** 2025-12-10
*   **Context:** Running `lmapp chat` with Ollama backend.
*   **Error Message:** `ConnectionError: HTTPConnectionPool(host='localhost', port=11434): Max retries exceeded`
*   **Root Cause:** Ollama service was not running.
*   **Solution:** Started service with `systemctl --user start ollama`.
*   **Prevention:** Added auto-start logic in `OllamaBackend.start()` method.

