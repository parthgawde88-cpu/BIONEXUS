import React from 'react';
import { Inbox } from 'lucide-react';

// ─── EmptyState ──────────────────────────────────────────────────────────────
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data found',
  description,
  action,
  compact = false,
  className = '',
}) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-8' : 'py-16',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4 border border-slate-200">
        <Icon className="w-8 h-8 text-slate-400" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-5">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
