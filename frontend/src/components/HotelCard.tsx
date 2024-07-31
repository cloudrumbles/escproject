import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HotelCardProps } from '../types';

const HotelCard: React.FC<HotelCardProps> = ({
  name,
  id,
  address,
  starRating,
  guestRating,
  price,
  imageUrl,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/hotel/${id}`);
  };

  return (
    <div 
      className="card card-compact bg-base-100 shadow-xl hover:shadow-2xl hover:bg-base-300 transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer"
      onClick={handleClick}
    >
      <figure><img src={imageUrl} alt={name} className="w-full h-48 object-cover" /></figure>
      <div className="card-body">
        <h2 className="card-title">{name}</h2>
        <p className="text-gray-600">{address}</p>
        <p className="text-yellow-500">Star Rating: {starRating}/5</p>
        <p className="text-yellow-500">Guest Rating: {guestRating}/5</p>
        <p className="text-green-500">Price: ${price}</p>
      </div>
    </div>
  );
};

export default HotelCard;