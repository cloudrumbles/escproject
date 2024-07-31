import React from 'react';
import { Star, MapPin} from 'lucide-react';
import { HotelData } from '../types';

const HotelDetails: React.FC<{ data: HotelData }> = ({ data }) => {
  if (!data) {
    return <div className="alert alert-error">No hotel data available</div>;
  }

  return (
    <div className="card w-96 bg-gray-800 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold">{data.name || 'Hotel Name Not Available'}</h2>
        {data.address && (
          <div className="flex items-center mt-2">
            <MapPin className="w-4 h-4 mr-2" />
            <p>{data.address}</p>
          </div>
        )}
        {data.rating && (
          <div className="flex items-center mt-2">
            {[...Array(Math.floor(data.rating))].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
            <span className="ml-2">{data.rating} stars</span>
          </div>
        )}
        {data.trustyou?.score?.overall && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold">TrustYou Score</h3>
            <div className="radial-progress text-primary" style={{"--value": data.trustyou.score.overall, "--size": "4rem"} as React.CSSProperties}>
              {data.trustyou.score.overall}
            </div>
          </div>
        )}
        {data.categories && Object.keys(data.categories).length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Categories</h3>
            <ul>
              {Object.entries(data.categories).map(([key, category]) => (
                <li key={key} className="flex justify-between">
                  <span>{category.name || 'Unknown'}</span>
                  <span>{category.score || 'N/A'}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.amenities_ratings && data.amenities_ratings.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Amenities Ratings</h3>
            <ul>
              {data.amenities_ratings.map((amenity, index) => (
                <li key={index} className="flex justify-between">
                  <span>{amenity.name || 'Unknown'}</span>
                  {amenity.score !== undefined && (
                    <progress className="progress progress-primary w-56" value={amenity.score} max="100"></progress>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary">Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default HotelDetails;