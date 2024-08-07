import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type City = string;

interface SearchParams {
  destination: string;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  guests: number;
  rooms: number;
}

interface SearchInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
}

interface SuggestionsListProps {
  suggestions: City[];
  onSelect: (city: City) => void;
}

interface GuestRoomInputProps {
  guests: number;
  rooms: number;
  onGuestsChange: (guests: number) => void;
  onRoomsChange: (rooms: number) => void;
}

// Mock data
const CITIES: readonly City[] = [
  "New York", "London", "Paris", "Tokyo", "Sydney", 
  "Berlin", "Rome", "Madrid", "Moscow", "Beijing",
  "Amsterdam", "Vienna", "Prague", "Istanbul", "Dubai", 
  "Singapore", "Bangkok", "Seoul", "Mumbai", "Cairo"
] as const;

// SearchInput component
const SearchInput: React.FC<SearchInputProps> = React.memo(({ value, onChange, onFocus, onBlur }) => (
  <input 
    type="text" 
    value={value}
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    placeholder="Travel Where?" 
    className="input input-bordered w-full max-w-2xl p-4 text-lg"
    aria-label="Search for a city"
  />
));

SearchInput.displayName = 'SearchInput';

// SuggestionsList component
const SuggestionsList: React.FC<SuggestionsListProps> = React.memo(({ suggestions, onSelect }) => (
  <ul className="absolute z-10 w-full max-w-2xl mt-1 bg-white border border-gray-300 rounded-md shadow-lg text-black">
    {suggestions.map((city) => (
      <li 
        key={city}
        className="p-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => onSelect(city)}
      >
        {city}
      </li>
    ))}
  </ul>
));

SuggestionsList.displayName = 'SuggestionsList';

// GuestRoomInput component
const GuestRoomInput: React.FC<GuestRoomInputProps> = React.memo(({ guests, rooms, onGuestsChange, onRoomsChange }) => (
  <div className="flex space-x-4 mt-4">
    <div>
      <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Guests</label>
      <input
        type="number"
        id="guests"
        value={guests}
        onChange={(e) => onGuestsChange(Math.max(1, parseInt(e.target.value)))}
        min={1}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
      />
    </div>
    <div>
      <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">Rooms</label>
      <input
        type="number"
        id="rooms"
        value={rooms}
        onChange={(e) => onRoomsChange(Math.max(1, parseInt(e.target.value)))}
        min={1}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
      />
    </div>
  </div>
));

GuestRoomInput.displayName = 'GuestRoomInput';

// Custom hook for search logic
const useSearch = (initialState: SearchParams) => {
  const [searchParams, setSearchParams] = useState<SearchParams>(initialState);
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => ({ ...prev, destination: e.target.value }));
  }, []);

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setTimeout(() => setIsFocused(false), 200), []);

  const handleCitySelect = useCallback((city: City) => {
    setSearchParams(prev => ({ ...prev, destination: city }));
    setSuggestions([]);
  }, []);

  const handleDateChange = useCallback((key: 'checkInDate' | 'checkOutDate', date: Date | null) => {
    setSearchParams(prev => {
      const newParams = { ...prev, [key]: date || undefined };
      
      // Ensure checkOutDate is not before checkInDate
      if (key === 'checkInDate' && date && newParams.checkOutDate && date > newParams.checkOutDate) {
        newParams.checkOutDate = undefined;
      }
      if (key === 'checkOutDate' && date && newParams.checkInDate && date < newParams.checkInDate) {
        return prev; // Don't update if checkOutDate is before checkInDate
      }
      
      return newParams;
    });
  }, []);

  const handleGuestsChange = useCallback((guests: number) => {
    setSearchParams(prev => ({ ...prev, guests }));
  }, []);

  const handleRoomsChange = useCallback((rooms: number) => {
    setSearchParams(prev => ({ ...prev, rooms }));
  }, []);

  useEffect(() => {
    if (searchParams.destination.length > 0) {
      const filteredCities = CITIES.filter(city =>
        city.toLowerCase().startsWith(searchParams.destination.toLowerCase())
      );
      setSuggestions(filteredCities);
    } else {
      setSuggestions([]);
    }
  }, [searchParams.destination]);

  return {
    searchParams,
    suggestions,
    isFocused,
    handleSearchChange,
    handleFocus,
    handleBlur,
    handleCitySelect,
    handleDateChange,
    handleGuestsChange,
    handleRoomsChange,
  };
};

// Home component
const Home: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchParams,
    suggestions,
    isFocused,
    handleSearchChange,
    handleFocus,
    handleBlur,
    handleCitySelect,
    handleDateChange,
    handleGuestsChange,
    handleRoomsChange,
  } = useSearch({
    destination: '',
    checkInDate: undefined,
    checkOutDate: undefined,
    guests: 1,
    rooms: 1
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchParams.destination.trim() && searchParams.checkInDate && searchParams.checkOutDate) {
      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0]; // This will return YYYY-MM-DD
      };
  
      const params = new URLSearchParams({
        destination_id: searchParams.destination,
        checkin: formatDate(searchParams.checkInDate),
        checkout: formatDate(searchParams.checkOutDate),
        guests: searchParams.guests.toString(),
        rooms: searchParams.rooms.toString()
      });
      navigate(`/listings?${params.toString()}`);
    } else {
      // Show an error message or handle incomplete form
      alert("Please fill in all fields including both check-in and check-out dates.");
    }
  }, [navigate, searchParams]);

  const containerStyles = `
    text-center 
    transition-all duration-300 
    ${isFocused || searchParams.destination ? 'transform -translate-y-40' : ''}
  `;

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className={containerStyles}>
        <h1 className="text-3xl font-bold mb-4">TAVERNS</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <SearchInput 
              value={searchParams.destination}
              onChange={handleSearchChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {suggestions.length > 0 && (
              <SuggestionsList 
                suggestions={suggestions}
                onSelect={handleCitySelect}
              />
            )}
          </div>
          <div className="flex space-x-4">
            <DatePicker
              selected={searchParams.checkInDate}
              onChange={(date: Date | null) => handleDateChange('checkInDate', date)}
              selectsStart
              startDate={searchParams.checkInDate}
              endDate={searchParams.checkOutDate}
              minDate={new Date()} // Prevent selecting dates in the past
              placeholderText="Check-in"
              className="input input-bordered p-2"
            />
            <DatePicker
              selected={searchParams.checkOutDate}
              onChange={(date: Date | null) => handleDateChange('checkOutDate', date)}
              selectsEnd
              startDate={searchParams.checkInDate}
              endDate={searchParams.checkOutDate}
              minDate={searchParams.checkInDate || new Date()} // Use check-in date or today as minimum
              placeholderText="Check-out"
              className="input input-bordered p-2"
              disabled={!searchParams.checkInDate} // Disable if check-in date is not selected
            />
          </div>
          <GuestRoomInput
            guests={searchParams.guests}
            rooms={searchParams.rooms}
            onGuestsChange={handleGuestsChange}
            onRoomsChange={handleRoomsChange}
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors w-full"
            aria-label="Search"
          >
            Search
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;