# lmapp GUI + Workflows - Integration Testing Guide

## Pre-Testing Setup

**Requirements:**
1. lmapp backend installed: `pip install -e .`
2. Ollama or llamafile running with at least one model
3. GUI dependencies installed: `cd gui && npm install`

**Quick Start:**
```bash
# Terminal 1: Start backend
cd ~/projects/lmapp
lmapp serve

# Terminal 2: Start GUI
cd ~/projects/lmapp/gui
npm start
```

---

## Phase 2A: GUI Core Features

### Test 1: Application Launch
- [ ] App opens within 3 seconds
- [ ] Dark theme applied by default
- [ ] No console errors (open DevTools with F12)
- [ ] Status shows "Connected" (green indicator)

### Test 2: Chat Functionality
- [ ] Send message: "Hello, how are you?"
- [ ] Receive AI response
- [ ] Message history preserved
- [ ] Clear chat works (with confirmation)

### Test 3: Model Selection
- [ ] Models list populated in dropdown
- [ ] Select different model
- [ ] Send message with new model
- [ ] Model persists after restart

### Test 4: File Attachment
- [ ] Click attach file button
- [ ] Select .txt file
- [ ] File added to context
- [ ] Ask: "What is in this file?"
- [ ] AI references file content

### Test 5: Settings Panel
- [ ] Open settings (⚙️ button)
- [ ] Toggle theme (dark ↔ light)
- [ ] Adjust temperature slider
- [ ] Enable/disable RAG
- [ ] Enable/disable agent mode
- [ ] Settings persist after restart

---

## Phase 2B: Workflow Integration

### Test 6: Workflow List Display
- [ ] Navigate to Workflows tab
- [ ] 5 workflows displayed:
  - Write Paper (Productivity)
  - Search Files (Research)
  - Game Help (Gaming)
  - Email Automation (Productivity)
  - Document Analysis (Research)
- [ ] Category filter works (All, Productivity, Research, Gaming)

### Test 7: Write Paper Workflow
**Steps:**
1. Click "Run Workflow" on "Write Paper"
2. Enter topic: "The benefits of renewable energy"
3. Wait for outline generation (10-30 seconds)
4. Review generated outline
5. Click Continue
6. Wait for first section (20-60 seconds)
7. Review written section
8. Workflow completes

**Expected:**
- [ ] Progress bar updates at each step
- [ ] Step indicator shows "Step X of Y"
- [ ] LLM generates coherent outline
- [ ] LLM writes relevant section
- [ ] Workflow completion confirmation

### Test 8: Search Files Workflow
**Steps:**
1. Click "Run Workflow" on "Search Files"
2. Enter search query: "python code"
3. Click "Select Folder" button
4. Choose ~/projects/lmapp/src
5. Wait for search results
6. Review file list

**Expected:**
- [ ] File picker dialog opens
- [ ] Folder selection works
- [ ] Search executes successfully
- [ ] Results show relevant Python files

### Test 9: Game Help Workflow
**Steps:**
1. Click "Run Workflow" on "Game Help"
2. Enter game: "Grand Theft Auto: San Andreas"
3. Enter platform: "PC"
4. Enter question: "What are the best cheat codes?"
5. Wait for response (10-30 seconds)
6. Review cheat codes

**Expected:**
- [ ] Multi-step input collection works
- [ ] Variables preserved between steps
- [ ] LLM provides relevant game help
- [ ] Cheat codes are accurate

### Test 10: Email Automation Workflow
**Steps:**
1. Click "Run Workflow" on "Email Automation"
2. Enter recipient: "manager"
3. Enter subject: "Project update"
4. Enter key points: "Phase 2 complete, testing underway"
5. Wait for email generation (10-30 seconds)
6. Review generated email

**Expected:**
- [ ] Professional tone
- [ ] All key points included
- [ ] Proper email structure (greeting, body, closing)

### Test 11: Document Analysis Workflow
**Steps:**
1. Click "Run Workflow" on "Document Analysis"
2. Click "Select File"
3. Choose a .txt or .md file
4. Wait for analysis (15-45 seconds)
5. Review summary and key points

**Expected:**
- [ ] File picker works
- [ ] File content read successfully
- [ ] Summary is accurate
- [ ] Key points extracted

---

## Integration Tests (GUI + Workflows)

### Test 12: Chat → Workflow → Chat
**Scenario:** Use chat, run workflow, return to chat
1. Send chat message
2. Navigate to Workflows tab
3. Run "Write Paper" workflow
4. Complete workflow
5. Navigate back to Chat tab
6. Send another message

