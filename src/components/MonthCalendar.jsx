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
    <div className="w-full min-w-0 shrink-0 md:w-[340px] md:flex-shrink-0 flex flex-col p-3 sm:p-4 min-h-0 max-h-[48dvh] overflow-y-auto overscroll-contain md:max-h-none md:overflow-y-visible">
      <div className="grid grid-cols-[32px_repeat(7,1fr)] gap-px mb-1">
        <div
          className="text-[9px] font-bold uppercase tracking-wider text-center py-1.5"
          style={{ color: 'var(--cal-header)' }}
        >
          Wk
        </div>
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-[10px] font-bold uppercase tracking-wider text-center py-1.5"
            style={{ color: 'var(--cal-header)' }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        className="flex-1 grid auto-rows-fr border rounded-xl overflow-hidden"
        style={{ borderColor: 'var(--border)' }}
      >
        {weeks.map((week) => {
          const currentWeekRow = week.days.some(isInCurrentWeek);

          return (
            <div
              key={week.weekNumber + '-' + formatDateKey(week.days[0])}
              className="grid grid-cols-[32px_repeat(7,1fr)]"
              style={currentWeekRow ? { backgroundColor: 'var(--cal-week-row)' } : undefined}
            >
              <div
                className="flex items-center justify-center text-[10px] font-bold border-r border-b"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: currentWeekRow ? 'var(--cal-wk-active-bg)' : 'var(--cal-wk-inactive-bg)',
                  color: currentWeekRow ? 'var(--cal-wk-active-fg)' : 'var(--cal-wk-inactive-fg)',
                }}
              >
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

                let bg = inMonth ? 'var(--cal-cell-in-bg)' : 'var(--cal-cell-out-bg)';
                let fg = inMonth ? 'var(--cal-cell-in-text)' : 'var(--cal-cell-out-text)';
                if (isFocused) {
                  bg = 'var(--cal-focus-bg)';
                } else if (isHovered) {
                  bg = 'var(--cal-hover)';
                } else if (today && !isFocused) {
                  bg = 'var(--cal-today-cell)';
                }

                return (
                  <button
                    key={key}
                    onClick={() => onDayClick(date)}
                    onMouseEnter={() => onDayHover(date)}
                    className="relative flex flex-col items-center justify-center py-2 transition-all outline-none border-r border-b last:border-r-0"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: bg,
                      color: fg,
                      boxShadow: isFocused ? `inset 0 0 0 2px var(--cal-focus-ring)` : undefined,
                      zIndex: isFocused ? 10 : undefined,
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-full"
                      style={
                        today || (isFocused && !today)
                          ? {
                              backgroundColor: 'var(--cal-day-today-bg)',
                              color: 'var(--cal-day-today-fg)',
                            }
                          : undefined
                      }
                    >
                      {format(date, 'd')}
                    </span>

                    {count > 0 && (
                      <div className="flex items-center gap-0.5 mt-1">
                        {hasAchievement && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor:
                              count >= 3 ? 'var(--cal-dot-3)' : count >= 2 ? 'var(--cal-dot-2)' : 'var(--cal-dot-1)',
                          }}
                        />
                        {count > 1 && (
                          <span className="text-[8px] font-bold" style={{ color: 'var(--cal-header)' }}>
                            {count}
                          </span>
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
