const { _electron: electron } = require('playwright');
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const os = require('os');

test.describe('lmapp GUI - Settings Management', () => {
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

  test('should open settings panel', async () => {
    const settingsBtn = await window.locator('.settings-btn, #settingsBtn');
    await expect(settingsBtn).toBeVisible();
    
    await settingsBtn.click();
    await window.waitForTimeout(500);
    
    // Settings modal/panel should appear
    const settingsPanel = await window.locator('.settings-panel, #settingsModal');
    await expect(settingsPanel).toBeVisible();
  });

  test('should show theme toggle', async () => {
    const settingsBtn = await window.locator('.settings-btn, #settingsBtn');
    await settingsBtn.click();
    await window.waitForTimeout(300);
    
    const themeToggle = await window.locator('#themeSelect, .theme-toggle');
    await expect(themeToggle).toBeVisible();
  });

  test('should toggle dark/light theme', async () => {
    const settingsBtn = await window.locator('.settings-btn, #settingsBtn');
    await settingsBtn.click();
    await window.waitForTimeout(300);
    
    const themeToggle = await window.locator('#themeSelect');
    const initialValue = await themeToggle.inputValue();
    
    // Toggle theme
    const newValue = initialValue === 'dark' ? 'light' : 'dark';
    await themeToggle.selectOption(newValue);
    await window.waitForTimeout(300);
    
    // Close settings
    const closeBtn = await window.locator('.close-settings-btn, .modal-close');
    await closeBtn.click();
    await window.waitForTimeout(300);
    
    // Check body class changed
    const bodyClass = await window.evaluate(() => document.body.className);
    expect(bodyClass).toContain(newValue);
  });

  test('should show temperature slider', async () => {
    const settingsBtn = await window.locator('.settings-btn, #settingsBtn');
    await settingsBtn.click();
    await window.waitForTimeout(300);
    
    const tempSlider = await window.locator('#temperatureSlider');
    await expect(tempSlider).toBeVisible();
  });

  test('should adjust temperature', async () => {
    const settingsBtn = await window.locator('.settings-btn, #settingsBtn');
    await settingsBtn.click();
    await window.waitForTimeout(300);
    
    const tempSlider = await window.locator('#temperatureSlider');
    await tempSlider.fill('0.8');
    
    const value = await tempSlider.inputValue();
    expect(parseFloat(value)).toBe(0.8);
  });

  test('should persist settings across restarts', async () => {
    const settingsBtn = await window.locator('.settings-btn, #settingsBtn');
    await settingsBtn.click();
    await window.waitForTimeout(300);
    
    // Change settings
    const themeToggle = await window.locator('#themeSelect');
    await themeToggle.selectOption('light');
    
    const tempSlider = await window.locator('#temperatureSlider');
    await tempSlider.fill('0.9');
    
    // Close settings
    const closeBtn = await window.locator('.close-settings-btn, .modal-close');
    await closeBtn.click();
    await window.waitForTimeout(500);
    
    // Restart app
    await electronApp.close();
    electronApp = await electron.launch({
      args: [path.join(__dirname, '../../main.js')]
    });
    window = await electronApp.firstWindow();
    await window.waitForLoadState('domcontentloaded');
    
    // Check settings persisted
    await window.locator('.settings-btn').click();
    await window.waitForTimeout(300);
    
    const persistedTheme = await window.locator('#themeSelect').inputValue();
    const persistedTemp = await window.locator('#temperatureSlider').inputValue();
    
    expect(persistedTheme).toBe('light');
    expect(parseFloat(persistedTemp)).toBe(0.9);
  });

  test('should show RAG toggle', async () => {
    const settingsBtn = await window.locator('.settings-btn, #settingsBtn');
    await settingsBtn.click();
    await window.waitForTimeout(300);
    
    const ragToggle = await window.locator('#ragEnabled');
    const exists = await ragToggle.isVisible().catch(() => false);
    
    // RAG toggle should exist
    expect(exists).toBeTruthy();
  });

  test('should show agent mode toggle', async () => {
    const settingsBtn = await window.locator('.settings-btn, #settingsBtn');
    await settingsBtn.click();
    await window.waitForTimeout(300);
    
    const agentToggle = await window.locator('#agentEnabled');
    const exists = await agentToggle.isVisible().catch(() => false);
    
    // Agent toggle should exist
    expect(exists).toBeTruthy();
  });
});
