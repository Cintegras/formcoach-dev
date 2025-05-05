# Supabase Integration

This directory contains the Supabase client configuration and related services for the FormCoach application.

## Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Copy your Supabase URL and anon key from the project settings
3. Create a `.env` file in the root of the project with the following variables:

```
VITE_SUPABASE_URL_DEV=your-dev-project-url
VITE_SUPABASE_KEY_DEV=your-dev-anon-key
VITE_SUPABASE_URL_PROD=your-prod-project-url
VITE_SUPABASE_KEY_PROD=your-prod-anon-key
VITE_FORMCOACH_ENV=dev  # or 'stage' or 'prod'
```

## Environment Handling

The application automatically sets the correct environment variable in Supabase sessions:

1. The environment is determined from `VITE_FORMCOACH_ENV` (defaults to 'dev')
2. The Supabase client automatically injects `SET app.environment = 'dev'` (or 'stage'/'prod') into sessions
3. Row Level Security (RLS) policies use this environment variable to isolate data between environments

## Data Access Layer

This directory contains services for accessing and manipulating data in the Supabase database:

- **profiles.ts**: User profile management
- **workout-sessions.ts**: Workout session tracking
- **exercise-logs.ts**: Exercise logging and form feedback
- **workout-plans.ts**: Workout plan creation and management
- **progress-metrics.ts**: Body measurements and progress tracking

Each service provides:

- Type definitions using the generated Supabase types
- CRUD operations (Create, Read, Update, Delete)
- Helper functions for common operations
- Real-time subscription functions
- Proper environment handling

## React Hooks

The application provides React hooks that wrap these services for easy use in components:

```typescript
import {
    useProfile,
    useWorkoutSessions,
    useExerciseLogs,
    useWorkoutPlans,
    useProgressMetrics
} from '@/hooks';

function YourComponent() {
    // Access and manage the current user's profile
    const {profile, loading, error, update} = useProfile();

    // Track workout sessions with real-time updates
    const {
        sessions,
        activeSession,
        startSession,
        endSession
    } = useWorkoutSessions();

    // ... and more
}
```

## Authentication

The application uses the AuthProvider component to manage authentication state. Import the useAuth hook to access
authentication state and methods:

```typescript
import { useAuth } from '@/features/auth';

function YourComponent() {
  const { user, signIn, signOut } = useAuth();

  return (
    <div>
      {user ? (
        <button onClick={signOut}>Sign Out</button>
      ) : (
        <button onClick={() => signIn('user@example.com', 'password')}>Sign In</button>
      )}
    </div>
  );
}
```

## Development Helpers

For development, dummy UUIDs are provided for test users:

```typescript
import {DUMMY_USER_IDS} from '@/services/supabase';

// Use in development
const jackId = DUMMY_USER_IDS.JACK;  // '00000000-0000-0000-0000-000000000001'
const gingerId = DUMMY_USER_IDS.GINGER;  // '00000000-0000-0000-0000-000000000002'
```

## Database Schema

See the `docs/supabase/sql/dev_001_init_schema.sql` file for the database schema and
`docs/supabase/ENVIRONMENT_RLS_GUIDE.md` for details on the Row Level Security implementation.
