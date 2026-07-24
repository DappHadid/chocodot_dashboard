import React, { useMemo } from 'react';
import { Badge } from '../ui/Badge';
import { WEEKS, MONTHS } from '../../constants/weeks';

function formatNumber(num) {
  if (num === null || num === undefined || num === 0) return '-';
  return new Intl.NumberFormat('id-ID').format(num);
}

export function RekapTable({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden overflow-x-auto custom-scrollbar">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-3 py-2 sticky left-0 bg-slate-50 z-10 border-r border-slate-200" rowSpan={2}>Kode / Bahan Baku</th>
            <th className="px-2 py-2 text-center border-r border-slate-200" rowSpan={2}>Satuan</th>
            <th className="px-2 py-2 text-center border-r border-slate-200" rowSpan={2}>Category</th>
            {MONTHS.map(m => (
              <th key={m} colSpan={4} className="px-2 py-1 text-center border-r-2 border-slate-300 bg-slate-100">{m}</th>
            ))}
            <th className="px-3 py-2 text-right sticky right-0 bg-slate-50 z-10 border-l border-slate-200" rowSpan={2}>Total</th>
          </tr>
          <tr>
            {WEEKS.map((w, i) => {
              const isMonthEnd = (i + 1) % 4 === 0;
              return (
                <th key={w.key} className={`px-1 py-1 text-center font-mono font-normal text-[10px] ${isMonthEnd ? 'border-r-2 border-slate-300' : 'border-r border-slate-100'}`}>
                  W{w.week}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map(item => {
            const isDibuat = item.category?.toLowerCase() === 'dibuat';
            
            return (
              <tr key={item.id || item.kode} className="hover:bg-slate-50/80 group">
                <td className="px-3 py-2 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-100">
                  <div className="flex flex-col">
                    <span className="font-mono font-semibold text-slate-700">{item.kode}</span>
                    <span className="text-xs text-slate-500 truncate max-w-[200px]" title={item.bahan_baku}>{item.bahan_baku}</span>
                  </div>
                </td>
                <td className="px-2 py-2 text-center text-xs text-slate-500 border-r border-slate-100">{item.satuan}</td>
                <td className="px-2 py-2 text-center border-r border-slate-100">
                  <Badge variant={isDibuat ? 'indigo' : 'warning'}>
                    {isDibuat ? 'Dibuat' : 'Dibeli'}
                  </Badge>
                </td>
                
                {WEEKS.map((w, i) => {
                  const val = item[w.key];
                  const hasValue = val > 0;
                  const isMonthEnd = (i + 1) % 4 === 0;
                  
                  return (
                    <td 
                      key={w.key} 
                      className={`px-1 py-2 text-right font-mono text-xs ${hasValue ? 'bg-sky-50 text-sky-900 font-medium' : 'text-slate-300'} ${isMonthEnd ? 'border-r-2 border-slate-200' : 'border-r border-slate-50'}`}
                    >
                      {formatNumber(val)}
                    </td>
                  );
                })}
                
                <td className="px-3 py-2 text-right font-mono font-bold text-slate-800 sticky right-0 bg-white group-hover:bg-slate-50 z-10 border-l border-slate-200">
                  {formatNumber(item.total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
