import { useState, useCallback } from 'react';

// Define the shape of the filter state
export interface FilterState {
  starRating: number[];
  guestRating: number;
  priceRange: [number, number];
}

// Custom hook to manage filter state
export const useFilterState = (initialFilters: FilterState) => {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  return { filters, handleFilterChange };
};

export default useFilterState;
