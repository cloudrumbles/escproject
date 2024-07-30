import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../hooks/useAppContext';
import { fetchHotelDetails } from '../services/api';
import { Hotel } from '../types';

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { searchParams, setSelectedHotel, setRooms, isLoading, setIsLoading, error, setError } = useAppContext();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    const loadHotelDetails = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const { hotel, rooms } = await fetchHotelDetails(id, searchParams);
        setHotel(hotel);
        setSelectedHotel(hotel);
        setRooms(rooms);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load hotel details'));
      } finally {
        setIsLoading(false);
      }
    };

    loadHotelDetails();
  }, [id, searchParams, setSelectedHotel, setRooms, setIsLoading, setError]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!hotel) return <div>Hotel not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{hotel.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <img src={hotel.image} alt={hotel.name} className="w-full h-64 object-cover rounded" />
          <p className="mt-2">{hotel.description}</p>
          <h2 className="text-2xl font-semibold mt-4">Amenities</h2>
          <ul className="list-disc list-inside">
            {hotel.amenities.map((amenity, index) => (
              <li key={index}>{amenity}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mt-4">Available Rooms</h2>
          {/* Render room options here */}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;