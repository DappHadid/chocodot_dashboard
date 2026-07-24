import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function SourcingPieChart({ data }) {
  const chartData = useMemo(() => {
    let dibuat = 0;
    let dibeli = 0;

    data.forEach(item => {
      if (item.category === 'dibuat') dibuat += Number(item.total || 0);
      if (item.category === 'dibeli') dibeli += Number(item.total || 0);
    });

    return [
      { name: 'Internal (Dibuat)', value: dibuat, color: 'var(--color-indigo-500)' },
      { name: 'Eksternal (Dibeli)', value: dibeli, color: 'var(--color-amber-500)' },
    ].filter(item => item.value > 0);
  }, [data]);

  return (
    <div className="h-80 w-full bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Komposisi Sourcing (Active Product)</h3>
      <div className="flex-1 min-h-0">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => new Intl.NumberFormat('id-ID').format(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            Tidak ada data rekap
          </div>
        )}
      </div>
    </div>
  );
}
