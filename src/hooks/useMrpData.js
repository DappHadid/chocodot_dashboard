import { useState, useEffect } from 'react';
import { getMrpByProduct } from '../lib/queries';
import { useDashboard } from '../contexts/DashboardContext';

export function useMrpData() {
  const { state } = useDashboard();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMrp = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMrpByProduct(state.activeProduct.group);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMrp();
  }, [state.activeProduct]);

  return { data, loading, error, refetch: fetchMrp };
}
