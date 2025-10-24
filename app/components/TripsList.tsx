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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">
        Available Trips
      </h2>
      {trips.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips planned yet</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Create the first trip above to get started coordinating with your colleagues
          </p>
        </div>
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
