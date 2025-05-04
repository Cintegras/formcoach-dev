/**
 * Test script for environment setup
 *
 * This script demonstrates how to use the environment filtering utility
 * with Supabase queries. It shows how to:
 *
 * 1. Get the current environment
 * 2. Apply environment filtering to queries
 * 3. Use the Supabase client with environment-specific configuration
 *
 * Run this script with:
 * npx ts-node scripts/test-environment-setup.ts
 */

import {supabase} from '../src/integrations/supabase/client';
import {getEnvironment, withEnvironmentFilter} from '../src/lib/supabase-utils';

async function testEnvironmentSetup() {
    console.log('Testing environment setup...');

    // Get the current environment
    const env = getEnvironment();
    console.log(`Current environment: ${env}`);

    try {
        // Example 1: Basic query with environment filtering
        console.log('\nExample 1: Basic query with environment filtering');
        const {data: profiles, error} = await withEnvironmentFilter(
            supabase.from('profiles').select('*')
        );

        if (error) {
            console.error('Error fetching profiles:', error);
        } else {
            console.log(`Found ${profiles?.length || 0} profiles in the '${env}' environment`);
        }

        // Example 2: Query with additional filters
        console.log('\nExample 2: Query with additional filters');
        const {data: exercises, error: exercisesError} = await withEnvironmentFilter(
            supabase.from('exercises').select('*').limit(5)
        );

        if (exercisesError) {
            console.error('Error fetching exercises:', exercisesError);
        } else {
            console.log(`Found ${exercises?.length || 0} exercises in the '${env}' environment`);
            if (exercises && exercises.length > 0) {
                console.log('First exercise:', exercises[0].name);
            }
        }

        console.log('\nEnvironment setup test completed.');
    } catch (error) {
        console.error('Unexpected error during test:', error);
    }
}

// Run the test
testEnvironmentSetup();