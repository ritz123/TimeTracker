import React, { useState, useRef, useEffect } from 'react';
import { THEME_OPTIONS } from '../theme';

export default function ThemePicker({ theme, onThemeChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg transition-colors text-white/90 hover:bg-white/15 hover:text-white text-sm font-medium"
        title="Theme"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
        <span className="hidden sm:inline">Theme</span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-1 z-50 w-64 max-h-[min(70vh,420px)] overflow-y-auto rounded-xl border py-1 shadow-xl"
          style={{
            backgroundColor: 'var(--modal-surface)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-item-hover)',
          }}
          role="listbox"
          aria-label="Choose theme"
        >
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="option"
              aria-selected={theme === opt.id}
              onClick={() => {
                onThemeChange(opt.id);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 text-sm transition-colors"
              style={{
                backgroundColor: theme === opt.id ? 'var(--modal-storage-bg)' : 'transparent',
                color: 'var(--text)',
              }}
              onMouseEnter={(e) => {
                if (theme !== opt.id) e.currentTarget.style.backgroundColor = 'var(--surface-muted)';
              }}
              onMouseLeave={(e) => {
                if (theme !== opt.id) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div className="font-semibold">{opt.label}</div>
              <div className="text-xs mt-0.5 font-normal" style={{ color: 'var(--text-muted)' }}>
                {opt.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
