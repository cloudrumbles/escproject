import React from 'react';
import { useInfiniteQuery } from 'react-query';
import { FilterState, Hotel } from '../types';
import { useAppContext } from '../hooks/useAppContext';

interface HotelAPIPollerProps {
  destinationId: string;
  children: (props: {
    hotels: Hotel[];
    isLoading: boolean;
    error: Error | null;
    fetchNextPage: () => void;
    hasNextPage: boolean;
  }) => React.ReactNode;
}

const PAGE_SIZE = 10;
const TOTAL_HOTELS = 100;

const generateAllHotels = (destinationId: string): Hotel[] => {
  return Array.from({ length: TOTAL_HOTELS }, (_, i) => ({
    id: `hotel-${i + 1}`,
    name: `Hotel ${i + 1} in ${destinationId}`,
    starRating: Math.floor(Math.random() * 5) + 1,
    guestRating: Math.floor(Math.random() * 10) + 1,
    price: Math.floor(Math.random() * 500) + 50,
    image: `https://example.com/hotel-${i + 1}.jpg`,
    description: `This is a detailed description for Hotel ${i + 1}.`
  }));
};

const mockApiCall = async (
  allHotels: Hotel[],
  filters: FilterState,
  page: number
): Promise<Hotel[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const filteredHotels = allHotels.filter(hotel => 
    (filters.starRating.length === 0 || filters.starRating.includes(hotel.starRating)) &&
    hotel.guestRating >= filters.guestRating &&
    hotel.price >= filters.priceRange[0] &&
    hotel.price <= filters.priceRange[1]
  );

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  return filteredHotels.slice(start, end);
};

const HotelAPIPoller: React.FC<HotelAPIPollerProps> = ({ destinationId, children }) => {
  const { filters } = useAppContext();
  const allHotels = React.useMemo(() => generateAllHotels(destinationId), [destinationId]);

  const fetchHotels = async ({ pageParam = 1 }) => {
    const data = await mockApiCall(allHotels, filters, pageParam);
    return { data, nextPage: pageParam + 1, totalPages: Math.ceil(TOTAL_HOTELS / PAGE_SIZE) };
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    error
  } = useInfiniteQuery(
    ['hotels', destinationId, filters],
    fetchHotels,
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.nextPage <= lastPage.totalPages) return lastPage.nextPage;
        return undefined;
      },
    }
  );

  const hotels = data ? data.pages.flatMap(page => page.data) : [];

  return children({ 
    hotels, 
    isLoading, 
    error: error as Error | null, 
    fetchNextPage,
    hasNextPage: !!hasNextPage
  });
};

export default HotelAPIPoller;