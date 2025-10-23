/**
 * API routes for trip management
 * Handles CRUD operations for trips stored in-memory
 */

import { NextResponse } from 'next/server';
import { Trip } from '@/app/lib/types';

// In-memory storage (resets on server restart)
let trips: Trip[] = [];

export async function GET() {
  return NextResponse.json({ trips });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { destination, driverName, availableSeats, departureTime } = body;

  const newTrip: Trip = {
    id: Date.now().toString(),
    destination,
    driverName,
    availableSeats,
    departureTime,
    passengers: [],
  };

  trips.push(newTrip);
  return NextResponse.json({ trip: newTrip }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { tripId, passengerName, action } = body;

  const trip = trips.find((t) => t.id === tripId);
  if (!trip) {
    return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
  }

  if (action === 'join') {
    if (trip.passengers.length >= trip.availableSeats) {
      return NextResponse.json(
        { error: 'No seats available' },
        { status: 400 }
      );
    }
    if (!trip.passengers.includes(passengerName)) {
      trip.passengers.push(passengerName);
    }
  } else if (action === 'leave') {
    trip.passengers = trip.passengers.filter((p) => p !== passengerName);
  }

  return NextResponse.json({ trip });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { tripId } = body;

  trips = trips.filter((t) => t.id !== tripId);
  return NextResponse.json({ success: true });
}
