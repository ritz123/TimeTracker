import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { getMonthGrid, isToday, isSameMonthAs, formatDateKey, getWeekRange, formatDayFull } from '../utils/dates';
import { getCategoryColor, getCategoryLabel } from '../utils/categories';

export default function MonthPicker({ weekOffset, items, onDayClick }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const { days, month } = getMonthGrid(monthOffset);
  const { start: weekStart, end: weekEnd } = getWeekRange(weekOffset);

  const itemsByDate = {};
  for (const item of items) {
    (itemsByDate[item.date] ||= []).push(item);
  }
  const itemDates = new Set(Object.keys(itemsByDate));
  const weekdays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  function isInCurrentWeek(date) {
    return date >= weekStart && date <= weekEnd;
  }

  function handleDayClick(date) {
    setSelectedDay((prev) => (prev && isSameDay(prev, date) ? null : date));
    onDayClick(date);
  }

  const selectedKey = selectedDay ? formatDateKey(selectedDay) : null;
  const selectedItems = selectedKey ? (itemsByDate[selectedKey] || []) : [];

  return (
    <div className="w-72 flex-shrink-0 border-r border-slate-200 bg-white/90 backdrop-blur-sm p-4 overflow-y-auto flex flex-col">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setMonthOffset((m) => m - 1)}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-bold text-slate-800">{format(month, 'MMMM yyyy')}</span>
        <button
          onClick={() => setMonthOffset((m) => m + 1)}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekdays.map((d) => (
          <div key={d} className="text-[10px] font-bold text-slate-400 text-center py-1 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((date) => {
          const key = formatDateKey(date);
          const inMonth = isSameMonthAs(date, month);
          const today = isToday(date);
          const inWeek = isInCurrentWeek(date);
          const hasItems = itemDates.has(key);
          const isSelected = selectedDay && isSameDay(date, selectedDay);

          return (
            <button
              key={key}
              onClick={() => handleDayClick(date)}
              className={`
                relative flex flex-col items-center justify-center h-9 rounded-lg text-xs font-medium transition-all
                ${!inMonth ? 'text-slate-300' : 'text-slate-700'}
                ${isSelected ? 'bg-indigo-500 text-white font-bold shadow-sm' : inWeek ? 'bg-indigo-100 text-indigo-700 font-bold' : 'hover:bg-slate-100'}
                ${today && !isSelected ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}
              `}
            >
              {format(date, 'd')}
              {hasItems && (
                <span className={`absolute bottom-0.5 day-dot ${isSelected ? 'bg-white' : inWeek ? 'bg-indigo-500' : 'bg-emerald-400'}`} />
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setMonthOffset(0)}
        className="w-full mt-3 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
      >
        Back to this month
      </button>

      {/* Selected day detail panel */}
      {selectedDay && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-700">{formatDayFull(selectedDay)}</h3>
            <button
              onClick={() => setSelectedDay(null)}
              className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {selectedItems.length === 0 ? (
            <p className="text-xs text-slate-400 italic py-2">No items for this day</p>
          ) : (
            <div className="space-y-1.5">
              {selectedItems.map((item) => (
                <div key={item.id} className="bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {item.isAchievement && (
                      <span className="text-amber-400 text-[10px] flex-shrink-0">★</span>
                    )}
                    <span className="text-xs font-semibold text-slate-800 truncate">{item.title}</span>
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{item.description}</p>
                  )}
                  <span className={`inline-block mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
                    {getCategoryLabel(item.category)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
