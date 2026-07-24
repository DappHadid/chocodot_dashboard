import React from 'react';

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    brand: 'bg-sky-100 text-sky-700',
    positive: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-rose-100 text-rose-700',
    indigo: 'bg-indigo-100 text-indigo-700',
  };

  const className = `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant] || variants.default}`;

  return (
    <span className={className}>
      {children}
    </span>
  );
}
