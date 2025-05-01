import { useState, useCallback } from 'react';
import { aiFormService } from '../services/aiFormService';
import { FormFieldType } from '@/features/forms';

/**
 * Hook for getting AI-generated form suggestions
 * 
 * This hook provides functionality for generating form field suggestions,
 * form improvements, and complete forms using AI.
 * 
 * @example
 * ```tsx
 * const { 
 *   suggestions, 
 *   isLoading, 
 *   error, 
 *   generateSuggestions 
 * } = useAIFormSuggestions();
 * 
 * // Generate suggestions based on a form title
 * const handleGenerateSuggestions = () => {
 *   generateSuggestions('Contact Form');
 * };
 * ```
 */
export const useAIFormSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [fieldSuggestions, setFieldSuggestions] = useState<Omit<FormFieldType, 'id'>[]>([]);
  const [completeForm, setCompleteForm] = useState<{
    title: string;
    description: string;
    fields: Omit<FormFieldType, 'id'>[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Generate form field suggestions based on a form title or description
   * 
   * @param formTitle - Title or description of the form
   */
  const generateFieldSuggestions = useCallback(async (formTitle: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fields = await aiFormService.generateFieldSuggestions(formTitle);
      setFieldSuggestions(fields);
      
      // Generate human-readable suggestions from the fields
      const readableSuggestions = fields.map(field => 
        `Add a ${field.type} field for "${field.label}"${field.required ? ' (required)' : ''}`
      );
      
      setSuggestions(readableSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate field suggestions'));
      console.error('Error in generateFieldSuggestions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Generate form improvement suggestions based on existing form fields
   * 
   * @param formFields - Existing form fields
   */
  const generateFormImprovements = useCallback(async (formFields: FormFieldType[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const improvementSuggestions = await aiFormService.generateFormImprovements(formFields);
      setSuggestions(improvementSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate form improvements'));
      console.error('Error in generateFormImprovements:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Generate a complete form based on a description
   * 
   * @param description - Description of the form to generate
   */
  const generateCompleteForm = useCallback(async (description: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const form = await aiFormService.generateCompleteForm(description);
      setCompleteForm(form);
      
      // Generate human-readable suggestions from the form
      const readableSuggestions = [
        `Use title: "${form.title}"`,
        `Use description: "${form.description}"`,
        ...form.fields.map(field => 
          `Add a ${field.type} field for "${field.label}"${field.required ? ' (required)' : ''}`
        )
      ];
      
      setSuggestions(readableSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to generate complete form'));
      console.error('Error in generateCompleteForm:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Generate suggestions based on the context
   * 
   * This is a convenience method that determines which type of suggestions to generate
   * based on the input.
   * 
   * @param input - Form title, description, or fields
   */
  const generateSuggestions = useCallback((input: string | FormFieldType[]) => {
    if (typeof input === 'string') {
      // If the input is a string, generate field suggestions or a complete form
      if (input.length > 50) {
        // If the input is a longer string, assume it's a form description
        return generateCompleteForm(input);
      } else {
        // If the input is a shorter string, assume it's a form title
        return generateFieldSuggestions(input);
      }
    } else {
      // If the input is an array of form fields, generate form improvements
      return generateFormImprovements(input);
    }
  }, [generateFieldSuggestions, generateFormImprovements, generateCompleteForm]);

  /**
   * Apply a field suggestion to a form
   * 
   * @param index - Index of the field suggestion to apply
   * @returns The field suggestion at the specified index
   */
  const applyFieldSuggestion = useCallback((index: number): Omit<FormFieldType, 'id'> | null => {
    if (index >= 0 && index < fieldSuggestions.length) {
      return fieldSuggestions[index];
    }
    return null;
  }, [fieldSuggestions]);

  /**
   * Apply the complete form suggestion
   * 
   * @returns The complete form suggestion
   */
  const applyCompleteForm = useCallback(() => {
    return completeForm;
  }, [completeForm]);

  /**
   * Reset all suggestions
   */
  const resetSuggestions = useCallback(() => {
    setSuggestions([]);
    setFieldSuggestions([]);
    setCompleteForm(null);
    setError(null);
  }, []);

  return {
    suggestions,
    fieldSuggestions,
    completeForm,
    isLoading,
    error,
    generateSuggestions,
    generateFieldSuggestions,
    generateFormImprovements,
    generateCompleteForm,
    applyFieldSuggestion,
    applyCompleteForm,
    resetSuggestions
  };
};

export default useAIFormSuggestions;