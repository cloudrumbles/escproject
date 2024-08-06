import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import HotelCard from './HotelCard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HotelCard', () => {
  const mockProps = {
    name: 'Test Hotel',
    id: '123',
    address: '123 Test St, Test City',
    starRating: 4,
    guestRating: 4.5,
    price: 100,
    imageUrl: 'test-image.jpg',
  };

  it('renders hotel information correctly', () => {
    render(
      <MemoryRouter>
        <HotelCard {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Hotel')).toBeInTheDocument();
    expect(screen.getByText('123 Test St, Test City')).toBeInTheDocument();
    expect(screen.getByText('Star Rating: 4/5')).toBeInTheDocument();
    expect(screen.getByText('Guest Rating: 4.5/5')).toBeInTheDocument();
    expect(screen.getByText('Price: $100')).toBeInTheDocument();
  });

  it('renders hotel image with correct attributes', () => {
    render(
      <MemoryRouter>
        <HotelCard {...mockProps} />
      </MemoryRouter>
    );

    const image = screen.getByAltText('Test Hotel') as HTMLImageElement;
    expect(image).toBeInTheDocument();
    expect(image.src).toContain('test-image.jpg');
    expect(image).toHaveClass('w-full h-48 object-cover');
  });

  it('navigates to the correct URL when clicked', () => {
    render(
      <MemoryRouter>
        <HotelCard {...mockProps} />
      </MemoryRouter>
    );

    const card = screen.getByText('Test Hotel').closest('.card');
    expect(card).not.toBeNull();
    if (card) {
      fireEvent.click(card);
      expect(mockNavigate).toHaveBeenCalledWith('/hotel/123');
    }
  });

  it('applies correct CSS classes', () => {
    render(
      <MemoryRouter>
        <HotelCard {...mockProps} />
      </MemoryRouter>
    );

    const card = screen.getByText('Test Hotel').closest('.card');
    expect(card).not.toBeNull();
    if (card) {
      expect(card).toHaveClass('card', 'card-compact', 'bg-base-100', 'shadow-xl', 'hover:shadow-2xl', 'hover:bg-base-300', 'cursor-pointer');
    }
  });
});