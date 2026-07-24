import React from 'react';
import { useLocation } from 'react-router-dom';
import { PRODUCTS } from '../../constants/products';
import { useDashboard } from '../../contexts/DashboardContext';

export function Topbar() {
  const location = useLocation();
  const { state, dispatch } = useDashboard();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard Overview';
      case '/bom': return 'Bill of Materials (BOM) Rev';
      case '/mrp': return 'MRP Revisi';
      case '/rekap': return 'Rekapitulasi Order';
      default: return 'Chocodot MRP';
    }
  };

  const handleProductChange = (e) => {
    const product = PRODUCTS.find(p => p.kode === e.target.value);
    if (product) {
      dispatch({ type: 'SET_PRODUCT', payload: product });
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="global-product" className="text-sm font-medium text-slate-600">
            Produk Aktif:
          </label>
          <select 
            id="global-product"
            value={state.activeProduct.kode}
            onChange={handleProductChange}
            className="text-sm border border-slate-300 rounded-md py-1.5 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-slate-800 cursor-pointer"
          >
            {PRODUCTS.map(p => (
              <option key={p.kode} value={p.kode}>{p.kode} - {p.nama}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
