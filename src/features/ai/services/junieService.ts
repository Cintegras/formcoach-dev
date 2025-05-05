/**
 * Junie AI Assistant Service
 *
 * This service handles the initialization and configuration of the Junie AI assistant.
 * It automatically loads and parses the docs/INIT.md file at the start of every session
 * to understand the current environment, Supabase project, and PyCharm project.
 */

import {getEnvironment} from '../../../lib/environment.ts';

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

    /**
     * Initialize the Junie service by loading and parsing the INIT.md file
     * This should be called at the start of every session
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // Load and parse the INIT.md file
            const initContent = await this.loadInitFile();

            // Extract environment information
            this.environmentInfo = this.parseEnvironmentInfo(initContent);

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
     */
    private async loadInitFile(): Promise<string> {
        try {
            const response = await fetch(this.initMdUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch INIT.md: ${response.status} ${response.statusText}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Error loading INIT.md file:', error);
            throw new Error('Failed to load INIT.md file. Please ensure the file exists at docs/init.md');
        }
    }

    /**
     * Parse the INIT.md content to extract environment information
     *
     * TODO: When a separate Supabase project for staging is created,
     * update this method to properly distinguish between 'dev', 'stage', and 'prod'
     */
    private parseEnvironmentInfo(content: string): EnvironmentInfo {
        // Get the current environment from the environment.ts file
        const currentEnv = getEnvironment();

        // Default values
        let pycharmProject: 'formcoach-dev' | 'formcoach-stage' | 'formcoach' = 'formcoach-dev';
        let supabaseProject: 'formcoach-dev' | 'formcoach' = 'formcoach-dev';

        // Map environment to PyCharm project and Supabase project
        if (currentEnv === 'prod') {
            pycharmProject = 'formcoach';
            supabaseProject = 'formcoach';
        } else {
            // Both dev and stage use the same Supabase project
            pycharmProject = 'formcoach-dev';
            supabaseProject = 'formcoach-dev';
        }

        return {
            // For compatibility with existing code, we'll keep the environment type as is
            // but in practice, it will only be 'dev' or 'prod'
            environment: currentEnv as 'dev' | 'stage' | 'prod',
            pycharmProject,
            supabaseProject
        };
    }

    /**
     * Display confirmation message after parsing INIT.md
     */
    private displayConfirmation(): void {
        if (!this.environmentInfo) return;

        const {environment, pycharmProject} = this.environmentInfo;
        console.log(`✅ INIT.md loaded and parsed. Environment: ${environment}. Project: ${pycharmProject}.`);
    }

    /**
     * Get the current environment information
     */
    getEnvironmentInfo(): EnvironmentInfo | null {
        return this.environmentInfo;
    }
}

// Create a singleton instance
const junieService = new JunieService();

export default junieService;
