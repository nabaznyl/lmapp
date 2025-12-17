const { _electron: electron } = require('playwright');
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('lmapp GUI - Chat Functionality', () => {
  let electronApp;
  let window;

  test.beforeAll(async () => {
    electronApp = await electron.launch({
      args: [path.join(__dirname, '../../main.js')]
    });
    window = await electronApp.firstWindow();
    
    // Wait for app to be ready
    await window.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('should send a message', async () => {
    const input = await window.locator('#messageInput');
    const sendBtn = await window.locator('.send-btn');
    
    // Type message
    await input.fill('Hello, AI!');
    
    // Click send
    await sendBtn.click();
    
    // Wait for response
    await window.waitForTimeout(2000);
    
    // Check message appears in chat
    const messages = await window.locator('.message.user');
    const count = await messages.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should receive AI response', async () => {
    const input = await window.locator('#messageInput');
    const sendBtn = await window.locator('.send-btn');
    
    await input.fill('Test message');
    await sendBtn.click();
    
    // Wait for AI response (may take a few seconds)
    await window.waitForTimeout(5000);
    
    // Check for assistant message
    const assistantMessages = await window.locator('.message.assistant');
    const count = await assistantMessages.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should clear chat', async () => {
    // Send a message first
    const input = await window.locator('#messageInput');
    await input.fill('Message to clear');
    await window.keyboard.press('Enter');
    await window.waitForTimeout(1000);
    
    // Click clear chat
    const clearBtn = await window.locator('.clear-chat-btn');
    await clearBtn.click();
    
    // Confirm dialog
    await window.keyboard.press('Enter');
    
    // Check messages are cleared
    const messages = await window.locator('.message');
    const count = await messages.count();
    expect(count).toBe(0);
  });

  test('should handle Enter key to send', async () => {
    const input = await window.locator('#messageInput');
    
    await input.fill('Message via Enter');
    await window.keyboard.press('Enter');
    
    await window.waitForTimeout(1000);
    
    const messages = await window.locator('.message.user');
    const lastMessage = await messages.last().textContent();
    expect(lastMessage).toContain('Message via Enter');
  });

  test('should handle Shift+Enter for new line', async () => {
    const input = await window.locator('#messageInput');
    
    await input.fill('Line 1');
    await window.keyboard.press('Shift+Enter');
    await input.type('Line 2');
    
    const value = await input.inputValue();
    expect(value).toContain('\n');
  });

  test('should show loading state while sending', async () => {
    const input = await window.locator('#messageInput');
    const sendBtn = await window.locator('.send-btn');
    
    await input.fill('Test loading');
    await sendBtn.click();
    
    // Check button shows "Sending..."
    const btnText = await sendBtn.textContent();
    expect(btnText).toContain('Sending');
    
    // Wait for completion
    await window.waitForTimeout(2000);
  });
});
