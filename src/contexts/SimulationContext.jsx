import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useDashboard } from './DashboardContext';
import { getBomByProduct } from '../lib/queries';
import { calculateMRP } from '../lib/mrpEngine';

const SimulationContext = createContext();

export function SimulationProvider({ children }) {
  const { state: dashboardState } = useDashboard();
  const [bomData, setBomData] = useState([]);
  const [demandData, setDemandData] = useState(Array(12).fill(0)); // 12 months
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial BOM when product changes
  //dsadadas
  //dsadadssa
  //dsadadsadasdsa
  useEffect(() => {
    let mounted = true;
    const fetchInitialBom = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getBomByProduct(dashboardState.activeProduct.group);
        if (mounted) {
          // Fix bug from database where merged Excel cells resulted in level 0 for Assembly items
          let lastLevel = 0;
          const fixedBomData = result.map((item, idx) => {
            let currentLevel = item.level;
            // If level is 0 but it's not the first item (root), it likely should inherit the last level
            if (currentLevel === 0 && idx > 0) {
              currentLevel = lastLevel;
            } else {
              lastLevel = currentLevel;
            }
            return { ...item, level: currentLevel };
          });
          
          setBomData(fixedBomData);
          // Reset demand when product changes, or keep it. Let's reset for now.
          setDemandData(Array(12).fill(0));
        }
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchInitialBom();
    return () => { mounted = false; };
  }, [dashboardState.activeProduct]);

  // Derived MRP Data
  const mrpData = useMemo(() => {
    try {
      return calculateMRP(bomData, demandData);
    } catch (err) {
      console.error("MRP Calculation Error:", err);
      return [];
    }
  }, [bomData, demandData]);

  // Actions
  const updateDemand = (monthIndex, value) => {
    const newDemand = [...demandData];
    newDemand[monthIndex] = Number(value) || 0;
    setDemandData(newDemand);
  };

  const updateBomItem = (index, field, value) => {
    const newBom = [...bomData];
    newBom[index] = { ...newBom[index], [field]: Number(value) || 0 };
    setBomData(newBom);
  };

  const updateBomItemText = (index, field, value) => {
    const newBom = [...bomData];
    newBom[index] = { ...newBom[index], [field]: value };
    setBomData(newBom);
  }

  const addBomItem = (parentIndex) => {
    const newBom = [...bomData];
    const parent = newBom[parentIndex];
    const newItem = {
      product_group: dashboardState.activeProduct.group,
      no: parent ? parent.no + 1 : (newBom.length > 0 ? newBom[newBom.length - 1].no + 1 : 1),
      level: parent ? parent.level + 1 : 0,
      kode: `NEW-ITEM-${Date.now().toString().slice(-4)}`,
      bahan_baku: 'Bahan Baru',
      quantity: 1,
      satuan: 'pcs',
      lead_time_minggu: 1,
      lot_size: 1,
      on_hand: 0
    };
    
    // Insert after parent
    if (parentIndex !== null && parentIndex >= 0) {
      newBom.splice(parentIndex + 1, 0, newItem);
    } else {
      newBom.push(newItem);
    }
    
    // Re-adjust 'no' to keep it sequential (optional, but good for display)
    newBom.forEach((item, idx) => {
      item.no = idx + 1;
    });

    setBomData(newBom);
  };

  const removeBomItem = (index) => {
    const newBom = [...bomData];
    // Optional: remove all children? For simplicity just remove this row.
    newBom.splice(index, 1);
    
    // Re-adjust 'no'
    newBom.forEach((item, idx) => {
      item.no = idx + 1;
    });

    setBomData(newBom);
  };

  return (
    <SimulationContext.Provider value={{
      bomData,
      demandData,
      mrpData,
      loading,
      error,
      updateDemand,
      updateBomItem,
      updateBomItemText,
      addBomItem,
      removeBomItem
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
}
