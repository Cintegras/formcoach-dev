/**
 * Test script for the Junie AI assistant
 *
 * This script initializes the Junie service and logs the environment information.
 * Run it with: npx ts-node src/features/ai/test-junie.ts
 */

import junieService from './services/junieService';

async function testJunieService() {
    console.log('Testing Junie service...');

    try {
        // Initialize Junie
        await junieService.initialize();

        // Get environment information
        const environmentInfo = junieService.getEnvironmentInfo();

        if (environmentInfo) {
            console.log('Environment information:');
            console.log(`- Environment: ${environmentInfo.environment}`);
            console.log(`- PyCharm project: ${environmentInfo.pycharmProject}`);
            console.log(`- Supabase project: ${environmentInfo.supabaseProject}`);
        } else {
            console.error('Failed to get environment information');
        }
    } catch (error) {
        console.error('Error testing Junie service:', error);
    }
}

// Run the test
testJunieService();
