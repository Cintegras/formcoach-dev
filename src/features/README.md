# Features Directory

This directory contains feature-based modules for the FormCoach application. Each feature is organized into its own directory with the following structure:

```
features/
├── auth/                 # Authentication feature
│   ├── components/       # Auth-specific components
│   ├── hooks/            # Auth-specific hooks
│   ├── services/         # Auth-specific services
│   └── types/            # Auth-specific types
├── forms/                # Forms feature
│   ├── components/       # Forms-specific components
│   ├── hooks/            # Forms-specific hooks
│   ├── services/         # Forms-specific services
│   └── types/            # Forms-specific types
└── ai/                   # AI integration feature
    ├── components/       # AI-specific components
    ├── hooks/            # AI-specific hooks
    ├── services/         # AI-specific services
    └── types/            # AI-specific types
```

## Purpose

The features directory is designed to organize code by feature rather than by technical concern. This approach:

- Improves code organization as the application grows
- Makes it easier to understand the codebase
- Facilitates code reuse within features
- Supports better team collaboration

## Usage Guidelines

1. Create a new directory for each major feature of the application
2. Within each feature directory, organize code by technical concern (components, hooks, services, types)
3. Export the public API of each feature through an index.ts file
4. Import feature components and hooks using the feature's namespace (e.g., `import { LoginForm } from '@/features/auth/components'`)