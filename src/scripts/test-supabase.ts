
/**
 * Test script to verify Supabase client configuration and utility functions
 *
 * This script:
 * 1. Connects to Supabase using the configured client
 * 2. Fetches profiles from the database
 * 3. Logs the results or any errors
 */

import {supabase} from '@/integrations/supabase/client';
import {withEnvironmentFilter} from '@/lib/supabase-utils';
import {getEnvironment} from '@/lib/environment';

async function testSupabaseConnection() {
    console.log(`Testing Supabase connection...`);

    try {
        // Fetch profiles
        const {data: profiles, error} = await supabase.from('profiles').select('*');

        if (error) {
            console.error('❌ Error fetching profiles:', error.message);
            return;
        }

        console.log(`✅ Successfully connected to Supabase and fetched profiles!`);
        console.log(`Found ${profiles?.length || 0} profiles:`);

        // Log the profiles (limited to 10 for readability)
        if (profiles) {
            const displayProfiles = profiles.slice(0, 10);
            console.table(displayProfiles);

            if (profiles.length > 10) {
                console.log(`... and ${profiles.length - 10} more profiles`);
            }
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

// Run the test
testSupabaseConnection();
