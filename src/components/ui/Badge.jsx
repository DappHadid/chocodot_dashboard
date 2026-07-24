import React from 'react';

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-gray-50 text-gray-700 border border-gray-200',
    brand: 'bg-sky-50 text-sky-700 border border-sky-200',
    positive: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200',
  };

  const className = `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant] || variants.default}`;

  return (
    <span className={className}>
      {children}
    </span>
  );
}
