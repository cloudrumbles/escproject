import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Hotel, Room } from '../types';

// Mock API call for hotel details
const fetchHotelDetails = async (id: string): Promise<Hotel> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id,
    name: `Hotel ${id}`,
    starRating: Math.floor(Math.random() * 5) + 1,
    guestRating: Math.floor(Math.random() * 10) + 1,
    price: Math.floor(Math.random() * 500) + 50,
    image: `https://example.com/hotel-${id}.jpg`,
    description: `This is a detailed description for Hotel ${id}.`
  };
};

// Mock API call for room details
const fetchRoomDetails = async (hotelId: string = 'DiH7'): Promise<Room[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  return Array.from({ length: 3 }, (_, i) => ({
    id: `room-${i + 1}`,
    name: `Room Type ${i + 1}`,
    description: `Description for Room Type ${i + 1}`,
    price: Math.floor(Math.random() * 200) + 100,
    capacity: Math.floor(Math.random() * 4) + 1,
    hotelId: hotelId
  }));
};

const HotelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [hotelData, roomsData] = await Promise.all([
          fetchHotelDetails(id!),
          fetchRoomDetails(id!)
        ]);
        setHotel(hotelData);
        setRooms(roomsData);
      } catch (err) {
        setError('Failed to load hotel details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!hotel) return <div>Hotel not found</div>;

  return (
    <div className="container mx-auto p-4">
      <button onClick={() => navigate(-1)} className="btn btn-secondary mb-4">
        Back to Search
      </button>
      <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-6">
        <img src={hotel.image} alt={hotel.name} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
          <p className="mb-2">Star Rating: {hotel.starRating}</p>
          <p className="mb-2">Guest Rating: {hotel.guestRating}/10</p>
          <p className="mb-4">{hotel.description}</p>
          <p className="text-2xl font-semibold">From ${hotel.price} per night</p>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map(room => (
          <div key={room.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
              <p className="mb-2">{room.description}</p>
              <p className="mb-2">Capacity: {room.capacity} person(s)</p>
              <p className="text-lg font-bold">${room.price} per night</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelDetails;