# LMAPP Deployment Guide

**Production deployment and installation instructions for various environments.**

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation Methods](#installation-methods)
3. [Backend Configuration](#backend-configuration)
4. [Web UI Deployment](#web-ui-deployment)
5. [Docker Deployment](#docker-deployment)
6. [Configuration Management](#configuration-management)
7. [Monitoring & Logs](#monitoring--logs)
8. [Security Considerations](#security-considerations)
9. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements
- **OS:** Linux, macOS, or Windows (WSL2)
- **Python:** 3.9 or higher
- **RAM:** 4GB (8GB+ recommended)
- **Storage:** 2GB free space
- **Network:** Internet access for model downloads

### Recommended Requirements (Production)
- **OS:** Ubuntu 22.04 LTS or Red Hat Enterprise Linux 8+
- **Python:** 3.11 or 3.12
- **RAM:** 16GB or higher
- **Storage:** 20GB+ NVMe SSD
- **GPU:** NVIDIA (CUDA 12.0+) or AMD (ROCm) optional

### Backend Requirements
- **Ollama:** 4GB RAM minimum, 20GB disk for models
- **Llamafile:** 2GB RAM minimum, 10GB disk for models
- **Local LLM:** Requires GPU for reasonable performance

## Installation Methods

### 1. System-Wide Installation (Linux/macOS)

```bash
# Create dedicated user
sudo useradd -m -s /bin/bash lmapp
sudo su - lmapp

# Install Python 3.11+
sudo apt update && sudo apt install -y python3.11 python3.11-venv python3.11-dev

# Create virtual environment
python3.11 -m venv /opt/lmapp/venv
source /opt/lmapp/venv/bin/activate

# Install LMAPP
pip install --upgrade pip setuptools wheel
pip install lmapp

# Verify installation
lmapp status
```

### 2. Container Deployment (Docker)

```bash
# Pull official image
docker pull lmapp/lmapp:latest

# Run with local backend
docker run -d \
  --name lmapp-server \
  -p 8000:8000 \
  -v ~/.lmapp:/root/.local/share/lmapp \
  -v /models:/models:ro \
  --gpus all \
  lmapp/lmapp:latest web
```

### 3. Development Installation

```bash
git clone https://github.com/yourusername/lmapp.git
cd lmapp
python3.11 -m venv venv
source venv/bin/activate
pip install -e ".[dev]"

# Run tests
pytest tests/ -v

# Start web UI
lmapp web --reload
```

## Backend Configuration

### Option 1: Ollama (Recommended)

**Installation:**
```bash
# Download Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
sudo systemctl start ollama
sudo systemctl enable ollama  # Auto-start on reboot
```

**Configuration:**
```bash
# Download models
ollama pull llama2          # 3.8GB
ollama pull mistral         # 3.7GB
ollama pull neural-chat     # 3.8GB

# Verify installation
curl http://localhost:11434/api/tags
```

**LMAPP Configuration:**
LMAPP auto-detects Ollama. To force configuration:

```bash
export LMAPP_BACKEND=ollama
export LMAPP_OLLAMA_HOST=http://localhost:11434
export LMAPP_DEFAULT_MODEL=llama2

lmapp chat
```

### Option 2: Llamafile

**Installation:**
```bash
# Download llamafile
wget https://releases.llamafile.ai/llamafile-0.8.12

chmod +x llamafile-0.8.12

# Download model (TinyLlama, Mistral, etc.)
wget https://huggingface.co/jartine/TinyLlama-1.1B-Chat-v1.0-GGUF/resolve/main/TinyLlama-1.1B-Chat-v1.0.Q8_0.gguf

# Start llamafile
./llamafile-0.8.12 -m TinyLlama-1.1B-Chat-v1.0.Q8_0.gguf
```

**LMAPP Configuration:**
```bash
export LMAPP_BACKEND=llamafile
export LMAPP_LLAMAFILE_HOST=http://localhost:8000

lmapp chat
```

### Option 3: Remote LLM API

```bash
# Configure for OpenAI API (alternative backend)
export LMAPP_BACKEND=openai
export OPENAI_API_KEY=sk-...

# LMAPP will use OpenAI instead of local backend
lmapp chat
```

## Web UI Deployment

### Local Development
```bash
lmapp web --host 127.0.0.1 --port 8000 --reload
```

### Production with Gunicorn
```bash
# Install gunicorn
pip install gunicorn uvicorn

# Run with gunicorn
gunicorn --workers 4 --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 120 \
  lmapp.web.server:app
```

### Production with Nginx Reverse Proxy

**Nginx Configuration:**
```nginx
upstream lmapp_backend {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name lmapp.example.com;

    location / {
        proxy_pass http://lmapp_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**SSL Configuration:**
```bash
# Install Let's Encrypt certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d lmapp.example.com

# Update Nginx to use SSL (modify above config)
listen 443 ssl http2;
ssl_certificate /etc/letsencrypt/live/lmapp.example.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/lmapp.example.com/privkey.pem;
```

## Docker Deployment

### Docker Compose (Recommended)

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_MODELS=/models

  lmapp:
    image: lmapp/lmapp:latest
    ports:
      - "8000:8000"
    depends_on:
      - ollama
    environment:
      - LMAPP_BACKEND=ollama
      - LMAPP_OLLAMA_HOST=http://ollama:11434
      - LMAPP_DEFAULT_MODEL=llama2
    volumes:
      - lmapp_config:/root/.local/share/lmapp
    command: web --host 0.0.0.0 --port 8000

volumes:
  ollama_data:
  lmapp_config:
```

**Start services:**
```bash
docker-compose up -d

# Download model
docker-compose exec ollama ollama pull llama2

# Check logs
docker-compose logs -f lmapp
```

### Kubernetes Deployment

**lmapp-deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lmapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: lmapp
  template:
    metadata:
      labels:
        app: lmapp
    spec:
      containers:
      - name: lmapp
        image: lmapp/lmapp:latest
        ports:
        - containerPort: 8000
        env:
        - name: LMAPP_BACKEND
          value: "ollama"
        - name: LMAPP_OLLAMA_HOST
          value: "http://ollama-service:11434"
        resources:
          requests:
            memory: "4Gi"
            cpu: "2"
          limits:
            memory: "8Gi"
            cpu: "4"
        volumeMounts:
        - name: config
          mountPath: /root/.local/share/lmapp
      volumes:
      - name: config
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: lmapp-service
spec:
  selector:
    app: lmapp
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 8000
```

**Deploy:**
```bash
kubectl apply -f lmapp-deployment.yaml
kubectl port-forward svc/lmapp-service 8000:80
```

## Configuration Management

### Environment Variables

```bash
# Backend selection
export LMAPP_BACKEND=ollama              # or: llamafile, mock
export LMAPP_OLLAMA_HOST=http://localhost:11434
export LMAPP_LLAMAFILE_HOST=http://localhost:8000

# Model settings
export LMAPP_DEFAULT_MODEL=llama2
export LMAPP_DEFAULT_TEMPERATURE=0.7
export LMAPP_DEFAULT_MAX_TOKENS=2048
export LMAPP_CONTEXT_SIZE=4096

# Web UI settings
export LMAPP_WEB_HOST=0.0.0.0
export LMAPP_WEB_PORT=8000
export LMAPP_WEB_RELOAD=false             # true for dev, false for prod

# Logging
export LMAPP_LOG_LEVEL=INFO               # or: DEBUG, WARNING, ERROR
export LMAPP_DEBUG=false
```

### Configuration File

**~/.local/share/lmapp/config.json:**
```json
{
  "backend": "ollama",
  "ollama_host": "http://localhost:11434",
  "default_model": "llama2",
  "default_temperature": 0.7,
  "default_max_tokens": 2048,
  "context_size": 4096,
  "web": {
    "host": "0.0.0.0",
    "port": 8000,
    "reload": false,
    "cors_origins": ["http://localhost:3000"]
  },
  "plugins": {
    "enabled": true,
    "auto_install": false,
    "plugin_dir": "~/.local/share/lmapp/plugins"
  },
  "rag": {
    "enabled": true,
    "index_path": "~/.local/share/lmapp/rag_index",
    "chunk_size": 512
  }
}
```

## Monitoring & Logs

### View Logs

```bash
# Real-time logs
tail -f ~/.local/share/lmapp/lmapp.log

# Filter by level
grep ERROR ~/.local/share/lmapp/lmapp.log
grep WARN ~/.local/share/lmapp/lmapp.log

# With docker
docker-compose logs -f lmapp
```

### Performance Monitoring

```bash
# Check memory usage
ps aux | grep lmapp

# Monitor in real-time
top -p $(pgrep -f 'python.*lmapp')

# Check backend availability
curl http://localhost:11434/api/tags    # Ollama
curl http://localhost:8000/api/tags     # Llamafile
```

### Health Checks

```bash
# System health
lmapp status

# API health
curl http://localhost:8000/api/health

# Backend health
curl http://localhost:8000/api/models
```

## Security Considerations

### 1. HTTPS/TLS
- **Always use HTTPS in production**
- Obtain certificates from Let's Encrypt (free)
- Configure Nginx/reverse proxy for SSL termination

### 2. Authentication
- Web UI has no built-in auth (add with reverse proxy)
- Use Nginx auth_basic or OAuth2 proxy
- Consider IP whitelisting for internal deployments

### 3. CORS Configuration
```bash
# Configure CORS origins
export LMAPP_CORS_ORIGINS="['https://example.com']"
```

### 4. Rate Limiting
```bash
# Configure via reverse proxy
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

### 5. Input Validation
- LMAPP validates all inputs by default
- Never disable validation in production
- Use web application firewall (ModSecurity, AWS WAF)

### 6. Model Safety
- Use smaller, tested models in production
- Monitor for prompt injection attempts
- Consider using models with safety training

### 7. Resource Limits
```bash
# Limit memory usage
ulimit -v 4000000  # 4GB

# Set timeouts
export LMAPP_REQUEST_TIMEOUT=120
export LMAPP_RESPONSE_TIMEOUT=300
```

## Troubleshooting

### Backend Not Detected
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Check LMAPP can see it
lmapp status

# Force backend
export LMAPP_BACKEND=ollama
```

### High Memory Usage
```bash
# Check what's using memory
ps aux | sort -k4 -nr | head -10

# Reduce model size
ollama pull neural-chat  # Smaller model
ollama rm llama2         # Remove unused model

# Limit tokens
export LMAPP_DEFAULT_MAX_TOKENS=512
```

### Slow Responses
```bash
# Check backend performance
ollama ps  # See running models

# Use faster model
ollama pull mistral

# Increase context window (if GPU has memory)
export LMAPP_CONTEXT_SIZE=2048
```

### Port Already in Use
```bash
# Find what's using port 8000
lsof -i :8000
sudo kill -9 <PID>

# Use different port
lmapp web --port 8001
```

### Web UI Not Loading
```bash
# Check if server is running
curl http://localhost:8000

# Check browser console for errors
# Open browser DevTools (F12)

# Try different port
lmapp web --port 8001
```

---

**Version:** 0.2.6  
**Last Updated:** Dec 11, 2025  
**Status:** ✅ Production Ready
