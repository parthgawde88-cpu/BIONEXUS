import React, { forwardRef } from 'react';

// ─── Shared ──────────────────────────────────────────────────────────────────
function FieldWrapper({ label, error, hint, required, children }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
          {required && (
            <span className="text-red-500 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

const baseInput =
  'w-full px-3 py-2.5 rounded-lg border bg-white text-slate-900 text-sm ' +
  'placeholder-slate-400 transition-all duration-150 ' +
  'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ' +
  'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed';

const stateClass = (error) =>
  error
    ? 'border-red-400 hover:border-red-400 focus:ring-red-500 focus:border-red-500'
    : 'border-slate-300 hover:border-slate-400';

// ─── Input ───────────────────────────────────────────────────────────────────
export const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    required = false,
    className = '',
    prefix,
    suffix,
    ...props
  },
  ref
) {
  const hasAdornment = prefix || suffix;

  const inputEl = (
    <input
      ref={ref}
      className={[
        baseInput,
        stateClass(error),
        prefix ? 'pl-10' : '',
        suffix ? 'pr-10' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-invalid={!!error}
      {...props}
    />
  );

  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      {hasAdornment ? (
        <div className="relative">
          {prefix && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {prefix}
            </div>
          )}
          {inputEl}
          {suffix && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {suffix}
            </div>
          )}
        </div>
      ) : (
        inputEl
      )}
    </FieldWrapper>
  );
});

// ─── Select ──────────────────────────────────────────────────────────────────
export const Select = forwardRef(function Select(
  { label, error, hint, required = false, className = '', children, ...props },
  ref
) {
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      <div className="relative">
        <select
          ref={ref}
          className={[
            baseInput,
            stateClass(error),
            'appearance-none pr-9 cursor-pointer',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>
        {/* Chevron icon */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </FieldWrapper>
  );
});

// ─── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = forwardRef(function Textarea(
  { label, error, hint, required = false, className = '', rows = 4, ...props },
  ref
) {
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required}>
      <textarea
        ref={ref}
        rows={rows}
        className={[
          baseInput,
          stateClass(error),
          'resize-y',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={!!error}
        {...props}
      />
    </FieldWrapper>
  );
});
