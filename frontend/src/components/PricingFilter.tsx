import React, { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface PriceRange {
  min: number | '';
  max: number | '';
}

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 1000;

const PricingFilter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState<PriceRange>({
    min: Number(searchParams.get('priceMin')) || DEFAULT_MIN,
    max: Number(searchParams.get('priceMax')) || DEFAULT_MAX,
  });

  const updateSearchParams = useCallback(() => {
    setSearchParams((prevParams) => {
      const newParams = new URLSearchParams(prevParams);
      newParams.set('priceMin', (priceRange.min === '' ? DEFAULT_MIN : priceRange.min).toString());
      newParams.set('priceMax', (priceRange.max === '' ? DEFAULT_MAX : priceRange.max).toString());
      return newParams;
    });
  }, [priceRange, setSearchParams]);

  useEffect(() => {
    updateSearchParams();
  }, [priceRange, updateSearchParams]);

  const handlePriceChange = (type: 'min' | 'max') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    let numValue: number | '' = inputValue === '' ? '' : Math.abs(parseInt(inputValue, 10));

    if (numValue === 0 && type === 'min') numValue = '';
    if (numValue === 1000 && type === 'max') numValue = '';

    setPriceRange(prev => {
      if (type === 'min') {
        return { ...prev, min: numValue === '' ? '' : Math.min(numValue, prev.max === '' ? DEFAULT_MAX : prev.max) };
      } else {
        return { ...prev, max: numValue === '' ? '' : Math.max(numValue, prev.min === '' ? DEFAULT_MIN : prev.min) };
      }
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="price-min" className="block text-sm font-medium text-gray-700">
          Minimum price
        </label>
        <input
          type="number"
          id="price-min"
          value={priceRange.min}
          onChange={handlePriceChange('min')}
          placeholder={DEFAULT_MIN.toString()}
          min={DEFAULT_MIN}
          max={(priceRange.max === '' ? DEFAULT_MAX : priceRange.max) - 1}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="price-max" className="block text-sm font-medium text-gray-700">
          Maximum price
        </label>
        <input
          type="number"
          id="price-max"
          value={priceRange.max}
          onChange={handlePriceChange('max')}
          placeholder={DEFAULT_MAX.toString()}
          min={(priceRange.min === '' ? DEFAULT_MIN : priceRange.min) + 1}
          max={Number.MAX_SAFE_INTEGER}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default PricingFilter;