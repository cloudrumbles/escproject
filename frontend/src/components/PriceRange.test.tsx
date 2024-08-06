import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import PriceRange from './PriceRange';

// Mock useSearchParams
vi.mock('react-router-dom', () => ({
  useSearchParams: vi.fn(),
}));

describe('PriceRange', () => {
  beforeEach(() => {
    console.log('Clearing all mocks before each test');
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    console.log('Starting "renders correctly" test');
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams(), vi.fn()]);
    render(<PriceRange />);
    console.log('Checking if "Price Range" text is present');
    expect(screen.getByText('Price Range')).toBeInTheDocument();
    console.log('Checking if "Minimum Price" input is present');
    expect(screen.getByLabelText('Minimum Price')).toBeInTheDocument();
    console.log('Checking if "Maximum Price" input is present');
    expect(screen.getByLabelText('Maximum Price')).toBeInTheDocument();
    console.log('Render test completed successfully');
  });

  it('initializes with URL parameters', () => {
    console.log('Starting "initializes with URL parameters" test');
    console.log('Mocking useSearchParams with initial values');
    const mockSetSearchParams = vi.fn();
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams({ minPrice: '100', maxPrice: '200' }),
      mockSetSearchParams,
    ]);
    render(<PriceRange />);
    console.log('Checking if Minimum Price input has value "100"');
    expect(screen.getByLabelText('Minimum Price')).toHaveValue('100');
    console.log('Checking if Maximum Price input has value "200"');
    expect(screen.getByLabelText('Maximum Price')).toHaveValue('200');
    console.log('URL parameters initialization test completed successfully');
  });

  it('updates URL when inputs change', async () => {
    console.log('Starting "updates URL when inputs change" test');
    const mockSetSearchParams = vi.fn();
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams(), mockSetSearchParams]);
    render(<PriceRange />);
    
    const minInput = screen.getByLabelText('Minimum Price');
    const maxInput = screen.getByLabelText('Maximum Price');

    console.log('Changing Minimum Price input to "100"');
    fireEvent.change(minInput, { target: { value: '100' } });
    console.log('Changing Maximum Price input to "200"');
    fireEvent.change(maxInput, { target: { value: '200' } });

    console.log('Waiting for mockSetSearchParams to be called');
    await waitFor(() => {
      expect(mockSetSearchParams).toHaveBeenCalled();
    });

    const lastCall = mockSetSearchParams.mock.calls[mockSetSearchParams.mock.calls.length - 1];
    console.log('Last call to mockSetSearchParams:', lastCall);
    const expectedParams = new URLSearchParams({ minPrice: '100', maxPrice: '200' });
    console.log('Expected params:', expectedParams.toString());
    console.log('Actual params:', lastCall[0].toString());
    expect(lastCall[0].toString()).toBe(expectedParams.toString());
    console.log('URL update test completed successfully');
  });

  it('displays error when min is greater than max', async () => {
    console.log('Starting "displays error when min is greater than max" test');
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams(), vi.fn()]);
    render(<PriceRange />);
    
    const minInput = screen.getByLabelText('Minimum Price');
    const maxInput = screen.getByLabelText('Maximum Price');

    console.log('Setting Minimum Price to "200"');
    fireEvent.change(minInput, { target: { value: '200' } });
    console.log('Setting Maximum Price to "100"');
    fireEvent.change(maxInput, { target: { value: '100' } });

    console.log('Waiting for error message to appear');
    await waitFor(() => {
      expect(screen.getByText('Minimum price cannot be greater than maximum price')).toBeInTheDocument();
    });
    console.log('Error display test completed successfully');
  });

  it('allows only numeric input', () => {
    console.log('Starting "allows only numeric input" test');
    (useSearchParams as jest.Mock).mockReturnValue([new URLSearchParams(), vi.fn()]);
    render(<PriceRange />);
    
    const minInput = screen.getByLabelText('Minimum Price');

    console.log('Attempting to input non-numeric value "abc"');
    fireEvent.change(minInput, { target: { value: 'abc' } });
    console.log('Checking if input value is empty');
    expect(minInput).toHaveValue('');

    console.log('Inputting numeric value "123"');
    fireEvent.change(minInput, { target: { value: '123' } });
    console.log('Checking if input value is "123"');
    expect(minInput).toHaveValue('123');
    console.log('Numeric input test completed successfully');
  });

  it('removes URL parameters when inputs are cleared', async () => {
    console.log('Starting "removes URL parameters when inputs are cleared" test');
    console.log('Mocking useSearchParams with initial values');
    const mockSetSearchParams = vi.fn();
    (useSearchParams as jest.Mock).mockReturnValue([
      new URLSearchParams({ minPrice: '100', maxPrice: '200' }),
      mockSetSearchParams,
    ]);
    render(<PriceRange />);
    
    const minInput = screen.getByLabelText('Minimum Price');
    const maxInput = screen.getByLabelText('Maximum Price');

    console.log('Clearing Minimum Price input');
    fireEvent.change(minInput, { target: { value: '' } });
    console.log('Clearing Maximum Price input');
    fireEvent.change(maxInput, { target: { value: '' } });

    console.log('Waiting for mockSetSearchParams to be called');
    await waitFor(() => {
      expect(mockSetSearchParams).toHaveBeenCalled();
    });

    const lastCall = mockSetSearchParams.mock.calls[mockSetSearchParams.mock.calls.length - 1];
    console.log('Last call to mockSetSearchParams:', lastCall);
    console.log('Checking if URL parameters were removed');
    expect(lastCall[0].toString()).toBe('');
    console.log('URL parameter removal test completed successfully');
  });
});