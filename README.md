# Lunch Break Planner

A simple internal application for coordinating lunch break trips to town or the supermarket. Built for teams located away from city centers who need to organize shared transportation.

## Features

- **No Authentication Required**: Simple, frictionless experience without user accounts
- **Create Trips**: Plan trips with destination, departure time, and available seats
- **Join Trips**: Colleagues can join available trips with just their name
- **Real-time Updates**: See available trips and seats instantly
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode Support**: Automatic dark mode based on system preferences

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: React hooks
- **Storage**: In-memory (resets on server restart)

## Getting Started

### Prerequisites

- Node.js 20+ and npm/yarn/pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd lunchbreak

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## Usage

### Creating a Trip

1. Fill in your name (driver)
2. Enter the destination (e.g., "City Center", "Supermarket")
3. Set the number of available seats
4. Choose a departure time
5. Click "Create Trip"

### Joining a Trip

1. Find a trip going to your desired destination
2. Enter your name in the "Join Trip" field
3. Click "Join Trip"

### Managing Trips

- **Remove Passenger**: Click the × next to a passenger's name
- **Delete Trip**: Click "Delete Trip" in the top-right of any trip card

## Project Structure

```
lunchbreak/
├── app/
│   ├── api/
│   │   └── trips/
│   │       └── route.ts          # API endpoints for trip operations
│   ├── components/
│   │   ├── TripCard.tsx          # Individual trip display component
│   │   ├── TripForm.tsx          # Form for creating new trips
│   │   └── TripsList.tsx         # List container for all trips
│   ├── lib/
│   │   ├── types.ts              # Shared TypeScript types
│   │   └── api-client.ts         # API client functions
│   ├── layout.tsx                # Root layout with fonts and metadata
│   ├── page.tsx                  # Main page component
│   └── globals.css               # Global styles
├── package.json
└── README.md
```

## Architecture Decisions

### In-Memory Storage

The application uses in-memory storage for simplicity. Data is lost on server restart. This is intentional for:
- Keeping the app lightweight
- Avoiding database setup complexity
- Ensuring fresh state each day

**Future Enhancement**: Consider adding persistent storage (SQLite, PostgreSQL) if data persistence is needed.

### No Authentication

The app intentionally has no authentication or user accounts to reduce friction. This is suitable for:
- Internal company tools with trusted users
- Small teams
- Temporary coordination needs

**Security Note**: This app is designed for internal network use only. Do not expose it to the public internet without adding proper authentication.

### Component Architecture

The code follows clean code principles:
- **Separation of Concerns**: UI components, API logic, and types are separated
- **Single Responsibility**: Each component has one clear purpose
- **Reusability**: Components are designed to be reusable and composable
- **Type Safety**: Full TypeScript coverage for better developer experience

## Development

### Code Style

The project uses ESLint for code quality:

```bash
npm run lint
```

### Adding Features

Common enhancements you might consider:

1. **Persistent Storage**: Add a database (see `app/api/trips/route.ts`)
2. **Notifications**: Add real-time updates with WebSockets or Server-Sent Events
3. **Recurring Trips**: Allow scheduling trips for multiple days
4. **Comments/Notes**: Add a notes field for additional trip information
5. **Return Trips**: Track both outbound and return journey times

## API Reference

### GET `/api/trips`

Returns all available trips.

**Response**: `{ trips: Trip[] }`

### POST `/api/trips`

Create a new trip.

**Body**:
```json
{
  "destination": "City Center",
  "driverName": "John",
  "availableSeats": 3,
  "departureTime": "12:30"
}
```

### PATCH `/api/trips`

Join or leave a trip.

**Body**:
```json
{
  "tripId": "1234567890",
  "passengerName": "Jane",
  "action": "join" | "leave"
}
```

### DELETE `/api/trips`

Delete a trip.

**Body**:
```json
{
  "tripId": "1234567890"
}
```

## Contributing

This is an internal tool, but contributions are welcome:

1. Follow the existing code style
2. Add types for all new code
3. Keep components small and focused
4. Test your changes locally before committing

## License

Internal use only.

## Support

For issues or questions, contact the development team.
