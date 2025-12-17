const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

let mainWindow;
let lmappBackend;

// Get path to bundled lmapp backend
function getBackendPath() {
  const isDev = process.argv.includes('--dev');
  
  if (isDev) {
    // Development: use system lmapp
    return 'lmapp';
  }
  
  // Production: use bundled binary
  const exeName = process.platform === 'win32' ? 'lmapp.exe' : 'lmapp';
  const bundledPath = path.join(
    process.resourcesPath || path.join(__dirname, 'resources'),
    'backend',
    exeName
  );
  
  if (fs.existsSync(bundledPath)) {
    console.log(`Using bundled backend: ${bundledPath}`);
    return bundledPath;
  }
  
  // Fallback to system lmapp
  console.warn('Bundled backend not found, using system lmapp');
  return 'lmapp';
}

// Start lmapp backend server
function startBackend() {
  const backendPath = getBackendPath();
  lmappBackend = spawn(backendPath, ['serve']);
  
  lmappBackend.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });
  
  lmappBackend.stderr.on('data', (data) => {
    console.error(`Backend error: ${data}`);
  });
  
  // Give backend time to start
  return new Promise(resolve => setTimeout(resolve, 2000));
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'lmapp - AI Everywhere',
    backgroundColor: '#1e1e1e'
  });

  // Load the index.html
  mainWindow.loadFile('renderer/index.html');

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  await startBackend();
  createWindow();
  
  // Register global keyboard shortcuts
  const { globalShortcut } = require('electron');
  
  // Ctrl+Shift+W: Open workflows
  globalShortcut.register('CommandOrControl+Shift+W', () => {
    if (mainWindow) {
      mainWindow.loadFile('renderer/workflows.html');
    }
  });
  
  // Ctrl+Shift+C: Open chat
  globalShortcut.register('CommandOrControl+Shift+C', () => {
    if (mainWindow) {
      mainWindow.loadFile('renderer/index.html');
    }
  });
  
  // Ctrl+Shift+S: Open settings
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    if (mainWindow) {
      ipcMain.emit('open-settings');
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('will-quit', () => {
  // Unregister all shortcuts
  const { globalShortcut } = require('electron');
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (lmappBackend) {
    lmappBackend.kill();
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (lmappBackend) {
    lmappBackend.kill();
  }
});

// IPC handlers for renderer process
const axios = require('axios');
const BACKEND_URL = 'http://localhost:8000';

ipcMain.handle('send-message', async (event, message) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/v1/chat`, {
      message: message,
      stream: false
    });
    return { response: response.data.response, error: response.data.error };
  } catch (error) {
    console.error('Backend error:', error);
    return { error: 'Could not connect to backend. Make sure lmapp is running.' };
  }
});

// Streaming chat handler (sends chunks as they arrive)
ipcMain.handle('send-message-stream', async (event, message) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/v1/chat/stream`, {
      message: message,
      stream: true
    }, {
      responseType: 'stream'
    });
    
    // Process SSE stream
    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const text = line.slice(6).replace(/\\n/g, '\n');
          if (text.trim()) {
            event.sender.send('message-chunk', text);
          }
        }
      }
    });
    
    response.data.on('end', () => {
      event.sender.send('message-complete');
    });
    
    response.data.on('error', (error) => {
      event.sender.send('message-error', error.message);
    });
    
    return { streaming: true };
  } catch (error) {
    console.error('Streaming error:', error);
    return { error: 'Could not connect to streaming endpoint' };
  }
});

ipcMain.handle('get-models', async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/v1/models`);
    return { models: response.data.models || [] };
  } catch (error) {
    console.error('Failed to get models:', error);
    return { models: [] };
  }
});

ipcMain.handle('select-file', async () => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Documents', extensions: ['txt', 'md', 'pdf', 'doc', 'docx'] },
      { name: 'Code', extensions: ['js', 'py', 'java', 'cpp', 'c', 'html', 'css'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    // Send files to backend for processing
    try {
      await axios.post(`${BACKEND_URL}/v1/files/add`, {
        paths: result.filePaths
      });
    } catch (error) {
      console.error('Failed to add files to context:', error);
    }
  }
  
  return result.filePaths;
});

// Settings management
const fs = require('fs');
const settingsPath = path.join(app.getPath('userData'), 'settings.json');

ipcMain.handle('get-settings', async () => {
  try {
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  
  // Default settings
  return {
    theme: 'dark',
    defaultModel: '',
    temperature: 0.7,
    maxTokens: 500,
    streamingEnabled: true,
    autoSave: true
  };
});

ipcMain.handle('save-settings', async (event, settings) => {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Failed to save settings:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-settings', async () => {
  const settingsWindow = new BrowserWindow({
    width: 600,
    height: 700,
    parent: mainWindow,
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  settingsWindow.loadFile(path.join(__dirname, 'renderer', 'settings.html'));
});

// Workflow management handlers
ipcMain.handle('get-workflows', async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/v1/workflows`);
    return response.data;
  } catch (error) {
    console.error('Failed to get workflows:', error);
    return { workflows: [] };
  }
});

ipcMain.handle('execute-workflow-step', async (event, stepData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/v1/workflows/execute`, stepData);
    return response.data;
  } catch (error) {
    console.error('Workflow step execution failed:', error);
    throw error;
  }
});

ipcMain.handle('check-backend', async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/health`);
    return { connected: true };
  } catch (error) {
    return { connected: false };
  }
});
