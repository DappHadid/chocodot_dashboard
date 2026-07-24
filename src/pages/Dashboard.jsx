import React, { useMemo } from 'react';
import { StatCard } from '../components/ui/StatCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { GrossRequirementChart } from '../components/charts/GrossRequirementChart';
import { PlannedOrderChart } from '../components/charts/PlannedOrderChart';
import { Badge } from '../components/ui/Badge';
import { useRekapData } from '../hooks/useRekapData';
import { useBomData } from '../hooks/useBomData';
import { PRODUCTS } from '../constants/products';
import { MONTHS, WEEKS } from '../constants/weeks';

export function Dashboard() {
  const { data: allRekap, loading: rekapLoading, error: rekapError, refetch: refetchRekap } = useRekapData(true);
  const { data: bomData, loading: bomLoading, error: bomError, refetch: refetchBom } = useBomData();

  const loading = rekapLoading || bomLoading;
  const error = rekapError || bomError;

  const stats = useMemo(() => {
    if (!allRekap.length) return { totalPlanned: 0, totalDibuat: 0, totalDibeli: 0 };
    
    let totalPlanned = 0;
    let totalDibuat = 0;
    let totalDibeli = 0;

    allRekap.forEach(item => {
      totalPlanned += Number(item.total || 0);
      if (item.category === 'dibuat') totalDibuat += Number(item.total || 0);
      if (item.category === 'dibeli') totalDibeli += Number(item.total || 0);
    });

    return { totalPlanned, totalDibuat, totalDibeli };
  }, [allRekap]);

  const grossChartData = useMemo(() => {
    // For demo/simplicity, using 'total' from rekap as proxy for gross req if not available elsewhere,
    // or we group by product.
    return PRODUCTS.map(p => {
      const productRekap = allRekap.filter(r => r.product_group === p.group);
      const val = productRekap.reduce((sum, curr) => sum + Number(curr.total || 0), 0);
      return {
        name: p.nama,
        value: val,
        fill: p.warna
      };
    }).sort((a, b) => b.value - a.value);
  }, [allRekap]);

  const timelineData = useMemo(() => {
    return MONTHS.map((month, monthIdx) => {
      const dataPoint = { month };
      PRODUCTS.forEach(p => {
        const pRekap = allRekap.filter(r => r.product_group === p.group);
        let monthTotal = 0;
        
        // Sum the 4 weeks of this month
        for (let w = 1; w <= 4; w++) {
          const weekKey = `w${String(monthIdx * 4 + w).padStart(2, '0')}`;
          pRekap.forEach(item => {
            monthTotal += Number(item[weekKey] || 0);
          });
        }
        dataPoint[p.kode] = monthTotal;
      });
      return dataPoint;
    });
  }, [allRekap]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onRetry={() => { refetchRekap(); refetchBom(); }} />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Produk" 
          value={PRODUCTS.length} 
          subtitle="Varian Finished Goods" 
          accent="var(--color-brand)" 
        />
        <StatCard 
          title="Total Planned Orders" 
          value={stats.totalPlanned} 
          subtitle="Sepanjang Tahun" 
          accent="var(--color-neutral)" 
        />
        <StatCard 
          title="Total Item Dibuat" 
          value={stats.totalDibuat} 
          subtitle="Produksi Internal" 
          accent="var(--color-indigo-500)" 
        />
        <StatCard 
          title="Total Item Dibeli" 
          value={stats.totalDibeli} 
          subtitle="Pembelian Eksternal" 
          accent="var(--color-amber-500)" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GrossRequirementChart data={grossChartData} />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-80 overflow-auto custom-scrollbar">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 sticky top-0 bg-white z-10 pb-2">Status Inventori (BOM Aktif)</h3>
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-8 z-10">
                <tr>
                  <th className="px-3 py-2">Kode</th>
                  <th className="px-3 py-2">Bahan Baku</th>
                  <th className="px-3 py-2 text-right">On Hand</th>
                  <th className="px-3 py-2 text-right">Lot Size</th>
                  <th className="px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bomData.length > 0 ? bomData.map(item => {
                  const ratio = item.lot_size ? (item.on_hand / item.lot_size) : 1;
                  let status = 'Aman';
                  let variant = 'positive';
                  if (item.on_hand === 0) { status = 'Kritis'; variant = 'danger'; }
                  else if (ratio < 0.5) { status = 'Perlu Order'; variant = 'warning'; }

                  return (
                    <tr key={item.id || item.kode} className="hover:bg-slate-50/50">
                      <td className="px-3 py-2 font-mono text-slate-600">{item.kode}</td>
                      <td className="px-3 py-2 truncate max-w-[150px]" title={item.bahan_baku}>{item.bahan_baku}</td>
                      <td className="px-3 py-2 text-right font-mono">{item.on_hand}</td>
                      <td className="px-3 py-2 text-right font-mono text-slate-500">{item.lot_size}</td>
                      <td className="px-3 py-2 text-center">
                        <Badge variant={variant}>{status}</Badge>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan={5} className="px-3 py-8 text-center text-slate-400">Belum ada data BOM untuk produk aktif</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PlannedOrderChart data={timelineData} />
    </div>
  );
}
