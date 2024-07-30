// src/services/api.ts
import { Hotel, Room, FilterState, SearchParams } from '../types';

const API_BASE_URL = '/api'; // Changed from 'https://hotelapi.loyalty.dev/api'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, retries: number = 3, delayMs: number = 3000): Promise<Response> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return response;
      }

      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    } catch (error) {
      if (attempt === retries - 1) {
        throw error; // Final attempt, re-throw the error
      }
      await delay(delayMs); // Wait before retrying
    }
  }
  
  throw new Error('Max retries reached');
};

export const fetchHotels = async (searchParams: SearchParams, filters: FilterState): Promise<Hotel[]> => {
  const { destinationId, checkIn, checkOut, guests, rooms } = searchParams;
  const url = `https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=WD0M&checkin=2024-10-01&checkout=2024-10-07&lang=en_US&currency=SGD&country_code=SG&guests=2&partner_id=1`;

  try {
    const response = await fetchWithRetry(url);
    const data = await response.json();

    // Apply filters
    return data.filter((hotel: Hotel) => 
      (filters.starRating.length === 0 || filters.starRating.includes(hotel.starRating)) &&
      hotel.guestRating >= filters.guestRating &&
      hotel.price >= filters.priceRange[0] &&
      hotel.price <= filters.priceRange[1]
    );
  } catch (error) {
    console.error('Error fetching hotels:', error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};


export const fetchHotelDetails = async (hotelId: string, searchParams: SearchParams): Promise<{ hotel: Hotel, rooms: Room[] }> => {
  const { checkIn, checkOut, guests, rooms } = searchParams;
  const hotelUrl = `${API_BASE_URL}/hotels/${hotelId}`;
  const pricesUrl = `${API_BASE_URL}/hotels/${hotelId}/prices?checkin=${checkIn}&checkout=${checkOut}&guests=${guests}&rooms=${rooms}&partner_id=1`;

  const [hotelResponse, pricesResponse] = await Promise.all([
    fetch(hotelUrl),
    fetch(pricesUrl)
  ]);

  if (!hotelResponse.ok || !pricesResponse.ok) {
    throw new Error('Failed to fetch hotel details');
  }

  const hotelData = await hotelResponse.json();
  const pricesData = await pricesResponse.json();

  return {
    hotel: hotelData,
    rooms: pricesData.rooms
  };
};