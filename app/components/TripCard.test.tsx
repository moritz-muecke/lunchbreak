import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test/test-utils'
import userEvent from '@testing-library/user-event'
import TripCard from './TripCard'
import { Trip } from '../lib/types'

describe('TripCard', () => {
  const mockTrip: Trip = {
    id: '1',
    destination: 'Berlin',
    driverName: 'John Doe',
    departureTime: '14:00',
    availableSeats: 4,
    passengers: ['Alice', 'Bob'],
  }

  const mockHandlers = {
    onJoin: vi.fn(),
    onLeave: vi.fn(),
    onDelete: vi.fn(),
  }

  it('renders trip information correctly', () => {
    render(<TripCard trip={mockTrip} {...mockHandlers} />)

    expect(screen.getByText('Berlin')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('14:00')).toBeInTheDocument()
  })

  it('displays correct number of available seats', () => {
    render(<TripCard trip={mockTrip} {...mockHandlers} />)

    expect(screen.getByText('2 seats available')).toBeInTheDocument()
  })

  it('displays passenger list', () => {
    render(<TripCard trip={mockTrip} {...mockHandlers} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('calls onJoin when joining a trip', async () => {
    const user = userEvent.setup()
    render(<TripCard trip={mockTrip} {...mockHandlers} />)

    const input = screen.getByPlaceholderText('Enter your name to join')
    const joinButton = screen.getByRole('button', { name: 'Join Trip' })

    await user.type(input, 'Charlie')
    await user.click(joinButton)

    expect(mockHandlers.onJoin).toHaveBeenCalledWith('1', 'Charlie')
  })

  it('calls onLeave when removing a passenger', async () => {
    const user = userEvent.setup()
    render(<TripCard trip={mockTrip} {...mockHandlers} />)

    const removeButtons = screen.getAllByText('×')
    await user.click(removeButtons[0])

    expect(mockHandlers.onLeave).toHaveBeenCalledWith('1', 'Alice')
  })

  it('calls onDelete when deleting a trip', async () => {
    const user = userEvent.setup()
    render(<TripCard trip={mockTrip} {...mockHandlers} />)

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    await user.click(deleteButton)

    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1')
  })

  it('does not show join form when no seats available', () => {
    const fullTrip = {
      ...mockTrip,
      passengers: ['Alice', 'Bob', 'Charlie', 'Dave'],
    }
    render(<TripCard trip={fullTrip} {...mockHandlers} />)

    expect(screen.queryByPlaceholderText('Enter your name to join')).not.toBeInTheDocument()
  })

  it('shows join form when seats are available', () => {
    render(<TripCard trip={mockTrip} {...mockHandlers} />)

    expect(screen.getByPlaceholderText('Enter your name to join')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Join Trip' })).toBeInTheDocument()
  })
})
