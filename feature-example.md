# Feature-Based Organization Example: Forms Feature

This document provides a detailed example of how the forms feature would be organized in the proposed structure, demonstrating the feature-based organization approach.

## Directory Structure

```
packages/
└── frontend/
    └── src/
        └── features/
            └── forms/
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
                │   ├── AIFormSuggestions/     # AI suggestions component
                │   │   ├── AIFormSuggestions.tsx  # Main component
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
                │   ├── formAnalytics.ts       # Analytics service for forms
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

## Component Examples

### FormBuilder.tsx

```tsx
import React, { useState } from 'react';
import { useFormBuilder } from '../hooks';
import { FormField } from './FormField';
import { FormPreview } from './FormPreview';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { FormType } from '../types';

interface FormBuilderProps {
  initialForm?: FormType;
  onSave: (form: FormType) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ initialForm, onSave }) => {
  const { form, addField, removeField, updateField, saveForm } = useFormBuilder(initialForm);
  
  const handleSave = () => {
    const savedForm = saveForm();
    onSave(savedForm);
  };
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Form Builder</h2>
        <Form>
          {form.fields.map((field) => (
            <FormField 
              key={field.id}
              field={field}
              onUpdate={updateField}
              onRemove={removeField}
            />
          ))}
          <Button onClick={() => addField()}>Add Field</Button>
          <Button onClick={handleSave} variant="primary">Save Form</Button>
        </Form>
      </div>
      <div>
        <h2 className="text-2xl font-bold">Preview</h2>
        <FormPreview form={form} />
      </div>
    </div>
  );
};
```

### useFormBuilder.ts

```typescript
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormType, FormFieldType } from '../types';
import { formApi } from '../services';

export const useFormBuilder = (initialForm?: FormType) => {
  const [form, setForm] = useState<FormType>(initialForm || {
    id: uuidv4(),
    title: 'New Form',
    description: '',
    fields: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  
  const addField = useCallback(() => {
    const newField: FormFieldType = {
      id: uuidv4(),
      type: 'text',
      label: 'New Field',
      placeholder: '',
      required: false,
      order: form.fields.length,
    };
    
    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, newField],
      updatedAt: new Date().toISOString(),
    }));
  }, [form.fields]);
  
  const removeField = useCallback((fieldId: string) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.filter((field) => field.id !== fieldId),
      updatedAt: new Date().toISOString(),
    }));
  }, []);
  
  const updateField = useCallback((fieldId: string, updates: Partial<FormFieldType>) => {
    setForm((prev) => ({
      ...prev,
      fields: prev.fields.map((field) => 
        field.id === fieldId ? { ...field, ...updates } : field
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);
  
  const saveForm = useCallback(() => {
    const updatedForm = {
      ...form,
      updatedAt: new Date().toISOString(),
    };
    
    // You could call an API service here
    // formApi.saveForm(updatedForm);
    
    return updatedForm;
  }, [form]);
  
  return {
    form,
    addField,
    removeField,
    updateField,
    saveForm,
  };
};
```

## Integration with Pages

### FormBuilderPage.tsx (in src/pages)

```tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FormBuilder } from '@/features/forms/components';
import { useQuery, useMutation } from '@tanstack/react-query';
import { formApi } from '@/features/forms/services';

const FormBuilderPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: form, isLoading } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => formId ? formApi.getForm(formId) : null,
    enabled: !!formId,
  });
  
  const saveFormMutation = useMutation({
    mutationFn: formApi.saveForm,
    onSuccess: (savedForm) => {
      toast({
        title: 'Form saved',
        description: 'Your form has been saved successfully.',
      });
      
      if (!formId) {
        navigate(`/forms/${savedForm.id}`);
      }
    },
  });
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {formId ? 'Edit Form' : 'Create New Form'}
      </h1>
      
      <FormBuilder 
        initialForm={form} 
        onSave={(form) => saveFormMutation.mutate(form)}
      />
    </div>
  );
};

export default FormBuilderPage;
```

## Benefits of This Approach

1. **Cohesion**: All code related to the forms feature is grouped together, making it easy to understand and maintain.

2. **Isolation**: The forms feature is isolated from other features, reducing coupling and making it easier to modify or replace.

3. **Reusability**: Components, hooks, and utilities can be easily reused within the feature.

4. **Scalability**: As the feature grows, its internal structure can evolve without affecting other parts of the application.

5. **Discoverability**: Developers can easily find all code related to forms in one place.

6. **Testing**: Feature-specific components and logic can be tested in isolation.

7. **Collaboration**: Different teams can work on different features with minimal conflicts.

This example demonstrates how a feature-based organization can provide a clean, maintainable structure for complex features in a React application.