import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import useHotels from './useHotels';
import api from '../services/api';

// Mock the api module
vi.mock('../services/api');

describe('useHotels', () => {
  const mockHotels = [
    { id: '1', name: 'Hotel A', address: '123 Main St, City A', starRating: 4, guestRating: 8.5, price: 100, imageUrl: 'image-a.jpg' },
    { id: '2', name: 'Hotel B', address: '456 Oak St, City B', starRating: 3, guestRating: 7.5, price: 80, imageUrl: 'image-b.jpg' },
    { id: '3', name: 'Hotel C', address: '789 Pine St, City C', starRating: 5, guestRating: 9.0, price: 150, imageUrl: 'image-c.jpg' },
    { id: '4', name: 'Hotel D', address: '101 Elm St, City D', starRating: 4, guestRating: 8.0, price: 120, imageUrl: 'image-d.jpg' },
  ];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should fetch hotels on mount', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockHotels });

    const { result } = renderHook(() => useHotels());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.hotels).toEqual([]);
    expect(result.current.error).toBe(null);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hotels).toEqual(mockHotels);
    expect(result.current.error).toBe(null);
    expect(api.get).toHaveBeenCalledWith('/hotels');
  });

  it('should handle API errors', async () => {
    const error = new Error('API Error');
    vi.mocked(api.get).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useHotels());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hotels).toEqual([]);
    expect(result.current.error).toEqual(error);
  });

  it('should refetch hotels when refetch is called', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: mockHotels });

    const { result } = renderHook(() => useHotels());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    vi.mocked(api.get).mockResolvedValueOnce({ data: [...mockHotels, { id: 3, name: 'Hotel C', starRating: 5, guestRating: 9.0, price: 150 }] });

    act(() => {
      result.current.refetch();
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hotels).toHaveLength(3);
    expect(api.get).toHaveBeenCalledTimes(2);
  });

  it('should handle non-Error objects thrown by the API', async () => {
    vi.mocked(api.get).mockRejectedValueOnce('String error');

    const { result } = renderHook(() => useHotels());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.hotels).toEqual([]);
    expect(result.current.error).toEqual(new Error('Failed to fetch hotels'));
  });
});