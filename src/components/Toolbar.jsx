import React from 'react';
import { formatMonthYear, getMonthGrid } from '../utils/dates';
import { APP_NAME } from '../utils/appInfo';
import ThemePicker from './ThemePicker';

export default function Toolbar({
  monthOffset,
  theme,
  onThemeChange,
  onPrevMonth,
  onNextMonth,
  onToday,
  onExport,
  onSettings,
}) {
  const { month } = getMonthGrid(monthOffset);

  return (
    <div
      className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between px-3 py-2.5 sm:px-6 sm:py-3 shadow-lg min-w-0 md:gap-4"
      style={{
        backgroundImage: 'var(--gradient-toolbar)',
        boxShadow: 'var(--shadow-toolbar)',
      }}
    >
      {/* App name + nav */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 shrink">
        <div className="flex items-center gap-2 mr-1 sm:mr-2 shrink-0">
          <svg className="w-5 h-5 text-white/90" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
            <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-bold text-white tracking-wide truncate max-w-[9rem] sm:max-w-none">
            {APP_NAME}
          </span>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 border-l border-white/20 pl-2 sm:pl-4 min-w-0">
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-lg transition-colors text-white/90 hover:bg-white/15 hover:text-white"
            title="Previous month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={onToday}
            className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors text-white/90 hover:bg-white/15 hover:text-white"
          >
            Today
          </button>

          <button
            onClick={onNextMonth}
            className="p-2 rounded-lg transition-colors text-white/90 hover:bg-white/15 hover:text-white"
            title="Next month"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex justify-center md:flex-1 md:min-w-0 md:px-2">
        <h1 className="text-base sm:text-lg font-semibold text-white tracking-tight truncate text-center">
          {formatMonthYear(month)}
        </h1>
      </div>

      <div className="flex items-center justify-center md:justify-end gap-1.5 sm:gap-2 shrink-0">
        <ThemePicker theme={theme} onThemeChange={onThemeChange} />
        <button
          onClick={onSettings}
          className="p-2 rounded-lg transition-colors text-white/90 hover:bg-white/15 hover:text-white"
          title="Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button
          onClick={onExport}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-4 text-sm font-medium rounded-lg transition-colors shadow-sm bg-[var(--surface)] text-[var(--text-on-accent)] hover:bg-[var(--accent-soft-hover)]"
          title="Export"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
}
