# Refactoring API Implementation Guide

## Overview
This guide covers implementing the backend refactoring endpoints for the lmapp VS Code extension. These endpoints provide code analysis, quick fixes, and refactoring suggestions.

## API Endpoints

### 1. POST `/v1/refactor/suggestions`
Analyzes code and provides refactoring suggestions organized by category.

**Request:**
```json
{
  "prompt": "def hello():\n    x = 5\n    y = 10\n    print(y)",
  "language": "python"
}
```

**Response:**
```json
{
  "total_fixes": 1,
  "fixes_by_category": {
    "unused_variable": 1
  },
  "suggestions": [
    {
      "id": "fix_001",
      "title": "Remove unused variable x",
      "explanation": "Variable x is assigned but never used",
      "auto_fixable": true,
      "category": "unused_variable",
      "line": 2
    }
  ]
}
```

### 2. POST `/v1/refactor/quick-fixes`
Gets quick fixable issues from code suitable for code actions.

**Request:**
```json
{
  "prompt": "import os\nprint('hello')",
  "language": "python"
}
```

**Response:**
```json
{
  "total_fixes": 1,
  "fixes": [
    {
      "id": "qf_001",
      "title": "Remove unused import os",
      "explanation": "Import 'os' is imported but never used",
      "auto_fixable": true,
      "category": "unused_import"
    }
  ]
}
```

### 3. POST `/v1/refactor/apply`
Applies a specific quick fix to code and returns the modified version.

**Request:**
```json
{
  "code": "import os\nprint('hello')",
  "fix_id": "qf_001",
  "language": "python"
}
```

**Response:**
```json
{
  "success": true,
  "modified_code": "print('hello')",
  "applied_fixes": [
    {
      "id": "qf_001",
      "title": "Remove unused import os",
      "category": "unused_import"
    }
  ]
}
```

## Implementation Patterns

### Pattern 1: Unused Variable Detection
```python
def detect_unused_variables(code: str, language: str) -> List[QuickFix]:
    """Detect variables that are assigned but never used."""
    fixes = []
    
    # Language-specific parsing
    if language == 'python':
        import ast
        tree = ast.parse(code)
        # Analyze AST for unused variables
        # Add fixes for each unused variable
    
    return fixes
```

### Pattern 2: Import Cleanup
```python
def detect_unused_imports(code: str, language: str) -> List[QuickFix]:
    """Detect and suggest removal of unused imports."""
    fixes = []
    
    if language == 'python':
        # Use regex or AST to find imports
        # Cross-reference with code usage
        # Add fixes for unused imports
    
    elif language in ['javascript', 'typescript']:
        # Similar pattern for JS/TS
        pass
    
    return fixes
```

### Pattern 3: Style Issues
```python
def detect_style_issues(code: str, language: str) -> List[QuickFix]:
    """Detect code style violations (spacing, naming, etc.)."""
    fixes = []
    
    style_patterns = {
        'python': [
            (r'(\w)=(\w)', 'Add spacing around operators'),
            (r'(\w)\((\w)', 'Add space after function name'),
        ]
    }
    
    # Apply patterns and create fixes
    
    return fixes
```

## Database Schema (Optional)
Store fix patterns and history:

```sql
CREATE TABLE fix_patterns (
    id VARCHAR(36) PRIMARY KEY,
    language VARCHAR(20),
    pattern_type VARCHAR(50),
    description TEXT,
    regex_pattern TEXT,
    replacement_template TEXT,
    category VARCHAR(30),
    auto_fixable BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applied_fixes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36),
    fix_id VARCHAR(36),
    original_code TEXT,
    fixed_code TEXT,
    language VARCHAR(20),
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fix_id) REFERENCES fix_patterns(id)
);
```

## Fix Categories

| Category | Description | Auto-Fixable | Priority |
|----------|-------------|--------------|----------|
| `unused_import` | Unused import statements | ✅ Yes | High |
| `unused_variable` | Variables assigned but not used | ✅ Yes | High |
| `whitespace` | Spacing around operators | ✅ Yes | Medium |
| `naming` | Variable/function naming conventions | ❌ No | Low |
| `type_hint` | Missing type annotations | ❌ No | Medium |
| `docstring` | Missing docstrings | ❌ No | Low |
| `complexity` | Function too complex | ❌ No | Low |
| `performance` | Performance anti-patterns | ❌ No | Medium |

## Implementation Checklist

### Backend Setup
- [ ] Create `/v1/refactor/suggestions` endpoint
- [ ] Create `/v1/refactor/quick-fixes` endpoint
- [ ] Create `/v1/refactor/apply` endpoint
- [ ] Implement language detection
- [ ] Add error handling and validation
- [ ] Add rate limiting for analysis requests

### Analysis Engines
- [ ] Python AST analysis
- [ ] JavaScript/TypeScript ESLint integration
- [ ] Java code style checks
- [ ] C/C++ analysis

### Testing
- [ ] Unit tests for each fix pattern
- [ ] Integration tests with real code samples
- [ ] Cross-language validation
- [ ] Performance benchmarks
- [ ] Error case handling

### Deployment
- [ ] Add endpoints to API documentation
- [ ] Update VS Code extension manifest
- [ ] Write user documentation
- [ ] Create demo videos
- [ ] Monitor fix application success rate

## Performance Considerations

1. **Caching**: Cache analysis results for identical code snippets
2. **Async Processing**: Use background tasks for large files
3. **Incremental Analysis**: Only analyze changed lines when possible
4. **Batching**: Support analyzing multiple files/selections
5. **Resource Limits**: Set timeouts for analysis operations

## Security Considerations

1. **Input Validation**: Validate code input size and format
2. **Timeout**: Set analysis timeouts to prevent resource exhaustion
3. **Sandboxing**: Run analysis in isolated containers if needed
4. **Logging**: Log all fix applications for audit trails
5. **Permissions**: Validate user permissions for file modifications

## Future Enhancements

- [ ] Machine learning-based pattern detection
- [ ] Custom rules per project/team
- [ ] Integration with linting tools (pylint, eslint)
- [ ] Batch refactoring across entire projects
- [ ] Undo/history of applied fixes
- [ ] Integration with version control for auto-commit
- [ ] Multi-language refactoring (e.g., Python to Go)
