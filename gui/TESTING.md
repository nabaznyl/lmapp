# lmapp GUI Testing Guide

## Manual Testing Checklist

### Installation Test
- [ ] Download package for your platform
- [ ] Install application (< 5 minutes)
- [ ] Launch application
- [ ] Backend auto-starts successfully
- [ ] UI appears within 3 seconds

### Chat Functionality
- [ ] Type message and send
- [ ] Receive response from AI
- [ ] Multiple messages in conversation
- [ ] Clear chat history
- [ ] Status indicator shows "Connected"

### File Attachment
- [ ] Click "Attach File" button
- [ ] Select one or more files
- [ ] Files added to context
- [ ] Chat references file content

### Model Selection
- [ ] Models list populates automatically
- [ ] Select different model
- [ ] Model change applies to next message

### UI/UX
- [ ] Dark theme consistent throughout
- [ ] Window resizable
- [ ] Scrolling works in chat
- [ ] Keyboard shortcuts work (Enter to send)
- [ ] Error messages clear and helpful

### Cross-Platform
- [ ] Test on macOS
- [ ] Test on Windows
- [ ] Test on Linux

## Automated Testing (TODO)

```bash
# Unit tests for main process
npm test

# E2E tests with Spectron
npm run test:e2e
```

## Performance Benchmarks

- [ ] App startup < 3 seconds
- [ ] Message send/receive < 1 second
- [ ] File attachment < 500ms
- [ ] Memory usage < 200MB idle
- [ ] CPU usage < 5% idle

## Known Issues

1. Backend must be installed (`pip install lmapp`)
2. Models must be downloaded first (Ollama/llamafile)
3. File picker may not work on Wayland (Linux)

## Next Steps

1. Add automated E2E tests
2. Implement streaming responses
3. Add settings panel
4. Add chat history persistence
5. Package for all platforms
