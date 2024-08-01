import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import PricingFilter from './PricingFilter';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(),
  };
});

describe('PricingFilter', () => {
  const mockSetSearchParams = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
      new URLSearchParams(),
      mockSetSearchParams,
    ]);
  });

  it('renders min and max price inputs', () => {
    render(
      <MemoryRouter>
        <PricingFilter />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Minimum price')).toBeInTheDocument();
    expect(screen.getByLabelText('Maximum price')).toBeInTheDocument();
  });

  it('initializes with default values when no URL params', () => {
    render(
      <MemoryRouter>
        <PricingFilter />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Minimum price')).toHaveValue(0);
    expect(screen.getByLabelText('Maximum price')).toHaveValue(1000);
  });

  it('initializes with URL param values when available', () => {
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
      new URLSearchParams('priceMin=100&priceMax=500'),
      mockSetSearchParams,
    ]);
    render(
      <MemoryRouter>
        <PricingFilter />
      </MemoryRouter>
    );
    expect(screen.getByLabelText('Minimum price')).toHaveValue(100);
    expect(screen.getByLabelText('Maximum price')).toHaveValue(500);
  });

  it('updates URL params when price range changes', () => {
    render(
      <MemoryRouter>
        <PricingFilter />
      </MemoryRouter>
    );
  
    fireEvent.change(screen.getByLabelText('Minimum price'), { target: { value: '200' } });
    fireEvent.change(screen.getByLabelText('Maximum price'), { target: { value: '800' } });
  
    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function));
    const updatedSearchParams = mockSetSearchParams.mock.calls[mockSetSearchParams.mock.calls.length - 1][0](new URLSearchParams());
    expect(updatedSearchParams.get('priceMin')).toBe('200');
    expect(updatedSearchParams.get('priceMax')).toBe('800');
  });

  it('prevents setting minimum price higher than maximum price', () => {
    render(
      <MemoryRouter>
        <PricingFilter />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Minimum price'), { target: { value: '1500' } });
    fireEvent.change(screen.getByLabelText('Maximum price'), { target: { value: '1000' } });

    expect(screen.getByLabelText('Minimum price')).toHaveValue(1000);
    expect(screen.getByLabelText('Maximum price')).toHaveValue(1000);
  });

  it('only accepts non-negative numbers and clears on default value', () => {
    render(
      <MemoryRouter>
        <PricingFilter />
      </MemoryRouter>
    );
  
    const minInput = screen.getByLabelText('Minimum price');
    const maxInput = screen.getByLabelText('Maximum price');
  
    // Test preventing negative numbers
    fireEvent.change(minInput, { target: { value: '-100' } });
    expect(minInput).toHaveValue(100);
  
    fireEvent.change(maxInput, { target: { value: '-200' } });
    expect(maxInput).toHaveValue(200);
  
    // Test clearing on default value
    fireEvent.change(minInput, { target: { value: '0' } });
    expect(minInput).toHaveValue(null);
  
    fireEvent.change(maxInput, { target: { value: '1000' } });
    expect(maxInput).toHaveValue(null);
  
    // Test accepting positive numbers
    fireEvent.change(minInput, { target: { value: '50' } });
    expect(minInput).toHaveValue(50);
  
    fireEvent.change(maxInput, { target: { value: '1500' } });
    expect(maxInput).toHaveValue(1500);
  });
});