import { useState, useEffect } from 'react';
import { getBomByProduct } from '../lib/queries';
import { useDashboard } from '../contexts/DashboardContext';

export function useBomData() {
  const { state } = useDashboard();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBom = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBomByProduct(state.activeProduct.group);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBom();
  }, [state.activeProduct]);

  return { data, loading, error, refetch: fetchBom };
}
