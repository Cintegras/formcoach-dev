/**
 * Junie AI Assistant Service
 *
 * This service handles the initialization and configuration of the Junie AI assistant.
 * It automatically loads and parses the docs/INIT.md file at the start of every session
 * to understand the current environment, Supabase project, and PyCharm project.
 */

import {getEnvironment} from '../../../lib/environment';

// Define types for environment information
interface EnvironmentInfo {
    environment: 'dev' | 'stage' | 'prod';
    pycharmProject: 'formcoach-dev' | 'formcoach-stage' | 'formcoach';
    supabaseProject: 'formcoach-dev' | 'formcoach';
}

class JunieService {
    private environmentInfo: EnvironmentInfo | null = null;
    private initMdUrl = '/docs/init.md';
    private isInitialized = false;
    private hasLoggedCrossOriginWarning = false;
    private allowedOrigins = ['gptengineer.app', 'localhost:3000'];

    /**
     * Initialize the Junie service
     * This should be called at the start of every session
     * Note: INIT.md is no longer required as environment setup has been hardcoded
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // Extract environment information directly without loading INIT.md
            this.environmentInfo = this.parseEnvironmentInfo();

            // Display confirmation message
            this.displayConfirmation();

            this.isInitialized = true;
        } catch (error) {
            console.error('Error initializing Junie service:', error);
            throw error;
        }
    }

    /**
     * Load the INIT.md file
     *
     * Note: This method is kept for backward compatibility but is no longer used
     * as INIT.md is no longer required
     */
    private async loadInitFile(): Promise<string> {
        try {
            const response = await fetch(this.initMdUrl);
            if (!response.ok) {
                console.warn(`INIT.md not found: ${response.status} ${response.statusText}`);
                return ''; // Return empty string instead of throwing error
            }
            return await response.text();
        } catch (error) {
            console.warn('Could not load INIT.md file, but continuing anyway:', error);
            return ''; // Return empty string instead of throwing error
        }
    }

    /**
     * Get environment information
     *
     * Note: This no longer parses INIT.md as environment setup has been hardcoded
     * All environments now use the 'formcoach-dev' Supabase project
     */
    private parseEnvironmentInfo(): EnvironmentInfo {
        // Get the current environment from the environment.ts file
        const currentEnv = getEnvironment();

        // All environments now use the same Supabase project (formcoach-dev)
        const pycharmProject = 'formcoach-dev';
        const supabaseProject = 'formcoach-dev';

        return {
            // For compatibility with existing code, we'll keep the environment type as is
            environment: currentEnv as 'dev' | 'stage' | 'prod',
            pycharmProject,
            supabaseProject
        };
    }

    /**
     * Display confirmation message for environment initialization
     */
    private displayConfirmation(): void {
        if (!this.environmentInfo) return;

        const {environment, pycharmProject} = this.environmentInfo;
        console.log(`✅ Environment initialized. Environment: ${environment}. Project: ${pycharmProject}.`);
    }

    /**
     * Get the current environment information
     */
    getEnvironmentInfo(): EnvironmentInfo | null {
        return this.environmentInfo;
    }

    /**
     * Safely send a postMessage to the parent window
     * This method checks if the current host matches the allowed origins
     * If not, it suppresses the postMessage and logs a single warning
     *
     * @param message The message to send
     * @param targetOrigin The target origin (will be checked against allowed origins)
     */
    safePostMessage(message: any, targetOrigin: string): void {
        // Skip if we're not in a browser environment
        if (typeof window === 'undefined' || !window.parent || window.parent === window) {
            return;
        }

        // Check if we're running in lovable.dev or a preview environment
        const currentHost = window.location.host;
        const isAllowedOrigin = this.allowedOrigins.some(origin => targetOrigin.includes(origin));
        const isCurrentHostAllowed = this.allowedOrigins.some(origin => currentHost.includes(origin));

        // If we're not in an allowed host or targeting an allowed origin, suppress the postMessage
        if (!isCurrentHostAllowed || !isAllowedOrigin) {
            // Log a warning only once
            if (!this.hasLoggedCrossOriginWarning) {
                console.warn(
                    `Suppressed postMessage to ${targetOrigin} from ${currentHost}. ` +
                    `Messages are only sent when running inside allowed origins.`
                );
                this.hasLoggedCrossOriginWarning = true;
            }
            return;
        }

        // If we're in an allowed host and targeting an allowed origin, send the message
        try {
            window.parent.postMessage(message, targetOrigin);
        } catch (error) {
            console.error('Error sending postMessage:', error);
        }
    }
}

// Create a singleton instance
const junieService = new JunieService();

export default junieService;
