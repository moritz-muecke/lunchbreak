/**
 * Card component for displaying individual trip information
 * Handles passenger management (join/leave) and trip deletion
 */

'use client';

import { FormEvent } from 'react';
import { Trip } from '../lib/types';

type TripCardProps = {
  trip: Trip;
  onJoin: (tripId: string, passengerName: string) => Promise<void>;
  onLeave: (tripId: string, passengerName: string) => Promise<void>;
  onDelete: (tripId: string) => Promise<void>;
};

export default function TripCard({
  trip,
  onJoin,
  onLeave,
  onDelete,
}: TripCardProps) {
  const seatsLeft = trip.availableSeats - trip.passengers.length;

  const handleJoinSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem(
      'passengerName'
    ) as HTMLInputElement;
    await onJoin(trip.id, input.value);
    input.value = '';
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            {trip.destination}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400">
            Driver: {trip.driverName} • Departure: {trip.departureTime}
          </p>
        </div>
        <button
          onClick={() => onDelete(trip.id)}
          className="mt-2 sm:mt-0 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
        >
          Delete Trip
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Seats: {seatsLeft} available out of {trip.availableSeats}
        </p>
        {trip.passengers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {trip.passengers.map((passenger, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
              >
                {passenger}
                <button
                  onClick={() => onLeave(trip.id, passenger)}
                  className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {seatsLeft > 0 && (
        <form onSubmit={handleJoinSubmit} className="flex gap-2">
          <input
            type="text"
            name="passengerName"
            placeholder="Your name"
            required
            className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
          >
            Join Trip
          </button>
        </form>
      )}
    </div>
  );
}
