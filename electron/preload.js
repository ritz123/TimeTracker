const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (items) => ipcRenderer.invoke('save-data', items),
  exportMarkdown: (markdown, defaultFilename) =>
    ipcRenderer.invoke('export-markdown', markdown, defaultFilename),

  // Preferences
  getPrefs: () => ipcRenderer.invoke('get-prefs'),
  savePrefs: (prefs) => ipcRenderer.invoke('save-prefs', prefs),

  // Google Drive
  googleAuthStatus: () => ipcRenderer.invoke('google-auth-status'),
  googleSignIn: () => ipcRenderer.invoke('google-sign-in'),
  googleSignOut: () => ipcRenderer.invoke('google-sign-out'),
  googleUserInfo: () => ipcRenderer.invoke('google-user-info'),
  googleLoadData: () => ipcRenderer.invoke('google-load-data'),
  googleSaveData: (items) => ipcRenderer.invoke('google-save-data', items),
});
