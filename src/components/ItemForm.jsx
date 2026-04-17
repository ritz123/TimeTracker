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

  return (
    <div className="border-t border-slate-200 bg-white/90 backdrop-blur-sm shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)]">
      <form onSubmit={handleSubmit} className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800">
            {editingItem ? 'Edit Work Item' : 'Add Work Item'}
            {dateLabel && (
              <span className="ml-2 text-sm font-normal text-slate-400">— {dateLabel}</span>
            )}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-[1fr_200px] gap-4 items-start">
          <div className="space-y-3">
            <input
              ref={titleRef}
              type="text"
              placeholder="What did you work on?"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 bg-white"
            />
            <textarea
              placeholder="Details (optional)"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 resize-none bg-white"
            />
          </div>

          <div className="space-y-3">
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isAchievement}
                onChange={(e) => setForm((f) => ({ ...f, isAchievement: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700">Mark as Achievement</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!form.title.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
          >
            {editingItem ? 'Update' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
