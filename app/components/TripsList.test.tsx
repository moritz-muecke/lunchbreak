import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test/test-utils'
import TripsList from './TripsList'
import { Trip } from '../lib/types'

describe('TripsList', () => {
  const mockHandlers = {
    onJoin: vi.fn(),
    onLeave: vi.fn(),
    onDelete: vi.fn(),
  }

  const mockTrips: Trip[] = [
    {
      id: '1',
      destination: 'Berlin',
      driverName: 'John',
      departureTime: '14:00',
      availableSeats: 4,
      passengers: ['Alice'],
    },
    {
      id: '2',
      destination: 'Munich',
      driverName: 'Jane',
      departureTime: '15:30',
      availableSeats: 3,
      passengers: [],
    },
  ]

  it('renders the heading', () => {
    render(<TripsList trips={[]} {...mockHandlers} />)

    expect(screen.getByText('Available Trips')).toBeInTheDocument()
  })

  it('displays empty state when no trips are available', () => {
    render(<TripsList trips={[]} {...mockHandlers} />)

    expect(
      screen.getByText('No trips planned yet. Create one above!')
    ).toBeInTheDocument()
  })

  it('renders all trips when trips are provided', () => {
    render(<TripsList trips={mockTrips} {...mockHandlers} />)

    expect(screen.getByText('Berlin')).toBeInTheDocument()
    expect(screen.getByText('Munich')).toBeInTheDocument()
    expect(screen.getByText(/Driver: John/)).toBeInTheDocument()
    expect(screen.getByText(/Driver: Jane/)).toBeInTheDocument()
  })

  it('does not display empty state when trips exist', () => {
    render(<TripsList trips={mockTrips} {...mockHandlers} />)

    expect(
      screen.queryByText('No trips planned yet. Create one above!')
    ).not.toBeInTheDocument()
  })

  it('passes correct props to TripCard components', () => {
    render(<TripsList trips={mockTrips} {...mockHandlers} />)

    // Verify that each trip's unique content is rendered (indicating TripCard received correct props)
    expect(screen.getByText('Berlin')).toBeInTheDocument()
    expect(screen.getByText('Munich')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders correct number of TripCard components', () => {
    render(<TripsList trips={mockTrips} {...mockHandlers} />)

    // Each trip should have a "Delete Trip" button in its TripCard
    const deleteButtons = screen.getAllByRole('button', { name: 'Delete Trip' })
    expect(deleteButtons).toHaveLength(mockTrips.length)
  })
})
