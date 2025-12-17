# Plugin Registry Schema (v1.0)

The LMAPP Plugin Registry is a centralized JSON file that lists available plugins.
It allows users to discover and install plugins via `lmapp plugin search` and `lmapp plugin install`.

## Schema Structure

```json
{
  "version": "1.0",
  "last_updated": "2025-12-12T12:00:00Z",
  "plugins": [
    {
      "id": "plugin_id",              // Unique identifier (namespace.name)
      "name": "Plugin Name",          // Display name
      "version": "1.0.0",             // Semantic version
      "description": "Short desc",    // One-line description
      "author": "Author Name",        // Author or Organization
      "url": "https://...",           // Direct download URL (raw python file or zip)
      "source_url": "https://...",    // GitHub/Source URL
      "tags": ["tag1", "tag2"],       // Categories
      "min_lmapp_version": "0.3.0",   // Minimum compatible LMAPP version
      "dependencies": ["requests"],   // Python dependencies (pip)
      "verified": true                // Official/Verified status
    }
  ]
}
```

## Example Registry

```json
{
  "version": "1.0",
  "plugins": [
    {
      "id": "official.analyzer",
      "name": "Code Analyzer",
      "version": "1.1.0",
      "description": "Static analysis and code quality metrics",
      "author": "LMAPP Team",
      "url": "https://raw.githubusercontent.com/nabaznyl/lmapp-plugins/main/analyzer.py",
      "tags": ["dev", "analysis"],
      "verified": true
    },
    {
      "id": "community.weather",
      "name": "Weather Bot",
      "version": "0.5.0",
      "description": "Check weather via OpenWeatherMap",
      "author": "CommunityUser",
      "url": "https://gist.githubusercontent.com/.../weather.py",
      "tags": ["utility", "fun"],
      "verified": false
    }
  ]
}
```

## Implementation Plan

1.  **Registry Host**: Host `registry.json` on GitHub Pages or raw GitHub repo.
2.  **Client**: `lmapp` fetches this JSON, caches it, and allows searching.
3.  **Installation**: `lmapp` downloads the file from `url` to `~/.lmapp/plugins/`.
