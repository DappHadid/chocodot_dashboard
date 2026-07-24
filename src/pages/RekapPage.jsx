import React, { useMemo } from 'react';
import { RekapTable } from '../components/tables/RekapTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { useRekapData } from '../hooks/useRekapData';
import { useDashboard } from '../contexts/DashboardContext';

export function RekapPage() {
  const { state } = useDashboard();
  const { data, loading, error, refetch } = useRekapData(false); // only for active product for this view, or we can fetch all

  const processedData = useMemo(() => {
    return data.map(item => {
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
  }, [data]);

  const stats = useMemo(() => {
    if (!processedData.length) return { totalDibuat: 0, totalDibeli: 0, itemsDibuat: 0, itemsDibeli: 0 };
    let totalDibuat = 0, totalDibeli = 0;
    let itemsDibuat = 0, itemsDibeli = 0;
    
    processedData.forEach(item => {
      const isDibuat = item.category?.toLowerCase() === 'dibuat';
      if (isDibuat) {
        totalDibuat += Number(item.total || 0);
        itemsDibuat++;
      } else {
        totalDibeli += Number(item.total || 0);
        itemsDibeli++;
      }
    });
    
    return { totalDibuat, totalDibeli, itemsDibuat, itemsDibeli };
  }, [processedData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Rekapitulasi Order Release</h2>
          <p className="text-sm text-gray-500">Agregasi kebutuhan material untuk: <span className="font-medium text-sky-600">{state.activeProduct.nama}</span></p>
        </div>
      </div>

      {processedData.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-indigo-500">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Item yang Dibuat ({stats.itemsDibuat} komponen)</h3>
              <p className="text-3xl font-bold text-gray-900">{new Intl.NumberFormat('id-ID').format(stats.totalDibuat)}</p>
              <p className="text-xs text-gray-400 mt-2">Total order release tahunan</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-amber-500">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Item yang Dibeli ({stats.itemsDibeli} komponen)</h3>
              <p className="text-3xl font-bold text-gray-900">{new Intl.NumberFormat('id-ID').format(stats.totalDibeli)}</p>
              <p className="text-xs text-gray-400 mt-2">Total order release tahunan</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
               <h3 className="font-semibold text-gray-700">Rincian Per Komponen</h3>
             </div>
             <RekapTable items={processedData} />
          </div>
        </>
      ) : (
        <EmptyState title="Data Rekap Kosong" message={`Belum ada data rekapitulasi untuk produk ${state.activeProduct.nama}.`} />
      )}
    </div>
  );
}
