/**
 * @fileoverview Custom React hook for filtering hotel data based on search parameters.
 */

import { useEffect, useState } from 'react';
import { HotelCardProps } from '../types';

/**
 * Custom hook for filtering hotel data based on search parameters.
 * 
 * @param {HotelCardProps[]} hotels - An array of hotel data to be filtered.
 * @param {URLSearchParams} searchParams - The search parameters to apply as filters.
 * @returns {HotelCardProps[]} An array of filtered hotel data.
 */
const useFilteredHotels = (hotels: HotelCardProps[], searchParams: URLSearchParams) => {
    const [filteredHotels, setFilteredHotels] = useState<HotelCardProps[]>([]);
  
    useEffect(() => {
      /**
       * Applies filters to the hotels array based on the search parameters.
       * 
       * @function applyFilters
       */
      const applyFilters = () => {
        let result = hotels;
  
        // Filter by star rating
        const starRatings = searchParams.getAll('star').map(Number);
        if (starRatings.length > 0) {
          result = result.filter(hotel => starRatings.includes(hotel.starRating));
        }
  
        // Filter by guest rating
        const guestRating = Number(searchParams.get('guest')) || 0;
        result = result.filter(hotel => hotel.guestRating >= guestRating);
  
        // Filter by price range
        const priceMin = Number(searchParams.get('minPrice')) || 0;
        const priceMax = Number(searchParams.get('maxPrice')) || Infinity;
        result = result.filter(hotel => hotel.price >= priceMin && hotel.price <= priceMax);
  
        setFilteredHotels(result);
      };
  
      applyFilters();
    }, [searchParams, hotels]);
  
    return filteredHotels;
  };

export default useFilteredHotels;