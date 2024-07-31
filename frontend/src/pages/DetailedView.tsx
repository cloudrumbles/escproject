import React, { useEffect, useState } from 'react';
import HotelDetails from '../components/HotelDetails';
import { HotelData } from '../types';

const DetailedView: React.FC = () => {
  const [hotelData, setHotelData] = useState<HotelData | null>(null);

  useEffect(() => {
    fetch('http://localhost:3100/api/data2/diH7')
      .then(response => response.json())
      .then(data => setHotelData(data))
      .catch(error => console.error('Error fetching hotel data:', error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      {hotelData ? <HotelDetails data={hotelData} /> : <p>Loading...</p>}
    </div>
  );
};

export default DetailedView;