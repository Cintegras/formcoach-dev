import {createClient} from '@supabase/supabase-js';
import type {Database} from './types';
import {getEnvironment} from '@/lib/environment';

// Get the current environment
const ENV = getEnvironment();

// Supabase project details for FormCoach
// TODO: When a separate Supabase project for staging is created,
// update this to use VITE_SUPABASE_URL_STAGE and VITE_SUPABASE_KEY_STAGE for stage environment
const SUPABASE_URL = ENV === 'prod'
    ? import.meta.env.VITE_SUPABASE_URL_PROD
    : import.meta.env.VITE_SUPABASE_URL_DEV;

const SUPABASE_KEY = ENV === 'prod'
    ? import.meta.env.VITE_SUPABASE_KEY_PROD
    : import.meta.env.VITE_SUPABASE_KEY_DEV;

// Get the current URL for redirects
const getRedirectURL = () => {
  // For client-side rendering
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href);
    return `${url.protocol}//${url.host}`;
  }
  // Default fallback (will be replaced client-side)
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
