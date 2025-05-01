import { AIModel, AIPrompt, AIResponse } from '../types';
import { aiClient } from '@/services/ai/aiClient';
import { FormFieldType } from '@/features/forms';

/**
 * AI service for form-related AI features
 */
class AIFormService {
  /**
   * Generate form field suggestions based on a form title or description
   * 
   * @param formTitle - Title or description of the form
   * @param model - AI model to use (optional)
   * @returns Promise that resolves to an array of suggested form fields
   */
  async generateFieldSuggestions(
    formTitle: string,
    model: AIModel = 'gpt-4'
  ): Promise<Omit<FormFieldType, 'id'>[]> {
    try {
      const prompt: AIPrompt = {
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that helps users create forms. 
            Your task is to suggest appropriate form fields based on the form title or description provided.
            Respond with a JSON array of form field objects that include type, label, placeholder, required, and validation properties.
            Only include fields that make sense for the form described.`
          },
          {
            role: 'user',
            content: `I'm creating a form with the title: "${formTitle}". 
            Please suggest appropriate fields for this form.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      };

      const response = await aiClient.generateResponse(prompt, model);
      
      // Parse the response to extract the JSON array of form fields
      const fields = this.parseFieldsFromResponse(response);
      
      return fields;
    } catch (error) {
      console.error('Error generating field suggestions:', error);
      throw error;
    }
  }
  
  /**
   * Generate form improvement suggestions based on an existing form
   * 
   * @param formFields - Existing form fields
   * @param model - AI model to use (optional)
   * @returns Promise that resolves to an array of improvement suggestions
   */
  async generateFormImprovements(
    formFields: FormFieldType[],
    model: AIModel = 'gpt-4'
  ): Promise<string[]> {
    try {
      const fieldsJson = JSON.stringify(formFields, null, 2);
      
      const prompt: AIPrompt = {
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that helps users improve their forms.
            Your task is to analyze the provided form fields and suggest improvements.
            Consider usability, accessibility, validation, and completeness.
            Respond with a JSON array of string suggestions.`
          },
          {
            role: 'user',
            content: `Please analyze these form fields and suggest improvements:\n\n${fieldsJson}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      };

      const response = await aiClient.generateResponse(prompt, model);
      
      // Parse the response to extract the JSON array of suggestions
      const suggestions = this.parseSuggestionsFromResponse(response);
      
      return suggestions;
    } catch (error) {
      console.error('Error generating form improvements:', error);
      throw error;
    }
  }
  
  /**
   * Generate a complete form based on a description
   * 
   * @param description - Description of the form to generate
   * @param model - AI model to use (optional)
   * @returns Promise that resolves to a form object
   */
  async generateCompleteForm(
    description: string,
    model: AIModel = 'gpt-4'
  ): Promise<{
    title: string;
    description: string;
    fields: Omit<FormFieldType, 'id'>[];
  }> {
    try {
      const prompt: AIPrompt = {
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant that helps users create forms.
            Your task is to generate a complete form based on the description provided.
            Respond with a JSON object that includes title, description, and an array of form fields.
            Each field should include type, label, placeholder, required, and validation properties.`
          },
          {
            role: 'user',
            content: `I need a form for: "${description}". Please generate a complete form.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      };

      const response = await aiClient.generateResponse(prompt, model);
      
      // Parse the response to extract the form object
      const form = this.parseFormFromResponse(response);
      
      return form;
    } catch (error) {
      console.error('Error generating complete form:', error);
      throw error;
    }
  }
  
  /**
   * Parse form fields from an AI response
   * 
   * @param response - AI response
   * @returns Array of form fields
   * @private
   */
  private parseFieldsFromResponse(response: AIResponse): Omit<FormFieldType, 'id'>[] {
    try {
      // Extract JSON array from the response
      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: try to parse the entire content as JSON
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing fields from AI response:', error);
      return [];
    }
  }
  
  /**
   * Parse suggestions from an AI response
   * 
   * @param response - AI response
   * @returns Array of suggestions
   * @private
   */
  private parseSuggestionsFromResponse(response: AIResponse): string[] {
    try {
      // Extract JSON array from the response
      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: try to parse the entire content as JSON
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing suggestions from AI response:', error);
      
      // Fallback: split the content by newlines and filter out empty lines
      const content = response.choices[0].message.content;
      return content
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && line.length > 0);
    }
  }
  
  /**
   * Parse a form from an AI response
   * 
   * @param response - AI response
   * @returns Form object
   * @private
   */
  private parseFormFromResponse(response: AIResponse): {
    title: string;
    description: string;
    fields: Omit<FormFieldType, 'id'>[];
  } {
    try {
      // Extract JSON object from the response
      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: try to parse the entire content as JSON
      return JSON.parse(content);
    } catch (error) {
      console.error('Error parsing form from AI response:', error);
      return {
        title: '',
        description: '',
        fields: []
      };
    }
  }
}

export const aiFormService = new AIFormService();

export default aiFormService;