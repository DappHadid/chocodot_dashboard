import React from 'react';
import { Badge } from '../ui/Badge';
import { useSimulation } from '../../contexts/SimulationContext';
import { Plus, Trash2 } from 'lucide-react';

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
  const { updateBomItem, updateBomItemText, addBomItem, removeBomItem } = useSimulation();

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden overflow-x-auto custom-scrollbar">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 w-12 text-center">Lvl</th>
            <th className="px-4 py-3 w-40">Kode</th>
            <th className="px-4 py-3 w-64">Bahan Baku</th>
            <th className="px-4 py-3 w-24">Qty</th>
            <th className="px-4 py-3 w-24">Satuan</th>
            <th className="px-4 py-3 w-24">Lead Time</th>
            <th className="px-4 py-3 w-24">Lot Size</th>
            <th className="px-4 py-3 w-24">On Hand</th>
            <th className="px-4 py-3 w-24 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {items.map((item, idx) => {
            const isLevel0 = item.level === 0;
            const isAssembly = item.kode && item.kode.startsWith('A-');
            
            return (
              <tr 
                key={idx} 
                className={`
                  hover:bg-sky-50/50 transition-colors
                  ${isLevel0 ? 'bg-slate-50/80 border-b-2 border-slate-200' : ''}
                `}
              >
                <td className="px-4 py-2.5 text-center text-slate-400 font-medium">
                  {item.level}
                </td>
                <td className="px-4 py-2.5">
                  <div style={{ paddingLeft: `${item.level * 12}px` }} className="flex items-center">
                    <TreeConnector level={item.level} />
                    <input 
                      type="text"
                      value={item.kode || ''}
                      onChange={(e) => updateBomItemText(idx, 'kode', e.target.value)}
                      className="w-full px-2 py-1 text-sm bg-transparent border border-transparent hover:border-slate-300 focus:border-sky-500 focus:bg-white rounded transition-colors font-mono"
                    />
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      value={item.bahan_baku || ''}
                      onChange={(e) => updateBomItemText(idx, 'bahan_baku', e.target.value)}
                      className={`w-full px-2 py-1 text-sm bg-transparent border border-transparent hover:border-slate-300 focus:border-sky-500 focus:bg-white rounded transition-colors ${isLevel0 ? 'font-semibold' : ''}`}
                    />
                    {isAssembly && <Badge variant="indigo">Assembly</Badge>}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <input 
                    type="number"
                    min="0" step="any"
                    value={item.quantity === 0 ? '' : item.quantity}
                    onChange={(e) => updateBomItem(idx, 'quantity', e.target.value)}
                    className="w-full px-2 py-1 text-right text-sm bg-transparent border border-transparent hover:border-slate-300 focus:border-sky-500 focus:bg-white rounded transition-colors font-mono"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input 
                    type="text"
                    value={item.satuan || ''}
                    onChange={(e) => updateBomItemText(idx, 'satuan', e.target.value)}
                    className="w-16 px-2 py-1 text-sm bg-transparent border border-transparent hover:border-slate-300 focus:border-sky-500 focus:bg-white rounded transition-colors"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center">
                    <input 
                      type="number"
                      min="0"
                      value={item.lead_time_minggu === 0 ? '' : item.lead_time_minggu}
                      onChange={(e) => updateBomItem(idx, 'lead_time_minggu', e.target.value)}
                      className="w-12 px-2 py-1 text-right text-sm bg-transparent border border-transparent hover:border-slate-300 focus:border-sky-500 focus:bg-white rounded transition-colors font-mono"
                    />
                    <span className="text-xs text-slate-400 ml-1">wks</span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <input 
                    type="number"
                    min="0"
                    value={item.lot_size === 0 ? '' : item.lot_size}
                    onChange={(e) => updateBomItem(idx, 'lot_size', e.target.value)}
                    className="w-full px-2 py-1 text-right text-sm bg-transparent border border-transparent hover:border-slate-300 focus:border-sky-500 focus:bg-white rounded transition-colors font-mono"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input 
                    type="number"
                    min="0"
                    value={item.on_hand === 0 ? '' : item.on_hand}
                    onChange={(e) => updateBomItem(idx, 'on_hand', e.target.value)}
                    className={`w-full px-2 py-1 text-right text-sm bg-transparent border border-transparent hover:border-slate-300 focus:border-sky-500 focus:bg-white rounded transition-colors font-mono ${item.on_hand === 0 ? 'text-rose-600 font-bold' : ''}`}
                  />
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center justify-center gap-1">
                    <button 
                      onClick={() => addBomItem(idx)}
                      title="Tambah Sub-Item"
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                    <button 
                      onClick={() => removeBomItem(idx)}
                      title="Hapus Item"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
