import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '../../test/test-utils'
import userEvent from '@testing-library/user-event'
import TripForm from './TripForm'

describe('TripForm', () => {
  it('renders form with all required fields', () => {
    const mockOnSubmit = vi.fn()
    render(<TripForm onSubmit={mockOnSubmit} />)

    expect(screen.getByText('Create a Trip')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Where are you going?')).toBeInTheDocument()
    expect(screen.getByDisplayValue('3')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create Trip' })).toBeInTheDocument()
  })

  it('has correct default values', () => {
    const mockOnSubmit = vi.fn()
    render(<TripForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByPlaceholderText('Enter your name') as HTMLInputElement
    const destinationInput = screen.getByPlaceholderText('Where are you going?') as HTMLInputElement
    const seatsInput = screen.getByDisplayValue('3') as HTMLInputElement
    const timeInput = screen.getByDisplayValue('12:00') as HTMLInputElement

    expect(nameInput.value).toBe('')
    expect(destinationInput.value).toBe('')
    expect(seatsInput.value).toBe('3')
    expect(timeInput.value).toBe('12:00')
  })

  it('updates input values when user types', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    render(<TripForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByPlaceholderText('Enter your name')
    const destinationInput = screen.getByPlaceholderText('Where are you going?')
    const seatsInput = screen.getByDisplayValue('3')
    const timeInput = screen.getByDisplayValue('12:00') as HTMLElement

    await user.clear(nameInput)
    await user.type(nameInput, 'John Doe')
    expect(nameInput).toHaveValue('John Doe')

    await user.type(destinationInput, 'Berlin')
    expect(destinationInput).toHaveValue('Berlin')

    await user.clear(seatsInput)
    await user.type(seatsInput, '5')
    expect(seatsInput).toHaveValue(5)

    await user.clear(timeInput)
    await user.type(timeInput, '14:30')
    expect(timeInput).toHaveValue('14:30')
  })

  it('calls onSubmit with correct data when form is submitted', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn()
    render(<TripForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByPlaceholderText('Enter your name')
    const destinationInput = screen.getByPlaceholderText('Where are you going?')
    const seatsInput = screen.getByDisplayValue('3')

    await user.type(nameInput, 'Alice')
    await user.type(destinationInput, 'Munich')
    await user.clear(seatsInput)
    await user.type(seatsInput, '4')

    await user.click(screen.getByRole('button', { name: 'Create Trip' }))

    expect(mockOnSubmit).toHaveBeenCalledWith({
      driverName: 'Alice',
      destination: 'Munich',
      availableSeats: 4,
      departureTime: '12:00',
    })
  })

  it('resets form after successful submission', async () => {
    const user = userEvent.setup()
    const mockOnSubmit = vi.fn().mockResolvedValue(undefined)
    render(<TripForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByPlaceholderText('Enter your name') as HTMLInputElement
    const destinationInput = screen.getByPlaceholderText('Where are you going?') as HTMLInputElement
    const timeInput = screen.getByDisplayValue('12:00') as HTMLInputElement

    await user.type(nameInput, 'Bob')
    await user.type(destinationInput, 'Hamburg')
    await user.clear(timeInput)
    await user.type(timeInput, '15:00')
    await user.click(screen.getByRole('button', { name: 'Create Trip' }))

    // Wait for form to reset
    await vi.waitFor(() => {
      expect(nameInput.value).toBe('')
      expect(destinationInput.value).toBe('')
      expect(timeInput.value).toBe('12:00')
    })
  })

  it('enforces min and max constraints on seats input', () => {
    const mockOnSubmit = vi.fn()
    render(<TripForm onSubmit={mockOnSubmit} />)

    const seatsInput = screen.getByDisplayValue('3') as HTMLInputElement

    expect(seatsInput.min).toBe('1')
    expect(seatsInput.max).toBe('10')
  })

  it('has required attributes on all inputs', () => {
    const mockOnSubmit = vi.fn()
    render(<TripForm onSubmit={mockOnSubmit} />)

    const nameInput = screen.getByPlaceholderText('Enter your name')
    const destinationInput = screen.getByPlaceholderText('Where are you going?')
    const seatsInput = screen.getByDisplayValue('3')
    const timeInput = screen.getByDisplayValue('12:00') as HTMLElement

    expect(nameInput).toBeRequired()
    expect(destinationInput).toBeRequired()
    expect(seatsInput).toBeRequired()
    expect(timeInput).toBeRequired()
  })
})
