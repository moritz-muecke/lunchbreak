/**
 * List component for displaying all available trips
 * Handles empty state and renders TripCard components
 */

'use client';

import { Trip } from '../lib/types';
import TripCard from './TripCard';

type TripsListProps = {
  trips: Trip[];
  onJoin: (tripId: string, passengerName: string) => Promise<void>;
  onLeave: (tripId: string, passengerName: string) => Promise<void>;
  onDelete: (tripId: string) => Promise<void>;
};

export default function TripsList({
  trips,
  onJoin,
  onLeave,
  onDelete,
}: TripsListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Available Trips
      </h2>
      {trips.length === 0 ? (
        <p className="text-zinc-600 dark:text-zinc-400">
          No trips planned yet. Create one above!
        </p>
      ) : (
        trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onJoin={onJoin}
            onLeave={onLeave}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
