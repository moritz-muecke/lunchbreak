/**
 * Shared type definitions for the Lunch Break Planner application
 */

export type Trip = {
  id: string;
  destination: string;
  driverName: string;
  availableSeats: number;
  departureTime: string;
  passengers: string[];
};

export type TripAction = 'join' | 'leave';
