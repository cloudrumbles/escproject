import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

type HotelListing = {
  id: string;
  name: string;
  description: string;
  price: number;
};

const HotelCard: React.FC<{ hotel: HotelListing }> = ({ hotel }) => (
  <div className="bg-white shadow-md rounded-lg p-4 mb-4">
    <h3 className="text-xl font-bold">{hotel.name}</h3>
    <p className="text-gray-600">{hotel.description}</p>
    <p className="text-lg font-semibold mt-2">${hotel.price} per night</p>
  </div>
);

const HotelListings: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState<HotelListing[]>([]);
  const city = searchParams.get('city') || '';

  useEffect(() => {
    const fetchHotelListings = async () => {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data generation
      const mockListings = Array.from({ length: 10 }, (_, i) => ({
        id: `hotel-${i}`,
        name: `${city} Hotel ${i + 1}`,
        description: `A lovely hotel in ${city}`,
        price: Math.floor(Math.random() * 200) + 100
      }));

      setListings(mockListings);
    };

    if (city) {
      fetchHotelListings();
    }
  }, [city]);

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">&larr; Back to Search</Link>
      <h1 className="text-3xl font-bold mb-4">Hotel Listings in {city}</h1>
      {listings.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} />
      ))}
    </div>
  );
};

export default HotelListings;