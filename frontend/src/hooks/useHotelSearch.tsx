import { useCallback } from 'react';
import { useAppContext } from './useAppContext';
import { fetchHotels } from '../services/api';

export const useHotelSearch = () => {
  const { setHotels, filters, searchParams, setIsLoading, setError } = useAppContext();

  const searchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newHotels = await fetchHotels(searchParams, filters);
      setHotels(newHotels);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, filters, setHotels, setIsLoading, setError]);

  return { searchHotels };
};