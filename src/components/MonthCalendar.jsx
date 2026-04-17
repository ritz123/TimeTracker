import React from 'react';
import { format, isSameDay } from 'date-fns';
import { getMonthGrid, isToday, isInCurrentWeek, isSameMonthAs, formatDateKey } from '../utils/dates';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export default function MonthCalendar({ monthOffset, items, focusedDate, hoveredDate, onDayClick, onDayHover }) {
  const { weeks, month } = getMonthGrid(monthOffset);

  const itemCounts = {};
  const achievementDates = new Set();
  for (const item of items) {
    itemCounts[item.date] = (itemCounts[item.date] || 0) + 1;
    if (item.isAchievement) achievementDates.add(item.date);
  }

  return (
    <div className="w-[340px] flex-shrink-0 flex flex-col p-4 min-h-0">
      {/* Weekday headers */}
      <div className="grid grid-cols-[32px_repeat(7,1fr)] gap-px mb-1">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center py-1.5">
          Wk
        </div>
        {WEEKDAYS.map((d) => (
          <div key={d} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center py-1.5">
            {d}
          </div>
        ))}
      </div>

      {/* Week rows — outer border wraps the entire grid */}
      <div className="flex-1 grid auto-rows-fr border border-slate-200 rounded-xl overflow-hidden">
        {weeks.map((week) => {
          const currentWeekRow = week.days.some(isInCurrentWeek);

          return (
            <div
              key={week.weekNumber + '-' + formatDateKey(week.days[0])}
              className={`grid grid-cols-[32px_repeat(7,1fr)] ${
                currentWeekRow ? 'bg-indigo-50/40' : ''
              }`}
            >
              <div className={`flex items-center justify-center text-[10px] font-bold border-r border-b border-slate-200 ${
                currentWeekRow ? 'bg-indigo-500 text-white' : 'bg-slate-50 text-slate-400'
              }`}>
                {week.weekNumber}
              </div>

              {week.days.map((date) => {
                const key = formatDateKey(date);
                const inMonth = isSameMonthAs(date, month);
                const today = isToday(date);
                const isFocused = focusedDate && isSameDay(date, focusedDate);
                const isHovered = hoveredDate && isSameDay(date, hoveredDate);
                const count = itemCounts[key] || 0;
                const hasAchievement = achievementDates.has(key);

                return (
                  <button
                    key={key}
                    onClick={() => onDayClick(date)}
                    onMouseEnter={() => onDayHover(date)}
                    className={`
                      relative flex flex-col items-center justify-center py-2 transition-all outline-none
                      border-r border-b border-slate-200 last:border-r-0
                      ${!inMonth ? 'bg-slate-50/50 text-slate-300' : 'bg-white text-slate-700 hover:bg-indigo-50/50'}
                      ${isFocused ? 'bg-indigo-100 ring-2 ring-inset ring-indigo-500 z-10' : ''}
                      ${isHovered && !isFocused ? 'bg-indigo-50' : ''}
                      ${today && !isFocused ? 'bg-indigo-50/70' : ''}
                    `}
                  >
                    <span className={`
                      inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-full
                      ${today ? 'bg-indigo-500 text-white' : ''}
                      ${isFocused && !today ? 'bg-indigo-500 text-white' : ''}
                    `}>
                      {format(date, 'd')}
                    </span>

                    {/* Dot indicators */}
                    {count > 0 && (
                      <div className="flex items-center gap-0.5 mt-1">
                        {hasAchievement && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                        <span className={`w-1.5 h-1.5 rounded-full ${count >= 3 ? 'bg-indigo-500' : count >= 2 ? 'bg-indigo-400' : 'bg-indigo-300'}`} />
                        {count > 1 && (
                          <span className="text-[8px] font-bold text-slate-400">{count}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
