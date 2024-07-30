import React from 'react';
import { Hotel } from '../types';

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (id: string) => void;
}

const HotelCard: React.FC<HotelCardProps> = React.memo(({ hotel, onSelect }) => (
  <div className="card card-side bg-base-100 shadow-xl mb-4">
    <figure><img src={hotel.image} alt={hotel.name} className="w-32 h-32 object-cover" /></figure>
    <div className="card-body">
      <h2 className="card-title">{hotel.name}</h2>
      <p>Star Rating: {hotel.starRating}</p>
      <p>Guest Rating: {hotel.guestRating}/10</p>
      <p className="text-lg font-semibold">${hotel.price} per night</p>
      <div className="card-actions justify-end">
        <button 
          onClick={() => onSelect(hotel.id)}
          className="btn btn-primary"
        >
          Select
        </button>
      </div>
    </div>
  </div>
));

export default HotelCard;