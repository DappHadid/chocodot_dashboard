import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function InventoryHealthChart({ data }) {
  const chartData = useMemo(() => {
    let aman = 0;
    let perluOrder = 0;
    let kritis = 0;

    data.forEach(item => {
      const ratio = item.lot_size ? (item.on_hand / item.lot_size) : 1;
      if (item.on_hand === 0) kritis++;
      else if (ratio < 0.5) perluOrder++;
      else aman++;
    });

    return [
      { name: 'Aman', value: aman, color: 'var(--color-positive, #10b981)' },
      { name: 'Perlu Order', value: perluOrder, color: 'var(--color-warning, #f59e0b)' },
      { name: 'Kritis', value: kritis, color: 'var(--color-danger, #ef4444)' },
    ].filter(item => item.value > 0);
  }, [data]);

  return (
    <div className="h-80 w-full bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">Status Inventori (BOM Aktif)</h3>
      <div className="flex-1 min-h-0">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                dataKey="value"
                stroke="#fff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} Komponen`, 'Jumlah']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            Belum ada data BOM
          </div>
        )}
      </div>
    </div>
  );
}
