import React from 'react';
import { BomTreeTable } from '../components/tables/BomTreeTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { useBomData } from '../hooks/useBomData';
import { useDashboard } from '../contexts/DashboardContext';

export function BomPage() {
  const { state } = useDashboard();
  const { data, loading, error, refetch } = useBomData();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Bill of Materials (BOM)</h2>
          <p className="text-sm text-slate-500">Struktur produk untuk: <span className="font-medium text-sky-600">{state.activeProduct.nama}</span></p>
        </div>
        <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
          Total Item: <span className="font-bold text-slate-700">{data.length}</span>
        </div>
      </div>

      {data.length > 0 ? (
        <BomTreeTable items={data} />
      ) : (
        <EmptyState title="BOM Kosong" message={`Belum ada data Bill of Materials untuk produk ${state.activeProduct.nama}.`} />
      )}
    </div>
  );
}
