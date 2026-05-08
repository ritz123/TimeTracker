import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES } from '../utils/categories';
import { formatDayFull } from '../utils/dates';
import { parseISO } from 'date-fns';

const EMPTY_FORM = {
  title: '',
  description: '',
  category: 'development',
  isAchievement: false,
};

export default function ItemForm({ editingItem, selectedDate, onSave, onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const titleRef = useRef(null);

  useEffect(() => {
    if (editingItem) {
      setForm({
        title: editingItem.title,
        description: editingItem.description || '',
        category: editingItem.category,
        isAchievement: editingItem.isAchievement || false,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setTimeout(() => titleRef.current?.focus(), 50);
  }, [editingItem, selectedDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });
  };

  const dateLabel = editingItem
    ? formatDayFull(parseISO(editingItem.date))
    : selectedDate
      ? formatDayFull(selectedDate)
      : '';

  const isOpen = editingItem || selectedDate;
  if (!isOpen) return null;

  const inputClass =
    'w-full px-3 py-2.5 text-base md:text-sm rounded-lg focus:outline-none focus:ring-2 resize-none bg-[var(--surface)]';
  const inputStyle = {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--form-border)',
    color: 'var(--text)',
    boxShadow: '0 0 0 0 transparent',
  };

  return (
    <>
      {/* Mobile: tap outside to close + lift sheet above footer chrome */}
      <button
        type="button"
        className="md:hidden fixed inset-0 z-[44] bg-[var(--modal-backdrop)]"
        onClick={onCancel}
        aria-label="Close form"
      />

      <div
        className="
          flex-1 flex flex-col min-h-0 overflow-hidden
          border-t backdrop-blur-sm
          max-md:fixed max-md:left-0 max-md:right-0 max-md:bottom-0 max-md:z-[45]
          max-md:max-h-[min(92dvh,100dvh)] max-md:flex max-md:flex-col max-md:rounded-t-2xl max-md:border-x max-md:shadow-2xl
          max-md:bg-[var(--surface-glass)]
          md:border-t-0 md:backdrop-blur-none md:bg-transparent md:shadow-none
        "
        style={{
          borderColor: 'var(--form-border)',
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 px-4 py-4 md:px-6 md:py-4 overflow-y-auto overscroll-contain max-md:pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
        >
          <div className="flex items-center justify-between mb-3 shrink-0">
            <h2 className="text-base font-bold pr-2" style={{ color: 'var(--text)' }}>
              {editingItem ? 'Edit Work Item' : 'Add Work Item'}
              {dateLabel && (
                <span className="ml-2 text-sm font-normal block sm:inline" style={{ color: 'var(--text-muted)' }}>
                  — {dateLabel}
                </span>
              )}
            </h2>
            <button
              type="button"
              onClick={onCancel}
              className="p-1.5 rounded-lg transition-colors shrink-0"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
                e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-3 flex-1 min-h-0">
            <div className="flex flex-row flex-wrap items-center gap-3 shrink-0">
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={`${inputClass} focus:ring-[var(--accent-ring)] flex-1 min-w-[10rem] md:max-w-xs`}
                style={inputStyle}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-2.5 cursor-pointer shrink-0 py-1">
                <input
                  type="checkbox"
                  checked={form.isAchievement}
                  onChange={(e) => setForm((f) => ({ ...f, isAchievement: e.target.checked }))}
                  className="w-5 h-5 md:w-4 md:h-4 rounded border-[var(--form-border)] shrink-0"
                  style={{ accentColor: 'var(--accent)' }}
                />
                <span className="text-sm whitespace-nowrap" style={{ color: 'var(--text)' }}>
                  Mark as Achievement
                </span>
              </label>
            </div>

            <input
              ref={titleRef}
              type="text"
              placeholder="What did you work on?"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={`${inputClass} focus:ring-[var(--accent-ring)] shrink-0`}
              style={inputStyle}
            />
            <textarea
              placeholder="Details (optional)"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className={`${inputClass} focus:ring-[var(--accent-ring)] min-h-[14rem] md:min-h-0 flex-1`}
              style={inputStyle}
            />
          </div>

          <div
            className="flex justify-end gap-2 mt-4 shrink-0 pt-1 max-md:border-t md:border-t md:pt-4"
            style={{ borderColor: 'var(--form-border)' }}
          >
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 md:py-2 text-sm font-medium rounded-lg transition-colors"
              style={{
                color: 'var(--form-secondary-text)',
                backgroundColor: 'var(--form-secondary-bg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--form-secondary-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--form-secondary-bg)';
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.title.trim()}
              className="px-4 py-2.5 md:py-2 text-sm font-medium text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundImage: 'var(--gradient-accent-btn)',
                boxShadow: 'var(--shadow-accent-btn)',
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundImage = 'var(--gradient-accent-btn-hover)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundImage = 'var(--gradient-accent-btn)';
              }}
            >
              {editingItem ? 'Update' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
