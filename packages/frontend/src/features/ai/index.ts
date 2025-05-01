/**
 * AI feature
 * 
 * This feature provides AI-powered functionality for the application,
 * including form suggestions, improvements, and generation.
 * 
 * @example
 * ```tsx
 * import { AIFormSuggestions, useAIFormSuggestions } from '@/features/ai';
 * 
 * const MyComponent = () => {
 *   const { generateSuggestions } = useAIFormSuggestions();
 *   
 *   return (
 *     <AIFormSuggestions onApplySuggestion={handleApplySuggestion} />
 *   );
 * };
 * ```
 */

// Export components
export * from './components/AIFormSuggestions/AIFormSuggestions';

// Export hooks
export * from './hooks/useAIFormSuggestions';

// Export services
export * from './services/aiFormService';

// Export types
export * from './types';

// Export constants
// export * from './constants';