import React, { useState, useRef } from 'react';
import { format, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { getWeekRange, formatDateKey } from '../utils/dates';
import { generateMarkdownForRange, markdownToHtml } from '../utils/markdown';
import { exportMarkdown } from '../utils/storage';

export default function ExportModal({ items, weekOffset, onClose }) {
  const { start, end } = getWeekRange(weekOffset);
  const [startDate, setStartDate] = useState(formatDateKey(start));
  const [endDate, setEndDate] = useState(formatDateKey(end));
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef(null);

  const rangeStart = parseISO(startDate);
  const rangeEnd = parseISO(endDate);
  const valid = startDate && endDate && rangeStart <= rangeEnd;

  const md = valid ? generateMarkdownForRange(items, rangeStart, rangeEnd) : '';
  const previewHtml = valid ? markdownToHtml(md) : '';

  const handleExportMd = async () => {
    if (!valid) return;
    const filename = `report-${startDate}-to-${endDate}.md`;
    await exportMarkdown(md, filename);
  };

  const handleExportPdf = async () => {
    if (!valid || !previewRef.current) return;
    setExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const el = previewRef.current;
      await html2pdf()
        .set({
          margin: [12, 16, 12, 16],
          filename: `report-${startDate}-to-${endDate}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(el)
        .save();
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[720px] max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-violet-50">
          <h2 className="text-lg font-bold text-slate-800">Export Report</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Date range */}
        <div className="px-6 py-4 border-b border-slate-100 bg-white">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Date Range</p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              />
            </div>
            <svg className="w-5 h-5 text-slate-400 mt-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
          {!valid && startDate && endDate && (
            <p className="mt-2 text-xs text-red-500 font-medium">End date must be on or after start date.</p>
          )}

          {/* Quick presets */}
          <div className="flex gap-2 mt-3">
            {[
              { label: 'This week', fn: () => { setStartDate(formatDateKey(start)); setEndDate(formatDateKey(end)); } },
              { label: 'Last 7 days', fn: () => {
                const now = new Date();
                const past = new Date(now); past.setDate(past.getDate() - 6);
                setStartDate(formatDateKey(past)); setEndDate(formatDateKey(now));
              }},
              { label: 'Last 30 days', fn: () => {
                const now = new Date();
                const past = new Date(now); past.setDate(past.getDate() - 29);
                setStartDate(formatDateKey(past)); setEndDate(formatDateKey(now));
              }},
              { label: 'This month', fn: () => {
                const now = new Date();
                const ms = new Date(now.getFullYear(), now.getMonth(), 1);
                const me = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                setStartDate(formatDateKey(ms)); setEndDate(formatDateKey(me));
              }},
            ].map((p) => (
              <button
                key={p.label}
                onClick={p.fn}
                type="button"
                className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-y-auto px-6 py-4 bg-slate-50/50">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Preview</p>
          {valid ? (
            <div
              ref={previewRef}
              className="bg-white rounded-lg border border-slate-200 p-6 text-sm leading-relaxed shadow-sm"
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <div className="text-center text-slate-400 py-12 text-sm">
              Select a valid date range to preview
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleExportMd}
            disabled={!valid}
            className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ring-1 ring-indigo-200"
          >
            Download .md
          </button>
          <button
            onClick={handleExportPdf}
            disabled={!valid || exporting}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shadow-indigo-200"
          >
            {exporting ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
