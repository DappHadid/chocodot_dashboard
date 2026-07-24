import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PRODUCTS } from '../../constants/products';

export function GrossRequirementChart({ data }) {
  // data expected format: [{ name: 'Produk A', value: 12000, fill: '#color' }, ...]
  
  return (
    <div className="h-80 w-full bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Total Gross Requirement per Produk (Tahunan)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis dataKey="name" type="category" tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }} width={120} />
          <Tooltip 
            cursor={{ fill: '#f1f5f9' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
            {
              data.map((entry, index) => (
                <cell key={`cell-${index}`} fill={entry.fill} />
              ))
            }
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
