import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useSearchParams } from 'react-router-dom'
import FilterPanel from './FilterPanel'

// Mock useSearchParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useSearchParams: vi.fn(),
  }
})

describe('FilterPanel', () => {
  const mockSetSearchParams = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (vi.mocked(useSearchParams) as ReturnType<typeof vi.fn>).mockReturnValue([
      new URLSearchParams(),
      mockSetSearchParams,
    ]);
  });

  const renderFilterPanel = () => {
    render(
      <MemoryRouter>
        <FilterPanel />
      </MemoryRouter>
    );
  };

  it('renders all filter sections', () => {
    renderFilterPanel();
    expect(screen.getByText('Filters')).toBeInTheDocument();
    expect(screen.getByText('Star Rating')).toBeInTheDocument();
    expect(screen.getByText('Guest Rating')).toBeInTheDocument();
    expect(screen.getByText('Price Range')).toBeInTheDocument();
  });

  it('initializes filters from URL parameters', () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams('star=3&star=4&guest=3&priceMin=50&priceMax=200'),
      mockSetSearchParams,
    ]);
    renderFilterPanel();

    expect(screen.getByLabelText('3 Stars')).toBeChecked();
    expect(screen.getByLabelText('4 Stars')).toBeChecked();
    expect(screen.getByRole('slider')).toHaveValue('3');
    expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    expect(screen.getByDisplayValue('200')).toBeInTheDocument();
  });

  it('updates star rating when checkbox is clicked', () => {
    renderFilterPanel();
    fireEvent.click(screen.getByLabelText('3 Stars'));
    expect(mockSetSearchParams).toHaveBeenCalledWith(
      expect.any(URLSearchParams),
      { replace: true }
    );
    const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
    expect(updatedParams.getAll('star')).toContain('3');
  });

  it('updates guest rating when slider is changed', () => {
    renderFilterPanel();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '4' } });
    expect(mockSetSearchParams).toHaveBeenCalledWith(
      expect.any(URLSearchParams),
      { replace: true }
    );
    const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
    expect(updatedParams.get('guest')).toBe('4');
  });

  it('updates price range when input values change', () => {
    renderFilterPanel();
    fireEvent.change(screen.getByDisplayValue('0'), { target: { value: '100' } });
    fireEvent.change(screen.getByDisplayValue('1000'), { target: { value: '500' } });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(2);
    const minPriceParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
    const maxPriceParams = mockSetSearchParams.mock.calls[1][0] as URLSearchParams;
    expect(minPriceParams.get('priceMin')).toBe('100');
    expect(maxPriceParams.get('priceMax')).toBe('500');
  });

  it('handles empty price inputs correctly', () => {
    renderFilterPanel();
    fireEvent.change(screen.getByDisplayValue('0'), { target: { value: '' } });
    fireEvent.change(screen.getByDisplayValue('1000'), { target: { value: '' } });

    expect(mockSetSearchParams).toHaveBeenCalledTimes(2);
    const minPriceParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
    const maxPriceParams = mockSetSearchParams.mock.calls[1][0] as URLSearchParams;
    expect(minPriceParams.has('priceMin')).toBe(false);
    expect(maxPriceParams.has('priceMax')).toBe(false);
  });
});