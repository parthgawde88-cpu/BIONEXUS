import React from 'react';

// ─── Variant & size maps ────────────────────────────────────────────────────
const variants = {
  primary:
    'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 ' +
    'focus:ring-emerald-500 shadow-sm disabled:bg-emerald-400',
  secondary:
    'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 ' +
    'active:bg-slate-100 focus:ring-slate-400 shadow-sm disabled:bg-slate-50',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 ' +
    'focus:ring-red-500 shadow-sm disabled:bg-red-400',
  ghost:
    'text-slate-600 hover:bg-slate-100 active:bg-slate-200 ' +
    'focus:ring-slate-400',
  outline:
    'border border-emerald-600 text-emerald-700 hover:bg-emerald-50 ' +
    'active:bg-emerald-100 focus:ring-emerald-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2.5',
};

// ─── Spinner ────────────────────────────────────────────────────────────────
function Spinner() {
  return (
    <svg
      className="w-4 h-4 animate-spin flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ─── Button ─────────────────────────────────────────────────────────────────
export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  children,
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-150 ' +
    'focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
    'disabled:opacity-60 disabled:cursor-not-allowed select-none';

  return (
    <button
      type={type}
      className={[
        base,
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Spinner />
          {children && <span>{children}</span>}
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          )}
        </>
      )}
    </button>
  );
}
