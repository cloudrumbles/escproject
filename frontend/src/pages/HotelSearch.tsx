import React from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import HotelCardList from '../components/HotelCardList';
import useHotels from '../hooks/useHotels';
import useFilteredHotels from '../hooks/useFilteredHotels';
import { SearchParams } from '../types';


const HotelSearch: React.FC = () => {
  const [searchParams] = useSearchParams();

  const initialSearchParams: SearchParams = {
    destinationId: searchParams.get('city') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '1', 10),
    rooms: parseInt(searchParams.get('rooms') || '1', 10),
  };
  const { hotels, isLoading, error, refetch } = useHotels(initialSearchParams);
  const filteredHotels = useFilteredHotels(hotels, searchParams);

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