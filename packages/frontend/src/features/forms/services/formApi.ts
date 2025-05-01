import { FormType, FormSubmissionType } from '../types/FormTypes';

/**
 * API service for forms
 * 
 * This service provides methods for interacting with the forms API.
 */
class FormApiService {
  private baseUrl: string;
  
  constructor(baseUrl: string = '/api/forms') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Get all forms
   * 
   * @returns Promise that resolves to an array of forms
   */
  async getForms(): Promise<FormType[]> {
    try {
      const response = await fetch(this.baseUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch forms: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw error;
    }
  }
  
  /**
   * Get a form by ID
   * 
   * @param formId - ID of the form to get
   * @returns Promise that resolves to the form
   */
  async getFormById(formId: string): Promise<FormType> {
    try {
      const response = await fetch(`${this.baseUrl}/${formId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch form: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching form ${formId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new form
   * 
   * @param form - Form data to create
   * @returns Promise that resolves to the created form
   */
  async createForm(form: Omit<FormType, 'id' | 'createdAt' | 'updatedAt'>): Promise<FormType> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create form: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating form:', error);
      throw error;
    }
  }
  
  /**
   * Update an existing form
   * 
   * @param formId - ID of the form to update
   * @param form - Updated form data
   * @returns Promise that resolves to the updated form
   */
  async updateForm(formId: string, form: Partial<FormType>): Promise<FormType> {
    try {
      const response = await fetch(`${this.baseUrl}/${formId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update form: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating form ${formId}:`, error);
      throw error;
    }
  }
  
  /**
   * Delete a form
   * 
   * @param formId - ID of the form to delete
   * @returns Promise that resolves when the form is deleted
   */
  async deleteForm(formId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${formId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete form: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error deleting form ${formId}:`, error);
      throw error;
    }
  }
  
  /**
   * Submit a form
   * 
   * @param formId - ID of the form to submit
   * @param values - Form values to submit
   * @returns Promise that resolves to the form submission
   */
  async submitForm(formId: string, values: Record<string, any>): Promise<FormSubmissionType> {
    try {
      const response = await fetch(`${this.baseUrl}/${formId}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error submitting form ${formId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get form submissions
   * 
   * @param formId - ID of the form to get submissions for
   * @returns Promise that resolves to an array of form submissions
   */
  async getFormSubmissions(formId: string): Promise<FormSubmissionType[]> {
    try {
      const response = await fetch(`${this.baseUrl}/${formId}/submissions`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch form submissions: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching submissions for form ${formId}:`, error);
      throw error;
    }
  }
}

export const formApi = new FormApiService();

export default formApi;