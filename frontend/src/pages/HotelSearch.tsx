import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import VirtualizedHotelList from '../components/VirtualizedHotelList';
import { useHotelSearch } from '../hooks/useHotelSearch';
import { useAppContext } from '../hooks/useAppContext';

const HotelSearch: React.FC = () => {
  const navigate = useNavigate();
  const { hotels, isLoading, error, searchParams } = useAppContext();
  const { searchHotels } = useHotelSearch();

  useEffect(() => {
    if (searchParams.destinationId) {
      searchHotels();
    }
  }, [searchParams, searchHotels]);

  const handleHotelSelect = (hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100">
        <FilterPanel onFilterChange={searchHotels} />
      </div>
      <div className="w-3/4 p-4">
        <VirtualizedHotelList
          hotels={hotels}
          isLoading={isLoading}
          error={error}
          onLoadMore={searchHotels}
          onSelectHotel={handleHotelSelect}
        />
      </div>
    </div>
  );
};

export default HotelSearch;