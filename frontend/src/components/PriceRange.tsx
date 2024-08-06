import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const PriceRange: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [min, setMin] = useState<string>(searchParams.get('minPrice') || '');
  const [max, setMax] = useState<string>(searchParams.get('maxPrice') || '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const minValue = parseInt(min);
    const maxValue = parseInt(max);

    if (min && max && !isNaN(minValue) && !isNaN(maxValue) && minValue > maxValue) {
      setError('Minimum price cannot be greater than maximum price');
      return;
    }

    setError(null);

    const newSearchParams = new URLSearchParams(searchParams);
    if (min) {
      newSearchParams.set('minPrice', min);
    } else {
      newSearchParams.delete('minPrice');
    }
    if (max) {
      newSearchParams.set('maxPrice', max);
    } else {
      newSearchParams.delete('maxPrice');
    }

    setSearchParams(newSearchParams);
  }, [min, max, searchParams, setSearchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setter(value);
    }
  };

  return (
    <div>
        <h2 className='font-semibold mb-2 text-white'>Price Range</h2>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Minimum Price</span>
          </label>
          <input
            type="text"
            placeholder="Min price"
            className="input input-bordered w-full"
            value={min}
            onChange={(e) => handleInputChange(e, setMin)}
            aria-label="Minimum Price"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Maximum Price</span>
          </label>
          <input
            type="text"
            placeholder="Max price"
            className="input input-bordered w-full"
            value={max}
            onChange={(e) => handleInputChange(e, setMax)}
            aria-label="Maximum Price"
          />
        </div>
        {error && (
          <div className="alert alert-error shadow-lg mt-4" role="alert">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
    </div>
  );
};

export default PriceRange;