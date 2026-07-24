import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PRODUCTS } from '../../constants/products';

export function PlannedOrderChart({ data }) {
  // data expected format: [{ month: 'Jan', CDTI: 400, CWTI: 200, ... }, ...]

  return (
    <div className="h-96 w-full bg-white p-4 rounded-lg border border-slate-200 shadow-sm mt-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">Planned Order Release Timeline</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          
          {PRODUCTS.map(product => (
            <Line 
              key={product.kode}
              type="monotone" 
              dataKey={product.kode} 
              name={product.nama}
              stroke={product.warna} 
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
