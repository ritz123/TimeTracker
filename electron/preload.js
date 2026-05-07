const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadData: () => ipcRenderer.invoke('load-data'),
  saveData: (items) => ipcRenderer.invoke('save-data', items),
  exportMarkdown: (markdown, defaultFilename) =>
    ipcRenderer.invoke('export-markdown', markdown, defaultFilename),

  // Preferences
  getPrefs: () => ipcRenderer.invoke('get-prefs'),
  savePrefs: (prefs) => ipcRenderer.invoke('save-prefs', prefs),
});
