import React, { useState, useRef } from 'react';
import { parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { formatDateKey } from '../utils/dates';
import { generateMarkdownForRange, markdownToHtml } from '../utils/markdown';
import { exportMarkdown } from '../utils/storage';

export default function ExportModal({ items, onClose }) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const [startDate, setStartDate] = useState(formatDateKey(monthStart));
  const [endDate, setEndDate] = useState(formatDateKey(monthEnd));
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

  const fieldClass =
    'w-full px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] bg-[var(--surface)] border border-[var(--form-border)] text-[var(--text)]';

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: 'var(--modal-backdrop)' }}>
      <div
        className="rounded-2xl shadow-2xl w-[720px] max-h-[85vh] flex flex-col overflow-hidden border"
        style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--border)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            borderColor: 'var(--border)',
            backgroundImage: 'var(--gradient-export-header)',
          }}
        >
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Export Report
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
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

        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Date Range
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                From
              </label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={fieldClass} />
            </div>
            <svg className="w-5 h-5 mt-5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="flex-1">
              <label className="block text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                To
              </label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={fieldClass} />
            </div>
          </div>
          {!valid && startDate && endDate && (
            <p className="mt-2 text-xs font-medium text-red-500">End date must be on or after start date.</p>
          )}

          <div className="flex gap-2 mt-3 flex-wrap">
            {[
              { label: 'This week', fn: () => {
                const ws = startOfWeek(new Date(), { weekStartsOn: 1 });
                const we = endOfWeek(new Date(), { weekStartsOn: 1 });
                setStartDate(formatDateKey(ws)); setEndDate(formatDateKey(we));
              }},
              { label: 'Last 7 days', fn: () => {
                const n = new Date();
                const past = new Date(n); past.setDate(past.getDate() - 6);
                setStartDate(formatDateKey(past)); setEndDate(formatDateKey(n));
              }},
              { label: 'Last 30 days', fn: () => {
                const n = new Date();
                const past = new Date(n); past.setDate(past.getDate() - 29);
                setStartDate(formatDateKey(past)); setEndDate(formatDateKey(n));
              }},
              { label: 'This month', fn: () => {
                const n = new Date();
                const ms = new Date(n.getFullYear(), n.getMonth(), 1);
                const me = new Date(n.getFullYear(), n.getMonth() + 1, 0);
                setStartDate(formatDateKey(ms)); setEndDate(formatDateKey(me));
              }},
            ].map((p) => (
              <button
                key={p.label}
                onClick={p.fn}
                type="button"
                className="px-2.5 py-1 text-xs font-medium rounded-full transition-colors"
                style={{
                  backgroundColor: 'var(--modal-preset-bg)',
                  color: 'var(--modal-preset-text)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--modal-preset-hover-bg)';
                  e.currentTarget.style.color = 'var(--modal-preset-hover-text)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--modal-preset-bg)';
                  e.currentTarget.style.color = 'var(--modal-preset-text)';
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ backgroundColor: 'var(--modal-preview-bg)' }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
            Preview
          </p>
          {valid ? (
            <div
              ref={previewRef}
              className="rounded-lg border p-6 text-sm leading-relaxed shadow-sm"
              style={{
                backgroundColor: 'var(--modal-preview-card)',
                borderColor: 'var(--border)',
                color: 'var(--text)',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
              }}
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          ) : (
            <div className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
              Select a valid date range to preview
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
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
            onClick={handleExportMd}
            disabled={!valid}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border"
            style={{
              color: 'var(--text-on-accent)',
              backgroundColor: 'var(--accent-soft)',
              borderColor: 'var(--day-add-bar-border)',
            }}
          >
            Download .md
          </button>
          <button
            onClick={handleExportPdf}
            disabled={!valid || exporting}
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
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
            {exporting ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
