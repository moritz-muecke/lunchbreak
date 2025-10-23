import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchTrips, createTrip, updateTrip, deleteTrip } from './api-client'
import { Trip } from './types'

// Mock global fetch
global.fetch = vi.fn()

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchTrips', () => {
    it('fetches trips successfully', async () => {
      const mockTrips: Trip[] = [
        {
          id: '1',
          destination: 'Berlin',
          driverName: 'John',
          departureTime: '14:00',
          availableSeats: 4,
          passengers: ['Alice'],
        },
      ]

      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({ trips: mockTrips }),
      } as Response)

      const result = await fetchTrips()

      expect(fetch).toHaveBeenCalledWith('/api/trips')
      expect(result).toEqual(mockTrips)
    })

    it('returns empty array when trips property is missing', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({}),
      } as Response)

      const result = await fetchTrips()

      expect(result).toEqual([])
    })

    it('returns empty array when trips is null', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        json: async () => ({ trips: null }),
      } as Response)

      const result = await fetchTrips()

      expect(result).toEqual([])
    })
  })

  describe('createTrip', () => {
    const tripData = {
      destination: 'Munich',
      driverName: 'Jane',
      availableSeats: 3,
      departureTime: '15:30',
    }

    it('creates a trip successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
      } as Response)

      const result = await createTrip(tripData)

      expect(fetch).toHaveBeenCalledWith('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      })
      expect(result).toBe(true)
    })

    it('returns false when creation fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      const result = await createTrip(tripData)

      expect(result).toBe(false)
    })
  })

  describe('updateTrip', () => {
    it('joins a trip successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
      } as Response)

      const result = await updateTrip('1', 'Charlie', 'join')

      expect(fetch).toHaveBeenCalledWith('/api/trips', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: '1',
          passengerName: 'Charlie',
          action: 'join',
        }),
      })
      expect(result).toBe(true)
    })

    it('leaves a trip successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
      } as Response)

      const result = await updateTrip('2', 'Alice', 'leave')

      expect(fetch).toHaveBeenCalledWith('/api/trips', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId: '2',
          passengerName: 'Alice',
          action: 'leave',
        }),
      })
      expect(result).toBe(true)
    })

    it('returns false when update fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      const result = await updateTrip('1', 'Bob', 'join')

      expect(result).toBe(false)
    })
  })

  describe('deleteTrip', () => {
    it('deletes a trip successfully', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
      } as Response)

      const result = await deleteTrip('1')

      expect(fetch).toHaveBeenCalledWith('/api/trips', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId: '1' }),
      })
      expect(result).toBe(true)
    })

    it('returns false when deletion fails', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
      } as Response)

      const result = await deleteTrip('1')

      expect(result).toBe(false)
    })
  })
})
