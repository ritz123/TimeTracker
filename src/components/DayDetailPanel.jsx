import React from 'react';
import { formatDayFull, isToday, formatDateKey } from '../utils/dates';
import { getCategoryColor, getCategoryLabel } from '../utils/categories';
import { format } from 'date-fns';

export default function DayDetailPanel({ date, items, isPinned, onEdit, onDelete, onAdd, onPin }) {
  const today = isToday(date);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white border-l border-slate-200">
      {/* Header */}
      <div className={`px-6 py-4 border-b flex items-center justify-between ${
        today ? 'bg-gradient-to-r from-indigo-500 to-violet-500' : 'bg-slate-50 border-slate-200'
      }`}>
        <div>
          <h2 className={`text-lg font-bold ${today ? 'text-white' : 'text-slate-800'}`}>
            {formatDayFull(date)}
          </h2>
          <p className={`text-xs mt-0.5 ${today ? 'text-indigo-200' : 'text-slate-400'}`}>
            {items.length} {items.length === 1 ? 'item' : 'items'}
            {today && ' · Today'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Pin/unpin toggle */}
          <button
            onClick={onPin}
            className={`p-2 rounded-lg transition-colors ${
              today ? 'hover:bg-white/20' : 'hover:bg-slate-200'
            } ${isPinned
              ? (today ? 'text-white bg-white/20' : 'text-indigo-600 bg-indigo-100')
              : (today ? 'text-indigo-200' : 'text-slate-400')
            }`}
            title={isPinned ? 'Unpin (follow hover)' : 'Pin this day'}
          >
            <svg className="w-4 h-4" fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          {/* Add */}
          <button
            onClick={() => onAdd(date)}
            className={`p-2 rounded-lg transition-colors ${
              today
                ? 'hover:bg-white/20 text-indigo-200 hover:text-white'
                : 'hover:bg-indigo-100 text-slate-400 hover:text-indigo-600'
            }`}
            title="Add item to this day"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-5">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-200 mb-4">
              <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm text-slate-400 font-medium">No items for this day</p>
            <button
              onClick={() => onAdd(date)}
              className="mt-4 px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              + Add Work Item
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-200 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => onEdit(item)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {item.isAchievement && (
                        <span className="text-amber-400 text-sm flex-shrink-0 drop-shadow-sm">★</span>
                      )}
                      <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                    </div>

                    {item.description && (
                      <p className="text-sm text-slate-500 leading-relaxed mb-3">{item.description}</p>
                    )}

                    <div className="flex items-center gap-2">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="text-[10px] text-slate-300">
                        {format(new Date(item.updatedAt), 'h:mm a')}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 flex-shrink-0"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={() => onAdd(date)}
              className="w-full py-3 text-sm font-semibold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center justify-center gap-2 border border-dashed border-indigo-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Work Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
