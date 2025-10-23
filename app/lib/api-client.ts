/**
 * API client for trip-related operations
 * Handles all HTTP communication with the backend
 */

import { Trip, TripAction } from './types';

/**
 * Fetches all available trips
 */
export async function fetchTrips(): Promise<Trip[]> {
  const response = await fetch('/api/trips');
  const data = await response.json();
  return data.trips || [];
}

/**
 * Creates a new trip
 */
export async function createTrip(tripData: {
  destination: string;
  driverName: string;
  availableSeats: number;
  departureTime: string;
}): Promise<boolean> {
  const response = await fetch('/api/trips', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tripData),
  });

  return response.ok;
}

/**
 * Updates a trip (join or leave)
 */
export async function updateTrip(
  tripId: string,
  passengerName: string,
  action: TripAction
): Promise<boolean> {
  const response = await fetch('/api/trips', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tripId,
      passengerName,
      action,
    }),
  });

  return response.ok;
}

/**
 * Deletes a trip
 */
export async function deleteTrip(tripId: string): Promise<boolean> {
  const response = await fetch('/api/trips', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tripId }),
  });

  return response.ok;
}
