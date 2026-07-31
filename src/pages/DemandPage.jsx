import React from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { useSimulation } from '../contexts/SimulationContext';

export function DemandPage() {
  const { state: dashboardState } = useDashboard();
  const { demandData, updateDemand } = useSimulation();

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Data Permintaan (Gross Requirement Level 0)</h2>
        <p className="text-slate-500 mt-1">
          Masukkan estimasi permintaan bulanan untuk produk <span className="font-semibold text-sky-600">{dashboardState.activeProduct.nama}</span>. Data ini akan digunakan sebagai Gross Requirement pada simulasi MRP.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <h3 className="font-semibold text-slate-700">Tabel Permintaan Bulanan</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {demandData.map((val, idx) => (
              <div key={idx} className="flex flex-col">
                <label className="text-xs font-semibold text-slate-500 uppercase mb-1">
                  Bulan {idx + 1}
                </label>
                <div className="relative">
                  <input 
                    type="number"
                    min="0"
                    value={val === 0 ? '' : val}
                    onChange={(e) => updateDemand(idx, e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                    pcs
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-sky-50 rounded-lg border border-sky-100 flex items-start gap-3 text-sm text-sky-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p>
              Setiap nilai bulan ini akan dialokasikan dan dibagi rata otomatis ke 4 minggu pada bulan tersebut (misal: nilai Bulan 1 dibagi 4 dan dialokasikan ke W1-W4) saat simulasi MRP.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
