import React from 'react';

function formatNumber(num) {
  if (num === null || num === undefined) return '-';
  return new Intl.NumberFormat('id-ID').format(num);
}

export function StatCard({ title, value, subtitle, accent = 'var(--color-brand)' }) {
  return (
    <div 
      className="relative bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold text-gray-900">
        {formatNumber(value)}
      </p>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
      )}
    </div>
  )
}
