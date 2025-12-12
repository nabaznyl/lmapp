# LMAPP API Reference (Lightweight)

Version: 0.3.0-beta

This document summarizes the public CLI commands and the lightweight local HTTP API exposed by `lmapp serve`.

---

## CLI Commands

All commands are available via the `lmapp` entrypoint. Use `--help` on any command for full options.

- `lmapp` (no args)
  - Launches the interactive main menu.

- `lmapp --version`
  - Prints the current version.

- `lmapp chat [--model <name>]`
  - Starts a local chat session using the detected backend.
  - If `--model` is not provided, a default is used.
  - If the backend isn’t running, guidance is printed.

- `lmapp install`
  - Runs the automated installation wizard:
    - System checks
    - Backend installation (Ollama/llamafile)
    - Optional model download

- `lmapp status`
  - Prints status information:
    - Version and license
    - Backend detection table
    - Basic system checks

- `lmapp model`
  - Lists installed models for the best available backend.

- `lmapp model download`
  - Opens a guided UI to download a model for the selected backend.

- `lmapp config show`
  - Displays current configuration and file locations.

- `lmapp config set <key> <value>`
  - Updates a configuration value with validation. Examples:
    - `lmapp config set model mistral`
    - `lmapp config set temperature 0.5`
    - `lmapp config set backend ollama`

- `lmapp config reset`
  - Resets all configuration to defaults (with confirmation).

- `lmapp config validate`
  - Validates current configuration and prints the result.

- `lmapp errors`
  - Shows recent error history and suggested solutions (from the local error DB).

- `lmapp serve`
  - Starts the local HTTP API server (FastAPI) on `http://127.0.0.1:8000`.

---

## HTTP API (when `lmapp serve` is running)

Base URL: `http://127.0.0.1:8000`

- `GET /health`
  - Returns backend health, version, and available models.
  - Response:
    ```json
    {
      "status": "ok" | "no_backend",
      "version": "0.3.0-beta",
      "backend": "ollama" | "llamafile" | null,
      "models": ["mistral", "llama3", ...]
    }
    ```

- `POST /v1/completions`
  - Creates a simple completion using the current backend.
  - Request:
    ```json
    {
      "model": "mistral",
      "prompt": "Explain recursion simply",
      "max_tokens": 100,
      "temperature": 0.7,
      "stop": ["\n\n"]
    }
    ```
  - Response:
    ```json
    {
      "id": "cmpl-1733960000",
      "object": "text_completion",
      "created": 1733960000,
      "model": "mistral",
      "choices": [{
        "text": "...",
        "index": 0,
        "logprobs": null,
        "finish_reason": "stop"
      }]
    }
    ```

Notes:
- The API is local-first and depends on a running local backend.
- For streaming/chat-style usage or advanced features, prefer the CLI for now.

---

## Supported Backends
- Ollama (recommended for 8GB+ RAM)
- llamafile (portable single-binary option)

The detector prioritizes any already-running backend; otherwise it selects the first available.

---

## Error Handling
- CLI: Errors are captured and logged to the local Error DB. `lmapp errors` shows recent entries.
- API: Returns standard HTTP error responses with details.

---

For more examples, see `README.md` (Demos) and `DEMO.md` (story + scenarios).
