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
      className={`bg-brand text-neutral flex flex-col transition-all duration-300 shadow-xl z-20 ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="h-20 flex items-center justify-between px-6 border-b border-neutral/10">
        {!collapsed && (
          <div className="flex items-center justify-center flex-1 overflow-hidden pr-2">
            <img src="/logo_chocodot.png" alt="Chocodot Logo" className="h-14 w-auto object-contain drop-shadow-sm" />
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 hover:bg-neutral/10 rounded-lg text-neutral/70 hover:text-neutral transition-colors"
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
                flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm
                ${isActive 
                  ? 'bg-neutral text-white shadow-md transform scale-100' 
                  : 'text-neutral/80 hover:bg-white/40 hover:text-neutral hover:scale-[1.02]'}
              `}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={22} className={collapsed ? "mx-auto" : "mr-4"} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-5 border-t border-neutral/10 text-xs font-semibold text-neutral/60 truncate tracking-wide text-center">
        {!collapsed ? <span>MUHAMMAD RIZQI SUBAGJA</span> : <span>MRS</span>}
      </div>
    </aside>
  );
}
