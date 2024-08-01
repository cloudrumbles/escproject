import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import AppRoutes from '.';

// Mock the components
vi.mock('../pages/Home', () => ({ default: () => <div>Home Page</div> }));
vi.mock('../pages/HotelSearch', () => ({ default: () => <div>Hotel Listings Page</div> }));
vi.mock('../pages/DetailedView', () => ({ default: () => <div>Detailed View Page</div> }));

describe('AppRoutes', () => {
  it('renders Home component for / route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  it('renders HotelListings component for /listings route', () => {
    render(
      <MemoryRouter initialEntries={['/listings']}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText('Hotel Listings Page')).toBeInTheDocument();
  });

  it('renders DetailedView component for /hotel/:id route', () => {
    render(
      <MemoryRouter initialEntries={['/hotel/123']}>
        <AppRoutes />
      </MemoryRouter>
    );
    expect(screen.getByText('Detailed View Page')).toBeInTheDocument();
  });
});