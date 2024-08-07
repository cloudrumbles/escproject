import { useState, useEffect, useCallback } from 'react';
import { HotelCardProps } from '../types';
import api from '../services/api';
import { SearchParams } from '../types';


const useHotels = (initialSearchParams: SearchParams) => {
  const [hotels, setHotels] = useState<HotelCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>(initialSearchParams);

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<HotelCardProps[]>('/hotels', {
        params: searchParams
      });
      setHotels(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch hotels'));
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  const updateSearchParams = (newParams: Partial<SearchParams>) => {
    setSearchParams(prevParams => ({ ...prevParams, ...newParams }));
  };

  return { hotels, isLoading, error, refetch: fetchHotels, updateSearchParams };
};

export default useHotels;