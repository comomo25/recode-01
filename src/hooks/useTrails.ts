import { useState, useEffect, useCallback } from 'react';
import { Trail } from '../types';
import { getAllTrails } from '../services/trailService';

interface UseTrailsReturn {
  trails: Trail[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTrails = (): UseTrailsReturn => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTrails = await getAllTrails();
      setTrails(fetchedTrails);
    } catch (err) {
      console.error('Error fetching trails:', err);
      setError(err instanceof Error ? err.message : '軌跡の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrails();
  }, [fetchTrails]);

  return {
    trails,
    loading,
    error,
    refetch: fetchTrails,
  };
};
