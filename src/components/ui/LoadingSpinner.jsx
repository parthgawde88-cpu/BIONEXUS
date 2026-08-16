import React from 'react';

const sizes = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-9 h-9',
  lg: 'w-14 h-14',
};

// ─── LoadingSpinner ──────────────────────────────────────────────────────────
export default function LoadingSpinner({
  size = 'md',
  label = 'Loading…',
  showLabel = true,
  className = '',
}) {
  return (
    <div
      className={['flex flex-col items-center justify-center gap-3', className]
        .filter(Boolean)
        .join(' ')}
      role="status"
      aria-label={label}
    >
      <svg
        className={[sizes[size] ?? sizes.md, 'animate-spin text-emerald-600']
          .join(' ')}
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-20"
          cx="12" cy="12" r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      {showLabel && label && (
        <p className="text-sm text-slate-500">{label}</p>
      )}
    </div>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
export function Skeleton({ className = '', rounded = 'md' }) {
  const roundedMap = { sm: 'rounded', md: 'rounded-lg', full: 'rounded-full' };
  return (
    <div
      className={[
        'bg-slate-200 animate-pulse',
        roundedMap[rounded] ?? roundedMap.md,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    />
  );
}

// ─── PageLoader ───────────────────────────────────────────────────────────────
export function PageLoader({ label = 'Loading page…' }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}
