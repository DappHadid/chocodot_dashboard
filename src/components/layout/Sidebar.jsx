import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Network, CalendarDays, ReceiptText, ChevronLeft, ChevronRight } from 'lucide-react';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/demand', label: 'Data Permintaan', icon: CalendarDays },
    { to: '/bom', label: 'BOM', icon: Network },
    { to: '/mrp', label: 'MRP', icon: CalendarDays },
    { to: '/rekap', label: 'Rekap', icon: ReceiptText },
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-20 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
        {!collapsed && (
          <div className="flex items-center flex-1 overflow-hidden pr-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">MRP Dashboard</h1>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 py-6 flex flex-col gap-2 px-4 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm
                ${isActive 
                  ? 'bg-indigo-50 text-indigo-600 font-semibold' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={22} className={collapsed ? "mx-auto" : "mr-4"} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-5 border-t border-slate-100 text-xs font-semibold text-slate-400 truncate tracking-wide text-center">
        {!collapsed ? <span>MUHAMMAD RIZQI SUBAGJA</span> : <span>MRS</span>}
      </div>
    </aside>
  );
}
