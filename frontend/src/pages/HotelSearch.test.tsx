import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import HotelSearch from './HotelSearch';
import { HotelCardProps } from '../types';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
  },
}));

// Mock FilterPanel component
vi.mock('../components/FilterPanel', () => ({
  default: vi.fn(({ updateSearchParams }) => (
    <div data-testid="filter-panel">
      <button onClick={() => updateSearchParams({ star: ['4', '5'] })}>Set 4-5 Stars</button>
      <input
        type="range"
        data-testid="guest-rating-slider"
        onChange={(e) => updateSearchParams({ guest: e.target.value })}
      />
      <button onClick={() => updateSearchParams({ priceMin: '100', priceMax: '200' })}>Set Price Range</button>
    </div>
  )),
}));

// Mock HotelCardList component
vi.mock('../components/HotelCardList', () => ({
  default: vi.fn(({ hotels }: { hotels: HotelCardProps[] }) => (
    <div data-testid="hotel-card-list">
      {hotels.map((hotel) => (
        <div key={hotel.id} data-testid={`hotel-${hotel.id}`}>
          {hotel.name} - {hotel.address} - {hotel.starRating} stars - Guest Rating: {hotel.guestRating} - Price: ${hotel.price}
        </div>
      ))}
    </div>
  )),
}));

const mockHotels: HotelCardProps[] = [
  { id: 'diH1', name: 'Hotel A', address: '123 Main St, City A', starRating: 4, guestRating: 8.5, price: 100, imageUrl: 'image-a.jpg' },
  { id: 'diH2', name: 'Hotel B', address: '456 Oak St, City B', starRating: 3, guestRating: 7.5, price: 80, imageUrl: 'image-b.jpg' },
  { id: 'diH3', name: 'Hotel C', address: '789 Pine St, City C', starRating: 5, guestRating: 9.0, price: 150, imageUrl: 'image-c.jpg' },
  { id: 'diH4', name: 'Hotel D', address: '101 Elm St, City D', starRating: 2, guestRating: 6.5, price: 60, imageUrl: 'image-d.jpg' },
  { id: 'diH5', name: 'Hotel E', address: '202 Maple St, City E', starRating: 4, guestRating: 8.0, price: 120, imageUrl: 'image-e.jpg' },
];

describe('HotelSearch', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockHotels });
  });

  const renderComponent = async (initialEntries: string[] = ['']) => {
    let rendered;
    await act(async () => {
      rendered = render(
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="*" element={<HotelSearch />} />
          </Routes>
        </MemoryRouter>
      );
    });
    return rendered;
  };

  it('renders the component and fetches hotels', async () => {
    await renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
      expect(screen.getByTestId('hotel-card-list')).toBeInTheDocument();
    });

    mockHotels.forEach((hotel) => {
      expect(screen.getByTestId(`hotel-${hotel.id}`)).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith('http://localhost:3100/api/hotels');
  });

  it('filters hotels based on star rating', async () => {
    await renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Set 4-5 Stars'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('hotel-diH1')).toBeInTheDocument();
      expect(screen.getByTestId('hotel-diH3')).toBeInTheDocument();
      expect(screen.getByTestId('hotel-diH5')).toBeInTheDocument();
      expect(screen.queryByTestId('hotel-diH2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('hotel-diH4')).not.toBeInTheDocument();
    });
  });

  it('filters hotels based on guest rating', async () => {
    await renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(screen.getByTestId('guest-rating-slider'), { target: { value: '8' } });
    });

    await waitFor(() => {
      expect(screen.getByTestId('hotel-diH1')).toBeInTheDocument();
      expect(screen.getByTestId('hotel-diH3')).toBeInTheDocument();
      expect(screen.getByTestId('hotel-diH5')).toBeInTheDocument();
      expect(screen.queryByTestId('hotel-diH2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('hotel-diH4')).not.toBeInTheDocument();
    });
  });

  it('filters hotels based on price range', async () => {
    await renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Set Price Range'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('hotel-diH1')).toBeInTheDocument();
      expect(screen.getByTestId('hotel-diH3')).toBeInTheDocument();
      expect(screen.getByTestId('hotel-diH5')).toBeInTheDocument();
      expect(screen.queryByTestId('hotel-diH2')).not.toBeInTheDocument();
      expect(screen.queryByTestId('hotel-diH4')).not.toBeInTheDocument();
    });
  });

  it('handles API error', async () => {
    const errorMessage = 'API Error';
    (axios.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error(errorMessage));

    await renderComponent();

    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching data', async () => {
    let resolvePromise: (value: unknown) => void;
    (axios.get as ReturnType<typeof vi.fn>).mockReturnValue(new Promise((resolve) => {
      resolvePromise = resolve;
    }));

    await renderComponent();

    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await act(async () => {
      resolvePromise!({ data: mockHotels });
    });

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('hotel-card-list')).toBeInTheDocument();
    });
  });

  it('displays no results message when filtered hotels are empty', async () => {
    await renderComponent();

    await waitFor(() => {
      expect(screen.getByTestId('filter-panel')).toBeInTheDocument();
    });

    // Set an impossible combination of filters
    await act(async () => {
      fireEvent.click(screen.getByText('Set 4-5 Stars'));
      fireEvent.change(screen.getByTestId('guest-rating-slider'), { target: { value: '10' } });
    });

    await waitFor(() => {
      expect(screen.getByTestId('no-results')).toBeInTheDocument();
    });
  });
});