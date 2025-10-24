import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../test/test-utils'
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

  beforeEach(() => {
    vi.clearAllMocks()
  })

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

    // Confirmation dialog should appear
    expect(screen.getByText('Remove Passenger')).toBeInTheDocument()
    expect(screen.getByText('Are you sure you want to remove "Alice" from this trip?')).toBeInTheDocument()

    // Click the confirm button in the dialog
    const confirmButton = screen.getByRole('button', { name: 'Remove' })
    await user.click(confirmButton)

    expect(mockHandlers.onLeave).toHaveBeenCalledWith('1', 'Alice')
  })

  it('does not call onLeave when canceling passenger removal', async () => {
    const user = userEvent.setup()
    render(<TripCard trip={mockTrip} {...mockHandlers} />)

    const removeButtons = screen.getAllByText('×')
    await user.click(removeButtons[0])

    // Confirmation dialog should appear
    await waitFor(() => {
      expect(screen.getByText('Remove Passenger')).toBeInTheDocument()
    })

    // Click the cancel button
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    // Wait a bit to ensure any potential async operations complete
    await waitFor(() => {
      expect(screen.queryByText('Remove Passenger')).not.toBeInTheDocument()
    })

    expect(mockHandlers.onLeave).not.toHaveBeenCalled()
  })

  it('calls onDelete when deleting a trip', async () => {
    const user = userEvent.setup()
    render(<TripCard trip={mockTrip} {...mockHandlers} />)

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    await user.click(deleteButton)

    // Confirmation dialog should appear
    expect(screen.getByText('Delete Trip')).toBeInTheDocument()
    expect(screen.getByText(/Are you sure you want to delete the trip to "Berlin"/)).toBeInTheDocument()

    // Click the confirm button in the dialog
    const confirmButton = screen.getAllByRole('button', { name: 'Delete' })[1] // Second one is in the dialog
    await user.click(confirmButton)

    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1')
  })

  it('does not call onDelete when canceling trip deletion', async () => {
    const user = userEvent.setup()
    render(<TripCard trip={mockTrip} {...mockHandlers} />)

    const deleteButton = screen.getByRole('button', { name: 'Delete' })
    await user.click(deleteButton)

    // Confirmation dialog should appear
    await waitFor(() => {
      expect(screen.getByText('Delete Trip')).toBeInTheDocument()
    })

    // Click the cancel button
    const cancelButton = screen.getByRole('button', { name: 'Cancel' })
    await user.click(cancelButton)

    // Wait to ensure dialog closes
    await waitFor(() => {
      expect(screen.queryByText('Delete Trip')).not.toBeInTheDocument()
    })

    expect(mockHandlers.onDelete).not.toHaveBeenCalled()
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
