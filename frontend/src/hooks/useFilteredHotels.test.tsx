import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useFilteredHotels from './useFilteredHotels';
import { HotelCardProps } from '../types';

const mockHotels: HotelCardProps[] = [
  { id: '1', name: 'Hotel A', address: '123 Main St, City A', starRating: 4, guestRating: 8.5, price: 100, imageUrl: 'image-a.jpg' },
  { id: '2', name: 'Hotel B', address: '456 Oak St, City B', starRating: 3, guestRating: 7.5, price: 80, imageUrl: 'image-b.jpg' },
  { id: '3', name: 'Hotel C', address: '789 Pine St, City C', starRating: 5, guestRating: 9.0, price: 150, imageUrl: 'image-c.jpg' },
  { id: '4', name: 'Hotel D', address: '101 Elm St, City D', starRating: 4, guestRating: 8.0, price: 120, imageUrl: 'image-d.jpg' },
];

describe('useFilteredHotels', () => {
  it('returns all hotels when no filters are applied', () => {
    const searchParams = new URLSearchParams();
    const { result } = renderHook(() => useFilteredHotels(mockHotels, searchParams));
    expect(result.current).toEqual(mockHotels);
  });

  it('filters hotels by star rating', () => {
    const searchParams = new URLSearchParams('star=4&star=5');
    const { result } = renderHook(() => useFilteredHotels(mockHotels, searchParams));
    expect(result.current).toEqual([mockHotels[0], mockHotels[2], mockHotels[3]]);
  });

  it('filters hotels by guest rating', () => {
    const searchParams = new URLSearchParams('guest=8.5');
    const { result } = renderHook(() => useFilteredHotels(mockHotels, searchParams));
    expect(result.current).toEqual([mockHotels[0], mockHotels[2]]);
  });

  it('filters hotels by price range', () => {
    const searchParams = new URLSearchParams('minPrice=90&maxPrice=130');
    const { result } = renderHook(() => useFilteredHotels(mockHotels, searchParams));
    expect(result.current).toEqual([mockHotels[0], mockHotels[3]]);
  });

  it('filters hotels by max price', () => {
    const searchParams = new URLSearchParams('maxPrice=100');
    const { result } = renderHook(() => useFilteredHotels(mockHotels, searchParams));
    expect(result.current).toEqual([mockHotels[0], mockHotels[1]]);
  });

  it('applies multiple filters', () => {
    const searchParams = new URLSearchParams('star=4&guest=8.5&minPrice=90&maxPrice=130');
    const { result } = renderHook(() => useFilteredHotels(mockHotels, searchParams));
    expect(result.current).toEqual([mockHotels[0]]);
  });

  it('returns empty array when no hotels match filters', () => {
    const searchParams = new URLSearchParams('star=2');
    const { result } = renderHook(() => useFilteredHotels(mockHotels, searchParams));
    expect(result.current).toEqual([]);
  });
});