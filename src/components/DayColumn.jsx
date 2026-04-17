import React from 'react';
import { formatDayHeader, isToday, getItemsForDay } from '../utils/dates';
import WorkItemCard from './WorkItemCard';

export default function DayColumn({ date, items, onAddItem, onEditItem, onDeleteItem }) {
  const dayItems = getItemsForDay(items, date);
  const today = isToday(date);

  return (
    <div
      className={`flex flex-col min-h-0 rounded-xl border transition-shadow ${
        today
          ? 'border-indigo-300 bg-indigo-50/40 shadow-md shadow-indigo-100'
          : 'border-slate-200 bg-white/80 backdrop-blur-sm hover:shadow-sm'
      }`}
    >
      <div
        className={`px-3 py-2.5 text-center text-sm font-bold border-b rounded-t-xl ${
          today
            ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-indigo-300'
            : 'bg-slate-50/80 text-slate-500 border-slate-200'
        }`}
      >
        {formatDayHeader(date)}
        {today && (
          <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-white rounded-full align-middle animate-pulse" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {dayItems.map((item) => (
          <WorkItemCard
            key={item.id}
            item={item}
            onEdit={onEditItem}
            onDelete={onDeleteItem}
          />
        ))}
      </div>

      <div className="p-1.5 border-t border-slate-100">
        <button
          onClick={() => onAddItem(date)}
          className="w-full py-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          + Add
        </button>
      </div>
    </div>
  );
}
