import React from 'react';
import { getCategoryColor, getCategoryLabel } from '../utils/categories';

export default function WorkItemCard({ item, onEdit, onDelete }) {
  return (
    <div
      className="group relative bg-white rounded-lg border border-slate-200 p-2.5 card-hover cursor-pointer hover:border-indigo-200"
      onClick={() => onEdit(item)}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {item.isAchievement && (
              <span className="text-amber-400 text-xs flex-shrink-0 drop-shadow-sm" title="Achievement">
                ★
              </span>
            )}
            <span className="text-sm font-semibold text-slate-800 truncate block">
              {item.title}
            </span>
          </div>
          {item.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-1.5 leading-relaxed">{item.description}</p>
          )}
          <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
            {getCategoryLabel(item.category)}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 flex-shrink-0"
          title="Delete"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
