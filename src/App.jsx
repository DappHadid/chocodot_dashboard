import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { BomPage } from './pages/BomPage';
import { MrpPage } from './pages/MrpPage';
import { RekapPage } from './pages/RekapPage';
import { DemandPage } from './pages/DemandPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="demand" element={<DemandPage />} />
          <Route path="bom" element={<BomPage />} />
          <Route path="mrp" element={<MrpPage />} />
          <Route path="rekap" element={<RekapPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
