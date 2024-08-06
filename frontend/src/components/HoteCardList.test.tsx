import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HotelCardList from './HotelCardList';
import { HotelCardProps } from '../types';

// Mock the HotelCard component
vi.mock('./HotelCard', () => ({
  default: ({ name, address }: HotelCardProps) => (
    <div data-testid="hotel-card">
      <h2>{name}</h2>
      <p>{address}</p>
    </div>
  ),
}));

describe('HotelCardList', () => {
  const mockHotels: HotelCardProps[] = [
    { id: '1', name: 'Hotel A', address: 'Address A', starRating: 4, guestRating: 4.5, price: 100, imageUrl: 'imageA.jpg' },
    { id: '2', name: 'Hotel B', address: 'Address B', starRating: 3, guestRating: 4.0, price: 80, imageUrl: 'imageB.jpg' },
    { id: '3', name: 'Hotel C', address: 'Address C', starRating: 5, guestRating: 4.8, price: 150, imageUrl: 'imageC.jpg' },
  ];

  it('renders the correct number of HotelCard components', () => {
    render(
      <MemoryRouter>
        <HotelCardList hotels={mockHotels} />
      </MemoryRouter>
    );

    const hotelCards = screen.getAllByTestId('hotel-card');
    expect(hotelCards).toHaveLength(3);
  });

  it('passes correct props to each HotelCard', () => {
    render(
      <MemoryRouter>
        <HotelCardList hotels={mockHotels} />
      </MemoryRouter>
    );

    mockHotels.forEach((hotel) => {
      expect(screen.getByText(hotel.name)).toBeInTheDocument();
      expect(screen.getByText(hotel.address)).toBeInTheDocument();
    });
  });

  it('applies correct grid classes', () => {
    render(
      <MemoryRouter>
        <HotelCardList hotels={mockHotels} />
      </MemoryRouter>
    );

    const hotelCards = screen.getAllByTestId('hotel-card');
    const gridContainer = hotelCards[0].parentElement;
    expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3', 'gap-4');
  });

  it('renders empty grid when no hotels are provided', () => {
    render(
      <MemoryRouter>
        <HotelCardList hotels={[]} />
      </MemoryRouter>
    );

    const hotelCards = screen.queryAllByTestId('hotel-card');
    expect(hotelCards).toHaveLength(0);

    const gridContainer = document.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
  });
});