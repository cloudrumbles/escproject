import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PriceRange from './PriceRange';

interface FilterState {
  star: number[];
  guest: number;
}

type FilterUpdateType = Partial<{
  [K in keyof FilterState]: K extends 'star' ? string[] : string;
}>;

const FilterPanel: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const getInitialState = useCallback((): FilterState => ({
    star: searchParams.getAll('star').map(Number),
    guest: Number(searchParams.get('guest')) || 0,
  }), [searchParams]);

  const [filters, setFilters] = useState<FilterState>(getInitialState());

  useEffect(() => {
    setFilters(getInitialState());
  }, [searchParams, getInitialState]);

  const updateSearchParams = useCallback((updates: FilterUpdateType): void => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      newParams.delete(key);
      if (Array.isArray(value) && value.length > 0) {
        value.forEach(v => newParams.append(key, v));
      } else if (typeof value === 'string' && value !== '' && value !== '0') {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleStarRatingChange = useCallback((star: number): void => {
    const newStarRating = filters.star.includes(star)
      ? filters.star.filter(s => s !== star)
      : [...filters.star, star];
    setFilters(prev => ({ ...prev, star: newStarRating }));
    updateSearchParams({ star: newStarRating.map(String) });
  }, [filters.star, updateSearchParams]);

  const handleGuestRatingChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const value = Number(event.target.value);
    setFilters(prev => ({ ...prev, guest: value }));
    updateSearchParams({ guest: value === 0 ? '' : value.toString() });
  }, [updateSearchParams]);

  return (
    <div className="bg-gray-900 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-white">Filters</h2>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2 text-white">Star Rating</h3>
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star} className="flex items-center mb-1 text-white">
            <input
              type="checkbox"
              checked={filters.star.includes(star)}
              onChange={() => handleStarRatingChange(star)}
              className="mr-2"
            />
            {`${star} Star${star > 1 ? 's' : ''}`}
          </label>
        ))}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2 text-white">Guest Rating</h3>
        <input
          type="range"
          min="0"
          max="5"
          value={filters.guest}
          onChange={handleGuestRatingChange}
          className="w-full"
        />
        <span className="text-white">{filters.guest > 0 ? `${filters.guest}+` : 'Any'}</span>
      </div>

      <div>
        <PriceRange />
      </div>
    </div>
  );
};

export default FilterPanel;