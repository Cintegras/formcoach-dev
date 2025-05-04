// Load environment variables from .env file
require('dotenv').config();

// Create a mock import.meta.env object with the environment variables
global.import = {
    meta: {
        env: {
            VITE_FORMCOACH_ENV: process.env.VITE_FORMCOACH_ENV,
            VITE_SUPABASE_URL_DEV: process.env.VITE_SUPABASE_URL_DEV,
            VITE_SUPABASE_KEY_DEV: process.env.VITE_SUPABASE_KEY_DEV,
            VITE_SUPABASE_URL_PROD: process.env.VITE_SUPABASE_URL_PROD,
            VITE_SUPABASE_KEY_PROD: process.env.VITE_SUPABASE_KEY_PROD
        }
    }
};

// Execute the seed-dev.ts script
require('ts-node/register');
require('./seed-dev.ts');