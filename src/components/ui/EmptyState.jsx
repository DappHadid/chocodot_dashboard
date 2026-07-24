import React from 'react';
import { PackageOpen } from 'lucide-react';

export function EmptyState({ title = "Data Tidak Ditemukan", message = "Belum ada data untuk ditampilkan." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <PackageOpen className="w-12 h-12 mb-4 text-slate-300" />
      <h3 className="text-lg font-medium text-slate-600">{title}</h3>
      <p className="text-sm">{message}</p>
    </div>
  );
}
