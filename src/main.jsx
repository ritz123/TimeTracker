import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './theme.css';
import { applyTheme, normalizeThemeId } from './theme';

try {
  const raw = localStorage.getItem('weekly-tracker-prefs');
  if (raw) {
    const p = JSON.parse(raw);
    applyTheme(normalizeThemeId(p.theme));
  }
} catch {
  /* ignore */
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
