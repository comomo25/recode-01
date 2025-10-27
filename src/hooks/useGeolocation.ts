import { useState, useEffect } from 'react';
import { Geolocation } from '../types';

interface UseGeolocationReturn {
  location: Geolocation | null;
  error: string | null;
  loading: boolean;
  refetch: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [location, setLocation] = useState<Geolocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      setError('お使いのブラウザは位置情報をサポートしていません');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
        setLoading(false);
      },
      (err) => {
        let errorMessage = '位置情報の取得に失敗しました';

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = '位置情報の使用が許可されていません';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = '位置情報が利用できません';
            break;
          case err.TIMEOUT:
            errorMessage = '位置情報の取得がタイムアウトしました';
            break;
        }

        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return {
    location,
    error,
    loading,
    refetch: fetchLocation,
  };
};
