const { ipcMain, dialog, shell } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = path.join(os.homedir(), '.weekly-tracker');
const DATA_FILE = path.join(DATA_DIR, 'data.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function registerIpcHandlers() {
  ipcMain.handle('load-data', async () => {
    ensureDataDir();
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });

  ipcMain.handle('save-data', async (_event, items) => {
    ensureDataDir();
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
    return true;
  });

  ipcMain.handle('export-markdown', async (_event, markdown, defaultFilename) => {
    const result = await dialog.showSaveDialog({
      title: 'Export Weekly Report',
      defaultPath: path.join(os.homedir(), 'Documents', defaultFilename),
      filters: [{ name: 'Markdown', extensions: ['md'] }],
    });

    if (result.canceled || !result.filePath) {
      return { success: false, canceled: true };
    }

    fs.writeFileSync(result.filePath, markdown, 'utf-8');
    shell.openPath(result.filePath);
    return { success: true, filePath: result.filePath };
  });
}

module.exports = { registerIpcHandlers };
