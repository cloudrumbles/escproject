import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

type City = string;

interface SearchInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onSubmit: () => void;
}

interface SuggestionsListProps {
  suggestions: City[];
  onSelect: (city: City) => void;
}

// Mock data
const cities: City[] = [
  "New York", "London", "Paris", "Tokyo", "Sydney", 
  "Berlin", "Rome", "Madrid", "Moscow", "Beijing",
  "Amsterdam", "Vienna", "Prague", "Istanbul", "Dubai", 
  "Singapore", "Bangkok", "Seoul", "Mumbai", "Cairo"
];

// SearchInput component
const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onFocus, onBlur, onSubmit }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="flex">
    <input 
      type="text" 
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Travel Where?" 
      className="input input-bordered w-full max-w-2xl p-4 text-lg rounded-r-none"
      aria-label="Search for a city"
    />
    <button 
      type="submit" 
      className="bg-blue-500 text-white px-6 rounded-r-md hover:bg-blue-600 transition-colors"
      aria-label="Search"
    >
      Search
    </button>
  </form>
);

// SuggestionsList component
const SuggestionsList: React.FC<SuggestionsListProps> = ({ suggestions, onSelect }) => (
  <ul className="absolute z-10 w-full max-w-2xl mt-1 bg-white border border-gray-300 rounded-md shadow-lg text-black">
    {suggestions.map((city, index) => (
      <li 
        key={index}
        className="p-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => onSelect(city)}
      >
        {city}
      </li>
    ))}
  </ul>
);

// Home component
const Home: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (search.length > 0) {
      const filteredCities = cities.filter(city =>
        city.toLowerCase().startsWith(search.toLowerCase())
      );
      setSuggestions(filteredCities);
    } else {
      setSuggestions([]);
    }
  }, [search]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setTimeout(() => setIsFocused(false), 200);
  const handleCitySelect = (city: City) => {
    setSearch(city);
    setSuggestions([]);
  };

  const handleSubmit = () => {
    if (search.trim()) {
      navigate(`/listings?city=${encodeURIComponent(search)}`);
    }
  };

  const containerStyles = `
    text-center 
    transition-all duration-300 
    ${isFocused || search ? 'transform -translate-y-40' : ''}
  `;

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className={containerStyles}>
        <h1 className="text-3xl font-bold mb-4">TAVERNS</h1>
        <div className="relative">
          <SearchInput 
            value={search}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onSubmit={handleSubmit}
          />
          {suggestions.length > 0 && (
            <SuggestionsList 
              suggestions={suggestions}
              onSelect={handleCitySelect}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
