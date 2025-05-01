# Services Directory

This directory contains service modules for the FormCoach application. Services are responsible for handling external interactions such as API calls, data fetching, and third-party integrations.

```
services/
├── api/                  # API client and endpoints
│   ├── client.ts         # Base API client
│   ├── endpoints.ts      # API endpoint definitions
│   └── index.ts          # Export file
├── ai/                   # AI service integrations
│   ├── aiClient.ts       # Base AI API client
│   ├── junieService.ts   # Junie-specific service
│   └── index.ts          # Export file
└── storage/              # Storage services
    ├── localStorage.ts   # Local storage service
    └── index.ts          # Export file
```

## Purpose

The services directory is designed to:

- Centralize all external interactions
- Provide a clean API for the rest of the application
- Abstract away the details of external services
- Make it easier to mock services for testing

## Usage Guidelines

1. Create service modules for each type of external interaction
2. Keep service implementations simple and focused
3. Use TypeScript interfaces to define service contracts
4. Export services through index.ts files
5. Consider using dependency injection for services that depend on other services

## Relationship with Features

While the services directory contains application-wide services, feature-specific services should be placed in the respective feature directory. For example:

- Application-wide API client: `src/services/api/client.ts`
- Auth-specific API service: `src/features/auth/services/authService.ts`