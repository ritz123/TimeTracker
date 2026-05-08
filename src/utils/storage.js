const isElectron = typeof window !== 'undefined' && window.api;

const LOCAL_STORAGE_KEY = 'weekly-tracker-items';
const PREFS_KEY = 'weekly-tracker-prefs';

/** @param {string} url */
export function isSafeGithubHttpsUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname === 'github.com';
  } catch {
    return false;
  }
}

/** @param {string} url */
export async function openExternalUrl(url) {
  if (!isSafeGithubHttpsUrl(url)) return false;
  if (isElectron && window.api.openExternal) {
    const ok = await window.api.openExternal(url);
    return Boolean(ok);
  }
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

// --- Preferences ---

export async function loadPrefs() {
  if (isElectron) return window.api.getPrefs();
  const raw = localStorage.getItem(PREFS_KEY);
  const prefs = raw ? JSON.parse(raw) : { storageMode: 'local', theme: 'default', checkUpdatesOnStartup: false };
  if (!prefs.theme) prefs.theme = 'default';
  if (typeof prefs.checkUpdatesOnStartup !== 'boolean') prefs.checkUpdatesOnStartup = false;
  if (prefs.storageMode === 'google') {
    const next = { ...prefs, storageMode: 'local' };
    await savePrefs(next);
    return next;
  }
  return prefs;
}

export async function savePrefs(prefs) {
  if (isElectron) return window.api.savePrefs(prefs);
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  return true;
}

// --- Data ---

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

export async function loadData() {
  return loadLocal();
}

export async function saveData(items) {
  return saveLocal(items);
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
