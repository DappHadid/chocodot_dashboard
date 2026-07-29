import React from 'react';
import { BomTreeTable } from '../components/tables/BomTreeTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { useSimulation } from '../contexts/SimulationContext';
import { useDashboard } from '../contexts/DashboardContext';
import { Plus } from 'lucide-react';

export function BomPage() {
  const { state } = useDashboard();
  const { bomData, loading, error, addBomItem } = useSimulation();

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Bill of Materials (BOM) - Simulasi Interaktif</h2>
          <p className="text-sm text-slate-500">Struktur produk untuk: <span className="font-medium text-sky-600">{state.activeProduct.nama}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md border border-slate-200">
            Total Item: <span className="font-bold text-slate-700">{bomData.length}</span>
          </div>
          <button
            onClick={() => addBomItem(null)}
            className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Tambah Root Item
          </button>
        </div>
      </div>

      {bomData.length > 0 ? (
        <BomTreeTable items={bomData} />
      ) : (
        <EmptyState title="BOM Kosong" message={`Belum ada data Bill of Materials untuk produk ${state.activeProduct.nama}.`} />
      )}
    </div>
  );
}
