/**
 * Get the current environment from environment variables
 * Defaults to 'dev' if not specified
 */
export const getEnvironment = (): string => {
    // Check if running in Node.js environment (for ts-node)
    if (typeof process !== 'undefined' && process.env) {
        return process.env.VITE_FORMCOACH_ENV || 'dev';
    }
    // Check if running in browser environment (for Vite)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env.VITE_FORMCOACH_ENV || 'dev';
    }
    // Default to 'dev' if neither environment is available
    return 'dev';
};
