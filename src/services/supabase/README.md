# Supabase Integration

This directory contains the Supabase client configuration and related services for the FormCoach application.

## Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Copy your Supabase URL and anon key from the project settings
3. Create a `.env` file in the root of the project with the following variables:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Usage

Import the Supabase client in your components or services:

```typescript
import { supabase } from '@/services/supabase';

// Example: Query data
const { data, error } = await supabase
  .from('your-table')
  .select('*');

// Example: Authentication
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
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

## Database Schema

See the `docs/PyCharm/SUPABASE_INTEGRATION_STRATEGY.md` file for the database schema and integration strategy.