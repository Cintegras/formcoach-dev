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

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);
