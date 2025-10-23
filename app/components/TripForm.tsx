/**
 * Form component for creating new trips
 * Handles user input validation and submission
 */

'use client';

import { useState, FormEvent } from 'react';

type TripFormProps = {
  onSubmit: (tripData: {
    destination: string;
    driverName: string;
    availableSeats: number;
    departureTime: string;
  }) => Promise<void>;
};

export default function TripForm({ onSubmit }: TripFormProps) {
  const [destination, setDestination] = useState('');
  const [driverName, setDriverName] = useState('');
  const [availableSeats, setAvailableSeats] = useState(3);
  const [departureTime, setDepartureTime] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await onSubmit({
      destination,
      driverName,
      availableSeats,
      departureTime,
    });

    // Reset form
    setDestination('');
    setDriverName('');
    setAvailableSeats(3);
    setDepartureTime('');
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-50">
        Create a Trip
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
              Your Name
            </label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
              placeholder="e.g., John"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
              placeholder="e.g., City Center, Supermarket"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
              Available Seats
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(Number(e.target.value))}
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-700 dark:text-zinc-300">
              Departure Time
            </label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          Create Trip
        </button>
      </form>
    </div>
  );
}
