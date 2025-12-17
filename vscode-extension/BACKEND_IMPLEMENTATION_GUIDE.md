# Phase 2, Feature 2: Quick Reference Guide

## Quick Start for Backend Implementation

### Step 1: Install Dependencies
```bash
# For Python code analysis
pip install astroid pylint radon

# For JavaScript/TypeScript
npm install @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### Step 2: Implement Endpoints

#### Create `app/routes/refactor.py`
```python
from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/v1/refactor", tags=["refactoring"])

class RefactorRequest(BaseModel):
    prompt: str
    language: str

@router.post("/suggestions")
async def get_suggestions(request: RefactorRequest):
    """Analyze code and return refactoring suggestions."""
    try:
        if request.language == "python":
            fixes = analyze_python_code(request.prompt)
        elif request.language in ["javascript", "typescript"]:
            fixes = analyze_js_code(request.prompt)
        else:
            raise ValueError(f"Unsupported language: {request.language}")
        
        return {
            "total_fixes": len(fixes),
            "fixes_by_category": count_by_category(fixes),
            "suggestions": fixes
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/quick-fixes")
async def get_quick_fixes(request: RefactorRequest):
    """Get only auto-fixable issues."""
    fixes = await get_suggestions(request)
    auto_fixes = [f for f in fixes["suggestions"] if f["auto_fixable"]]
    return {
        "total_fixes": len(auto_fixes),
        "fixes": auto_fixes
    }

@router.post("/apply")
async def apply_fix(code: str, fix_id: str, language: str):
    """Apply a specific fix to code."""
    try:
        fixed_code = apply_fix_by_id(code, fix_id, language)
        return {
            "success": True,
            "modified_code": fixed_code,
            "applied_fixes": [{"id": fix_id}]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
```

### Step 3: Add Analysis Functions

#### Python Analysis
```python
import ast

def analyze_python_code(code: str) -> List[dict]:
    """Analyze Python code for issues."""
    fixes = []
    
    try:
        tree = ast.parse(code)
        
        # Find unused variables
        for node in ast.walk(tree):
            if isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        # Check if variable is used
                        if not is_variable_used(target.id, tree):
                            fixes.append({
                                "id": f"unused_{target.id}",
                                "title": f"Remove unused variable {target.id}",
                                "explanation": f"Variable {target.id} is assigned but never used",
                                "auto_fixable": True,
                                "category": "unused_variable"
                            })
    
    except SyntaxError:
        fixes.append({
            "id": "syntax_error",
            "title": "Fix syntax error",
            "explanation": "Code contains syntax errors",
            "auto_fixable": False,
            "category": "syntax"
        })
    
    return fixes
```

### Step 4: Register Routes
```python
# In main.py or app.py
from app.routes import refactor
app.include_router(refactor.router)
```

## Testing Commands

```bash
# Test refactor suggestions endpoint
curl -X POST http://localhost:8000/v1/refactor/suggestions \
  -H "Content-Type: application/json" \
  -d '{"prompt": "x=1", "language": "python"}'

# Test quick fixes endpoint
curl -X POST http://localhost:8000/v1/refactor/quick-fixes \
  -H "Content-Type: application/json" \
  -d '{"prompt": "import os\nprint(\"hello\")", "language": "python"}'

# Test apply fix endpoint
curl -X POST http://localhost:8000/v1/refactor/apply \
  -H "Content-Type: application/json" \
  -d '{"code": "import os\nprint(\"hello\")", "fix_id": "unused_os", "language": "python"}'
```

## Integration Checklist

- [ ] Implement `/v1/refactor/suggestions` endpoint
- [ ] Implement `/v1/refactor/quick-fixes` endpoint
- [ ] Implement `/v1/refactor/apply` endpoint
- [ ] Add Python code analysis
- [ ] Add JavaScript/TypeScript analysis
- [ ] Add error handling
- [ ] Add rate limiting
- [ ] Test with VS Code extension
- [ ] Document API responses
- [ ] Add metrics/logging

## Files to Create/Update

```
backend/
├── app/
│   ├── routes/
│   │   └── refactor.py (NEW)
│   ├── services/
│   │   └── analyzer.py (NEW - code analysis logic)
│   └── main.py (UPDATE - register routes)
├── tests/
│   └── test_refactor.py (NEW)
└── README.md (UPDATE)
```

## Expected Response Times

| Operation | Target | Max |
|-----------|--------|-----|
| Suggestions (small file) | 100-500ms | 2s |
| Quick Fixes (small file) | 50-200ms | 1s |
| Apply Fix | 50-100ms | 500ms |
| Suggestions (large file) | 1-2s | 5s |

## Troubleshooting

**Issue**: 500 Internal Server Error
- Check backend logs for syntax errors in code
- Verify language parameter is supported
- Check if analyzer service is running

**Issue**: Timeout
- For large files, increase timeout
- Consider streaming large files
- Add progress indicators

**Issue**: Incorrect fixes applied
- Verify code is syntactically valid
- Check fix_id matches code pattern
- Review fix implementation logic

## Next Steps After Backend Implementation

1. **Add more languages**: Go, Rust, C#
2. **Implement caching**: Cache analysis results
3. **Add batch processing**: Analyze multiple files
4. **Create dashboard**: Show refactoring metrics
5. **Add machine learning**: Pattern-based suggestions

---

**Time to Implement**: 4-6 hours for complete backend
**Complexity**: Medium (requires language-specific analysis)
**Dependencies**: astroid, pylint, eslint, TypeScript parser
