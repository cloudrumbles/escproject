import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import HotelSearch from './HotelSearch';
import { HotelCardProps } from '../types';

// Create a new instance of MockAdapter
const mock = new MockAdapter(axios);

vi.mock('../components/FilterPanel', () => ({
  default: () => <div data-testid="filter-panel" />
}));

vi.mock('../components/HotelCardList', () => ({
  default: ({ hotels }: { hotels: HotelCardProps[] }) => (
    <div data-testid="hotel-card-list">
      {hotels.map((hotel) => (
        <div key={hotel.id} data-testid={`hotel-${hotel.id}`}>
          {hotel.name}
        </div>
      ))}
    </div>
  )
}));

const mockHotels: HotelCardProps[] = [
  { id: 'diH1', name: 'Hotel A', address: '123 Main St, City A', starRating: 4, guestRating: 4.2, price: 100, imageUrl: 'image-a.jpg' },
  { id: 'diH2', name: 'Hotel B', address: '456 Oak St, City B', starRating: 3, guestRating: 3.1, price: 80, imageUrl: 'image-b.jpg' },
  { id: 'diH3', name: 'Hotel C', address: '789 Pine St, City C', starRating: 5, guestRating: 1.3, price: 150, imageUrl: 'image-c.jpg' },
];

describe('HotelSearch', () => {
  beforeEach(() => {
    mock.reset();
  });

  const renderComponent = (initialEntries: string[] = ['']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <HotelSearch />
      </MemoryRouter>
    );
  };

  it('renders the component and fetches hotels', async () => {
    mock.onGet('http://localhost:3100/api/hotels').reply(200, mockHotels);

    renderComponent();

    expect(await screen.findByTestId('filter-panel')).toBeInTheDocument();
    const hotelList = await screen.findByTestId('hotel-card-list');
    
    mockHotels.forEach((hotel) => {
      expect(within(hotelList).getByText(hotel.name)).toBeInTheDocument();
    });
  });

  it('displays loading state while fetching data', async () => {
    mock.onGet('http://localhost:3100/api/hotels').reply(() => {
      return new Promise((resolve) => {
        setTimeout(() => resolve([200, mockHotels]), 100);
      });
    });

    renderComponent();

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    expect(await screen.findByTestId('hotel-card-list')).toBeInTheDocument();
  });

  it('handles API error', async () => {
    const errorMessage = 'Failed to fetch hotels. Please try again.';
    mock.onGet('http://localhost:3100/api/hotels').reply(500, { message: errorMessage });

    renderComponent();

    expect(await screen.findByText(`Error: ${errorMessage}`)).toBeInTheDocument();
  });

  it('filters hotels based on URL parameters', async () => {
    mock.onGet('http://localhost:3100/api/hotels').reply(200, mockHotels);

    renderComponent(['?star=4&star=5&guest=8&priceMin=100&priceMax=200']);

    const hotelList = await screen.findByTestId('hotel-card-list');
    
    expect(within(hotelList).getByText('Hotel A')).toBeInTheDocument();
    expect(within(hotelList).queryByText('Hotel B')).not.toBeInTheDocument();
    expect(within(hotelList).getByText('Hotel C')).toBeInTheDocument();
  });

  it('displays no results message when filtered hotels are empty', async () => {
    mock.onGet('http://localhost:3100/api/hotels').reply(200, []);

    renderComponent(['?star=2&guest=10']);

    expect(await screen.findByText('No hotels found matching the current filters.')).toBeInTheDocument();
  });
});