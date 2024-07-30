import React, { createContext, useState, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export interface FilterState {
  starRating: number[];
  guestRating: number;
  priceRange: [number, number];
}

export interface AppContextType {
  user: { name: string } | null;
  setUser: (user: { name: string } | null) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
}

const initialFilters: FilterState = {
  starRating: [],
  guestRating: 0,
  priceRange: [0, 1000]
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ user, setUser, filters, setFilters }}>
        {children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
};