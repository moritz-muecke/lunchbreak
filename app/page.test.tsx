import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../test/test-utils'
import userEvent from '@testing-library/user-event'
import Home from './page'
import * as apiClient from './lib/api-client'

// Mock the api-client module
vi.mock('./lib/api-client', () => ({
  fetchTrips: vi.fn(),
  createTrip: vi.fn(),
  updateTrip: vi.fn(),
  deleteTrip: vi.fn(),
}))

describe('Home Page', () => {
  const mockTrips = [
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

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.fetchTrips).mockResolvedValue([])
  })

  it('renders the main heading and description', () => {
    render(<Home />)

    expect(screen.getByText(/Create or join trips to town, the supermarket, or anywhere else/)).toBeInTheDocument()
  })

  it('fetches and displays trips on mount', async () => {
    vi.mocked(apiClient.fetchTrips).mockResolvedValue(mockTrips)
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Berlin')).toBeInTheDocument()
      expect(screen.getByText('Munich')).toBeInTheDocument()
    })

    expect(apiClient.fetchTrips).toHaveBeenCalledTimes(1)
  })

  it('displays empty state when no trips are available', async () => {
    vi.mocked(apiClient.fetchTrips).mockResolvedValue([])
    render(<Home />)

    await waitFor(() => {
      expect(
        screen.getByText('No trips planned yet')
      ).toBeInTheDocument()
    })
  })

  it('renders TripForm component', async () => {
    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Create a Trip')).toBeInTheDocument()
    })
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Where are you going?')).toBeInTheDocument()
  })

  it('renders TripsList component', () => {
    render(<Home />)

    expect(screen.getByText('Available Trips')).toBeInTheDocument()
  })

  it('creates a new trip and reloads trips', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.fetchTrips).mockResolvedValue([])
    vi.mocked(apiClient.createTrip).mockResolvedValue(true)

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    })

    // Fill out the form
    const nameInput = screen.getByPlaceholderText('Enter your name')
    const destinationInput = screen.getByPlaceholderText('Where are you going?')
    const timeInputs = screen.getAllByDisplayValue('')
    const timeInput = timeInputs.find(input => (input as HTMLInputElement).type === 'time') as HTMLElement

    await user.type(nameInput, 'Alice')
    await user.type(destinationInput, 'Hamburg')
    await user.type(timeInput, '12:00')

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Create Trip' }))

    await waitFor(() => {
      expect(apiClient.createTrip).toHaveBeenCalledWith({
        driverName: 'Alice',
        destination: 'Hamburg',
        availableSeats: 3,
        departureTime: '12:00',
      })
    })

    // Should fetch trips again after creating
    await waitFor(() => {
      expect(apiClient.fetchTrips).toHaveBeenCalledTimes(2)
    })
  })

  it('does not reload trips when create fails', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.fetchTrips).mockResolvedValue([])
    vi.mocked(apiClient.createTrip).mockResolvedValue(false)

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    })

    const nameInput = screen.getByPlaceholderText('Enter your name')
    const destinationInput = screen.getByPlaceholderText('Where are you going?')
    const timeInputs = screen.getAllByDisplayValue('')
    const timeInput = timeInputs.find(input => (input as HTMLInputElement).type === 'time') as HTMLElement

    await user.type(nameInput, 'Bob')
    await user.type(destinationInput, 'Frankfurt')
    await user.type(timeInput, '13:00')
    await user.click(screen.getByRole('button', { name: 'Create Trip' }))

    await waitFor(() => {
      expect(apiClient.createTrip).toHaveBeenCalled()
    })

    // Should not fetch trips again if create failed
    expect(apiClient.fetchTrips).toHaveBeenCalledTimes(1)
  })

  it('joins a trip and reloads trips', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.fetchTrips).mockResolvedValue(mockTrips)
    vi.mocked(apiClient.updateTrip).mockResolvedValue(true)

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Berlin')).toBeInTheDocument()
    })

    // Find the "Join Trip" input and button for the first trip
    const joinInputs = screen.getAllByPlaceholderText('Enter your name to join')
    const joinButtons = screen.getAllByRole('button', { name: 'Join Trip' })

    await user.type(joinInputs[0], 'Charlie')
    await user.click(joinButtons[0])

    await waitFor(() => {
      expect(apiClient.updateTrip).toHaveBeenCalledWith('1', 'Charlie', 'join')
      expect(apiClient.fetchTrips).toHaveBeenCalledTimes(2)
    })
  })

  it('does not join trip with empty passenger name', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.fetchTrips).mockResolvedValue(mockTrips)
    vi.mocked(apiClient.updateTrip).mockResolvedValue(true)

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Berlin')).toBeInTheDocument()
    })

    const joinButtons = screen.getAllByRole('button', { name: 'Join Trip' })
    await user.click(joinButtons[0])

    // Should not call updateTrip with empty name
    expect(apiClient.updateTrip).not.toHaveBeenCalled()
  })

  it('leaves a trip and reloads trips', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.fetchTrips).mockResolvedValue(mockTrips)
    vi.mocked(apiClient.updateTrip).mockResolvedValue(true)

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument()
    })

    // Find and click the remove button for Alice
    const removeButtons = screen.getAllByText('×')
    await user.click(removeButtons[0])

    // Confirmation dialog should appear
    await waitFor(() => {
      expect(screen.getByText('Remove Passenger')).toBeInTheDocument()
    })

    // Click the confirm button in the dialog
    const confirmButton = screen.getByRole('button', { name: 'Remove' })
    await user.click(confirmButton)

    await waitFor(() => {
      expect(apiClient.updateTrip).toHaveBeenCalledWith('1', 'Alice', 'leave')
      expect(apiClient.fetchTrips).toHaveBeenCalledTimes(2)
    })
  })

  it('does not reload trips when update fails', async () => {
    const user = userEvent.setup()
    vi.mocked(apiClient.fetchTrips).mockResolvedValue(mockTrips)
    vi.mocked(apiClient.updateTrip).mockResolvedValue(false)

    render(<Home />)

    await waitFor(() => {
      expect(screen.getByText('Berlin')).toBeInTheDocument()
    })

    const joinInputs = screen.getAllByPlaceholderText('Enter your name to join')
    const joinButtons = screen.getAllByRole('button', { name: 'Join Trip' })

    await user.type(joinInputs[0], 'Charlie')
    await user.click(joinButtons[0])

    await waitFor(() => {
      expect(apiClient.updateTrip).toHaveBeenCalled()
    })

    // Should not fetch trips again if update failed
    expect(apiClient.fetchTrips).toHaveBeenCalledTimes(1)
  })
})
