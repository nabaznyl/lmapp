const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');

let mainWindow;
let lmappBackend;
const BACKEND_URL = 'http://localhost:8000';

// Start lmapp backend server
function startBackend() {
  return new Promise((resolve, reject) => {
    lmappBackend = spawn('lmapp', ['serve', '--port', '8000']);
    
    lmappBackend.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
    });
    
    lmappBackend.stderr.on('data', (data) => {
      console.error(`Backend: ${data}`);
    });
    
    lmappBackend.on('error', (error) => {
      console.error('Failed to start backend:', error);
      reject(error);
    });
    
    // Wait for backend to be ready
    let attempts = 0;
    const checkBackend = setInterval(async () => {
      try {
        await axios.get(`${BACKEND_URL}/health`);
        clearInterval(checkBackend);
        console.log('Backend ready');
        resolve();
      } catch (error) {
        attempts++;
        if (attempts > 30) {
          clearInterval(checkBackend);
          reject(new Error('Backend failed to start'));
        }
      }
    }, 500);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'lmapp - AI Everywhere',
    backgroundColor: '#1e1e1e',
    icon: path.join(__dirname, 'assets/icon.png')
  });

  mainWindow.loadFile('renderer/index.html');

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  try {
    await startBackend();
    createWindow();
  } catch (error) {
    console.error('Failed to start application:', error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
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

// IPC handlers
ipcMain.handle('send-message', async (event, message) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/v1/chat`, {
      message: message,
      stream: false
    });
    return { response: response.data.response };
  } catch (error) {
    console.error('Backend error:', error);
    return { error: 'Could not connect to backend. Make sure lmapp is running.' };
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

ipcMain.handle('get-settings', async () => {
  // TODO: Load settings from file
  return {
    theme: 'dark',
    model: '',
    temperature: 0.7
  };
});

ipcMain.handle('save-settings', async (event, settings) => {
  // TODO: Save settings to file
  console.log('Saving settings:', settings);
  return { success: true };
});
