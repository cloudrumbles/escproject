import React from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * A component to handle filter settings for star ratings, guest ratings, and price ranges.
 * Uses URL search parameters for dynamic updates and state synchronization across browser sessions.
 */
const FilterPanel: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filter values from URL parameters or set default values if none are present.
  const starRating = searchParams.getAll('star').map(Number);
  const guestRating = Number(searchParams.get('guest')) || 0;
  const priceMin = Number(searchParams.get('priceMin')) || 0;
  const priceMax = Number(searchParams.get('priceMax')) || 1000;

  /**
   * Updates URL search parameters based on specified filter changes.
   * Uses a transactional approach to avoid unnecessary history entries.
   * @param updates A map of filter names to their new values (string or array).
   */
  const updateSearchParams = (updates: Record<string, string | string[]>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      newParams.delete(key);
      if (Array.isArray(value)) {
        value.forEach(v => newParams.append(key, v.toString()));
      } else if (value !== '') {
        newParams.set(key, value.toString());
      }
    });
    setSearchParams(newParams, { replace: true });
  };

  /**
   * Handles changes to the star rating by either adding or removing a star from the filter.
   * @param star The star rating to toggle (1-5).
   */
  const handleStarRatingChange = (star: number) => {
    const newStarRating = starRating.includes(star)
      ? starRating.filter(s => s !== star)
      : [...starRating, star];
    updateSearchParams({ star: newStarRating.map(String) });
  };

  /**
   * Updates the guest rating based on user input from a range slider.
   * @param event The change event from the input element.
   */
  const handleGuestRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchParams({ guest: event.target.value });
  };

  /**
   * Adjusts the minimum or maximum price based on user input.
   * @param index Indicates which price to update (0 for min, 1 for max).
   * @param value The new price value.
   */
  const handlePriceRangeChange = (index: number, value: string) => {
    updateSearchParams({
      [index === 0 ? 'priceMin' : 'priceMax']: value
    });
  };

  return (
    <div className="bg-gray-900 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Filters</h2>
      
      {/* Interface for selecting star ratings */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Star Rating</h3>
        {[1, 2, 3, 4, 5].map((star) => (
          <label key={star} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={starRating.includes(star)}
              onChange={() => handleStarRatingChange(star)}
              className="mr-2"
            />
            {`${star} Star${star > 1 ? 's' : ''}`}
          </label>
        ))}
      </div>

      {/* Slider for selecting guest ratings */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Guest Rating</h3>
        <input
          type="range"
          min="0"
          max="5"
          value={guestRating}
          onChange={handleGuestRatingChange}
          className="w-full"
        />
        <span>{guestRating}+</span>
      </div>

      {/* Inputs for defining price range */}
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <div className="flex justify-between">
          <input
            type="number"
            value={priceMin}
            onChange={(e) => handlePriceRangeChange(0, e.target.value)}
            className="w-20 p-1 border rounded"
          />
          <span className="mx-2">-</span>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => handlePriceRangeChange(1, e.target.value)}
            className="w-20 p-1 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
