/**
 * Card component for displaying individual trip information
 * Handles passenger management (join/leave) and trip deletion
 */

'use client';

import { FormEvent, useState } from 'react';
import { Trip } from '../lib/types';
import ConfirmDialog from './ConfirmDialog';

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
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    type: 'deleteTrip' | 'removePassenger';
    passengerName?: string;
  }>({
    isOpen: false,
    type: 'deleteTrip',
  });

  const seatsLeft = trip.availableSeats - trip.passengers.length;

  const handleJoinSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem(
      'passengerName'
    ) as HTMLInputElement;
    await onJoin(trip.id, input.value);
    input.value = '';
  };

  const handleDeleteTrip = () => {
    setConfirmDialog({
      isOpen: true,
      type: 'deleteTrip',
    });
  };

  const handleRemovePassenger = (passengerName: string) => {
    setConfirmDialog({
      isOpen: true,
      type: 'removePassenger',
      passengerName,
    });
  };

  const handleConfirm = async () => {
    if (confirmDialog.type === 'deleteTrip') {
      await onDelete(trip.id);
    } else if (confirmDialog.type === 'removePassenger' && confirmDialog.passengerName) {
      await onLeave(trip.id, confirmDialog.passengerName);
    }
    setConfirmDialog({ isOpen: false, type: 'deleteTrip' });
  };

  const handleCancel = () => {
    setConfirmDialog({ isOpen: false, type: 'deleteTrip' });
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {trip.destination}
          </h3>
          <div className="space-y-1 text-gray-600">
            <p>
              <span className="font-medium">Driver:</span> {trip.driverName}
            </p>
            <p>
              <span className="font-medium">Departure:</span> {trip.departureTime}
            </p>
          </div>
        </div>
        <button
          onClick={handleDeleteTrip}
          className="mt-4 sm:mt-0 text-sm text-red-500 hover:text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium"
        >
          Delete
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${seatsLeft === 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {seatsLeft} seat{seatsLeft !== 1 ? 's' : ''} available
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {trip.availableSeats} total seats
          </span>
        </div>
        
        {trip.passengers.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 mb-3">Passengers:</p>
            <div className="flex flex-wrap gap-2">
              {trip.passengers.map((passenger, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm font-medium"
                >
                  {passenger}
                  <button
                    onClick={() => handleRemovePassenger(passenger)}
                    className="text-blue-600 hover:text-blue-800 ml-1 hover:bg-blue-100 rounded-full w-5 h-5 flex items-center justify-center text-xs transition-all duration-200"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {seatsLeft > 0 && (
        <form onSubmit={handleJoinSubmit} className="flex gap-3">
          <input
            type="text"
            name="passengerName"
            placeholder="Enter your name to join"
            required
            className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Join Trip
          </button>
        </form>
      )}

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.type === 'deleteTrip' ? 'Delete Trip' : 'Remove Passenger'}
        message={
          confirmDialog.type === 'deleteTrip'
            ? `Are you sure you want to delete the trip to "${trip.destination}"? This action cannot be undone.`
            : `Are you sure you want to remove "${confirmDialog.passengerName}" from this trip?`
        }
        confirmLabel={confirmDialog.type === 'deleteTrip' ? 'Delete' : 'Remove'}
        cancelLabel="Cancel"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        variant={confirmDialog.type === 'deleteTrip' ? 'danger' : 'warning'}
      />
    </div>
  );
}
