import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export function ErrorState({ error, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-rose-50 border border-rose-200 rounded-lg max-w-md mx-auto my-8">
      <AlertTriangle className="w-10 h-10 text-rose-500 mb-4" />
      <h3 className="text-lg font-semibold text-rose-800 mb-2">Terjadi Kesalahan</h3>
      <p className="text-sm text-rose-600 text-center mb-6">
        {error?.message || "Tidak dapat memuat data. Silakan periksa koneksi atau coba lagi nanti."}
      </p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Coba Lagi
        </button>
      )}
    </div>
  );
}
