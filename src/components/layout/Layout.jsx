import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { DashboardProvider } from '../../contexts/DashboardContext';
import { SimulationProvider } from '../../contexts/SimulationContext';

export function Layout() {
  return (
    <DashboardProvider>
      <SimulationProvider>
        <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans text-slate-900">
          <Sidebar />
          <div className="flex-1 flex flex-col h-screen min-w-0">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-6 relative">
              <Outlet />
            </main>
          </div>
        </div>
      </SimulationProvider>
    </DashboardProvider>
  );
}
