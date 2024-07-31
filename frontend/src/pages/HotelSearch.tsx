import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import HotelCardList from '../components/HotelCardList';
import { HotelCardProps } from '../types';
import axios from 'axios';

const HotelSearch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState<HotelCardProps[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<HotelCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchHotels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<HotelCardProps[]>('http://localhost:3100/api/hotels');
      setHotels(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch hotels. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    searchHotels();
  }, [searchHotels]);

  useEffect(() => {
    const applyFilters = () => {
      let result = hotels;

      // Filter by star rating
      const starRatings = searchParams.getAll('star').map(Number);
      if (starRatings.length > 0) {
        result = result.filter(hotel => starRatings.includes(hotel.starRating));
      }

      // Filter by guest rating
      const guestRating = Number(searchParams.get('guest')) || 0;
      result = result.filter(hotel => hotel.guestRating >= guestRating);

      // Filter by price range
      const priceMin = Number(searchParams.get('priceMin')) || 0;
      const priceMax = Number(searchParams.get('priceMax')) || Infinity;
      result = result.filter(hotel => hotel.price >= priceMin && hotel.price <= priceMax);

      setFilteredHotels(result);
    };

    applyFilters();
  }, [searchParams, hotels]);

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-1/4 p-4 bg-gray overflow-y-auto">
        <FilterPanel />
      </div>
      <div className="w-3/4 p-4 flex flex-col">
        <div className="flex-grow overflow-y-auto">
          {isLoading && <div>Loading...</div>}
          {error && <div>Error: {error.message}</div>}
          {!isLoading && !error && filteredHotels.length > 0 && <HotelCardList hotels={filteredHotels} />}
          {!isLoading && !error && filteredHotels.length === 0 && <div>No hotels found matching the current filters.</div>}
        </div>
      </div>
    </div>
  );
};

export default HotelSearch;