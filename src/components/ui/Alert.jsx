import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from 'lucide-react';

// ─── Variant map ─────────────────────────────────────────────────────────────
const variants = {
  success: {
    wrapper:   'bg-emerald-50 border-emerald-200 text-emerald-900',
    icon:      CheckCircle2,
    iconColor: 'text-emerald-500',
  },
  warning: {
    wrapper:   'bg-amber-50 border-amber-200 text-amber-900',
    icon:      AlertTriangle,
    iconColor: 'text-amber-500',
  },
  danger: {
    wrapper:   'bg-red-50 border-red-200 text-red-900',
    icon:      XCircle,
    iconColor: 'text-red-500',
  },
  info: {
    wrapper:   'bg-blue-50 border-blue-200 text-blue-900',
    icon:      Info,
    iconColor: 'text-blue-500',
  },
  neutral: {
    wrapper:   'bg-slate-50 border-slate-200 text-slate-700',
    icon:      Info,
    iconColor: 'text-slate-400',
  },
};

// ─── Alert ───────────────────────────────────────────────────────────────────
export default function Alert({
  variant = 'info',
  title,
  onDismiss,
  showIcon = true,
  className = '',
  children,
}) {
  const { wrapper, icon: Icon, iconColor } =
    variants[variant] ?? variants.info;

  return (
    <div
      className={[
        'flex gap-3 p-4 rounded-lg border text-sm',
        wrapper,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="alert"
      aria-live="polite"
    >
      {showIcon && (
        <Icon
          className={['w-5 h-5 flex-shrink-0 mt-0.5', iconColor].join(' ')}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold mb-1 leading-tight">{title}</p>
        )}
        <div className="leading-relaxed">{children}</div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="flex-shrink-0 ml-1 opacity-50 hover:opacity-100 transition-opacity rounded focus:outline-none focus:ring-2 focus:ring-current"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
