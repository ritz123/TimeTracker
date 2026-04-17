import React from 'react';
import { getWeekDays } from '../utils/dates';
import DayColumn from './DayColumn';

export default function WeekCalendar({ weekOffset, items, onAddItem, onEditItem, onDeleteItem }) {
  const days = getWeekDays(weekOffset);

  return (
    <div className="flex-1 grid grid-cols-7 gap-3 p-4 min-h-0 overflow-hidden">
      {days.map((date) => (
        <DayColumn
          key={date.toISOString()}
          date={date}
          items={items}
          onAddItem={onAddItem}
          onEditItem={onEditItem}
          onDeleteItem={onDeleteItem}
        />
      ))}
    </div>
  );
}
