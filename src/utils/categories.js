export const CATEGORIES = [
  { id: 'development', label: 'Development', color: 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' },
  { id: 'code-review', label: 'Code Review', color: 'bg-violet-100 text-violet-700 ring-1 ring-violet-200' },
  { id: 'meetings', label: 'Meetings', color: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200' },
  { id: 'devops', label: 'DevOps', color: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200' },
  { id: 'documentation', label: 'Documentation', color: 'bg-cyan-100 text-cyan-700 ring-1 ring-cyan-200' },
  { id: 'other', label: 'Other', color: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200' },
];

export function getCategoryColor(categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return cat ? cat.color : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
}

export function getCategoryLabel(categoryId) {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return cat ? cat.label : categoryId;
}
