# AI Services

This directory contains global AI services for the FormCoach application. These services provide common functionality
that can be used by specific AI service implementations.

## Directory Structure

```
src/services/ai/
├── aiClient.ts          # Base AI API client
├── aiConfig.ts          # AI configuration
├── README.md            # This file
└── index.ts             # Export file
```

## AI Client

The AI Client is a base class for AI services. It provides common functionality that can be used by specific AI service
implementations.

### Usage

```typescript
import { AIClient, aiConfig } from '@/services/ai';

// Create a new AI client
const client = new AIClient(aiConfig.junie.baseUrl, aiConfig.junie.apiKey);

// Make a request to the AI service
const response = await client.makeRequest('endpoint', { data: 'value' });
```

## AI Configuration

The AI Configuration file contains configuration options for AI services. It includes API keys, base URLs, and other
settings.

### Configuration Structure

The configuration is structured by environment:

- `devConfig`: Configuration for the development environment
- `stageConfig`: Configuration for the staging environment
- `prodConfig`: Configuration for the production environment

Each environment configuration contains settings for specific AI services:

```typescript
interface AIConfig {
  junie: {
    baseUrl: string;
    apiKey: string;
  };
  // Add other AI services here as needed
}
```

### Environment Selection

The configuration automatically selects the appropriate settings based on the current environment:

```typescript
// Get the current environment
const ENV = getEnvironment();

// Select the appropriate configuration based on the environment
let config: AIConfig;
if (ENV === 'prod') {
  config = prodConfig;
} else if (ENV === 'stage') {
  config = stageConfig;
} else {
  config = devConfig;
}
```

## Integration with Feature Modules

The global AI services are used by feature-specific AI services, such as the Junie AI assistant in the `src/features/ai`
module.

To use the global AI services in a feature module:

```typescript
import { AIClient, aiConfig } from '@/services/ai';

class FeatureAIService {
  private aiClient: AIClient;
  
  constructor() {
    this.aiClient = new AIClient(aiConfig.junie.baseUrl, aiConfig.junie.apiKey);
  }
  
  async someFeatureSpecificFunction() {
    const response = await this.aiClient.makeRequest('endpoint', { data: 'value' });
    return response;
  }
}
```