import React, { createContext, useState, ReactNode } from 'react';
import { Hotel, Room, FilterState, SearchParams } from '../types';

export interface AppContextType {
  hotels: Hotel[];
  setHotels: React.Dispatch<React.SetStateAction<Hotel[]>>;
  selectedHotel: Hotel | null;
  setSelectedHotel: React.Dispatch<React.SetStateAction<Hotel | null>>;
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  searchParams: SearchParams;
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    starRating: [],
    guestRating: 0,
    priceRange: [0, 1000],
  });
  const [searchParams, setSearchParams] = useState<SearchParams>({
    destinationId: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  return (
    <AppContext.Provider value={{
      hotels,
      setHotels,
      selectedHotel,
      setSelectedHotel,
      rooms,
      setRooms,
      filters,
      setFilters,
      searchParams,
      setSearchParams,
      isLoading,
      setIsLoading,
      error,
      setError,
    }}>
      {children}
    </AppContext.Provider>
  );
};