# GUI Testing Documentation

Complete manual testing checklist in [gui/TESTING.md](gui/TESTING.md)

## Quick Testing Guide

### Prerequisites

1. Backend running:
   ```bash
   lmapp serve
   ```

2. Ollama/llamafile with at least one model:
   ```bash
   ollama pull llama2  # or similar
   ```

3. GUI dependencies installed:
   ```bash
   cd gui
   npm install
   ```

### Run Tests

**Automated (Playwright):**
```bash
cd gui
npm test              # Run all tests
npm run test:headed   # See tests run
npm run test:debug    # Debug mode
```

**Manual Testing:**
```bash
cd gui
npm start             # Launch GUI in dev mode
```
Follow checklist in [gui/TESTING.md](gui/TESTING.md)

### Test Coverage

**E2E Tests (19 tests):**
- ✅ Application launch (7 tests)
- ✅ Chat functionality (6 tests)  
- ✅ Model selection (5 tests)
- ✅ File attachment (6 tests)
- ✅ Settings persistence (8 tests)

**Manual Tests (150+ checkpoints):**
- Connection & status
- Streaming responses
- Error handling
- Performance benchmarks
- Real-world scenarios
- Platform-specific features

### CI/CD Integration

Tests run automatically via GitHub Actions:
- On PRs to main/develop
- On commits to gui/ or server/
- Cross-platform (Ubuntu, macOS, Windows)
- Multiple Node versions (18, 20)

See [.github/workflows/gui-tests.yml](.github/workflows/gui-tests.yml)

### Performance Targets

- App startup: < 3 seconds
- Message send: < 1 second
- Settings load: < 500ms
- Memory usage: < 200MB idle
- CPU usage: < 5% idle

### Test Results

Upload to:
- `playwright-report/` (HTML report)
- `test-results/` (screenshots/videos on failure)

Artifacts retained for 7 days in GitHub Actions.
