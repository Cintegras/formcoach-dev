import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FormType, FormFieldType } from '../types';

/**
 * Hook for building and managing forms
 * 
 * This hook provides functionality for creating, updating, and managing form fields.
 * 
 * @param initialForm - Optional initial form data
 * @returns Form building utilities and current form state
 * 
 * @example
 * ```tsx
 * const { form, addField, removeField, updateField, saveForm } = useFormBuilder(initialForm);
 * ```
 */
export const useFormBuilder = (initialForm?: FormType) => {
  const [form, setForm] = useState<FormType>(initialForm || {
    id: uuidv4(),
    title: 'New Form',
    description: '',
    fields: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  /**
   * Add a new field to the form
   * 
   * @param fieldData - Partial field data to initialize the field
   */
  const addField = useCallback((fieldData: Partial<FormFieldType>) => {
    const newField: FormFieldType = {
      id: uuidv4(),
      type: fieldData.type || 'text',
      label: fieldData.label || `New ${fieldData.type || 'text'} field`,
      placeholder: fieldData.placeholder || '',
      required: fieldData.required || false,
      options: fieldData.options || [],
      validation: fieldData.validation || null,
      defaultValue: fieldData.defaultValue || '',
      ...fieldData,
    };

    setForm((prevForm) => ({
      ...prevForm,
      fields: [...prevForm.fields, newField],
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Remove a field from the form
   * 
   * @param fieldId - ID of the field to remove
   */
  const removeField = useCallback((fieldId: string) => {
    setForm((prevForm) => ({
      ...prevForm,
      fields: prevForm.fields.filter((field) => field.id !== fieldId),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Update an existing field in the form
   * 
   * @param fieldId - ID of the field to update
   * @param fieldData - New field data
   */
  const updateField = useCallback((fieldId: string, fieldData: Partial<FormFieldType>) => {
    setForm((prevForm) => ({
      ...prevForm,
      fields: prevForm.fields.map((field) =>
        field.id === fieldId ? { ...field, ...fieldData } : field
      ),
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Update form metadata (title, description)
   * 
   * @param metadata - Form metadata to update
   */
  const updateFormMetadata = useCallback((metadata: Partial<Pick<FormType, 'title' | 'description'>>) => {
    setForm((prevForm) => ({
      ...prevForm,
      ...metadata,
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  /**
   * Reorder fields in the form
   * 
   * @param sourceIndex - Index of the field to move
   * @param destinationIndex - Destination index for the field
   */
  const reorderFields = useCallback((sourceIndex: number, destinationIndex: number) => {
    setForm((prevForm) => {
      const newFields = [...prevForm.fields];
      const [removed] = newFields.splice(sourceIndex, 1);
      newFields.splice(destinationIndex, 0, removed);
      
      return {
        ...prevForm,
        fields: newFields,
        updatedAt: new Date().toISOString(),
      };
    });
  }, []);

  /**
   * Save the current form state
   * 
   * @returns The current form state with updated timestamp
   */
  const saveForm = useCallback(() => {
    const savedForm = {
      ...form,
      updatedAt: new Date().toISOString(),
    };
    
    setForm(savedForm);
    return savedForm;
  }, [form]);

  return {
    form,
    addField,
    removeField,
    updateField,
    updateFormMetadata,
    reorderFields,
    saveForm,
  };
};

export default useFormBuilder;