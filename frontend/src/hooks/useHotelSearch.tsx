import { useState, useEffect, useCallback } from 'react';
import { FilterState } from './useFilterState';

export interface Hotel {
  id: string;
  name: string;
  starRating: number;
  guestRating: number;
  price: number;
  image: string;
}

// Mock data for hotels
const mockHotels: Hotel[] = [
  {
    id: '1',
    name: 'Hotel A',
    starRating: 5,
    guestRating: 4.5,
    price: 200,
    image: 'http://example.com/image1.jpg',
  },
  {
    id: '2',
    name: 'Hotel B',
    starRating: 4,
    guestRating: 4.0,
    price: 150,
    image: 'http://example.com/image2.jpg',
  },
  {
    id: '3',
    name: 'Hotel C',
    starRating: 3,
    guestRating: 3.5,
    price: 100,
    image: 'http://example.com/image3.jpg',
  },
  // Add more mock hotels as needed
];

// Custom hook to fetch hotels based on filters
export const useHotelSearch = (filters: FilterState) => {
  const [hotels, setHotels] = useState<Hotel[]>([]); // List of hotels
  const [hasNextPage, setHasNextPage] = useState<boolean>(true); // Whether there are more hotels to fetch
  const [isLoading, setIsLoading] = useState<boolean>(false); // Whether hotels are currently being fetched
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false); // Whether the next page of hotels is being fetched
  const [error, setError] = useState<Error | null>(null);

  // Function to fetch hotels
  const fetchHotels = useCallback(async (page: number, filters: FilterState) => {
    try {
      // Simulate an API call with a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Filter and paginate mock hotels based on the filters and page number
      const filteredHotels = mockHotels.filter((hotel) => {
        return (
          (filters.starRating.length === 0 || filters.starRating.includes(hotel.starRating)) &&
          hotel.guestRating >= filters.guestRating &&
          hotel.price >= filters.priceRange[0] &&
          hotel.price <= filters.priceRange[1]
        );
      });

      const paginatedHotels = filteredHotels.slice((page - 1) * 10, page * 10);

      return {
        hotels: paginatedHotels,
        hasNextPage: filteredHotels.length > page * 10,
      };
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, []);

  // Function to load the initial list of hotels
  const loadHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchHotels(1, filters);
      setHotels(data.hotels);
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchHotels, filters]);

  // Function to load the next page of hotels
  const loadNextPage = useCallback(async () => {
    if (!hasNextPage || isFetchingNextPage) return;
    setIsFetchingNextPage(true);
    setError(null);
    try {
      const data = await fetchHotels(hotels.length / 10 + 1, filters);
      setHotels((prevHotels) => [...prevHotels, ...data.hotels]);
      setHasNextPage(data.hasNextPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [fetchHotels, filters, hasNextPage, hotels.length, isFetchingNextPage]);

  // Effect to load hotels when filters change
  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  return { hotels, hasNextPage, isLoading, isFetchingNextPage, loadHotels: loadNextPage, error };
};

export default useHotelSearch;
