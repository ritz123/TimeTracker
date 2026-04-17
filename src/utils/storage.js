const isElectron = typeof window !== 'undefined' && window.api;

const LOCAL_STORAGE_KEY = 'weekly-tracker-items';
const PREFS_KEY = 'weekly-tracker-prefs';

// --- Preferences ---

export async function loadPrefs() {
  if (isElectron) return window.api.getPrefs();
  const raw = localStorage.getItem(PREFS_KEY);
  return raw ? JSON.parse(raw) : { storageMode: 'local' };
}

export async function savePrefs(prefs) {
  if (isElectron) return window.api.savePrefs(prefs);
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  return true;
}

// --- Data (local) ---

async function loadLocal() {
  if (isElectron) return window.api.loadData();
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function saveLocal(items) {
  if (isElectron) return window.api.saveData(items);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  return true;
}

// --- Data (Google Drive) ---

async function loadGoogle() {
  if (!isElectron) throw new Error('Google Drive requires the desktop app');
  return window.api.googleLoadData();
}

async function saveGoogle(items) {
  if (!isElectron) throw new Error('Google Drive requires the desktop app');
  return window.api.googleSaveData(items);
}

// --- Unified API ---

export async function loadData(storageMode = 'local') {
  return storageMode === 'google' ? loadGoogle() : loadLocal();
}

export async function saveData(items, storageMode = 'local') {
  return storageMode === 'google' ? saveGoogle(items) : saveLocal(items);
}

// --- Google auth helpers ---

export async function googleAuthStatus() {
  if (!isElectron) return { isConfigured: false, isAuthenticated: false };
  return window.api.googleAuthStatus();
}

export async function googleSignIn() {
  if (!isElectron) throw new Error('Requires desktop app');
  return window.api.googleSignIn();
}

export async function googleSignOut() {
  if (!isElectron) throw new Error('Requires desktop app');
  return window.api.googleSignOut();
}

export async function googleUserInfo() {
  if (!isElectron) return null;
  return window.api.googleUserInfo();
}

// --- Export ---

export async function exportMarkdown(markdown, defaultFilename) {
  if (isElectron) return window.api.exportMarkdown(markdown, defaultFilename);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = defaultFilename;
  a.click();
  URL.revokeObjectURL(url);
  return { success: true };
}
