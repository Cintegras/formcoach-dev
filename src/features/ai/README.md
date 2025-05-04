# AI Feature Module

This module contains all AI-related functionality for the FormCoach application, including the Junie AI assistant.

## Directory Structure

```
src/features/ai/
├── components/          # AI-specific components (future)
├── hooks/               # AI-specific hooks (future)
├── services/            # AI service integrations
│   ├── junieService.ts  # Junie-specific service
│   └── index.ts         # Export file
├── types/               # AI-specific types (future)
├── utils/               # AI-specific utilities (future)
├── README.md            # This file
└── index.ts             # Main export file
```

## Junie AI Assistant

The Junie AI assistant is integrated into the FormCoach application to provide intelligent assistance to users. It
automatically loads and parses the `docs/INIT.md` file at the start of every session to understand the current
environment, Supabase project, and PyCharm project.

### Testing

To test the Junie AI assistant, you can run the test script:

```bash
npx ts-node src/features/ai/test-junie.ts
```

This script initializes the Junie service and logs the environment information. It's useful for verifying that the Junie
service is working correctly and that it can properly parse the INIT.md file.

### Usage

To use the Junie AI assistant in your code:

```typescript
import { junieService } from '@/features/ai';

// Initialize Junie at the start of the session
await junieService.initialize();

// Get environment information
const environmentInfo = junieService.getEnvironmentInfo();
console.log(`Current environment: ${environmentInfo.environment}`);
console.log(`PyCharm project: ${environmentInfo.pycharmProject}`);
console.log(`Supabase project: ${environmentInfo.supabaseProject}`);
```

### Initialization

The Junie AI assistant should be initialized at the start of every session. This is typically done in the application's
entry point (e.g., `main.ts` or `App.tsx`).

When initialized, Junie will:

1. Load and parse the `docs/INIT.md` file
2. Extract environment information from the parsed content
3. Display a confirmation message with the extracted information

The confirmation message will look like:

```
✅ INIT.md loaded and parsed. Environment: dev. Project: formcoach-dev.
```

## Global AI Services

The global AI services are located in `src/services/ai/` and provide common functionality that can be used by specific
AI service implementations.

To use the global AI services:

```typescript
import { AIClient, aiConfig } from '@/services/ai';

// Create a new AI client
const client = new AIClient(aiConfig.junie.baseUrl, aiConfig.junie.apiKey);

// Make a request to the AI service
const response = await client.makeRequest('endpoint', { data: 'value' });
```
