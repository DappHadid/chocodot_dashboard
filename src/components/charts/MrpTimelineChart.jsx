import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MONTHS } from '../../constants/weeks';

export function MrpTimelineChart({ data, productName }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Find Gross Requirement and Planned Order Release for the top level item (level 0)
    // usually the first component in the data, or where level === 0
    const topLevelGross = data.find(item => item.level === 0 && item.row_type === 'gross_requirement');
    const topLevelPlanned = data.find(item => item.level === 0 && item.row_type === 'planned_order_release');

    if (!topLevelGross || !topLevelPlanned) return [];

    return MONTHS.map((month, monthIdx) => {
      let grossTotal = 0;
      let plannedTotal = 0;

      for (let w = 1; w <= 4; w++) {
        const weekKey = `w${String(monthIdx * 4 + w).padStart(2, '0')}`;
        grossTotal += Number(topLevelGross[weekKey] || 0);
        plannedTotal += Number(topLevelPlanned[weekKey] || 0);
      }

      return {
        month,
        Gross: grossTotal,
        Planned: plannedTotal
      };
    });
  }, [data]);

  return (
    <div className="h-96 w-full bg-white p-6 rounded-xl border border-gray-100 shadow-sm mt-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Gross Requirement vs Planned Order</h3>
        <p className="text-xs text-gray-500">Produk: <span className="font-medium text-brand-dark">{productName || 'Tidak diketahui'}</span></p>
      </div>
      
      <div className="h-[calc(100%-3rem)] w-full">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-danger)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-danger)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-brand)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-brand)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
              
              <Area type="monotone" dataKey="Gross" stroke="var(--color-danger)" fillOpacity={1} fill="url(#colorGross)" strokeWidth={2} />
              <Area type="monotone" dataKey="Planned" stroke="var(--color-brand)" fillOpacity={1} fill="url(#colorPlanned)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            Tidak ada data MRP untuk produk ini
          </div>
        )}
      </div>
    </div>
  );
}
