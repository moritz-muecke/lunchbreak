/**
 * Main page component for the Lunch Break Planner
 * Coordinates trip management and renders the UI
 */

'use client';

import { useState, useEffect } from 'react';
import { Trip } from './lib/types';
import { fetchTrips, createTrip, updateTrip, deleteTrip } from './lib/api-client';
import TripForm from './components/TripForm';
import TripsList from './components/TripsList';

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);

  const loadTrips = async () => {
    const data = await fetchTrips();
    setTrips(data);
  };

  useEffect(() => {
    void fetchTrips().then(setTrips);
  }, []);

  const handleCreateTrip = async (tripData: {
    destination: string;
    driverName: string;
    availableSeats: number;
    departureTime: string;
  }) => {
    const success = await createTrip(tripData);
    if (success) {
      await loadTrips();
    }
  };

  const handleJoinTrip = async (tripId: string, passengerName: string) => {
    if (!passengerName.trim()) return;

    const success = await updateTrip(tripId, passengerName, 'join');
    if (success) {
      await loadTrips();
    }
  };

  const handleLeaveTrip = async (tripId: string, passengerName: string) => {
    const success = await updateTrip(tripId, passengerName, 'leave');
    if (success) {
      await loadTrips();
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    const success = await deleteTrip(tripId);
    if (success) {
      await loadTrips();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
          Lunch Break Planner
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Coordinate trips to town or the supermarket
        </p>

        <TripForm onSubmit={handleCreateTrip} />

        <TripsList
          trips={trips}
          onJoin={handleJoinTrip}
          onLeave={handleLeaveTrip}
          onDelete={handleDeleteTrip}
        />
      </div>
    </div>
  );
}
