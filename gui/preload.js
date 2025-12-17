const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.invoke('send-message', message),
  getModels: () => ipcRenderer.invoke('get-models'),
  selectFile: () => ipcRenderer.invoke('select-file'),
  checkBackend: () => ipcRenderer.invoke('check-backend'),
  getWorkflows: () => ipcRenderer.invoke('get-workflows'),
  executeWorkflowStep: (stepData) => ipcRenderer.invoke('execute-workflow-step', stepData),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  openSettings: () => ipcRenderer.invoke('open-settings')
});
