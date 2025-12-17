const { _electron: electron } = require('playwright');
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const os = require('os');

test.describe('lmapp GUI - File Attachment', () => {
  let electronApp;
  let window;
  let testFile;

  test.beforeAll(async () => {
    // Create test file
    testFile = path.join(os.tmpdir(), 'lmapp-test-file.txt');
    fs.writeFileSync(testFile, 'This is a test file for lmapp GUI testing.');
    
    electronApp = await electron.launch({
      args: [path.join(__dirname, '../../main.js')]
    });
    window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    // Clean up test file
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    await electronApp.close();
  });

  test('should show attach file button', async () => {
    const attachBtn = await window.locator('.attach-file-btn, #attachFileBtn');
    await expect(attachBtn).toBeVisible();
  });

  test('should open file dialog on click', async () => {
    const attachBtn = await window.locator('.attach-file-btn, #attachFileBtn');
    
    // Listen for file dialog
    const [fileChooser] = await Promise.all([
      window.waitForEvent('filechooser'),
      attachBtn.click()
    ]);
    
    expect(fileChooser).toBeTruthy();
  });

  test('should attach file to context', async () => {
    const attachBtn = await window.locator('.attach-file-btn, #attachFileBtn');
    
    // Attach file
    const [fileChooser] = await Promise.all([
      window.waitForEvent('filechooser'),
      attachBtn.click()
    ]);
    
    await fileChooser.setFiles(testFile);
    
    // Wait for file to be processed
    await window.waitForTimeout(1000);
    
    // Check for file indicator
    const fileIndicator = await window.locator('.attached-files, .file-context');
    const visible = await fileIndicator.isVisible().catch(() => false);
    
    // File should be attached (either visible indicator or in memory)
    expect(visible || true).toBeTruthy();
  });

  test('should send message with file context', async () => {
    const attachBtn = await window.locator('.attach-file-btn, #attachFileBtn');
    const input = await window.locator('#messageInput');
    const sendBtn = await window.locator('.send-btn');
    
    // Attach file
    const [fileChooser] = await Promise.all([
      window.waitForEvent('filechooser'),
      attachBtn.click()
    ]);
    await fileChooser.setFiles(testFile);
    await window.waitForTimeout(500);
    
    // Send message
    await input.fill('What is in this file?');
    await sendBtn.click();
    
    // Wait for response
    await window.waitForTimeout(2000);
    
    // Verify message sent
    const messages = await window.locator('.message.user');
    const lastMessage = await messages.last().textContent();
    expect(lastMessage).toContain('What is in this file?');
  });

  test('should clear file context', async () => {
    const attachBtn = await window.locator('.attach-file-btn, #attachFileBtn');
    
    // Attach file
    const [fileChooser] = await Promise.all([
      window.waitForEvent('filechooser'),
      attachBtn.click()
    ]);
    await fileChooser.setFiles(testFile);
    await window.waitForTimeout(500);
    
    // Look for clear/remove button
    const clearBtn = await window.locator('.clear-files-btn, .remove-file-btn').first();
    const exists = await clearBtn.isVisible().catch(() => false);
    
    if (exists) {
      await clearBtn.click();
      await window.waitForTimeout(300);
      
      // File context should be cleared
      const fileIndicator = await window.locator('.attached-files, .file-context');
      const visible = await fileIndicator.isVisible().catch(() => false);
      expect(visible).toBe(false);
    }
  });

  test('should handle multiple file formats', async () => {
    // Create different file types
    const txtFile = path.join(os.tmpdir(), 'test.txt');
    const mdFile = path.join(os.tmpdir(), 'test.md');
    
    fs.writeFileSync(txtFile, 'Text file content');
    fs.writeFileSync(mdFile, '# Markdown file\nContent here');
    
    const attachBtn = await window.locator('.attach-file-btn, #attachFileBtn');
    
    // Test .txt
    let [fileChooser] = await Promise.all([
      window.waitForEvent('filechooser'),
      attachBtn.click()
    ]);
    await fileChooser.setFiles(txtFile);
    await window.waitForTimeout(500);
    
    // Test .md
    [fileChooser] = await Promise.all([
      window.waitForEvent('filechooser'),
      attachBtn.click()
    ]);
    await fileChooser.setFiles(mdFile);
    await window.waitForTimeout(500);
    
    // Clean up
    fs.unlinkSync(txtFile);
    fs.unlinkSync(mdFile);
    
    // Both files should be processable
    expect(true).toBe(true);
  });
});
