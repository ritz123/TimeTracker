import {
  startOfWeek, endOfWeek, addWeeks, differenceInWeeks,
  startOfMonth, endOfMonth, addMonths, differenceInMonths,
  format, eachDayOfInterval, isSameDay, isSameMonth, getISOWeek,
} from 'date-fns';

export function getWeekRange(weekOffset = 0) {
  const base = addWeeks(new Date(), weekOffset);
  const start = startOfWeek(base, { weekStartsOn: 1 });
  const end = endOfWeek(base, { weekStartsOn: 1 });
  return { start, end };
}

export function formatDayFull(date) {
  return format(date, 'EEEE, MMM d');
}

export function formatDateKey(date) {
  return format(date, 'yyyy-MM-dd');
}

export function getItemsForDay(items, date) {
  const key = formatDateKey(date);
  return items.filter((item) => item.date === key);
}

export function isToday(date) {
  return isSameDay(date, new Date());
}

export function isInCurrentWeek(date) {
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  return date >= weekStart && date <= weekEnd;
}

export function weekOffsetForDate(date) {
  const todayWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const targetWeekStart = startOfWeek(date, { weekStartsOn: 1 });
  return differenceInWeeks(targetWeekStart, todayWeekStart);
}

export function getMonthGrid(monthOffset = 0) {
  const base = addMonths(new Date(), monthOffset);
  const monthStart = startOfMonth(base);
  const monthEnd = endOfMonth(base);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    const weekDays = days.slice(i, i + 7);
    weeks.push({
      weekNumber: getISOWeek(weekDays[0]),
      days: weekDays,
    });
  }

  return { weeks, month: base };
}

export function isSameMonthAs(date, reference) {
  return isSameMonth(date, reference);
}

export function formatMonthYear(date) {
  return format(date, 'MMMM yyyy');
}

/** Month offset for `getMonthGrid` so the calendar shows the month containing `date`. */
export function monthOffsetForDate(date) {
  const ref = new Date();
  return differenceInMonths(startOfMonth(date), startOfMonth(ref));
}
