import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, useSearchParams } from 'react-router-dom'
import FilterPanel from './FilterPanel'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useSearchParams: vi.fn(),
  }
})

vi.mock('./PricingFilter', () => ({
  default: vi.fn(() => <div data-testid="pricing-filter">Mock PricingFilter</div>),
}))

describe('FilterPanel', () => {
  const mockSetSearchParams = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderFilterPanel = (initialParams = new URLSearchParams()) => {
    (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
      initialParams,
      mockSetSearchParams,
    ])
    render(
      <MemoryRouter>
        <FilterPanel />
      </MemoryRouter>
    )
  }

  describe('Rendering', () => {
    beforeEach(() => {
      renderFilterPanel()
    })

    it('renders all filter sections', () => {
      expect(screen.getByText('Filters')).toBeInTheDocument()
      expect(screen.getByText('Star Rating')).toBeInTheDocument()
      expect(screen.getByText('Guest Rating')).toBeInTheDocument()
      expect(screen.getByText('Price Range')).toBeInTheDocument()
    })

    it('renders all star rating checkboxes', () => {
      [1, 2, 3, 4, 5].forEach(star => {
        expect(screen.getByLabelText(`${star} Star${star > 1 ? 's' : ''}`)).toBeInTheDocument()
      })
    })

    it('renders guest rating slider', () => {
      expect(screen.getByRole('slider')).toBeInTheDocument()
    })

    it('renders PricingFilter component', () => {
      expect(screen.getByTestId('pricing-filter')).toBeInTheDocument()
    })
  })

  describe('Initial State', () => {
    it('correctly reflects initial URL parameters for star rating', () => {
      renderFilterPanel(new URLSearchParams('star=3&star=4'))
      expect(screen.getByLabelText('3 Stars')).toBeChecked()
      expect(screen.getByLabelText('4 Stars')).toBeChecked()
      expect(screen.getByLabelText('5 Stars')).not.toBeChecked()
    })

    it('correctly reflects initial URL parameters for guest rating', () => {
      renderFilterPanel(new URLSearchParams('guest=4'))
      expect(screen.getByRole('slider')).toHaveValue('4')
      expect(screen.getByText('4+')).toBeInTheDocument()
    })
  })

  describe('Star Rating Interaction', () => {
    beforeEach(() => {
      renderFilterPanel()
    })

    it('updates star rating when checkbox is clicked', () => {
      fireEvent.click(screen.getByLabelText('3 Stars'))
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams),
        { replace: true }
      )
      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams
      expect(updatedParams.getAll('star')).toContain('3')
    })

    it('removes star rating when checkbox is unchecked', () => {
      renderFilterPanel(new URLSearchParams('star=3&star=4'))
      fireEvent.click(screen.getByLabelText('3 Stars'))
      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams
      expect(updatedParams.getAll('star')).not.toContain('3')
      expect(updatedParams.getAll('star')).toContain('4')
    })

    it('handles multiple star ratings', () => {
      fireEvent.click(screen.getByLabelText('3 Stars'))
      fireEvent.click(screen.getByLabelText('4 Stars'))
      const updatedParams = mockSetSearchParams.mock.calls[1][0] as URLSearchParams
      expect(updatedParams.getAll('star').sort()).toEqual(['3', '4'])
    })

    it('removes star parameter when all stars are unchecked', () => {
      renderFilterPanel(new URLSearchParams('star=3'))
      fireEvent.click(screen.getByLabelText('3 Stars'))
      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams
      expect(updatedParams.has('star')).toBe(false)
    })
  })

  describe('Guest Rating Interaction', () => {
    beforeEach(() => {
      renderFilterPanel()
    })

    it('updates guest rating when slider is changed', () => {
      fireEvent.change(screen.getByRole('slider'), { target: { value: '4' } })
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams),
        { replace: true }
      )
      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams
      expect(updatedParams.get('guest')).toBe('4')
    })

    it('updates displayed guest rating value', () => {
      fireEvent.change(screen.getByRole('slider'), { target: { value: '4' } })
      expect(screen.getByText('4+')).toBeInTheDocument()
    })

    it('removes guest parameter when slider is set to 0', () => {
      renderFilterPanel(new URLSearchParams('guest=3'))
      fireEvent.change(screen.getByRole('slider'), { target: { value: '0' } })
      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams
      expect(updatedParams.has('guest')).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('handles invalid initial star rating gracefully', () => {
      renderFilterPanel(new URLSearchParams('star=invalid'))
      expect(screen.getAllByRole('checkbox', { checked: false }).length).toBe(5)
    })

    it('handles invalid initial guest rating gracefully', () => {
      renderFilterPanel(new URLSearchParams('guest=invalid'))
      expect(screen.getByRole('slider')).toHaveValue('0')
    })
  })
})