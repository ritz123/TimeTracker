import React, { useState, useEffect } from 'react';
import { addDays, parseISO } from 'date-fns';
import { formatDateKey, formatDayFull } from '../utils/dates';

export default function CopyToDateModal({ item, onClose, onConfirm }) {
  const [targetKey, setTargetKey] = useState(() =>
    formatDateKey(addDays(parseISO(item.date), 1))
  );

  useEffect(() => {
    setTargetKey(formatDateKey(addDays(parseISO(item.date), 1)));
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetKey) return;
    onConfirm(targetKey);
  };

  const targetPreview = (() => {
    try {
      return formatDayFull(parseISO(targetKey));
    } catch {
      return '';
    }
  })();

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm p-4"
      style={{ backgroundColor: 'var(--modal-backdrop)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="copy-to-date-title"
      onClick={onClose}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden border"
        style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-5 py-4 border-b flex items-start justify-between gap-3"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="min-w-0">
            <h2 id="copy-to-date-title" className="text-base font-bold" style={{ color: 'var(--text)' }}>
              Copy to another day
            </h2>
            <p className="text-sm mt-1 truncate" style={{ color: 'var(--text-muted)' }} title={item.title}>
              {item.title}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg shrink-0"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label htmlFor="copy-target-date" className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Target date
            </label>
            <input
              id="copy-target-date"
              type="date"
              value={targetKey}
              onChange={(e) => setTargetKey(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] bg-[var(--surface)] border border-[var(--form-border)] text-[var(--text)]"
            />
            {targetPreview && (
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                {targetPreview}
              </p>
            )}
          </div>

          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Creates a new work item with the same title, description, category, and achievement flag. The original stays on{' '}
            {formatDayFull(parseISO(item.date))}.
          </p>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-lg border"
              style={{
                borderColor: 'var(--border)',
                color: 'var(--text)',
                backgroundColor: 'var(--surface)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold rounded-lg text-white"
              style={{ backgroundImage: 'var(--gradient-accent-btn)' }}
            >
              Copy item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
