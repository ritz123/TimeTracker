import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { THEME_OPTIONS } from '../theme';

export default function ThemePicker({ theme, onThemeChange }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState(
    /** @type {React.CSSProperties | null} */ (null)
  );

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return undefined;
    }

    if (!triggerRef.current) return undefined;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;

      const rect = trigger.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const margin = 10;
      const gap = 6;
      const panelWidth = Math.min(256, vw - margin * 2);

      let left = rect.right - panelWidth;
      left = Math.max(margin, Math.min(left, vw - panelWidth - margin));

      const spaceBelow = vh - rect.bottom - margin;
      const spaceAbove = rect.top - margin;

      const preferDown = spaceBelow >= spaceAbove;

      /** @type {React.CSSProperties} */
      const next = {
        position: 'fixed',
        left,
        width: panelWidth,
        zIndex: 50,
      };

      if (preferDown) {
        next.top = rect.bottom + gap;
        next.maxHeight = Math.min(420, Math.max(120, spaceBelow - gap));
      } else {
        next.bottom = vh - rect.top + gap;
        next.maxHeight = Math.min(420, Math.max(120, spaceAbove - gap));
      }

      setMenuStyle(next);
    };

    updatePosition();

    const vv = window.visualViewport;
    vv?.addEventListener('resize', updatePosition);
    vv?.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      vv?.removeEventListener('resize', updatePosition);
      vv?.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={triggerRef}
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

      {open && menuStyle && (
        <div
          className="overflow-y-auto overscroll-contain rounded-xl border py-1 shadow-xl"
          style={{
            ...menuStyle,
            backgroundColor: 'var(--modal-surface)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-item-hover)',
            paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom, 0px))',
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
