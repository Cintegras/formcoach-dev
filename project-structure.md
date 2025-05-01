# FormCoach Project Structure

## Overview

This document outlines a comprehensive project structure for the FormCoach application, a fullstack AI-integrated app with a React frontend, FastAPI backend, and AI assistants like Junie and Builder.io.

## Goals

- Create a clean, scalable foundation for fullstack AI apps
- Clearly separate frontend and backend concerns
- Support future features: authentication, state management, AI API calls, dashboard
- Prioritize developer clarity, reusability, and component separation

## Project Structure

```
formcoach/
├── .github/                    # GitHub workflows and configuration
├── docs/                       # Documentation
│   ├── ai-integration.md       # AI integration documentation
│   ├── feature-organization.md # Feature organization documentation
│   └── project-structure.md    # Project structure documentation
├── packages/                   # Monorepo packages
│   ├── frontend/               # React frontend application
│   │   ├── public/             # Static assets
│   │   ├── src/
│   │   │   ├── assets/         # Frontend assets (images, fonts, etc.)
│   │   │   ├── components/     # Reusable UI components
│   │   │   │   ├── common/     # Common components used across features
│   │   │   │   ├── forms/      # Form-related components
│   │   │   │   ├── layout/     # Layout components (Header, Footer, Sidebar)
│   │   │   │   └── ui/         # Basic UI components (from shadcn-ui)
│   │   │   ├── config/         # Frontend configuration
│   │   │   ├── features/       # Feature-based modules
│   │   │   │   ├── auth/       # Authentication feature
│   │   │   │   │   ├── components/  # Auth-specific components
│   │   │   │   │   ├── hooks/       # Auth-specific hooks
│   │   │   │   │   ├── services/    # Auth-specific services
│   │   │   │   │   └── types/       # Auth-specific types
│   │   │   │   ├── dashboard/  # Dashboard feature
│   │   │   │   ├── forms/      # Forms feature
│   │   │   │   └── ai/         # AI integration feature
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── lib/            # Utility functions and shared logic
│   │   │   ├── pages/          # Page components
│   │   │   ├── services/       # API services and data fetching
│   │   │   │   ├── api/        # API client and endpoints
│   │   │   │   └── ai/         # AI service integrations
│   │   │   ├── store/          # State management
│   │   │   │   ├── slices/     # State slices (if using Redux)
│   │   │   │   └── context/    # React context providers
│   │   │   ├── types/          # TypeScript type definitions
│   │   │   ├── utils/          # Utility functions
│   │   │   ├── App.tsx         # Main App component
│   │   │   └── main.tsx        # Entry point
│   │   ├── .eslintrc.js        # ESLint configuration
│   │   ├── package.json        # Frontend dependencies
│   │   ├── tsconfig.json       # TypeScript configuration
│   │   └── vite.config.ts      # Vite configuration
│   ├── backend/                # FastAPI backend application
│   │   ├── app/
│   │   │   ├── api/            # API routes
│   │   │   │   ├── endpoints/  # API endpoint modules
│   │   │   │   └── deps.py     # Dependency injection
│   │   │   ├── core/           # Core application code
│   │   │   │   ├── config.py   # Configuration
│   │   │   │   └── security.py # Security utilities
│   │   │   ├── db/             # Database models and utilities
│   │   │   │   ├── models/     # Database models
│   │   │   │   └── session.py  # Database session
│   │   │   ├── services/       # Business logic services
│   │   │   │   └── ai/         # AI service integrations
│   │   │   ├── schemas/        # Pydantic schemas
│   │   │   └── main.py         # FastAPI application
│   │   ├── tests/              # Backend tests
│   │   ├── requirements.txt    # Python dependencies
│   │   └── Dockerfile          # Backend Dockerfile
│   └── shared/                 # Shared code between frontend and backend
│       ├── types/              # Shared TypeScript types
│       └── constants/          # Shared constants
├── scripts/                    # Development and deployment scripts
├── .env.example                # Example environment variables
├── docker-compose.yml          # Docker Compose configuration
├── package.json                # Root package.json for monorepo
└── README.md                   # Project documentation
```

