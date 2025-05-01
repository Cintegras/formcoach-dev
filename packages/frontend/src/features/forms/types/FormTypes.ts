/**
 * Types for the forms feature
 */

/**
 * Form field type
 * Represents a single field in a form
 */
export interface FormFieldType {
  /** Unique identifier for the field */
  id: string;
  
  /** Type of the field */
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number' | 'email' | 'password';
  
  /** Label for the field */
  label: string;
  
  /** Placeholder text for the field */
  placeholder?: string;
  
  /** Whether the field is required */
  required: boolean;
  
  /** Options for select, checkbox, and radio fields */
  options?: Array<{
    value: string;
    label: string;
  }>;
  
  /** Validation rules for the field */
  validation: {
    /** Minimum length for text fields */
    minLength?: number;
    /** Maximum length for text fields */
    maxLength?: number;
    /** Pattern for text fields */
    pattern?: string;
    /** Minimum value for number fields */
    min?: number;
    /** Maximum value for number fields */
    max?: number;
    /** Custom validation function */
    custom?: (value: any) => boolean | string;
  } | null;
  
  /** Default value for the field */
  defaultValue?: any;
  
  /** Help text for the field */
  helpText?: string;
  
  /** Whether the field is disabled */
  disabled?: boolean;
  
  /** Additional CSS classes for the field */
  className?: string;
}

/**
 * Form type
 * Represents a complete form with fields and metadata
 */
export interface FormType {
  /** Unique identifier for the form */
  id: string;
  
  /** Title of the form */
  title: string;
  
  /** Description of the form */
  description: string;
  
  /** Fields in the form */
  fields: FormFieldType[];
  
  /** When the form was created */
  createdAt: string;
  
  /** When the form was last updated */
  updatedAt: string;
  
  /** User who created the form */
  createdBy?: string;
  
  /** Whether the form is published */
  published?: boolean;
  
  /** When the form was published */
  publishedAt?: string;
  
  /** Form submission settings */
  settings?: {
    /** Whether to collect email addresses */
    collectEmail?: boolean;
    /** Whether to allow multiple submissions */
    allowMultipleSubmissions?: boolean;
    /** Whether to show a confirmation message */
    showConfirmation?: boolean;
    /** Confirmation message to show */
    confirmationMessage?: string;
    /** Whether to send email notifications */
    sendNotifications?: boolean;
    /** Email addresses to send notifications to */
    notificationEmails?: string[];
  };
}

/**
 * Form submission type
 * Represents a submission of a form
 */
export interface FormSubmissionType {
  /** Unique identifier for the submission */
  id: string;
  
  /** ID of the form that was submitted */
  formId: string;
  
  /** When the form was submitted */
  submittedAt: string;
  
  /** User who submitted the form */
  submittedBy?: string;
  
  /** Form field values */
  values: Record<string, any>;
}

export default {
  FormFieldType,
  FormType,
  FormSubmissionType,
};