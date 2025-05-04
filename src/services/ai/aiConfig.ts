/**
 * AI Configuration
 *
 * This file contains configuration options for AI services.
 * It includes API keys, base URLs, and other settings.
 */

import {getEnvironment} from '@/lib/environment';

// Define types for AI configuration
interface AIServiceConfig {
    baseUrl: string;
    apiKey: string;
}

interface AIConfig {
    junie: AIServiceConfig;
    // Add other AI services here as needed
}

// Get the current environment
const ENV = getEnvironment();

// Define configuration for different environments
const devConfig: AIConfig = {
    junie: {
        baseUrl: 'https://api.junie.dev.formcoach.ai',
        apiKey: process.env.JUNIE_API_KEY || 'dev-api-key',
    },
};

const stageConfig: AIConfig = {
    junie: {
        baseUrl: 'https://api.junie.stage.formcoach.ai',
        apiKey: process.env.JUNIE_API_KEY || 'stage-api-key',
    },
};

const prodConfig: AIConfig = {
    junie: {
        baseUrl: 'https://api.junie.formcoach.ai',
        apiKey: process.env.JUNIE_API_KEY || 'prod-api-key',
    },
};

// Select the appropriate configuration based on the environment
let config: AIConfig;
if (ENV === 'prod') {
    config = prodConfig;
} else if (ENV === 'stage') {
    config = stageConfig;
} else {
    config = devConfig;
}

export default config;