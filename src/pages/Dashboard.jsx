import React, { useMemo } from 'react';
import { StatCard } from '../components/ui/StatCard';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { GrossRequirementChart } from '../components/charts/GrossRequirementChart';
import { PlannedOrderChart } from '../components/charts/PlannedOrderChart';
import { SourcingPieChart } from '../components/charts/SourcingPieChart';
import { InventoryHealthChart } from '../components/charts/InventoryHealthChart';
import { MrpTimelineChart } from '../components/charts/MrpTimelineChart';
import { Badge } from '../components/ui/Badge';
import { useRekapData } from '../hooks/useRekapData';
import { useBomData } from '../hooks/useBomData';
import { useMrpData } from '../hooks/useMrpData';
import { useDashboard } from '../contexts/DashboardContext';
import { PRODUCTS } from '../constants/products';
import { MONTHS } from '../constants/weeks';

export function Dashboard() {
  const { state } = useDashboard();
  const { data: allRekap, loading: rekapLoading, error: rekapError, refetch: refetchRekap } = useRekapData(true); // global rekap
  const { data: activeRekap, loading: activeRekapLoading, error: activeRekapError, refetch: refetchActiveRekap } = useRekapData(false); // active product rekap
  const { data: bomData, loading: bomLoading, error: bomError, refetch: refetchBom } = useBomData();
  const { data: mrpData, loading: mrpLoading, error: mrpError, refetch: refetchMrp } = useMrpData();

  const loading = rekapLoading || activeRekapLoading || bomLoading || mrpLoading;
  const error = rekapError || activeRekapError || bomError || mrpError;

  const handleRetry = () => {
    refetchRekap(); refetchActiveRekap(); refetchBom(); refetchMrp();
  };

  // Pre-process rekap data because the DB might have 0 for total and hardcoded category
  const processedAllRekap = useMemo(() => {
    return allRekap.map(item => {
      let sum = 0;
      for (let i = 1; i <= 48; i++) {
        sum += Number(item[`w${String(i).padStart(2, '0')}`] || 0);
      }
      
      // Determine category simply based on the material name if it's incorrectly seeded
      let category = item.category || 'dibuat';
      const name = (item.bahan_baku || '').toLowerCase();
      if (name.includes('foil') || name.includes('kemasan') || name.includes('compound') || name.includes('dodol')) {
        category = 'dibeli';
      } else {
        category = 'dibuat';
      }

      return { ...item, total: sum > 0 ? sum : item.total, category };
    });
  }, [allRekap]);

  const processedActiveRekap = useMemo(() => {
    return activeRekap.map(item => {
      let sum = 0;
      for (let i = 1; i <= 48; i++) {
        sum += Number(item[`w${String(i).padStart(2, '0')}`] || 0);
      }
      let category = item.category || 'dibuat';
      const name = (item.bahan_baku || '').toLowerCase();
      if (name.includes('foil') || name.includes('kemasan') || name.includes('compound') || name.includes('dodol')) {
        category = 'dibeli';
      } else {
        category = 'dibuat';
      }
      return { ...item, total: sum > 0 ? sum : item.total, category };
    });
  }, [activeRekap]);

  const stats = useMemo(() => {
    if (!processedAllRekap.length) return { totalPlanned: 0, totalDibuat: 0, totalDibeli: 0 };
    
    let totalPlanned = 0;
    let totalDibuat = 0;
    let totalDibeli = 0;

    processedAllRekap.forEach(item => {
      totalPlanned += Number(item.total || 0);
      if (item.category === 'dibuat') totalDibuat += Number(item.total || 0);
      if (item.category === 'dibeli') totalDibeli += Number(item.total || 0);
    });

    return { totalPlanned, totalDibuat, totalDibeli };
  }, [processedAllRekap]);

  const grossChartData = useMemo(() => {
    return PRODUCTS.map(p => {
      const productRekap = processedAllRekap.filter(r => r.product_group === p.group);
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

  if (loading) return <LoadingSpinner text="Memuat data dashboard..." />;
  if (error) return <ErrorState error={error} onRetry={handleRetry} />;

  return (
    <div className="space-y-6">
      {/* Top Stats - Global */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Produk" 
          value={PRODUCTS.length} 
          subtitle="Varian Finished Goods" 
          accent="var(--color-brand)" 
        />
        <StatCard 
          title="Total Planned Orders" 
          value={stats.totalPlanned} 
          subtitle="Sepanjang Tahun (Global)" 
          accent="var(--color-neutral)" 
        />
        <StatCard 
          title="Total Item Dibuat" 
          value={stats.totalDibuat} 
          subtitle="Produksi Internal (Global)" 
          accent="var(--color-indigo-500)" 
        />
        <StatCard 
          title="Total Item Dibeli" 
          value={stats.totalDibeli} 
          subtitle="Pembelian Eksternal (Global)" 
          accent="var(--color-amber-500)" 
        />
      </div>

      {/* Global Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GrossRequirementChart data={grossChartData} />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 shadow-sm h-[420px] overflow-auto custom-scrollbar flex flex-col">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 sticky top-0 bg-gray-50 z-10 pb-2 border-b border-gray-100">Status Inventori ({state.activeProduct.nama})</h3>
            <div className="flex-1 min-h-0">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-3 rounded-tl-md font-semibold">Kode</th>
                    <th className="px-3 py-3 font-semibold">Bahan Baku</th>
                    <th className="px-3 py-3 text-right font-semibold">On Hand</th>
                    <th className="px-3 py-3 text-right font-semibold">Lot Size</th>
                    <th className="px-3 py-3 text-center rounded-tr-md font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bomData.length > 0 ? bomData.map(item => {
                    const ratio = item.lot_size ? (item.on_hand / item.lot_size) : 1;
                    let status = 'Aman';
                    let variant = 'positive';
                    if (item.on_hand === 0) { status = 'Kritis'; variant = 'danger'; }
                    else if (ratio < 0.5) { status = 'Perlu Order'; variant = 'warning'; }

                    return (
                      <tr key={item.id || item.kode} className="odd:bg-gray-50 even:bg-gray-100/50 hover:bg-gray-100 transition-colors">
                        <td className="px-3 py-3 font-mono text-gray-600">{item.kode}</td>
                        <td className="px-3 py-3 truncate max-w-[150px] text-gray-700" title={item.bahan_baku}>{item.bahan_baku}</td>
                        <td className="px-3 py-3 text-right font-mono text-gray-900">{item.on_hand}</td>
                        <td className="px-3 py-3 text-right font-mono text-gray-500">{item.lot_size}</td>
                        <td className="px-3 py-3 text-center">
                          <Badge variant={variant}>{status}</Badge>
                        </td>
                      </tr>
                    )
                  }) : (
                    <tr>
                      <td colSpan={5} className="px-3 py-8 text-center text-gray-400">Belum ada data BOM untuk produk aktif</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Active Product Insights Row */}
      <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4 border-b border-slate-200 pb-2">Analisis: {state.activeProduct.nama}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <InventoryHealthChart data={bomData} />
        <SourcingPieChart data={processedActiveRekap} />
      </div>

      <MrpTimelineChart data={mrpData} productName={state.activeProduct.nama} />
      
      <div className="mt-6 border-t border-slate-200 pt-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Tren Produksi Global (Semua Produk)</h2>
        <PlannedOrderChart data={timelineData} />
      </div>
    </div>
  );
}

