import { useState, useEffect } from 'react';
import { getRekapByProduct, getAllRekap } from '../lib/queries';
import { useDashboard } from '../contexts/DashboardContext';

export function useRekapData(fetchAll = false) {
  const { state } = useDashboard();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRekap = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = fetchAll 
        ? await getAllRekap()
        : await getRekapByProduct(state.activeProduct.group);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekap();
  }, [state.activeProduct, fetchAll]);

  return { data, loading, error, refetch: fetchRekap };
}
