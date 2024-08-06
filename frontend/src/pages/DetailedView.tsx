import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import HotelDetails from '../components/HotelDetails';
import { HotelData } from '../types';

const DetailedView: React.FC = () => {
  const [hotelData, setHotelData] = useState<HotelData | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3100/api/data2/${id}`)
        .then(response => response.json())
        .then(data => setHotelData(data))
        .catch(error => console.error('Error fetching hotel data:', error));
    }
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      {hotelData ? <HotelDetails data={hotelData} /> : <p>Loading...</p>}
    </div>
  );
};

export default DetailedView;