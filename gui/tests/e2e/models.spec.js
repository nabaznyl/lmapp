const { _electron: electron } = require('playwright');
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('lmapp GUI - Model Selection', () => {
  let electronApp;
  let window;

  test.beforeAll(async () => {
    electronApp = await electron.launch({
      args: [path.join(__dirname, '../../main.js')]
    });
    window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('should load available models', async () => {
    const modelSelect = await window.locator('#modelSelect');
    await expect(modelSelect).toBeVisible();
    
    const options = await modelSelect.locator('option').count();
    expect(options).toBeGreaterThan(0);
  });

  test('should change model selection', async () => {
    const modelSelect = await window.locator('#modelSelect');
    
    // Get initial value
    const initialValue = await modelSelect.inputValue();
    
    // Get all options
    const options = await modelSelect.locator('option').all();
    
    if (options.length > 1) {
      // Select second option
      await modelSelect.selectOption({ index: 1 });
      
      // Verify change
      const newValue = await modelSelect.inputValue();
      expect(newValue).not.toBe(initialValue);
    }
  });

  test('should persist model selection', async () => {
    const modelSelect = await window.locator('#modelSelect');
    
    // Select a specific model
    const options = await modelSelect.locator('option').all();
    if (options.length > 0) {
      await modelSelect.selectOption({ index: 0 });
      const selectedValue = await modelSelect.inputValue();
      
      // Wait for save
      await window.waitForTimeout(500);
      
      // Reload app
      await electronApp.close();
      electronApp = await electron.launch({
        args: [path.join(__dirname, '../../main.js')]
      });
      window = await electronApp.firstWindow();
      
      // Check if selection persisted
      const newModelSelect = await window.locator('#modelSelect');
      const persistedValue = await newModelSelect.inputValue();
      
      expect(persistedValue).toBe(selectedValue);
    }
  });

  test('should show model name in UI', async () => {
    const modelSelect = await window.locator('#modelSelect');
    const selectedOption = await modelSelect.locator('option:checked');
    const modelName = await selectedOption.textContent();
    
    expect(modelName).toBeTruthy();
    expect(modelName.length).toBeGreaterThan(0);
  });

  test('should handle model switching during chat', async () => {
    const modelSelect = await window.locator('#modelSelect');
    const input = await window.locator('#messageInput');
    const sendBtn = await window.locator('.send-btn');
    
    // Send message with first model
    await input.fill('Test with model 1');
    await sendBtn.click();
    await window.waitForTimeout(1000);
    
    // Switch model
    const options = await modelSelect.locator('option').all();
    if (options.length > 1) {
      await modelSelect.selectOption({ index: 1 });
      
      // Send message with second model
      await input.fill('Test with model 2');
      await sendBtn.click();
      await window.waitForTimeout(1000);
      
      // Verify both messages appear
      const messages = await window.locator('.message.user');
      const count = await messages.count();
      expect(count).toBeGreaterThanOrEqual(2);
    }
  });
});
