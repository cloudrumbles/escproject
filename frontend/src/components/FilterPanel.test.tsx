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
    ;(useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
      new URLSearchParams(),
      mockSetSearchParams,
    ])
  })

  const renderFilterPanel = () => {
    render(
      <MemoryRouter>
        <FilterPanel />
      </MemoryRouter>
    )
  }

  describe('Rendering', () => {
    it('renders all filter sections', () => {
      renderFilterPanel()
      expect(screen.getByText('Filters')).toBeDefined()
      expect(screen.getByText('Star Rating')).toBeDefined()
      expect(screen.getByText('Guest Rating')).toBeDefined()
      expect(screen.getByText('Price Range')).toBeDefined()
    })

    it('renders all star rating checkboxes', () => {
      renderFilterPanel()
      ;[1, 2, 3, 4, 5].forEach(star => {
        expect(screen.getByLabelText(`${star} Star${star > 1 ? 's' : ''}`)).toBeDefined()
      })
    })

    it('renders guest rating slider', () => {
      renderFilterPanel()
      expect(screen.getByRole('slider')).toBeDefined()
    })

    it('renders PricingFilter component', () => {
      renderFilterPanel()
      expect(screen.getByTestId('pricing-filter')).toBeDefined()
    })
  })

  describe('Star Rating Interaction', () => {
    it('updates star rating when checkbox is clicked', () => {
      renderFilterPanel()
      fireEvent.click(screen.getByLabelText('3 Stars'))
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams),
        { replace: true }
      )
      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams
      expect(updatedParams.getAll('star')).toContain('3')
    })

    it('removes star rating when checkbox is unchecked', () => {
      (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
        new URLSearchParams('star=3&star=4'),
        mockSetSearchParams,
      ])
      renderFilterPanel()
      fireEvent.click(screen.getByLabelText('3 Stars'))
      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams
      expect(updatedParams.getAll('star')).not.toContain('3')
      expect(updatedParams.getAll('star')).toContain('4')
    })

    it('handles multiple star ratings', () => {
      renderFilterPanel()
      fireEvent.click(screen.getByLabelText('3 Stars'))
      fireEvent.click(screen.getByLabelText('4 Stars'))
      const updatedParams = mockSetSearchParams.mock.calls[1][0] as URLSearchParams
      expect(updatedParams.getAll('star').sort()).toEqual(['3', '4'])
    })

    it('removes star parameter when all stars are unchecked', () => {
      (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
        new URLSearchParams('star=3'),
        mockSetSearchParams,
      ])
      renderFilterPanel()
      fireEvent.click(screen.getByLabelText('3 Stars'))
      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams
      expect(updatedParams.has('star')).toBe(false)
    })
  })

  describe('Guest Rating Interaction', () => {
    it('updates guest rating when slider is changed', () => {
      renderFilterPanel()
      fireEvent.change(screen.getByRole('slider'), { target: { value: '4' } })
      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams),
        { replace: true }
      )
      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams
      expect(updatedParams.get('guest')).toBe('4')
    })

    it('updates displayed guest rating value', () => {
      renderFilterPanel()
      fireEvent.change(screen.getByRole('slider'), { target: { value: '4' } })
      expect(screen.getByText('4+')).toBeDefined()
    })

    it('removes guest parameter when slider is set to 0', () => {
      (useSearchParams as ReturnType<typeof vi.fn>).mockReturnValue([
        new URLSearchParams('guest=3'),
        mockSetSearchParams,
      ])
      renderFilterPanel()
      fireEvent.change(screen.getByRole('slider'), { target: { value: '0' } })
      const updatedParams = mockSetSearchParams.mock.calls[0][0] as URLSearchParams
      expect(updatedParams.has('guest')).toBe(false)
    })
  })
})