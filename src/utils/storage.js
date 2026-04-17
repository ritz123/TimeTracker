const isElectron = typeof window !== 'undefined' && window.api;

const LOCAL_STORAGE_KEY = 'weekly-tracker-items';

export async function loadData() {
  if (isElectron) {
    return window.api.loadData();
  }
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveData(items) {
  if (isElectron) {
    return window.api.saveData(items);
  }
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  return true;
}

export async function exportMarkdown(markdown, defaultFilename) {
  if (isElectron) {
    return window.api.exportMarkdown(markdown, defaultFilename);
  }
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = defaultFilename;
  a.click();
  URL.revokeObjectURL(url);
  return { success: true };
}
