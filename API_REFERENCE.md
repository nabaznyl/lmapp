# LMAPP API Reference (v0.2.6)

**Complete REST API documentation for LMAPP Web UI and integrations.**

## Base URL
```
http://localhost:8000
```

## Authentication
No authentication required (add via reverse proxy in production).

## Response Format
All responses are JSON.

```json
{
  "success": true,
  "data": { },
  "error": null,
  "timestamp": "2025-12-11T10:30:00Z"
}
```

## Endpoints

### Health & Status

#### GET /api/health
Check server health.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-11T10:30:00Z"
}
```

#### GET /api/status
System status and diagnostics.

**Response:**
```json
{
  "backend": "ollama",
  "backend_running": true,
  "models_available": ["llama2", "mistral", "neural-chat"],
  "python_version": "3.11.5",
  "platform": "Linux",
  "memory_usage_percent": 45.2,
  "disk_free_gb": 150.5
}
```

### Models

#### GET /api/models
List available models from backend.

**Query Parameters:**
- `backend` (optional): Force specific backend (ollama, llamafile)

**Response:**
```json
{
  "models": [
    {
      "name": "llama2",
      "size": "3.8GB",
      "modified": "2025-12-10T15:30:00Z",
      "digest": "sha256:..."
    }
  ],
  "count": 3
}
```

#### GET /api/models/{model_name}
Get details for specific model.

**Response:**
```json
{
  "name": "llama2",
  "size": "3.8GB",
  "parameters": "7B",
  "family": "llama",
  "modified": "2025-12-10T15:30:00Z",
  "details": {
    "parameter_size": "7B",
    "quantization_level": "Q4_0",
    "format": "GGUF"
  }
}
```

### Chat

#### POST /api/chat
Send a message and get response.

**Request Body:**
```json
{
  "message": "What is machine learning?",
  "model": "llama2",
  "temperature": 0.7,
  "max_tokens": 512,
  "system_prompt": "You are a helpful assistant.",
  "session_id": "session-123",
  "history": []
}
```

**Query Parameters:**
- `stream` (optional, boolean): Stream response as Server-Sent Events

**Response (Normal):**
```json
{
  "response": "Machine learning is...",
  "tokens_used": 145,
  "model": "llama2",
  "timestamp": "2025-12-11T10:30:00Z"
}
```

**Response (Streaming):**
```
data: {"token": "Machine"}
data: {"token": " learning"}
data: {"token": " is"}
...
```

#### WebSocket /ws/chat
Streaming chat via WebSocket.

**Connect:**
```javascript
const ws = new WebSocket('ws://localhost:8000/ws/chat');