## Design Decisions

### Monorepo Structure

The project uses a monorepo structure with packages for frontend, backend, and shared code. This allows for:

- **Clear separation of concerns**: Frontend and backend code are clearly separated, making it easier to understand and maintain.
- **Shared code**: Types and constants can be shared between frontend and backend, ensuring consistency.
- **Simplified dependency management**: Dependencies can be managed at the package level, making it easier to update and maintain.
- **Unified development experience**: Developers can work on both frontend and backend code in the same repository, with consistent tooling and workflows.

### Frontend Structure

#### Feature-Based Organization

The frontend is organized around features, with each feature containing its own components, hooks, services, and types. This approach:

- **Improves code organization**: As the application grows, code remains organized and easy to navigate.
- **Enhances developer clarity**: Developers can easily understand which code belongs to which feature.
- **Facilitates code reuse**: Components, hooks, and utilities can be reused within features.
- **Supports team collaboration**: Different teams can work on different features without stepping on each other's toes.

#### Component Hierarchy

Components are organized into multiple categories:

- **UI components**: Basic UI building blocks (from shadcn-ui)
- **Common components**: Reusable components used across features
- **Layout components**: Components for page layout (Header, Footer, Sidebar)
- **Feature components**: Components specific to a feature

This hierarchy ensures that components are organized by responsibility and scope, making it easy to find and reuse them.

#### State Management

The structure supports multiple state management approaches:

- **Local component state**: For simple state management within components
- **React Context**: For shared state across components
- **Redux or other libraries**: For more complex state management needs

This flexibility allows developers to choose the right approach for each use case.

#### Services Layer

API and AI services are separated into their own directory, making it easy to:

- **Manage API endpoints**: Each endpoint can be defined and documented in one place.
- **Handle authentication**: Authentication logic can be centralized in the API client.
- **Integrate with AI services**: AI services can be abstracted behind a common interface.

### Backend Structure

#### FastAPI Organization

The backend follows FastAPI best practices with:

- **Clear separation of routes, models, and services**: Each part of the application has its own directory.
- **Dependency injection**: Services can be injected into routes, making testing easier.
- **Pydantic schemas**: For request and response validation.

#### AI Integration

AI services have dedicated directories in both frontend and backend, allowing for:

- **Clean integration with AI assistants**: Each AI service can be implemented separately.
- **Separation of AI-specific logic**: AI-specific code is kept separate from the rest of the application.
- **Reusable AI utilities**: Common AI utilities can be shared across services.

### Shared Code

The shared package contains code used by both frontend and backend:

- **TypeScript types**: For API requests and responses, ensuring consistency.
- **Constants**: For feature flags, API endpoints, etc.

## Migration Strategy

To migrate from the current structure to the proposed structure:

1. **Set up the monorepo structure**:
   - Create the packages directory with frontend, backend, and shared packages
   - Move the current frontend code to the frontend package
   - Set up the backend package with FastAPI

2. **Reorganize the frontend code**:
   - Move UI components to the appropriate directories
   - Create feature directories for existing features
   - Refactor hooks and utilities to the new structure

3. **Implement the backend structure**:
   - Set up the FastAPI application
   - Create API endpoints for existing features
   - Implement AI service integrations

4. **Create shared types and constants**:
   - Define shared types for API requests and responses
   - Define shared constants for feature flags, API endpoints, etc.

5. **Update imports and references**:
   - Update import paths to reflect the new structure
   - Ensure all references to moved code are updated

## Conclusion

This structure provides a clean, scalable foundation for the FormCoach application, with clear separation of concerns, support for future features, and a focus on developer clarity and component reusability. The feature-based organization and AI integration approach ensure that the application can grow and evolve while maintaining a high level of code quality and developer productivity.