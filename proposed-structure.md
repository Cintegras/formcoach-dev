# FormCoach Project Structure Proposal

## Overview
This document outlines a proposed folder structure for the FormCoach application, a fullstack AI-integrated app with a React frontend, FastAPI backend, and AI assistants.

## Goals
- Create a clean, scalable foundation for fullstack AI apps
- Clearly separate frontend and backend concerns
- Support future features: authentication, state management, AI API calls, dashboard
- Prioritize developer clarity, reusability, and component separation

## Proposed Structure

```
formcoach/
├── .github/                    # GitHub workflows and configuration
├── docs/                       # Documentation
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
- Clear separation of concerns
- Sharing of types and constants between frontend and backend
- Easier management of dependencies
- Simplified deployment

### Frontend Structure

#### Feature-based Organization
The frontend is organized around features, with each feature containing its own components, hooks, services, and types. This approach:
- Improves code organization as the application grows
- Makes it easier to understand the codebase
- Facilitates code reuse within features
- Supports better team collaboration

#### Component Hierarchy
Components are organized into multiple categories:
- **UI components**: Basic UI building blocks (from shadcn-ui)
- **Common components**: Reusable components used across features
- **Layout components**: Components for page layout
- **Feature components**: Components specific to a feature

#### State Management
The structure supports multiple state management approaches:
- Local component state
- React Context for shared state
- Redux or other state management libraries if needed

#### Services Layer
API and AI services are separated into their own directory, making it easy to:
- Manage API endpoints
- Handle authentication
- Integrate with AI services

### Backend Structure

#### FastAPI Organization
The backend follows FastAPI best practices with:
- Clear separation of routes, models, and services
- Dependency injection for services
- Pydantic schemas for validation

#### AI Integration
AI services have dedicated directories in both frontend and backend, allowing for:
- Clean integration with AI assistants
- Separation of AI-specific logic
- Reusable AI utilities

### Shared Code
The shared package contains code used by both frontend and backend:
- TypeScript types for API requests and responses
- Constants for feature flags, API endpoints, etc.

## Migration Strategy
To migrate from the current structure:
1. Set up the new directory structure
2. Move UI components to the appropriate directories
3. Organize pages into the new structure
4. Refactor hooks and utilities
5. Implement the backend structure
6. Update imports and references

## Conclusion
This structure provides a clean, scalable foundation for the FormCoach application, with clear separation of concerns, support for future features, and a focus on developer clarity and component reusability.