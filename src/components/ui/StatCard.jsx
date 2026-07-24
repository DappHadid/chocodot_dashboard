import React from 'react';

function formatNumber(num) {
  if (num === null || num === undefined) return '-';
  return new Intl.NumberFormat('id-ID').format(num);
}

export function StatCard({ title, value, subtitle, accent = 'var(--color-brand)' }) {
  return (
    <div 
      className="relative bg-white rounded-lg p-5 shadow-sm border border-slate-200"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
        {title}
      </p>
      <p className="mt-2 text-3xl font-mono font-bold text-slate-900">
        {formatNumber(value)}
      </p>
      {subtitle && (
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      )}
    </div>
  )
}
