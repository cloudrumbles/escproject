import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Star, Wifi, Coffee, Tv, AirVent } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

const customIcon = new L.Icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface HotelDetails {
  id: string;
  name: string;
  address: string;
  rating: number;
  description: string;
  image_details: {
    prefix: string;
    suffix: string;
    count: number;
  };
  amenities: {
    [key: string]: boolean;
  };
  trustyou: {
    score: {
      overall: number;
    };
  };
  latitude: number;
  longitude: number;
}

interface Room {
  roomDescription: string;
  images: { url: string }[];
  price: number;
  amenities: string[];
}

const HotelDetails: React.FC = () => {
  const [hotel, setHotel] = useState<HotelDetails | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/hotels/diH7');
        setHotel(response.data);
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setError('Failed to fetch hotel details');
      }
    };

    const fetchRoomPricing = async () => {
      try {
        // Example query parameters - you might want to make these dynamic
        const params = new URLSearchParams({
          destination_id: 'WD0M',
          checkin: '2024-10-01',
          checkout: '2024-10-07',
          guests: '2',
          language: 'en_US',
          currency: 'SGD',
          country_code: 'SG'
        });

        const response = await axios.get(`http://localhost:3001/api/hotels/diH7/rooms?${params}`);
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching room pricing:', error);
        setError('Failed to fetch room information');
      }
    };

    fetchHotelDetails();
    fetchRoomPricing();
  }, []);

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!hotel) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{hotel.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <img 
            src={`${hotel.image_details.prefix}0${hotel.image_details.suffix}`} 
            alt={hotel.name} 
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
        
        <div>
          <p className="flex items-center mb-2">
            <MapPin className="mr-2" /> {hotel.address}
          </p>
          <p className="flex items-center mb-2">
            {[...Array(hotel.rating)].map((_, i) => (
              <Star key={i} className="text-yellow-400 mr-1" />
            ))}
            {hotel.rating} Stars
          </p>
          <p className="mb-2">
            Guest Rating: {hotel.trustyou.score.overall}/100
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {hotel.amenities.airConditioning && <AirVent className="text-blue-500" />}
            {hotel.amenities.roomService && <Coffee className="text-blue-500" />}
            {hotel.amenities.tVInRoom && <Tv className="text-blue-500" />}
            {hotel.amenities.dataPorts && <Wifi className="text-blue-500" />}
          </div>
          <MapContainer 
            center={[hotel.latitude, hotel.longitude]} 
            zoom={13} 
            style={{ height: '300px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[hotel.latitude, hotel.longitude]} icon={customIcon}>
              <Popup>{hotel.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Description</h2>
        <p dangerouslySetInnerHTML={{ __html: hotel.description }}></p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Available Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room, index) => (
            <div key={index} className="border rounded-lg p-4">
              <img 
                src={room.images[0].url} 
                alt={room.roomDescription} 
                className="w-full h-48 object-cover rounded-lg mb-2"
              />
              <h3 className="font-bold">{room.roomDescription}</h3>
              <p className="text-xl font-bold mt-2">${room.price.toFixed(2)}</p>
              <ul className="mt-2">
                {room.amenities.slice(0, 3).map((amenity, i) => (
                  <li key={i} className="text-sm">{amenity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;