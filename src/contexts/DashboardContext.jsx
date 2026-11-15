import React, { createContext, useContext, useReducer } from 'react';
import { PRODUCTS } from '../constants/products';

const DashboardContext = createContext();

const initialState = {
  activeProduct: PRODUCTS[0],
  // You could also add month filters here here here here
};

function dashboardReducer(state, action) {
  switch (action.type) {
    case 'SET_PRODUCT':
      return { ...state, activeProduct: action.payload };
    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
