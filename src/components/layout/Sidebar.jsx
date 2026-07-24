import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Network, CalendarDays, ReceiptText, ChevronLeft, ChevronRight } from 'lucide-react';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/bom', label: 'BOM Rev', icon: Network },
    { to: '/mrp', label: 'MRP Revisi', icon: CalendarDays },
    { to: '/rekap', label: 'Rekap', icon: ReceiptText },
  ];

  return (
    <aside 
      className={`bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}
    >
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && <span className="font-bold text-white whitespace-nowrap overflow-hidden">Chocodot MRP</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center px-3 py-2 rounded-md transition-colors
                ${isActive 
                  ? 'bg-slate-800 text-sky-400 border-l-4 border-sky-400 -ml-2 pl-[10px]' 
                  : 'hover:bg-slate-800/50 hover:text-white border-l-4 border-transparent'}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} className={collapsed ? "mx-auto" : "mr-3"} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-800 text-xs text-slate-600 truncate">
        {!collapsed && <span>MRP System v1.0</span>}
      </div>
    </aside>
  );
}
