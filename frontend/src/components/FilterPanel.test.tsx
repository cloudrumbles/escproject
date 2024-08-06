import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useSearchParams } from 'react-router-dom';
import FilterPanel from './FilterPanel';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useSearchParams: vi.fn(),
  }
});

vi.mock('./PriceRange', () => ({
  default: vi.fn(() => <div data-testid="price-range">Mock PriceRange</div>),
}));

describe('FilterPanel', () => {
  const mockSetSearchParams = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderFilterPanel = (initialParams = new URLSearchParams()) => {
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
      initialParams,
      mockSetSearchParams,
    ]);
    render(
      <MemoryRouter>
        <FilterPanel />
      </MemoryRouter>
    );
  };

  describe('Rendering', () => {
    beforeEach(() => {
      renderFilterPanel();
    });

    it('renders all filter sections', () => {
      expect(screen.getByText('Filters')).toBeInTheDocument();
      expect(screen.getByText('Star Rating')).toBeInTheDocument();
      expect(screen.getByText('Guest Rating')).toBeInTheDocument();
      expect(screen.getByTestId('price-range')).toBeInTheDocument();
    });

    it('renders all star rating checkboxes', () => {
      [1, 2, 3, 4, 5].forEach(star => {
        expect(screen.getByLabelText(`${star} Star${star > 1 ? 's' : ''}`)).toBeInTheDocument();
      });
    });

    it('renders guest rating slider', () => {
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });
  });

  describe('Initial State', () => {
    it('correctly reflects initial URL parameters for star rating', () => {
      renderFilterPanel(new URLSearchParams('star=3&star=4'));
      expect(screen.getByLabelText('3 Stars')).toBeChecked();
      expect(screen.getByLabelText('4 Stars')).toBeChecked();
      expect(screen.getByLabelText('5 Stars')).not.toBeChecked();
    });

    it('correctly reflects initial URL parameters for guest rating', () => {
      renderFilterPanel(new URLSearchParams('guest=4'));
      expect(screen.getByRole('slider')).toHaveValue('4');
      expect(screen.getByText('4+')).toBeInTheDocument();
    });
  });

  describe('Star Rating Interaction', () => {
    it('updates star rating when checkbox is clicked', async () => {
      renderFilterPanel();
      await userEvent.click(screen.getByLabelText('3 Stars'));
      
      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
      });

      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
      expect(updatedParams.getAll('star')).toContain('3');
    });

    it('removes star rating when checkbox is unchecked', async () => {
      renderFilterPanel(new URLSearchParams('star=3&star=4'));
      await userEvent.click(screen.getByLabelText('3 Stars'));
      
      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
      });

      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
      expect(updatedParams.getAll('star')).not.toContain('3');
      expect(updatedParams.getAll('star')).toContain('4');
    });

    it('handles multiple star ratings', async () => {
      renderFilterPanel();
      await userEvent.click(screen.getByLabelText('3 Stars'));
      await userEvent.click(screen.getByLabelText('4 Stars'));
      
      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalledTimes(2);
      });

      const updatedParams = mockSetSearchParams.mock.calls[1][0] as URLSearchParams;
      expect(updatedParams.getAll('star').sort()).toEqual(['3', '4']);
    });
  });

  describe('Guest Rating Interaction', () => {
    it('updates guest rating when slider is changed', async () => {
      renderFilterPanel();
      fireEvent.change(screen.getByRole('slider'), { target: { value: '4' } });
      
      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
      });

      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
      expect(updatedParams.get('guest')).toBe('4');
    });

    it('updates displayed guest rating value', async () => {
      renderFilterPanel();
      const slider = screen.getByRole('slider');
      
      // Initial state should be "Any"
      expect(screen.getByText('Any')).toBeInTheDocument();
      
      // Change slider value to 4
      fireEvent.change(slider, { target: { value: '4' } });
      
      // Wait for the component to update and check for "4+"
      await waitFor(() => {
        expect(screen.getByText('4+')).toBeInTheDocument();
      });
      
      // Ensure "Any" is no longer present
      expect(screen.queryByText('Any')).not.toBeInTheDocument();
    });

    it('removes guest parameter when slider is set to 0', async () => {
      renderFilterPanel(new URLSearchParams('guest=3'));
      fireEvent.change(screen.getByRole('slider'), { target: { value: '0' } });
      
      await waitFor(() => {
        expect(mockSetSearchParams).toHaveBeenCalled();
      });

      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams;
      expect(updatedParams.has('guest')).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('handles invalid initial star rating gracefully', () => {
      renderFilterPanel(new URLSearchParams('star=invalid'));
      expect(screen.getAllByRole('checkbox', { checked: false }).length).toBe(5);
    });

    it('handles invalid initial guest rating gracefully', () => {
      renderFilterPanel(new URLSearchParams('guest=invalid'));
      expect(screen.getByRole('slider')).toHaveValue('0');
    });
  });
});