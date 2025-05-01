# AI Integration in FormCoach

This document outlines how AI assistants like Junie, Builder.io, and other AI services would be integrated into the FormCoach application using the proposed structure.

## AI Integration Structure

```
formcoach/
├── packages/
│   ├── frontend/
│   │   └── src/
│   │       ├── features/
│   │       │   └── ai/                      # AI feature module
│   │       │       ├── components/          # AI-specific components
│   │       │       │   ├── AIAssistant/     # General AI assistant component
│   │       │       │   ├── AIChat/          # AI chat interface
│   │       │       │   ├── AIPromptBuilder/ # Prompt building interface
│   │       │       │   └── index.ts         # Export file
│   │       │       ├── hooks/               # AI-specific hooks
│   │       │       │   ├── useAIAssistant.ts # Hook for AI assistant
│   │       │       │   ├── useAIChat.ts     # Hook for AI chat
│   │       │       │   └── index.ts         # Export file
│   │       │       ├── services/            # AI service integrations
│   │       │       │   ├── aiService.ts     # Base AI service
│   │       │       │   ├── junieService.ts  # Junie-specific service
│   │       │       │   ├── builderService.ts # Builder.io-specific service
│   │       │       │   └── index.ts         # Export file
│   │       │       ├── types/               # AI-specific types
│   │       │       │   ├── AITypes.ts       # Type definitions for AI
│   │       │       │   └── index.ts         # Export file
│   │       │       ├── utils/               # AI-specific utilities
│   │       │       │   ├── promptUtils.ts   # Utilities for prompt engineering
│   │       │       │   └── index.ts         # Export file
│   │       │       ├── constants.ts         # AI-related constants
│   │       │       └── index.ts             # Main export file
│   │       └── services/
│   │           └── ai/                      # Global AI services
│   │               ├── aiClient.ts          # Base AI API client
│   │               ├── aiConfig.ts          # AI configuration
│   │               └── index.ts             # Export file
│   ├── backend/
│   │   └── app/
│   │       ├── api/
│   │       │   └── endpoints/
│   │       │       └── ai/                  # AI API endpoints
│   │       │           ├── chat.py          # Chat endpoints
│   │       │           ├── suggestions.py   # Suggestions endpoints
│   │       │           └── __init__.py      # Init file
│   │       └── services/
│   │           └── ai/                      # AI services
│   │               ├── base.py              # Base AI service
│   │               ├── junie.py             # Junie integration
│   │               ├── builder.py           # Builder.io integration
│   │               └── __init__.py          # Init file
│   └── shared/
│       └── types/
│           └── ai.ts                        # Shared AI types
└── scripts/
    └── ai/                                  # AI-related scripts
        ├── train.js                         # Training scripts
        └── evaluate.js                      # Evaluation scripts
```

## AI Service Integration

### Frontend AI Service Example

```typescript
// src/services/ai/aiClient.ts
import axios from 'axios';
import { AIModel, AIPrompt, AIResponse } from '@/types/ai';

class AIClient {
  private baseUrl: string;
  private apiKey: string;
  
  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }
  
  async generateResponse(prompt: AIPrompt, model: AIModel): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/generate`,
        { prompt, model },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    }
  }
  
  async streamResponse(prompt: AIPrompt, model: AIModel, onChunk: (chunk: string) => void): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/stream`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, model }),
      });
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body is null');
      
      const decoder = new TextDecoder();
      let done = false;
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        
        if (value) {
          const chunk = decoder.decode(value);
          onChunk(chunk);
        }
      }
    } catch (error) {
      console.error('Error streaming AI response:', error);
      throw error;
    }
  }
}

export default AIClient;
```

### Feature-Specific AI Service

```typescript
// src/features/forms/services/formAIService.ts
import { AIClient } from '@/services/ai';
import { FormType, FormFieldType } from '../types';
import { AIPrompt } from '@/types/ai';

class FormAIService {
  private aiClient: AIClient;
  
  constructor(aiClient: AIClient) {
    this.aiClient = aiClient;
  }
  
  async generateFormSuggestions(description: string): Promise<Partial<FormType>> {
    const prompt: AIPrompt = {
      system: "You are an expert form designer. Generate a form structure based on the user's description.",
      user: description,
    };
    
    const response = await this.aiClient.generateResponse(prompt, 'junie-form-designer');
    
    // Parse the response into a form structure
    return JSON.parse(response.content);
  }
  
  async suggestFormImprovements(form: FormType): Promise<string[]> {
    const prompt: AIPrompt = {
      system: "You are an expert in form usability and design. Analyze the given form and suggest improvements.",
      user: JSON.stringify(form),
    };
    
    const response = await this.aiClient.generateResponse(prompt, 'junie-form-analyzer');
    
    // Parse the response into an array of suggestions
    return JSON.parse(response.content);
  }
  
  async generateFieldValidation(field: FormFieldType): Promise<string> {
    const prompt: AIPrompt = {
      system: "You are an expert in form validation. Generate a validation rule for the given field.",
      user: JSON.stringify(field),
    };
    
    const response = await this.aiClient.generateResponse(prompt, 'junie-validator');
    
    return response.content;
  }
}

export default FormAIService;
```

## AI Component Example

