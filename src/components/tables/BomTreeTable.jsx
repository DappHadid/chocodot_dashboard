import React from 'react';
import { Badge } from '../ui/Badge';

function formatNumber(num) {
  if (num === null || num === undefined) return '-';
  return new Intl.NumberFormat('id-ID').format(num);
}

function TreeConnector({ level }) {
  if (level === 0) return null;
  return (
    <span 
      className="inline-block border-l border-b border-dashed border-slate-400 mr-2 relative" 
      style={{ width: '12px', height: '16px', top: '-6px' }}
    />
  );
}

export function BomTreeTable({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 w-16">No</th>
            <th className="px-4 py-3 w-16 text-center">Lvl</th>
            <th className="px-4 py-3 w-48">Kode</th>
            <th className="px-4 py-3">Bahan Baku</th>
            <th className="px-4 py-3 text-right">Qty</th>
            <th className="px-4 py-3">Satuan</th>
            <th className="px-4 py-3 text-right">Lead Time</th>
            <th className="px-4 py-3 text-right">Lot Size</th>
            <th className="px-4 py-3 text-right">On Hand</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item, idx) => {
            const isLevel0 = item.level === 0;
            const isAssembly = item.kode && item.kode.startsWith('A-');
            
            return (
              <tr 
                key={item.id || idx} 
                className={`
                  hover:bg-sky-50/50 transition-colors
                  ${isLevel0 ? 'bg-slate-50/80 font-semibold border-b-2 border-slate-200' : ''}
                `}
              >
                <td className="px-4 py-2.5 text-slate-500">{item.no}</td>
                <td className="px-4 py-2.5 text-center text-slate-400">{item.level}</td>
                <td className="px-4 py-2.5 font-mono text-slate-700 whitespace-nowrap">
                  <div style={{ paddingLeft: `${item.level * 16}px` }} className="flex items-center">
                    <TreeConnector level={item.level} />
                    {item.kode}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {item.bahan_baku}
                    {isAssembly && <Badge variant="indigo">Assembly</Badge>}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right font-mono">{formatNumber(item.quantity)}</td>
                <td className="px-4 py-2.5 text-slate-500 text-xs">
                  <Badge variant={item.satuan?.toLowerCase() === 'kg' ? 'warning' : 'default'}>
                    {item.satuan}
                  </Badge>
                </td>
                <td className="px-4 py-2.5 text-right font-mono">{item.lead_time_minggu} wks</td>
                <td className="px-4 py-2.5 text-right font-mono">{formatNumber(item.lot_size)}</td>
                <td className={`px-4 py-2.5 text-right font-mono ${item.on_hand === 0 ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                  {formatNumber(item.on_hand)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
