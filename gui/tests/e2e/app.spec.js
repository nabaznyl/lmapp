const { _electron: electron } = require('playwright');
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('lmapp GUI - Application Launch', () => {
  let electronApp;
  let window;

  test.beforeAll(async () => {
    // Launch Electron app
    electronApp = await electron.launch({
      args: [path.join(__dirname, '../../main.js')]
    });
    
    // Get first window
    window = await electronApp.firstWindow();
  });

  test.afterAll(async () => {
    await electronApp.close();
  });

  test('should launch application', async () => {
    expect(electronApp).toBeTruthy();
  });

  test('should create main window', async () => {
    expect(window).toBeTruthy();
  });

  test('should have correct window title', async () => {
    const title = await window.title();
    expect(title).toBe('lmapp');
  });

  test('should have correct window size', async () => {
    const size = await window.evaluate(() => ({
      width: window.innerWidth,
      height: window.innerHeight
    }));
    
    expect(size.width).toBeGreaterThanOrEqual(1200);
    expect(size.height).toBeGreaterThanOrEqual(800);
  });

  test('should load main UI elements', async () => {
    // Check sidebar exists
    const sidebar = await window.locator('.sidebar');
    await expect(sidebar).toBeVisible();
    
    // Check chat container exists
    const chatContainer = await window.locator('.chat-container');
    await expect(chatContainer).toBeVisible();
    
    // Check input area exists
    const inputArea = await window.locator('#messageInput');
    await expect(inputArea).toBeVisible();
  });

  test('should show connection status', async () => {
    const status = await window.locator('.status');
    await expect(status).toBeVisible();
  });

  test('should load models in dropdown', async () => {
    const modelSelect = await window.locator('#modelSelect');
    const options = await modelSelect.locator('option').count();
    
    // Should have at least one model option
    expect(options).toBeGreaterThan(0);
  });
});
