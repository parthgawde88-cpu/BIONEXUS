import React from 'react';

// ─── Card ────────────────────────────────────────────────────────────────────
const paddings = { none: '', sm: 'p-4', md: 'p-6', lg: 'p-8' };
const shadows  = { none: '', sm: 'shadow-card', md: 'shadow-md' };

export default function Card({
  className = '',
  padding = 'md',
  shadow = 'sm',
  hover = false,
  children,
  ...props
}) {
  return (
    <div
      className={[
        'bg-white rounded-xl border border-slate-200',
        paddings[padding] ?? paddings.md,
        shadows[shadow] ?? shadows.sm,
        hover ? 'transition-shadow duration-200 hover:shadow-card-hover cursor-pointer' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── CardHeader ──────────────────────────────────────────────────────────────
export function CardHeader({ className = '', children }) {
  return (
    <div className={['flex items-center justify-between mb-5', className].join(' ')}>
      {children}
    </div>
  );
}

// ─── CardTitle ───────────────────────────────────────────────────────────────
export function CardTitle({ className = '', children }) {
  return (
    <h3 className={['text-base font-semibold text-slate-900', className].join(' ')}>
      {children}
    </h3>
  );
}

// ─── CardDescription ─────────────────────────────────────────────────────────
export function CardDescription({ className = '', children }) {
  return (
    <p className={['text-sm text-slate-500 mt-1', className].join(' ')}>
      {children}
    </p>
  );
}

// ─── CardFooter ──────────────────────────────────────────────────────────────
export function CardFooter({ className = '', children }) {
  return (
    <div
      className={[
        'flex items-center justify-between pt-4 mt-4 border-t border-slate-100',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
