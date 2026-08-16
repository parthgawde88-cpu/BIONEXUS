import React from 'react';

// ─── Variant map ─────────────────────────────────────────────────────────────
const variants = {
  success: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot:   'bg-emerald-500',
  },
  warning: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot:   'bg-amber-500',
  },
  danger: {
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot:   'bg-red-500',
  },
  info: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot:   'bg-blue-500',
  },
  neutral: {
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot:   'bg-slate-400',
  },
  purple: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    dot:   'bg-purple-500',
  },
  teal: {
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    dot:   'bg-teal-500',
  },
};

const sizes = {
  sm: 'text-[10px] px-1.5 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
};

// ─── Badge ───────────────────────────────────────────────────────────────────
export default function Badge({
  variant = 'neutral',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
  children,
}) {
  const v = variants[variant] ?? variants.neutral;
  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full border',
        v.badge,
        sizes[size] ?? sizes.md,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {dot && (
        <span
          className={[
            'w-1.5 h-1.5 rounded-full flex-shrink-0',
            v.dot,
            pulse ? 'animate-pulse' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