ws.onopen = () => {
  ws.send(JSON.stringify({
    message: "Hello",
    model: "llama2",
    temperature: 0.7
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.token); // Print each token
};
```

**Message Format:**
```json
{
  "type": "chat",
  "message": "Your message",
  "model": "llama2",
  "temperature": 0.7,
  "max_tokens": 512,
  "system_prompt": "Optional system prompt"
}
```

**Responses:**
```json
// Token response
{"type": "token", "token": "text"}

// Complete response
{"type": "complete", "response": "full text", "tokens_used": 145}

// Error
{"type": "error", "error": "error message"}
```

### Documents (RAG)

#### GET /api/documents
List all documents in RAG index.

**Query Parameters:**
- `limit` (optional, int): Max results, default 50
- `offset` (optional, int): Pagination offset
- `search` (optional, string): Search documents

**Response:**
```json
{
  "documents": [
    {
      "id": "doc-1",
      "filename": "guide.pdf",
      "size_bytes": 2048576,
      "chunks": 24,
      "indexed_at": "2025-12-10T15:30:00Z"
    }
  ],
  "total": 5,
  "limit": 50,
  "offset": 0
}
```

#### POST /api/documents
Upload document for indexing.

**Request (multipart/form-data):**
```
file: <binary file>
```

**Response:**
```json
{
  "id": "doc-1",
  "filename": "guide.pdf",
  "size_bytes": 2048576,
  "chunks": 24,
  "status": "indexed",
  "message": "Document successfully indexed"
}
```

#### GET /api/documents/{doc_id}
Get document metadata and chunks.

**Response:**
```json
{
  "id": "doc-1",
  "filename": "guide.pdf",
  "size_bytes": 2048576,
  "chunks": [
    {
      "id": "chunk-1",
      "text": "Document content...",
      "embedding_model": "sentence-transformer"
    }
  ]
}
```

#### DELETE /api/documents/{doc_id}
Remove document from RAG index.

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully",
  "id": "doc-1"
}
```

#### POST /api/documents/search
Search documents via RAG.

**Request Body:**
```json
{
  "query": "What is the installation process?",
  "limit": 5,
  "threshold": 0.5
}
```

**Response:**
```json
{
  "results": [
    {
      "document_id": "doc-1",
      "chunk_id": "chunk-5",
      "text": "Matching document chunk...",
      "relevance_score": 0.89,
      "source": "guide.pdf"
    }
  ],
  "query_time_ms": 45,
  "total_results": 3
}
```

### Plugins

#### GET /api/plugins
List all installed plugins.

**Response:**
```json
{
  "plugins": [
    {
      "name": "translator",
      "version": "1.0.0",
      "author": "community",
      "description": "Translate text between languages",
      "enabled": true,
      "commands": ["/translate"]
    }
  ],
  "count": 5
}
```

#### POST /api/plugins
Install a new plugin.

**Request Body:**
```json
{
  "name": "translator",
  "source": "github"  // or: "local", "url"
}
```

**Response:**
```json
{
  "name": "translator",
  "version": "1.0.0",
  "status": "installed",
  "message": "Plugin installed successfully"
}
```

#### DELETE /api/plugins/{plugin_name}
Uninstall a plugin.

**Response:**
```json
{
  "name": "translator",
  "status": "uninstalled",
  "message": "Plugin removed successfully"
}
```

#### POST /api/plugins/{plugin_name}/execute
Execute a plugin command.

**Request Body:**
```json
{
  "command": "/translate",
  "args": {
    "text": "Hello",
    "source_lang": "en",
    "target_lang": "es"
  },
  "context": {
    "model": "llama2",
    "session_id": "session-123"
  }
}
```

**Response:**
```json
{
  "plugin": "translator",
  "command": "/translate",
  "result": "Hola",
  "execution_time_ms": 250
}
```

### Batch Processing

#### POST /api/batch/submit
Submit batch job.

**Request Body:**
```json
{
  "name": "my-batch",
  "input_file": "input.json",
  "model": "llama2",
  "temperature": 0.7,
  "output_format": "json"
}
```

**Response:**
```json
{
  "job_id": "batch-123",
  "status": "queued",
  "created_at": "2025-12-11T10:30:00Z",
  "input_count": 100
}
```

#### GET /api/batch/jobs/{job_id}
Get batch job status.

**Response:**
```json
{
  "job_id": "batch-123",
  "status": "processing",
  "progress": {
    "completed": 45,
    "total": 100,
    "percent": 45
  },
  "created_at": "2025-12-11T10:30:00Z",
  "started_at": "2025-12-11T10:31:00Z",
  "estimated_completion": "2025-12-11T11:00:00Z"
}
```

#### GET /api/batch/jobs/{job_id}/results
Get batch results.

**Query Parameters:**
- `format` (optional): json, csv, markdown

**Response:**
```json
{
  "job_id": "batch-123",
  "results": [
    {
      "input": "Query 1",
      "output": "Response 1",
      "tokens": 142,
      "model": "llama2"
    }
  ],
  "summary": {
    "total": 100,
    "successful": 99,
    "failed": 1,
    "total_tokens": 14250,
    "average_time_ms": 1200
  }
}
```

### RAG Context (Sessions)

#### POST /api/sessions
Create new session with RAG context.

**Request Body:**
```json
{
  "name": "research-session",
  "documents": ["doc-1", "doc-2"],
  "context_window": 4096
}
```

**Response:**
```json
{
  "session_id": "session-123",
  "name": "research-session",
  "created_at": "2025-12-11T10:30:00Z",
  "context_window": 4096
}
```

#### GET /api/sessions/{session_id}
Get session details.

**Response:**
```json
{
  "session_id": "session-123",
  "name": "research-session",
  "documents": ["doc-1", "doc-2"],
  "conversation_history": [
    {
      "role": "user",
      "content": "Question?",
      "timestamp": "2025-12-11T10:30:00Z"
    },
    {
      "role": "assistant",
      "content": "Answer...",
      "timestamp": "2025-12-11T10:30:05Z"
    }
  ],
  "context_used": 2048,
  "context_window": 4096
}
```

#### DELETE /api/sessions/{session_id}
Delete session.

**Response:**
```json
{
  "session_id": "session-123",
  "status": "deleted",
  "message": "Session deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid model name",
  "details": {
    "field": "model",
    "reason": "Model not found in available models"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found",
  "details": {
    "resource": "document",
    "id": "doc-999"
  }
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "details": {
    "message": "Backend connection failed",
    "timestamp": "2025-12-11T10:30:00Z"
  }
}
```

## Rate Limiting
- Default: 100 requests per minute per IP
- Burst: 20 requests allowed
- Applies to: All endpoints except /health

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1670750400
```

## Pagination
All list endpoints support pagination:
- `limit` (optional): Results per page, default 50, max 100
- `offset` (optional): Starting position, default 0

## Examples

### Python
```python
import requests
import json

# Simple chat
response = requests.post(
  'http://localhost:8000/api/chat',
  json={
    'message': 'Hello!',
    'model': 'llama2',
    'temperature': 0.7
  }
)
print(response.json()['response'])

# Streaming chat
response = requests.post(
  'http://localhost:8000/api/chat?stream=true',
  json={'message': 'Tell me a story...', 'model': 'llama2'},
  stream=True
)
for line in response.iter_lines():
  if line:
    token = json.loads(line).get('token', '')
    print(token, end='', flush=True)
```

### JavaScript
```javascript
// Simple chat
const response = await fetch('http://localhost:8000/api/chat', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    message: 'Hello!',
    model: 'llama2',
    temperature: 0.7
  })
});
const data = await response.json();
console.log(data.response);

// WebSocket streaming
const ws = new WebSocket('ws://localhost:8000/ws/chat');
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'token') {
    console.log(msg.token);
  }
};
ws.send(JSON.stringify({
  message: 'Tell me a story...',
  model: 'llama2'
}));
```

### cURL
```bash
# Get models
curl http://localhost:8000/api/models

# Send chat
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello!",
    "model": "llama2",
    "temperature": 0.7
  }'

# Upload document
curl -X POST http://localhost:8000/api/documents \
  -F "file=@guide.pdf"

# Stream chat
curl "http://localhost:8000/api/chat?stream=true" \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me a story", "model": "llama2"}'
```

---

**Version:** 0.2.6  
**Last Updated:** Dec 11, 2025  
**Status:** ✅ Production Ready

For more information, see [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md).
