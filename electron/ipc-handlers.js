const { ipcMain, dialog, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = path.join(os.homedir(), '.weekly-tracker');
const DATA_FILE = path.join(DATA_DIR, 'data.json');
const PREFS_FILE = path.join(DATA_DIR, 'prefs.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadPrefs() {
  ensureDataDir();
  if (!fs.existsSync(PREFS_FILE)) return { storageMode: 'local' };
  try {
    const prefs = JSON.parse(fs.readFileSync(PREFS_FILE, 'utf-8'));
    if (prefs.storageMode === 'google') {
      const next = { ...prefs, storageMode: 'local' };
      savePrefs(next);
      return next;
    }
    return prefs;
  } catch {
    return { storageMode: 'local' };
  }
}

function savePrefs(prefs) {
  ensureDataDir();
  fs.writeFileSync(PREFS_FILE, JSON.stringify(prefs, null, 2));
}

function registerIpcHandlers() {
  // Local file storage
  ipcMain.handle('load-data', async () => {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    try { return JSON.parse(raw); } catch { return []; }
  });

  ipcMain.handle('save-data', async (_event, items) => {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
    return true;
  });

  ipcMain.handle('export-markdown', async (_event, markdown, defaultFilename) => {
    const result = await dialog.showSaveDialog({
      title: 'Time Tracker — Export Report',
      defaultPath: path.join(os.homedir(), 'Documents', defaultFilename),
      filters: [{ name: 'Markdown', extensions: ['md'] }],
    });
    if (result.canceled || !result.filePath) return { success: false, canceled: true };
    fs.writeFileSync(result.filePath, markdown, 'utf-8');
    shell.openPath(result.filePath);
    return { success: true, filePath: result.filePath };
  });

  // Preferences
  ipcMain.handle('get-prefs', async () => loadPrefs());
  ipcMain.handle('save-prefs', async (_event, prefs) => { savePrefs(prefs); return true; });
}

module.exports = { registerIpcHandlers };