**Expected:**
- [ ] Navigation preserves state
- [ ] Chat history intact after workflow
- [ ] No errors or crashes

### Test 13: Multiple Workflows in Sequence
**Scenario:** Run 3 workflows back-to-back
1. Run "Game Help" workflow → Complete
2. Run "Search Files" workflow → Complete
3. Run "Document Analysis" workflow → Complete

**Expected:**
- [ ] Each workflow executes independently
- [ ] No interference between workflows
- [ ] Memory usage stable (< 500MB)

### Test 14: Settings + Workflows
**Scenario:** Change settings, run workflow
1. Open settings
2. Change temperature to 0.9
3. Change theme to light
4. Close settings
5. Run "Write Paper" workflow
6. Check output creativity

**Expected:**
- [ ] Settings applied to workflow LLM calls
- [ ] Higher temperature = more creative output
- [ ] Theme change doesn't break workflow UI

---

## Error Handling Tests

### Test 15: Backend Disconnection
1. Stop lmapp backend (Ctrl+C)
2. Try to run workflow
3. Observe error handling
4. Restart backend
5. Try workflow again

**Expected:**
- [ ] Error shown gracefully (not crash)
- [ ] "Disconnected" status indicator
- [ ] Automatic reconnection on backend restart
- [ ] Workflow succeeds after reconnect

### Test 16: Invalid Workflow Input
1. Run "Write Paper" workflow
2. Leave topic blank
3. Try to continue

**Expected:**
- [ ] Input validation prevents empty submission
- [ ] User prompted to fill required fields

### Test 17: Large File Handling
1. Run "Document Analysis" workflow
2. Select very large file (>1MB)
3. Observe processing

**Expected:**
- [ ] File loads successfully OR
- [ ] Size warning shown with option to continue
- [ ] No crash or freeze

---

## Performance Benchmarks

### Test 18: Response Times
- [ ] Chat response: < 5 seconds
- [ ] Workflow step (simple): < 10 seconds
- [ ] Workflow step (complex): < 30 seconds
- [ ] File selection: < 1 second
- [ ] Settings save: < 500ms

### Test 19: Resource Usage
- [ ] CPU idle: < 5%
- [ ] Memory idle: < 200MB
- [ ] Memory active (chat): < 400MB
- [ ] Memory active (workflow): < 500MB
- [ ] No memory leaks (monitor for 10+ minutes)

### Test 20: Long Session Stability
1. Run for 30+ minutes
2. Execute 10+ workflows
3. Send 50+ chat messages
4. Switch between tabs frequently

**Expected:**
- [ ] No crashes or freezes
- [ ] Performance remains stable
- [ ] Memory usage doesn't continuously increase

---

## Workflow Proficiency Tests

### Test 21: Workflow Speed Improvements
Test if these features work (if implemented):
- [ ] Cached responses (run same workflow twice → faster 2nd time)
- [ ] Recent workflows shown at top
- [ ] Keyboard shortcut Ctrl+Shift+W opens workflows

### Test 22: User Experience
- [ ] Workflow cards are visually appealing
- [ ] Progress indicators are clear
- [ ] Error messages are helpful
- [ ] Workflow completion feels satisfying

---

## Cross-Platform Tests (if available)

### macOS
- [ ] .dmg installer works
- [ ] App opens from Applications folder
- [ ] Cmd+Q quits properly

### Windows
- [ ] .exe installer works
- [ ] Desktop shortcut created
- [ ] Alt+F4 closes properly

### Linux
- [ ] AppImage runs without install
- [ ] .deb installs correctly
- [ ] No permission errors

---

## Final Checklist

**Before Release:**
- [ ] All 22 integration tests pass
- [ ] No critical bugs
- [ ] Performance meets targets
- [ ] Documentation complete
- [ ] Distribution builds created

**Test Results Summary:**
```
Phase 2A GUI Tests:      ___/5  ⬜ Pass ⬜ Fail
Phase 2B Workflow Tests: ___/6  ⬜ Pass ⬜ Fail
Integration Tests:       ___/3  ⬜ Pass ⬜ Fail
Error Handling Tests:    ___/3  ⬜ Pass ⬜ Fail
Performance Tests:       ___/3  ⬜ Pass ⬜ Fail
Proficiency Tests:       ___/2  ⬜ Pass ⬜ Fail
─────────────────────────────────────────────
Total:                   ___/22 (Goal: 100%)
```

**Overall Status:** ⬜ Ready for Beta | ⬜ Ready for Production | ⬜ Needs Work

**Tester Signature:** _________________ **Date:** _________
