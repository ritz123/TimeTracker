import {
  startOfWeek, endOfWeek, addWeeks, differenceInWeeks,
  startOfMonth, endOfMonth, addMonths,
  format, eachDayOfInterval, isSameDay, isSameMonth, getDay,
} from 'date-fns';

export function getWeekRange(weekOffset = 0) {
  const base = addWeeks(new Date(), weekOffset);
  const start = startOfWeek(base, { weekStartsOn: 1 });
  const end = endOfWeek(base, { weekStartsOn: 1 });
  return { start, end };
}

export function getWeekDays(weekOffset = 0) {
  const { start, end } = getWeekRange(weekOffset);
  return eachDayOfInterval({ start, end });
}

export function formatWeekLabel(weekOffset = 0) {
  const { start, end } = getWeekRange(weekOffset);
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}

export function formatDayHeader(date) {
  return format(date, 'EEE d');
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
  return { days, monthStart, month: base };
}

export function isSameMonthAs(date, reference) {
  return isSameMonth(date, reference);
}
