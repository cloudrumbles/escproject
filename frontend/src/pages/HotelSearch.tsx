import React from 'react';
import { useNavigate } from 'react-router-dom';
import FilterPanel from '../components/FilterPanel';
import VirtualizedHotelList from '../components/VirtualizedHotelList';
import HotelAPIPoller from '../services/HotelAPIPoller';

const HotelSearch: React.FC = () => {
  const navigate = useNavigate();

  const handleHotelSelect = (hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100">
        <FilterPanel />
      </div>
      <div className="w-3/4 p-4">
        <HotelAPIPoller destinationId="example-destination">
          {({ hotels, isLoading, error, fetchNextPage, hasNextPage }) => (
            <VirtualizedHotelList
              hotels={hotels}
              isLoading={isLoading}
              error={error}
              onLoadMore={fetchNextPage}
              hasNextPage={hasNextPage}
              onSelectHotel={handleHotelSelect}
            />
          )}
        </HotelAPIPoller>
      </div>
    </div>
  );
};

export default HotelSearch;