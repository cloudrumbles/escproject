import React from 'react';
import { useAppContext } from '../hooks/UseAppContext';

const Home: React.FC = () => {
  const { user } = useAppContext();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to our Hotel Booking App</h1>
      {user ? (
        <p className="text-lg">Hello, {user.name}!</p>
      ) : (
        <p className="text-lg">Please log in to access all features</p>
      )}
    </div>
  );
};

export default Home;