# Forms Feature

This directory contains the forms feature of the FormCoach application. The forms feature allows users to create, edit, and submit forms.

## Directory Structure

```
forms/
├── components/                # Forms-specific components
│   ├── FormBuilder/           # Form builder component
│   │   ├── FormBuilder.tsx    # Main component
│   │   ├── FormField.tsx      # Field component
│   │   ├── FormPreview.tsx    # Preview component
│   │   └── index.ts           # Export file
│   ├── FormRenderer/          # Form renderer component
│   │   ├── FormRenderer.tsx   # Main component
│   │   ├── FieldRenderer.tsx  # Field renderer
│   │   └── index.ts           # Export file
│   └── index.ts               # Export file for all components
├── hooks/                     # Forms-specific hooks
│   ├── useFormBuilder.ts      # Hook for form building
│   ├── useFormSubmission.ts   # Hook for form submission
│   ├── useFormValidation.ts   # Hook for form validation
│   └── index.ts               # Export file
├── services/                  # Forms-specific services
│   ├── formApi.ts             # API service for forms
│   ├── formStorage.ts         # Storage service for forms
│   └── index.ts               # Export file
├── types/                     # Forms-specific types
│   ├── FormTypes.ts           # Type definitions for forms
│   ├── FormFieldTypes.ts      # Type definitions for form fields
│   └── index.ts               # Export file
├── utils/                     # Forms-specific utilities
│   ├── formValidation.ts      # Validation utilities
│   ├── formFormatting.ts      # Formatting utilities
│   └── index.ts               # Export file
├── constants.ts               # Constants for forms feature
└── index.ts                   # Main export file for the feature
```

## Usage

Import components, hooks, and utilities from this feature to use them in your application:

```tsx
import { FormBuilder, FormRenderer } from '@/features/forms/components';
import { useFormBuilder, useFormSubmission } from '@/features/forms/hooks';
import { FormType, FormFieldType } from '@/features/forms/types';
```

## Integration with AI

The forms feature integrates with the AI feature to provide intelligent form suggestions and validation:

```tsx
import { useAIFormSuggestions } from '@/features/ai/hooks';
import { FormBuilder } from '@/features/forms/components';

const MyFormBuilder = () => {
  const { suggestions } = useAIFormSuggestions();
  
  return (
    <FormBuilder aiSuggestions={suggestions} />
  );
};
```