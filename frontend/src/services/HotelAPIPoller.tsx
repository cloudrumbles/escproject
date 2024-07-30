import React, { useState, useEffect, useCallback } from 'react';
import { Hotel, FilterState } from '../types';

interface HotelAPIPollerProps {
  destinationId: string;
  filters: FilterState;
  children: (props: {
    hotels: Hotel[];
    isLoading: boolean;
    error: Error | null;
    pollAgain: () => void;
  }) => React.ReactNode;
}

const POLL_INTERVAL = 5000; // 5 seconds

const mockApiCall = async (destinationId: string, filters: FilterState, page: number): Promise<Hotel[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock data
  const hotels: Hotel[] = Array.from({ length: 10 * page }, (_, i) => ({
    id: `hotel-${i + 1}`,
    name: `Hotel ${i + 1}`,
    starRating: Math.floor(Math.random() * 5) + 1,
    guestRating: Math.floor(Math.random() * 10) + 1,
    price: Math.floor(Math.random() * 500) + 50,
    image: `https://example.com/hotel-${i + 1}.jpg`
  }));

  // Apply filters
  return hotels.filter(hotel => 
    (filters.starRating.length === 0 || filters.starRating.includes(hotel.starRating)) &&
    hotel.guestRating >= filters.guestRating &&
    hotel.price >= filters.priceRange[0] &&
    hotel.price <= filters.priceRange[1]
  );
};

const HotelAPIPoller: React.FC<HotelAPIPollerProps> = ({ destinationId, filters, children }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);

  const fetchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newHotels = await mockApiCall(destinationId, filters, page);
      setHotels(prevHotels => [...prevHotels, ...newHotels]);
      setPage(prevPage => prevPage + 1);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [destinationId, filters, page]);

  useEffect(() => {
    setHotels([]);
    setPage(1);
    fetchHotels();

    const intervalId = setInterval(fetchHotels, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, [destinationId, filters]);

  return children({ hotels, isLoading, error, pollAgain: fetchHotels });
};

export default HotelAPIPoller;