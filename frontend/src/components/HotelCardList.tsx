import React from 'react';
import { HotelCardProps } from '../types';
import HotelCard from './HotelCard';

/**
 * Props for the HotelCardList component.
 */
interface HotelCardListProps {
  /** Array of hotel objects to display */
  hotels: HotelCardProps[];
}

/**
 * A component that displays a list of hotels using HotelCard components.
 *
 * @param props - The properties containing the array of hotels to display
 * @returns A React component displaying a grid of HotelCard components
 */
const HotelCardList: React.FC<HotelCardListProps> = ({ hotels }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {hotels.map((hotel) => (
        <HotelCard key={hotel.id} {...hotel} />
      ))}
    </div>
  );
};

export default HotelCardList;