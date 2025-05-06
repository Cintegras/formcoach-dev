import {createClient} from '@supabase/supabase-js';
import type {Database} from './types';

// Default values to prevent blank screens during initialization
const DEFAULT_SUPABASE_URL = 'https://gfaqeouktaxibmyzfnwr.supabase.co';
const DEFAULT_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYXFlb3VrdGF4aWJteXpmbndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMzAxMDIsImV4cCI6MjA2MTgwNjEwMn0.EmzRZtlWoZBpcYflghiULEQbDI_pQtGCUG1J9KuH3rw';

// Get Supabase URL and key
let SUPABASE_URL: string;
let SUPABASE_KEY: string;

// Check if running in Node.js environment (for ts-node)
if (typeof process !== 'undefined' && process.env) {
  SUPABASE_URL = process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
}
// Check if running in browser environment (for Vite)
else if (typeof import.meta !== 'undefined' && import.meta.env) {
  SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_KEY;
}
// Default fallback to dev values
else {
  SUPABASE_URL = DEFAULT_SUPABASE_URL;
  SUPABASE_KEY = DEFAULT_SUPABASE_KEY;
}

// Provide a safeguard to ensure URL and key are never empty strings
if (!SUPABASE_URL || SUPABASE_URL.trim() === '') {
  SUPABASE_URL = DEFAULT_SUPABASE_URL;
  console.warn('Supabase URL was empty, using default URL');
}

if (!SUPABASE_KEY || SUPABASE_KEY.trim() === '') {
  SUPABASE_KEY = DEFAULT_SUPABASE_KEY;
  console.warn('Supabase key was empty, using default key');
}

// Get the current URL for redirects
const getRedirectURL = () => {
  // For client-side rendering
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    return `${url.protocol}//${url.host}`;
  }
  // Default fallback
  return 'https://gfaqeouktaxibmyzfnwr.supabase.co';
};

// Ensure SUPABASE_URL and SUPABASE_KEY are not empty
if (!SUPABASE_URL) {
  SUPABASE_URL = 'https://gfaqeouktaxibmyzfnwr.supabase.co';
  console.warn('SUPABASE_URL was empty, using fallback URL');
}

if (!SUPABASE_KEY) {
  SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYXFlb3VrdGF4aWJteXpmbndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMzAxMDIsImV4cCI6MjA2MTgwNjEwMn0.EmzRZtlWoZBpcYflghiULEQbDI_pQtGCUG1J9KuH3rw';
  console.warn('SUPABASE_KEY was empty, using fallback key');
}

// Create the Supabase client with site URL configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'Accept': 'application/json'
    }
  }
});

// Note: redirectTo should be passed to specific auth methods like signIn, signUp, etc.
// rather than in the client initialization

// NOTE: The environment column has been removed from the database
// All queries should now work without environment filtering
// This simplifies the service layer (e.g., src/services/supabase/*.ts)
