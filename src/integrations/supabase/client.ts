import {createClient} from '@supabase/supabase-js';
import type {Database} from './types';
import {getEnvironment} from '@/lib/environment';

// Get the current environment
const ENV = getEnvironment();

// Select the appropriate Supabase URL and key based on the environment
const SUPABASE_URL = ENV === 'prod'
    ? import.meta.env.VITE_SUPABASE_URL_PROD
    : import.meta.env.VITE_SUPABASE_URL_DEV;

const SUPABASE_KEY = ENV === 'prod'
    ? import.meta.env.VITE_SUPABASE_KEY_PROD
    : import.meta.env.VITE_SUPABASE_KEY_DEV;

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Create the Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

// NOTE: We no longer set the environment using supabase.query() as it's a server-only feature
// Instead, all reads and writes should explicitly use .eq('environment', getEnvironment())
// or include environment: getEnvironment() in inserts/updates
// This is handled in the service layer (e.g., src/services/supabase/*.ts)
