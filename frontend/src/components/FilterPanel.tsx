import React from 'react';

export interface FilterState {
  starRating: number[];
  guestRating: number;
  priceRange: [number, number];
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange }) => {
  const handleStarRatingChange = (star: number) => {
    const newStarRating = filters.starRating.includes(star)
      ? filters.starRating.filter(s => s !== star)
      : [...filters.starRating, star];
    onFilterChange({ ...filters, starRating: newStarRating });
  };

  const handleGuestRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, guestRating: parseInt(event.target.value, 10) });
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newPriceRange = [...filters.priceRange] as [number, number];
    newPriceRange[index] = value;
    onFilterChange({ ...filters, priceRange: newPriceRange });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      
      {/* Star Rating */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Star Rating</h3>
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={filters.starRating.includes(star)}
              onChange={() => handleStarRatingChange(star)}
              className="mr-2"
            />
            {star} Star{star > 1 ? 's' : ''}
          </label>
        ))}
      </div>

      {/* Guest Rating */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Guest Rating</h3>
        <input
          type="range"
          min="0"
          max="10"
          value={filters.guestRating}
          onChange={handleGuestRatingChange}
          className="w-full"
        />
        <span>{filters.guestRating}+</span>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="flex justify-between">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value, 10))}
            className="w-20 p-1 border rounded"
          />
          <span className="mx-2">-</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value, 10))}
            className="w-20 p-1 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;