```tsx
// src/features/forms/components/AIFormSuggestions/AIFormSuggestions.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { useFormAI } from '../../hooks/useFormAI';
import { FormType } from '../../types';

interface AIFormSuggestionsProps {
  onApplySuggestion: (form: Partial<FormType>) => void;
}

export const AIFormSuggestions: React.FC<AIFormSuggestionsProps> = ({ onApplySuggestion }) => {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateFormSuggestions } = useFormAI();
  
  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    try {
      const suggestion = await generateFormSuggestions(description);
      onApplySuggestion(suggestion);
    } catch (error) {
      console.error('Error generating form suggestions:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Form Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Describe the form you want to create..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mb-4"
        />
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          disabled={!description.trim() || isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Form'}
        </Button>
      </CardFooter>
    </Card>
  );
};
```

## AI Hook Example

```typescript
// src/features/forms/hooks/useFormAI.ts
import { useCallback } from 'react';
import { FormType } from '../types';
import { formAIService } from '../services';
import { useToast } from '@/hooks/use-toast';

export const useFormAI = () => {
  const { toast } = useToast();
  
  const generateFormSuggestions = useCallback(async (description: string): Promise<Partial<FormType>> => {
    try {
      return await formAIService.generateFormSuggestions(description);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate form suggestions. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);
  
  const suggestFormImprovements = useCallback(async (form: FormType): Promise<string[]> => {
    try {
      return await formAIService.suggestFormImprovements(form);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate improvement suggestions. Please try again.',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);
  
  return {
    generateFormSuggestions,
    suggestFormImprovements,
  };
};
```

## Backend AI Service Example

```python
# app/services/ai/junie.py
import os
import httpx
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class JuniePrompt(BaseModel):
    system: str
    user: str

class JunieResponse(BaseModel):
    content: str
    model: str
    usage: Dict[str, int]

class JunieService:
    def __init__(self):
        self.api_key = os.getenv("JUNIE_API_KEY")
        self.base_url = os.getenv("JUNIE_API_URL", "https://api.junie.io/v1")
        
    async def generate_response(self, prompt: JuniePrompt, model: str) -> JunieResponse:
        """Generate a response from Junie AI"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/completions",
                json={
                    "prompt": {
                        "system": prompt.system,
                        "user": prompt.user
                    },
                    "model": model,
                    "max_tokens": 1000
                },
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                }
            )
            
            if response.status_code != 200:
                raise Exception(f"Error from Junie API: {response.text}")
                
            data = response.json()
            return JunieResponse(
                content=data["content"],
                model=data["model"],
                usage=data["usage"]
            )
    
    async def generate_form_structure(self, description: str) -> Dict[str, Any]:
        """Generate a form structure based on a description"""
        prompt = JuniePrompt(
            system="You are an expert form designer. Generate a form structure based on the user's description.",
            user=description
        )
        
        response = await self.generate_response(prompt, "junie-form-designer")
        
        # Parse the response as JSON
        import json
        return json.loads(response.content)
```

## API Endpoint Example

```python
# app/api/endpoints/ai/suggestions.py
from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any, List
from pydantic import BaseModel

from app.services.ai import JunieService
from app.api.deps import get_junie_service

router = APIRouter()

class FormDescriptionRequest(BaseModel):
    description: str

class FormSuggestionResponse(BaseModel):
    title: str
    description: str
    fields: List[Dict[str, Any]]

@router.post("/form-suggestions", response_model=FormSuggestionResponse)
async def generate_form_suggestions(
    request: FormDescriptionRequest,
    junie_service: JunieService = Depends(get_junie_service)
):
    """Generate form structure suggestions based on a description"""
    try:
        form_structure = await junie_service.generate_form_structure(request.description)
        return FormSuggestionResponse(**form_structure)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating form suggestions: {str(e)}")
```

## Integration with Form Builder

```tsx
// src/pages/FormBuilderPage.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { FormBuilder } from '@/features/forms/components/FormBuilder';
import { AIFormSuggestions } from '@/features/forms/components/AIFormSuggestions';
import { useQuery, useMutation } from '@tanstack/react-query';
import { formApi } from '@/features/forms/services';
import { FormType } from '@/features/forms/types';

const FormBuilderPage: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState<FormType | null>(null);
  
  const { data: initialForm, isLoading } = useQuery({
    queryKey: ['form', formId],
    queryFn: () => formId ? formApi.getForm(formId) : null,
    enabled: !!formId,
    onSuccess: (data) => {
      if (data) setForm(data);
    }
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
  
  const handleApplySuggestion = (suggestion: Partial<FormType>) => {
    setForm((prev) => {
      if (!prev) return suggestion as FormType;
      return { ...prev, ...suggestion };
    });
    
    toast({
      title: 'AI Suggestion Applied',
      description: 'The AI-generated form structure has been applied.',
    });
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {formId ? 'Edit Form' : 'Create New Form'}
      </h1>
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <FormBuilder 
            initialForm={form || initialForm} 
            onSave={(form) => saveFormMutation.mutate(form)}
            onChange={setForm}
          />
        </div>
        <div>
          <AIFormSuggestions onApplySuggestion={handleApplySuggestion} />
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage;
```

## Benefits of This AI Integration Approach

1. **Separation of Concerns**: AI functionality is separated into its own feature module and services, making it easier to maintain and update.

2. **Reusability**: AI services can be reused across different features of the application.

3. **Scalability**: The structure allows for adding new AI models and services without affecting existing functionality.

4. **Flexibility**: Different AI providers (Junie, Builder.io, etc.) can be integrated through a common interface.

5. **Type Safety**: TypeScript types ensure that AI responses are properly typed and validated.

6. **Testing**: AI services can be mocked for testing purposes, making it easier to test components that use AI.

7. **Developer Experience**: Clear organization makes it easier for developers to understand how AI is integrated into the application.

This approach provides a solid foundation for integrating AI assistants into the FormCoach application, allowing for easy expansion and maintenance as the application grows.