/**
 * @fileoverview Custom React hook for fetching and managing hotel data.
 */

import { useState, useEffect, useCallback } from 'react';
import { HotelCardProps } from '../types';
import api from '../services/api'; 

/**
 * Custom hook for fetching and managing hotel data.
 * 
 * @returns {Object} An object containing the following properties:
 *   @property {HotelCardProps[]} hotels - An array of hotel data.
 *   @property {boolean} isLoading - Indicates if the data is currently being fetched.
 *   @property {Error|null} error - Any error that occurred during fetching, or null if no error.
 *   @property {Function} refetch - A function to manually trigger a re-fetch of the hotel data.
 */
const useHotels = () => {
  const [hotels, setHotels] = useState<HotelCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetches hotel data from the API.
   * 
   * @async
   * @function fetchHotels
   * @throws {Error} If the API request fails.
   */
  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<HotelCardProps[]>('/hotels');
      setHotels(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch hotels'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch hotels on component mount
  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return { hotels, isLoading, error, refetch: fetchHotels };
};

export default useHotels;