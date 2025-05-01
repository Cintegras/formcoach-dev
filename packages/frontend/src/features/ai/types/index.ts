/**
 * AI feature types
 * 
 * This file contains types for AI models, prompts, and responses.
 */

/**
 * AI model type
 * Represents the AI model to use for generating responses
 */
export type AIModel = 
  | 'gpt-3.5-turbo'
  | 'gpt-4'
  | 'gpt-4-turbo'
  | 'claude-2'
  | 'claude-instant'
  | 'junie-form-assistant'
  | 'builder-form-assistant';

/**
 * AI message role
 * Represents the role of a message in a conversation
 */
export type AIMessageRole = 'system' | 'user' | 'assistant' | 'function';

/**
 * AI message
 * Represents a message in a conversation with an AI model
 */
export interface AIMessage {
  /** Role of the message sender */
  role: AIMessageRole;
  
  /** Content of the message */
  content: string;
  
  /** Name of the function that was called (for function messages) */
  name?: string;
  
  /** Function call information (for assistant messages) */
  function_call?: {
    /** Name of the function to call */
    name: string;
    /** Arguments to pass to the function */
    arguments: string;
  };
}

/**
 * AI prompt
 * Represents a prompt to send to an AI model
 */
export interface AIPrompt {
  /** Messages in the conversation */
  messages: AIMessage[];
  
  /** Temperature for controlling randomness (0-2) */
  temperature?: number;
  
  /** Maximum number of tokens to generate */
  max_tokens?: number;
  
  /** Top-p sampling (nucleus sampling) */
  top_p?: number;
  
  /** Frequency penalty (-2 to 2) */
  frequency_penalty?: number;
  
  /** Presence penalty (-2 to 2) */
  presence_penalty?: number;
  
  /** Stop sequences */
  stop?: string[];
  
  /** Functions that the model can call */
  functions?: AIFunction[];
  
  /** Function to call automatically */
  function_call?: 'auto' | 'none' | { name: string };
}

/**
 * AI function
 * Represents a function that an AI model can call
 */
export interface AIFunction {
  /** Name of the function */
  name: string;
  
  /** Description of the function */
  description: string;
  
  /** Parameters for the function */
  parameters: {
    /** Type of the parameters object */
    type: 'object';
    
    /** Properties of the parameters object */
    properties: Record<string, {
      /** Type of the property */
      type: 'string' | 'number' | 'boolean' | 'array' | 'object';
      
      /** Description of the property */
      description: string;
      
      /** Items in the array (for array properties) */
      items?: {
        /** Type of the items */
        type: 'string' | 'number' | 'boolean' | 'object';
      };
      
      /** Enum values (for string properties) */
      enum?: string[];
    }>;
    
    /** Required properties */
    required?: string[];
  };
}

/**
 * AI response choice
 * Represents a single response choice from an AI model
 */
export interface AIResponseChoice {
  /** Index of the choice */
  index: number;
  
  /** Message in the choice */
  message: AIMessage;
  
  /** Finish reason */
  finish_reason: 'stop' | 'length' | 'function_call' | 'content_filter';
}

/**
 * AI response usage
 * Represents token usage information for an AI response
 */
export interface AIResponseUsage {
  /** Number of prompt tokens */
  prompt_tokens: number;
  
  /** Number of completion tokens */
  completion_tokens: number;
  
  /** Total number of tokens */
  total_tokens: number;
}

/**
 * AI response
 * Represents a response from an AI model
 */
export interface AIResponse {
  /** ID of the response */
  id: string;
  
  /** Object type */
  object: 'chat.completion';
  
  /** Creation timestamp */
  created: number;
  
  /** Model used for the response */
  model: string;
  
  /** Response choices */
  choices: AIResponseChoice[];
  
  /** Token usage information */
  usage: AIResponseUsage;
}

/**
 * AI stream chunk
 * Represents a chunk of a streaming AI response
 */
export interface AIStreamChunk {
  /** ID of the chunk */
  id: string;
  
  /** Object type */
  object: 'chat.completion.chunk';
  
  /** Creation timestamp */
  created: number;
  
  /** Model used for the response */
  model: string;
  
  /** Chunk choices */
  choices: {
    /** Index of the choice */
    index: number;
    
    /** Delta in the choice */
    delta: Partial<AIMessage>;
    
    /** Finish reason */
    finish_reason: 'stop' | 'length' | 'function_call' | 'content_filter' | null;
  }[];
}

/**
 * AI error
 * Represents an error from an AI model
 */
export interface AIError {
  /** Error message */
  message: string;
  
  /** Error type */
  type: string;
  
  /** Error code */
  code: string;
  
  /** Error param */
  param: string | null;
}

/**
 * AI form suggestion
 * Represents a suggestion for a form field
 */
export interface AIFormSuggestion {
  /** Type of the suggestion */
  type: 'field' | 'improvement' | 'complete_form';
  
  /** Content of the suggestion */
  content: string;
  
  /** Data associated with the suggestion */
  data?: any;
}

export default {
  AIModel,
  AIMessageRole,
  AIMessage,
  AIPrompt,
  AIFunction,
  AIResponseChoice,
  AIResponseUsage,
  AIResponse,
  AIStreamChunk,
  AIError,
  AIFormSuggestion
};