import React, { createContext, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export interface AppContextType {
  user: { name: string } | null;
  setUser: (user: { name: string } | null) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string } | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{ user, setUser }}>
        {children}
      </AppContext.Provider>
    </QueryClientProvider>
  );
};