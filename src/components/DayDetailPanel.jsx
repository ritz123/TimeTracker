import React from 'react';
import { formatDayFull, isToday } from '../utils/dates';
import { getCategoryColor, getCategoryLabel } from '../utils/categories';
import { format } from 'date-fns';
import ItemForm from './ItemForm';

export default function DayDetailPanel({
  date,
  items,
  isPinned,
  onEdit,
  onDelete,
  onAdd,
  onPin,
  onCopyToAnotherDay,
  editingItem,
  selectedDate,
  onSave,
  onCancel,
}) {
  const today = isToday(date);
  const formOpen = !!(editingItem || selectedDate);

  if (formOpen) {
    return (
      <div
        className="flex-1 flex flex-col overflow-hidden min-h-0 min-w-0 border-t md:border-t-0 md:border-l"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: 'var(--border)',
        }}
      >
        <ItemForm
          editingItem={editingItem}
          selectedDate={selectedDate}
          onSave={onSave}
          onCancel={onCancel}
          onCopyToAnotherDay={onCopyToAnotherDay}
        />
      </div>
    );
  }

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden min-w-0 border-t md:border-t-0 md:border-l"
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{
          backgroundImage: today ? 'var(--gradient-day-header-today)' : undefined,
          backgroundColor: today ? undefined : 'var(--day-header-bg)',
          borderColor: 'var(--day-header-border)',
        }}
      >
        <div>
          <h2
            className="text-lg font-bold"
            style={{ color: today ? 'var(--text-inverse)' : 'var(--day-header-text)' }}
          >
            {formatDayFull(date)}
          </h2>
          <p
            className="text-xs mt-0.5"
            style={{ color: today ? 'var(--text-inverse-muted)' : 'var(--day-header-sub)' }}
          >
            {items.length} {items.length === 1 ? 'item' : 'items'}
            {today && ' · Today'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onPin}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: isPinned ? (today ? 'rgba(255,255,255,0.2)' : 'var(--day-pin-active-bg)') : undefined,
              color: isPinned
                ? (today ? 'var(--text-inverse)' : 'var(--day-pin-active)')
                : (today ? 'var(--text-inverse-muted)' : 'var(--day-pin-muted)'),
            }}
            onMouseEnter={(e) => {
              if (!isPinned) e.currentTarget.style.backgroundColor = today ? 'rgba(255,255,255,0.2)' : 'var(--day-pin-hover-bg)';
            }}
            onMouseLeave={(e) => {
              if (!isPinned) e.currentTarget.style.backgroundColor = 'transparent';
            }}
            title={isPinned ? 'Unpin (follow hover)' : 'Pin this day'}
          >
            <svg className="w-4 h-4" fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>

          <button
            onClick={() => onAdd(date)}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: today ? 'var(--text-inverse-muted)' : 'var(--day-add-muted)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = today ? 'rgba(255,255,255,0.2)' : 'var(--day-add-hover-bg)';
              e.currentTarget.style.color = today ? 'var(--text-inverse)' : 'var(--day-add-hover-fg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = today ? 'var(--text-inverse-muted)' : 'var(--day-add-muted)';
            }}
            title="Add item to this day"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4" style={{ color: 'var(--day-empty-icon)' }}>
              <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
              No items for this day
            </p>
            <button
              onClick={() => onAdd(date)}
              className="mt-4 px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
              style={{
                color: 'var(--day-add-bar-text)',
                backgroundColor: 'var(--accent-soft)',
              }}
            >
              + Add Work Item
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl border p-4 transition-all cursor-pointer hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--day-card-bg)',
                  borderColor: 'var(--day-card-border)',
                  boxShadow: 'none',
                }}
                onClick={() => onEdit(item)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--day-card-hover-border)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-item-hover)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--day-card-border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {item.isAchievement && (
                        <span className="text-amber-400 text-sm flex-shrink-0 drop-shadow-sm">★</span>
                      )}
                      <h3 className="text-sm font-bold" style={{ color: 'var(--day-card-title)' }}>
                        {item.title}
                      </h3>
                    </div>

                    {item.description && (
                      <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--day-card-desc)' }}>
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
                        {getCategoryLabel(item.category)}
                      </span>
                      <span className="text-[10px]" style={{ color: 'var(--day-meta)' }}>
                        {format(new Date(item.updatedAt), 'h:mm a')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyToAnotherDay?.(item);
                      }}
                      className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1.5 rounded-lg"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--day-delete-hover-bg)';
                        e.currentTarget.style.color = 'var(--day-add-hover-fg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                      title="Copy to another day"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-1.5 rounded-lg"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--day-delete-hover-bg)';
                        e.currentTarget.style.color = 'var(--day-delete-hover-fg)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => onAdd(date)}
              className="w-full py-3 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 border border-dashed"
              style={{
                color: 'var(--day-add-bar-text)',
                backgroundColor: 'var(--day-add-bar)',
                borderColor: 'var(--day-add-bar-border)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--day-add-bar-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--day-add-bar)';
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Work Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
