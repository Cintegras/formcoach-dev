/**
 * AI Client
 *
 * This is a base client for AI services. It provides common functionality
 * that can be used by specific AI service implementations.
 */

class AIClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(baseUrl: string, apiKey: string) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
    }

    /**
     * Get the base URL for the AI service
     */
    getBaseUrl(): string {
        return this.baseUrl;
    }

    /**
     * Get the API key for the AI service
     */
    getApiKey(): string {
        return this.apiKey;
    }

    /**
     * Make a request to the AI service
     */
    async makeRequest(endpoint: string, data: any): Promise<any> {
        try {
            const response = await fetch(`${this.baseUrl}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Error making request to AI service: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error making request to AI service:', error);
            throw error;
        }
    }
}

export default AIClient;