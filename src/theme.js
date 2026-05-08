/** @typedef {'default' | 'dark' | 'warm'} ThemeId */

export const THEME_IDS = /** @type {const} */ (['default', 'dark', 'warm']);

export const THEME_OPTIONS = [
  { id: 'default', label: 'Light', description: 'Cool slate surfaces with indigo accents' },
  { id: 'dark', label: 'Dark', description: 'Low-light slate and violet tones' },
  { id: 'warm', label: 'Warm', description: 'Cream and amber, easy on the eyes' },
];

/** @param {unknown} id */
export function normalizeThemeId(id) {
  return THEME_IDS.includes(/** @type {ThemeId} */ (id)) ? /** @type {ThemeId} */ (id) : 'default';
}

/** @param {ThemeId | string} id */
export function applyTheme(id) {
  const t = normalizeThemeId(id);
  document.documentElement.dataset.theme = t;
  document.documentElement.style.colorScheme = t === 'dark' ? 'dark' : 'light';
}
