const { app, BrowserWindow, Menu, nativeImage } = require('electron');
const fs = require('fs');
const path = require('path');
const { registerIpcHandlers } = require('./ipc-handlers');

let mainWindow;

const ICON_DIR = path.join(__dirname, '..', 'build', 'icons');

/** Prefer nativeImage so Linux WMs get correct ARGB / aspect when mapping _NET_WM_ICON. */
function loadWindowIcon() {
  if (process.platform === 'win32') {
    const ico = nativeImage.createFromPath(path.join(ICON_DIR, 'icon.ico'));
    if (!ico.isEmpty()) return ico;
  }
  const png = nativeImage.createFromPath(path.join(ICON_DIR, 'icon.png'));
  return png.isEmpty() ? undefined : png;
}

function createWindow() {
  Menu.setApplicationMenu(null);

  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    minWidth: 900,
    minHeight: 600,
    icon: loadWindowIcon(),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    title: 'Time Tracker',
  });

  const distHtml = path.join(__dirname, '..', 'dist', 'index.html');
  const hasDist = fs.existsSync(distHtml);
  const useViteDevServer = !app.isPackaged && app.commandLine.hasSwitch('vite-dev');

  if (useViteDevServer) {
    mainWindow.loadURL('http://localhost:5173');
  } else if (hasDist) {
    mainWindow.loadFile(distHtml);
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
