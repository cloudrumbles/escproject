import React from 'react';
import { HotelCardProps } from '../types';

const HotelCard: React.FC<HotelCardProps> = ({
  name,
  address,
  starRating,
  guestRating,
  price,
  imageUrl,
}) => {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden">
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{name}</h2>
        <p className="text-gray-600 mb-2">{address}</p>
        <p className="text-yellow-500 mb-2">Star Rating: {starRating}/5</p>
        <p className="text-yellow-500 mb-2">Guest Rating: {guestRating}/5</p>
        <p className="text-green-500 mb-2">Price: ${price}</p>
      </div>
    </div>
  );
};

export default HotelCard;