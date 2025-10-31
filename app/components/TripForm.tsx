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
  const [departureTime, setDepartureTime] = useState('12:00');

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
    setDepartureTime('12:00');
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Create a Trip
        </h2>
        <p className="text-gray-600">
          Start a new trip and let others join you
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Enter your name"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Where are you going?"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Available Seats
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(Number(e.target.value))}
              required
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          
            <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Departure Time
            </label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-8 py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Create Trip
          </button>
        </div>
      </form>
    </div>
  );
}
