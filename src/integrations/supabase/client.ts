import {createClient} from '@supabase/supabase-js';
import type {Database} from './types';
import {getEnvironment} from '@/lib/environment';

// Get the current environment
const ENV = getEnvironment();

// Get Supabase URL and key based on environment
let SUPABASE_URL: string;
let SUPABASE_KEY: string;

// Check if running in Node.js environment (for ts-node)
if (typeof process !== 'undefined' && process.env) {
  if (ENV === 'prod') {
    SUPABASE_URL = process.env.VITE_SUPABASE_URL_PROD || '';
    SUPABASE_KEY = process.env.VITE_SUPABASE_KEY_PROD || '';
  } else if (ENV === 'stage') {
    SUPABASE_URL = process.env.VITE_SUPABASE_URL_DEV || '';
    SUPABASE_KEY = process.env.VITE_SUPABASE_KEY_DEV || '';
  } else {
    SUPABASE_URL = process.env.VITE_SUPABASE_URL_DEV || '';
    SUPABASE_KEY = process.env.VITE_SUPABASE_KEY_DEV || '';
  }
}
// Check if running in browser environment (for Vite)
else if (typeof import.meta !== 'undefined' && import.meta.env) {
  if (ENV === 'prod') {
    SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL_PROD || '';
    SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY_PROD || '';
  } else if (ENV === 'stage') {
    SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL_DEV || '';
    SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY_DEV || '';
  } else {
    SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL_DEV || '';
    SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY_DEV || '';
  }
}
// Default fallback to dev values
else {
  SUPABASE_URL = 'https://gfaqeouktaxibmyzfnwr.supabase.co';
  SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmYXFlb3VrdGF4aWJteXpmbndyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMzAxMDIsImV4cCI6MjA2MTgwNjEwMn0.EmzRZtlWoZBpcYflghiULEQbDI_pQtGCUG1J9KuH3rw';
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

// Create the Supabase client with site URL configuration
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Note: redirectTo should be passed to specific auth methods like signIn, signUp, etc.
// rather than in the client initialization

// NOTE: We no longer set the environment using supabase.query() as it's a server-only feature
// Instead, all reads and writes should explicitly use .eq('environment', getEnvironment())
// or include environment: getEnvironment() in inserts/updates
// This is handled in the service layer (e.g., src/services/supabase/*.ts)
