import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useSearchParams } from 'react-router-dom';
import PriceRange from './PriceRange';

vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
}));

describe('PriceRange', () => {
  const mockSetSearchParams = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams(), mockSetSearchParams]);
  });

  const getLastCallParams = (): URLSearchParams | null => {
    const lastCall = mockSetSearchParams.mock.lastCall;
    return lastCall ? lastCall[0] as URLSearchParams : null;
  };

  it('renders correctly with default values', () => {
    render(<PriceRange />);
    
    expect(screen.getByText('Price Range')).toBeInTheDocument();
    expect(screen.getByLabelText('Minimum Price')).toHaveValue('');
    expect(screen.getByLabelText('Maximum Price')).toHaveValue('');
  });

  it('initializes with URL parameters', () => {
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams({ minPrice: '100', maxPrice: '200' }),
      mockSetSearchParams,
    ]);

    render(<PriceRange />);
    
    expect(screen.getByLabelText('Minimum Price')).toHaveValue('100');
    expect(screen.getByLabelText('Maximum Price')).toHaveValue('200');
  });

  it('updates URL when inputs change', async () => {
    const user = userEvent.setup();
    render(<PriceRange />);
    
    await user.type(screen.getByLabelText('Minimum Price'), '100');
    await user.type(screen.getByLabelText('Maximum Price'), '200');

    await waitFor(() => {
      const params = getLastCallParams();
      expect(params).not.toBeNull();
      expect(params?.get('minPrice')).toBe('100');
      expect(params?.get('maxPrice')).toBe('200');
    });
  });

  it('displays error when min is greater than max', async () => {
    const user = userEvent.setup();
    render(<PriceRange />);
    
    await user.type(screen.getByLabelText('Minimum Price'), '200');
    await user.type(screen.getByLabelText('Maximum Price'), '100');

    expect(await screen.findByText('Minimum price cannot be greater than maximum price')).toBeInTheDocument();
  });

  it('allows only numeric input', async () => {
    const user = userEvent.setup();
    render(<PriceRange />);
    
    const minInput = screen.getByLabelText('Minimum Price');
    
    await user.type(minInput, 'abc');
    expect(minInput).toHaveValue('');

    await user.type(minInput, '123');
    expect(minInput).toHaveValue('123');
  });

  it('removes URL parameters when inputs are cleared', async () => {
    const user = userEvent.setup();
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams({ minPrice: '100', maxPrice: '200' }),
      mockSetSearchParams,
    ]);
    
    render(<PriceRange />);
    
    await user.clear(screen.getByLabelText('Minimum Price'));
    await user.clear(screen.getByLabelText('Maximum Price'));

    await waitFor(() => {
      const params = getLastCallParams();
      expect(params).not.toBeNull();
      expect(params?.toString()).toBe('');
    });
  });

  it('clears error when min becomes less than max', async () => {
    const user = userEvent.setup();
    render(<PriceRange />);
    
    await user.type(screen.getByLabelText('Minimum Price'), '200');
    await user.type(screen.getByLabelText('Maximum Price'), '100');

    expect(await screen.findByText('Minimum price cannot be greater than maximum price')).toBeInTheDocument();

    await user.clear(screen.getByLabelText('Minimum Price'));
    await user.type(screen.getByLabelText('Minimum Price'), '50');

    await waitFor(() => {
      expect(screen.queryByText('Minimum price cannot be greater than maximum price')).not.toBeInTheDocument();
    });
  });

  it('handles very large numbers correctly', async () => {
    const user = userEvent.setup();
    render(<PriceRange />);
    
    await user.type(screen.getByLabelText('Minimum Price'), '1000000000');
    await user.type(screen.getByLabelText('Maximum Price'), '9999999999');

    await waitFor(() => {
      const params = getLastCallParams();
      expect(params).not.toBeNull();
      expect(params?.get('minPrice')).toBe('1000000000');
      expect(params?.get('maxPrice')).toBe('9999999999');
    });
  });

  it('handles decimal inputs correctly', async () => {
    const user = userEvent.setup();
    render(<PriceRange />);
    
    await user.type(screen.getByLabelText('Minimum Price'), '10.99');
    await user.type(screen.getByLabelText('Maximum Price'), '20.50');

    await waitFor(() => {
      const params = getLastCallParams();
      expect(params).not.toBeNull();
      expect(params?.get('minPrice')).toBe('1099');
      expect(params?.get('maxPrice')).toBe('2050');
    });
  });

  it('handles negative inputs correctly', async () => {
    const user = userEvent.setup();
    render(<PriceRange />);
    
    await user.type(screen.getByLabelText('Minimum Price'), '-10');
    await user.type(screen.getByLabelText('Maximum Price'), '-5');

    // Assuming the component doesn't allow negative values
    await waitFor(() => {
      const params = getLastCallParams();
      expect(params?.get('minPrice')).toBe('10');
      expect(params?.get('maxPrice')).toBe(null);
    });
  });


  it('maintains other URL parameters when updating price range', async () => {
    const initialParams = new URLSearchParams({ category: 'electronics', sort: 'price-asc' });
    (useSearchParams as jest.Mock).mockReturnValue([initialParams, mockSetSearchParams]);
    
    const user = userEvent.setup();
    render(<PriceRange />);
    
    await user.type(screen.getByLabelText('Minimum Price'), '100');
    await user.type(screen.getByLabelText('Maximum Price'), '200');

    await waitFor(() => {
      const params = getLastCallParams();
      expect(params).not.toBeNull();
      expect(params?.get('minPrice')).toBe('100');
      expect(params?.get('maxPrice')).toBe('200');
      expect(params?.get('category')).toBe('electronics');
      expect(params?.get('sort')).toBe('price-asc');
    });
  });
});