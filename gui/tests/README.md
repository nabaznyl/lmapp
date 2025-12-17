# GUI Automated Testing

## Test Framework

Using **Playwright for Electron** - modern, reliable, fast.

## Setup

```bash
cd gui
npm install --save-dev playwright @playwright/test
```

## Test Structure

```
gui/
├── tests/
│   ├── e2e/
│   │   ├── app.spec.js          # App launch, window creation
│   │   ├── chat.spec.js         # Chat functionality
│   │   ├── models.spec.js       # Model selection
│   │   └── files.spec.js        # File attachment
│   ├── unit/
│   │   ├── backend.spec.js      # Backend integration
│   │   └── settings.spec.js     # Settings persistence
│   └── helpers/
│       └── electron-test.js     # Test utilities
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- chat.spec.js

# Run in headed mode (see UI)
npm test -- --headed

# Debug mode
npm test -- --debug
```

## Test Coverage Goals

- ✅ App launches successfully
- ✅ Backend connection works
- ✅ Chat sends/receives messages
- ✅ Model selection changes model
- ✅ File attachment adds to context
- ✅ Settings persist across restarts
- ✅ Clear chat works
- ✅ Window resizes properly

## Performance Benchmarks

- App startup: < 3 seconds
- Message send: < 1 second
- Settings load: < 500ms
- Memory usage: < 200MB idle

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Main branch commits
- Before releases

## Manual Testing Checklist

See [TESTING.md](TESTING.md) for complete manual test checklist.
