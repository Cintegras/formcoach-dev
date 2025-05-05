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

// Initialize the session with the correct environment
// This ensures the app.environment variable is set correctly for RLS policies
const initializeEnvironment = async () => {
    try {
        // Set the app.environment variable based on the current environment
        const envValue = ENV === 'prod' ? 'prod' : ENV === 'stage' ? 'stage' : 'dev';

        // Call the initialize_session function or set the variable directly
        await supabase.rpc('initialize_session');

        // Alternative approach: set the variable directly if the RPC fails
        await supabase.query(`SET app.environment = '${envValue}'`);

        console.log(`Database environment set to: ${envValue}`);
    } catch (error) {
        console.error('Failed to initialize database environment:', error);
        // Fallback: try direct SQL approach
        try {
            await supabase.query(`SET app.environment = '${ENV || 'dev'}'`);
        } catch (fallbackError) {
            console.error('Fallback environment initialization also failed:', fallbackError);
        }
    }
};

// Initialize the environment when the client is first imported
initializeEnvironment();
