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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="text-center mb-8">
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create or join trips to town, the supermarket, or anywhere else with your colleagues
          </p>
        </div>

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
