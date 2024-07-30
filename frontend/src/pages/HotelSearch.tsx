import React, { useState } from 'react';
import FilterPanel, { FilterState } from '../components/FilterPanel';
import HotelAPIPoller from '../services/HotelAPIPoller';
import VirtualizedHotelList from '../components/VirtualizedHotelList';


const initialFilters: FilterState = {
  starRating: [],
  guestRating: 0,
  priceRange: [0, 1000]
};

const HotelSearchPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedHotel, setSelectedHotel] = useState<string | null>(null);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleHotelSelect = (hotelId: string) => {
    setSelectedHotel(hotelId);
    // You can add additional logic here, like opening a modal or navigating to a details page
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 p-4 bg-gray-100">
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
      </div>
      <div className="w-3/4 p-4">
        <HotelAPIPoller destinationId="example-destination" filters={filters}>
          {({ hotels, isLoading, error, pollAgain }) => (
            <VirtualizedHotelList
              hotels={hotels}
              isLoading={isLoading}
              error={error}
              onLoadMore={pollAgain}
              onSelectHotel={handleHotelSelect}
            />
          )}
        </HotelAPIPoller>
      </div>
    </div>
  );
};

export default HotelSearchPage;