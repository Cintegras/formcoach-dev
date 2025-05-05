/**
 * Get the current environment from environment variables
 * Defaults to 'dev' if not specified
 *
 * TODO: When a separate Supabase project for staging is created,
 * update this function to properly distinguish between 'dev', 'stage', and 'prod'
 */
export const getEnvironment = (): string => {
    // Check if running in Node.js environment (for ts-node)
    if (typeof process !== 'undefined' && process.env) {
        const env = process.env.VITE_FORMCOACH_ENV || 'dev';
        // For now, we only distinguish between 'prod' and non-prod environments
        return env === 'prod' ? 'prod' : 'dev';
    }
    // Check if running in browser environment (for Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        const env = import.meta.env.VITE_FORMCOACH_ENV || 'dev';
        // For now, we only distinguish between 'prod' and non-prod environments
        return env === 'prod' ? 'prod' : 'dev';
    }
    // Default to 'dev' if neither environment is available
    return 'dev';
};
