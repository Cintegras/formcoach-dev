// Load environment variables from .env file
import dotenv from 'dotenv';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';
import {dirname, resolve} from 'path';

dotenv.config();

// Create a mock import.meta.env object with the environment variables
globalThis.import = {
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

// Set up require for ES modules
const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Execute the seed-dev.ts script
require('ts-node/register');
require(resolve(__dirname, './seed-dev.ts'));