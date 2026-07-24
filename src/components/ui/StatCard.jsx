import React from 'react';

function formatNumber(num) {
  if (num === null || num === undefined) return '-';
  return new Intl.NumberFormat('id-ID').format(num);
}

export function StatCard({ title, value, subtitle, accent = 'var(--color-brand)', icon: Icon }) {
  return (
    <div 
      className="relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <div>
        <div className="flex justify-between items-start">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide pr-2">
            {title}
          </p>
          {Icon && <Icon size={22} className="text-gray-400 shrink-0" />}
        </div>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {formatNumber(value)}
        </p>
      </div>
      {subtitle && (
        <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
      )}
    </div>
  )
}
