/**
 * Get the current environment from environment variables
 * Defaults to 'dev' if not specified
 *
 * Distinguishes between 'dev', 'stage', and 'prod' environments
 */
export const getEnvironment = (): string => {
    // Check if running in Node.js environment (for ts-node)
    if (typeof process !== 'undefined' && process.env) {
        const env = process.env.VITE_FORMCOACH_ENV || 'dev';
        // Return the environment as is (dev, stage, or prod)
        return env;
    }
    // Check if running in browser environment (for Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        const env = import.meta.env.VITE_FORMCOACH_ENV || 'dev';
        // Return the environment as is (dev, stage, or prod)
        return env;
    }
    // Default to 'dev' if neither environment is available
    return 'dev';
};
