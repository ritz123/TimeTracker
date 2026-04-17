import { formatDayFull, formatDateKey } from './dates';
import { format, eachDayOfInterval } from 'date-fns';

export function generateMarkdownForRange(items, start, end) {
  const days = eachDayOfInterval({ start, end });
  const rangeLabel = `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  const startKey = formatDateKey(start);
  const endKey = formatDateKey(end);

  const lines = [];
  lines.push(`# Report: ${rangeLabel}`);
  lines.push('');

  const achievements = items.filter((item) => {
    return item.isAchievement && item.date >= startKey && item.date <= endKey;
  });

  if (achievements.length > 0) {
    lines.push('## Achievements');
    lines.push('');
    for (const a of achievements) {
      const desc = a.description ? ` - ${a.description}` : '';
      lines.push(`- **${a.title}**${desc} *(${a.category})*`);
    }
    lines.push('');
  }

  lines.push('## Work Items');
  lines.push('');

  for (const day of days) {
    const dayKey = formatDateKey(day);
    const dayItems = items.filter((item) => item.date === dayKey);

    lines.push(`### ${formatDayFull(day)}`);
    lines.push('');

    if (dayItems.length === 0) {
      lines.push('*(No items)*');
    } else {
      for (const item of dayItems) {
        const desc = item.description ? ` - ${item.description}` : '';
        const star = item.isAchievement ? ' ⭐' : '';
        lines.push(`- ${item.title}${desc} *(${item.category})*${star}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

export function markdownToHtml(md) {
  return md
    .replace(/^# (.+)$/gm, '<h1 style="font-size:22px;font-weight:700;margin:0 0 16px;color:#1e293b;">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:17px;font-weight:700;margin:20px 0 8px;color:#334155;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:14px;font-weight:600;margin:14px 0 6px;color:#475569;">$1</h3>')
    .replace(/^\*\((.+)\)\*$/gm, '<p style="color:#94a3b8;font-style:italic;font-size:13px;margin:2px 0;">$1</p>')
    .replace(/^- (.+)$/gm, '<div style="padding:2px 0 2px 12px;font-size:13px;color:#334155;">• $1</div>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em style="color:#64748b;">$1</em>')
    .replace(/\n/g, '');
}

export function getDefaultFilename(startDate, endDate) {
  return `report-${formatDateKey(startDate)}-to-${formatDateKey(endDate)}`;
}
