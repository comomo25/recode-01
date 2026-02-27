import { useState, useCallback } from 'react';
import { GpxParseResult } from '../types';
import { parseGpxFile } from '../services/gpxService';

interface UseGpxParserReturn {
  result: GpxParseResult | null;
  loading: boolean;
  error: string | null;
  parse: (file: File) => Promise<void>;
  reset: () => void;
}

export const useGpxParser = (): UseGpxParserReturn => {
  const [result, setResult] = useState<GpxParseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parse = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(null);
      const parsed = await parseGpxFile(file);
      setResult(parsed);
    } catch (err) {
      console.error('Error parsing GPX:', err);
      setError(err instanceof Error ? err.message : 'GPXファイルの解析に失敗しました');
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    loading,
    error,
    parse,
    reset,
  };
};
