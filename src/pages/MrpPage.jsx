import React from 'react';
import { MrpDetailTable } from '../components/tables/MrpDetailTable';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { useSimulation } from '../contexts/SimulationContext';
import { useDashboard } from '../contexts/DashboardContext';

export function MrpPage() {
  const { state } = useDashboard();
  const { mrpData, loading, error } = useSimulation();

  if (loading) return <LoadingSpinner text="Memuat simulasi data MRP..." />;
  if (error) return <ErrorState error={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Material Requirements Planning (MRP) - Hasil Simulasi</h2>
          <p className="text-sm text-slate-500">Perencanaan 48 minggu untuk: <span className="font-medium text-sky-600">{state.activeProduct.nama}</span></p>
        </div>
        <div className="flex gap-2">
          {/* We can add more filters here later, like row type visibility */}
        </div>
      </div>

      {mrpData.length > 0 ? (
        <div className="flex-1 min-h-0">
          <MrpDetailTable items={mrpData} />
        </div>
      ) : (
        <EmptyState title="Data MRP Kosong" message={`Silakan pastikan BOM dan Data Permintaan sudah diisi untuk ${state.activeProduct.nama}.`} />
      )}
    </div>
  );
}
