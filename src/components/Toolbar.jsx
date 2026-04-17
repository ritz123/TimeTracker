import React from 'react';
import { formatWeekLabel } from '../utils/dates';

export default function Toolbar({ weekOffset, onPrevWeek, onNextWeek, onToday, onExport }) {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20">
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrevWeek}
          className="p-2 rounded-lg hover:bg-white/15 transition-colors text-indigo-100 hover:text-white"
          title="Previous week"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={onToday}
          className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-white/15 transition-colors text-indigo-100 hover:text-white"
        >
          Today
        </button>

        <button
          onClick={onNextWeek}
          className="p-2 rounded-lg hover:bg-white/15 transition-colors text-indigo-100 hover:text-white"
          title="Next week"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <h1 className="text-lg font-semibold text-white tracking-tight">
        Week of {formatWeekLabel(weekOffset)}
      </h1>

      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 bg-white rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Report
      </button>
    </div>
  );
}
