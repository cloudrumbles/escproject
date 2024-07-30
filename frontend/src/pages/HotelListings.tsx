import React, { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from 'react-query';
import { FixedSizeList as List } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

// Types
interface Hotel {
  id: string;
  name: string;
  starRating: number;
  guestRating: number;
  price: number;
  image: string;
}

interface FilterState {
  starRating: number[];
  guestRating: number;
  priceRange: [number, number];
}

interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

interface HotelFetchResult {
  hotels: Hotel[];
  nextPage: number | null;
}

// Mock API function
const fetchHotels = async (
  page: number,
  filters: FilterState,
  searchParams: SearchParams
): Promise<HotelFetchResult> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate mock data
  const hotels: Hotel[] = Array.from({ length: 20 }, (_, i) => ({
    id: `hotel-${page}-${i}`,
    name: `${searchParams.destination} Hotel ${page * 20 + i + 1}`,
    starRating: Math.floor(Math.random() * 5) + 1,
    guestRating: Math.floor(Math.random() * 5) + 5,
    price: Math.floor(Math.random() * (filters.priceRange[1] - filters.priceRange[0])) + filters.priceRange[0],
    image: `/api/placeholder/300/200`,
  }));

  // Apply filters
  const filteredHotels = hotels.filter(hotel => 
    filters.starRating.includes(hotel.starRating) &&
    hotel.guestRating >= filters.guestRating &&
    hotel.price >= filters.priceRange[0] &&
    hotel.price <= filters.priceRange[1]
  );

  return {
    hotels: filteredHotels,
    nextPage: page < 5 ? page + 1 : null, // Limit to 5 pages for this example
  };
};

// HotelCard component
interface HotelCardProps {
  hotel: Hotel;
  onSelect: (id: string) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect }) => (
  <div className="card card-side bg-base-100 shadow-xl mb-4">
    <figure><img src={hotel.image} alt={hotel.name} className="w-32 h-32 object-cover" /></figure>
    <div className="card-body">
      <h2 className="card-title">{hotel.name}</h2>
      <p>Star Rating: {hotel.starRating}</p>
      <p>Guest Rating: {hotel.guestRating}/10</p>
      <p className="text-lg font-semibold">${hotel.price} per night</p>
      <div className="card-actions justify-end">
        <button 
          onClick={() => onSelect(hotel.id)}
          className="btn btn-primary"
        >
          Select
        </button>
      </div>
    </div>
  </div>
);

// Main HotelSearchResults component
const HotelSearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extract and parse search parameters
  const searchParamsObj: SearchParams = {
    destination: searchParams.get('destination') || '',
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
    guests: parseInt(searchParams.get('guests') || '1', 10),
    rooms: parseInt(searchParams.get('rooms') || '1', 10),
  };

  // Initialize filter state
  const [filters, setFilters] = useState<FilterState>({
    starRating: [1, 2, 3, 4, 5],
    guestRating: 0,
    priceRange: [0, 1000],
  });

  // Use React Query for data fetching
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<HotelFetchResult, Error>(
    ['hotels', filters, searchParamsObj],
    ({ pageParam = 0 }) => fetchHotels(pageParam, filters, searchParamsObj),
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  // Flatten hotel data from all pages
  const hotels = data?.pages.flatMap(page => page.hotels) || [];

  // Callback for loading more items
  const loadMoreItems = useCallback(() => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isFetchingNextPage, fetchNextPage]);

  // Check if an item is loaded
  const isItemLoaded = useCallback((index: number) => !hasNextPage || index < hotels.length, [hasNextPage, hotels.length]);

  // Handle star rating filter change
  const handleStarRatingChange = useCallback((rating: number) => {
    setFilters(prev => ({
      ...prev,
      starRating: prev.starRating.includes(rating)
        ? prev.starRating.filter(r => r !== rating)
        : [...prev.starRating, rating],
    }));
  }, []);

  // Handle guest rating filter change
  const handleGuestRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, guestRating: parseInt(e.target.value, 10) }));
  };

  // Handle price range filter change
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, boundary: 'min' | 'max') => {
    const value = parseInt(e.target.value, 10);
    setFilters(prev => ({
      ...prev,
      priceRange: boundary === 'min' 
        ? [value, prev.priceRange[1]] 
        : [prev.priceRange[0], value],
    }));
  };

  // Handle hotel selection
  const handleSelectHotel = useCallback((hotelId: string) => {
    navigate(`/hotel/${hotelId}`);
  }, [navigate]);

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Hotels in {searchParamsObj.destination}</h1>
      <div className="flex flex-col md:flex-row">
        {/* Filter Panel */}
        <div className="w-full md:w-1/4 pr-4 mb-4 md:mb-0">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Filters</h2>
              {/* Star Rating Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Star Rating</span>
                </label>
                {[1, 2, 3, 4, 5].map(rating => (
                  <label key={rating} className="label cursor-pointer">
                    <span className="label-text">{rating} Stars</span>
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={filters.starRating.includes(rating)}
                      onChange={() => handleStarRatingChange(rating)}
                    />
                  </label>
                ))}
              </div>
              {/* Guest Rating Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Guest Rating</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={filters.guestRating}
                  onChange={handleGuestRatingChange}
                  className="range"
                  step="1"
                />
                <div className="w-full flex justify-between text-xs px-2">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
              {/* Price Range Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price Range</span>
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    className="input input-bordered w-full max-w-xs"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 'min')}
                  />
                  <span className="mx-2">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="input input-bordered w-full max-w-xs"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 'max')}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Hotel Listings */}
        <div className="w-full md:w-3/4">
          <InfiniteLoader
            isItemLoaded={isItemLoaded}
            itemCount={hotels.length + (hasNextPage ? 1 : 0)}
            loadMoreItems={loadMoreItems}
          >
            {({ onItemsRendered, ref }) => (
              <List
                height={600}
                itemCount={hotels.length + (hasNextPage ? 1 : 0)}
                itemSize={200}
                onItemsRendered={onItemsRendered}
                ref={ref}
                width="100%"
              >
                {({ index, style }) => {
                  if (!isItemLoaded(index)) {
                    return <div style={style} className="loading loading-spinner loading-lg"></div>;
                  }
                  const hotel = hotels[index];
                  return (
                    <div style={style}>
                      <HotelCard 
                        hotel={hotel} 
                        onSelect={handleSelectHotel} 
                      />
                    </div>
                  );
                }}
              </List>
            )}
          </InfiniteLoader>
        </div>
      </div>
    </div>
  );
};

export default HotelSearchResults;