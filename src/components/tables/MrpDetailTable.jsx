import React, { useState, useMemo } from 'react';
import { WEEKS, MONTHS } from '../../constants/weeks';

function formatNumber(num) {
  if (num === null || num === undefined || num === 0) return '-';
  return new Intl.NumberFormat('id-ID').format(num);
}

const ROW_TYPES = [
  { id: 'gross_requirement', label: 'Gross Requirement', style: 'text-slate-700' },
  { id: 'schedule_receipts', label: 'Schedule Receipts', style: 'text-sky-600 font-medium' },
  { id: 'projected_on_hand', label: 'Projected On Hand', style: 'font-medium' },
  { id: 'net_requirement', label: 'Net Requirement', style: 'text-amber-600' },
  { id: 'planned_order_receipts', label: 'Planned Order Receipts', style: 'text-sky-600' },
  { id: 'planned_order_release', label: 'Planned Order Release', style: 'text-slate-900 font-bold bg-sky-50' },
  { id: 'sisa', label: 'Sisa', style: 'text-slate-400' },
];

function MrpGroupRows({ partNumber, groupData, collapsed }) {
  // First item in the group is used to extract part info
  const info = groupData[0];
  
  if (collapsed) return null;

  return (
    <>
      {ROW_TYPES.map(rowType => {
        // Find data row for this type
        const rowData = groupData.find(r => r.row_type === rowType.id) || {};
        
        let customStyle = rowType.style;
        
        return (
          <tr key={`${partNumber}-${rowType.id}`} className="hover:bg-slate-50/50 group border-b border-slate-100 last:border-b-2 last:border-slate-300">
            {/* Sticky Label */}
            <td className={`sticky left-[200px] bg-white group-hover:bg-slate-50 px-3 py-1.5 text-xs whitespace-nowrap border-r border-slate-200 z-10 ${customStyle}`}>
              {rowType.label}
            </td>
            
            {/* Data Columns */}
            <td className={`px-2 py-1.5 text-center text-xs border-r border-slate-100 font-mono ${customStyle}`}>
              {formatNumber(rowData.past_due)}
            </td>
            
            {WEEKS.map((w, i) => {
              const val = rowData[w.key];
              
              // Projected on hand styling
              let cellStyle = customStyle;
              if (rowType.id === 'projected_on_hand') {
                if (val < 0) cellStyle = 'text-rose-600 font-bold bg-rose-50';
                else if (val > 0) cellStyle = 'text-emerald-600';
                else cellStyle = 'text-slate-400';
              }
              if (rowType.id === 'net_requirement' && val > 0) {
                cellStyle = 'text-amber-600 font-bold bg-amber-50';
              }
              if (rowType.id === 'planned_order_release' && val > 0) {
                cellStyle = 'text-slate-900 font-bold bg-sky-100 border border-sky-200';
              }
              
              // Add right border at the end of each month
              const isMonthEnd = (i + 1) % 4 === 0;
              
              return (
                <td 
                  key={w.key} 
                  className={`px-2 py-1.5 text-right text-xs font-mono group-hover:bg-slate-100/50 ${cellStyle} ${isMonthEnd ? 'border-r-2 border-slate-200' : 'border-r border-slate-100'}`}
                >
                  {formatNumber(val)}
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}

export function MrpDetailTable({ items }) {
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const groupedItems = useMemo(() => {
    const groups = {};
    items.forEach(item => {
      const pn = item.part_number;
      if (!groups[pn]) groups[pn] = [];
      groups[pn].push(item);
    });
    return Object.entries(groups).map(([partNumber, data]) => ({ partNumber, data }));
  }, [items]);

  const toggleGroup = (partNumber) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [partNumber]: !prev[partNumber]
    }));
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 w-full overflow-hidden flex flex-col relative h-[calc(100vh-220px)]">
      <div className="overflow-x-auto overflow-y-auto custom-scrollbar flex-1 relative">
        <table className="min-w-max w-full border-collapse text-left">
          <thead className="sticky top-0 z-30 shadow-sm">
            {/* Month Header */}
            <tr className="bg-slate-100 text-slate-700 text-xs uppercase font-semibold">
              <th className="sticky left-0 bg-slate-100 border-r border-slate-200 px-4 py-2 w-[200px] z-30" rowSpan={2}>Komponen</th>
              <th className="sticky left-[200px] bg-slate-100 border-r border-slate-200 px-3 py-2 w-[180px] z-30" rowSpan={2}>Tipe Baris</th>
              <th className="border-r border-slate-200 px-2 py-2 text-center" rowSpan={2}>Past<br/>Due</th>
              
              {MONTHS.map((month, idx) => (
                <th key={month} colSpan={4} className="border-r-2 border-slate-300 px-2 py-1 text-center bg-slate-200/50">
                  {month}
                </th>
              ))}
            </tr>
            {/* Week Header */}
            <tr className="bg-slate-50 text-slate-500 text-xs">
              {WEEKS.map((w, i) => {
                const isMonthEnd = (i + 1) % 4 === 0;
                return (
                  <th key={w.key} className={`px-2 py-1 text-center font-mono ${isMonthEnd ? 'border-r-2 border-slate-300' : 'border-r border-slate-200'}`}>
                    W{w.week}
                  </th>
                );
              })}
            </tr>
          </thead>
          
          <tbody className="bg-white">
            {groupedItems.map(({ partNumber, data }) => {
              const info = data[0]; // First row has the component info
              const isCollapsed = collapsedGroups[partNumber];
              
              return (
                <React.Fragment key={partNumber}>
                  {/* Group Header Row */}
                  <tr className="bg-slate-100/80 border-t-2 border-b-2 border-slate-300 sticky z-20" style={{ top: '65px' }}>
                    <td 
                      className="sticky left-0 bg-slate-200 px-3 py-2 border-r border-slate-300 z-20 font-medium text-xs cursor-pointer hover:bg-slate-300 transition-colors"
                      onClick={() => toggleGroup(partNumber)}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sky-700 font-bold">{partNumber}</span>
                          <span className="text-slate-500 text-[10px] bg-white px-1.5 rounded">{isCollapsed ? '+' : '-'}</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-800 line-clamp-2" title={info.desc}>{info.desc}</span>
                        <div className="flex gap-2 text-[10px] text-slate-500 mt-1">
                          <span className="bg-white px-1 rounded border border-slate-200">Lvl: {info.level}</span>
                          <span className="bg-white px-1 rounded border border-slate-200">LT: {info.lead_time}w</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Empty cells for the rest of the header row if collapsed, else we just span it or show summary? */}
                    {/* We'll just show some summary data in the row type col for the header */}
                    <td className="sticky left-[200px] bg-slate-100/80 border-r border-slate-300 px-3 py-2 z-20 text-[10px] text-slate-600">
                      <div>On Hand: <span className="font-bold">{info.on_hand}</span></div>
                      <div>Lot Size: <span className="font-bold">{info.lot_size}</span></div>
                      <div>UoM: <span className="font-bold">{info.bom_uom} {info.satuan}</span></div>
                    </td>
                    
                    {/* The rest is just filler background for the header row */}
                    <td colSpan={49} className="bg-slate-100/50">
                      {/* Optional: sparkline here */}
                    </td>
                  </tr>
                  
                  {/* Detail Rows */}
                  <MrpGroupRows partNumber={partNumber} groupData={data} collapsed={isCollapsed} />
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
