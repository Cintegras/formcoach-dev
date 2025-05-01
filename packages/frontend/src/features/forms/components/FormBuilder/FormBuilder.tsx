import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from './FormField';
import { FormPreview } from './FormPreview';
import { useFormBuilder } from '../../hooks/useFormBuilder';
import { FormType, FormFieldType } from '../../types';

interface FormBuilderProps {
  initialForm?: FormType;
  onSave: (form: FormType) => void;
  aiSuggestions?: string[];
}

/**
 * FormBuilder component for creating and editing forms
 * 
 * This component allows users to build forms by adding, removing, and configuring fields.
 * It also provides a preview of the form as it's being built.
 * 
 * @example
 * ```tsx
 * <FormBuilder 
 *   initialForm={existingForm} 
 *   onSave={handleSaveForm} 
 *   aiSuggestions={aiSuggestions}
 * />
 * ```
 */
export const FormBuilder: React.FC<FormBuilderProps> = ({ 
  initialForm, 
  onSave,
  aiSuggestions = []
}) => {
  const { 
    form, 
    addField, 
    removeField, 
    updateField, 
    saveForm 
  } = useFormBuilder(initialForm);
  
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  
  const handleSave = () => {
    const savedForm = saveForm();
    onSave(savedForm);
  };
  
  const handleAddField = (type: FormFieldType['type']) => {
    addField({ type });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Form Builder</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'editor' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('editor')}
          >
            Editor
          </Button>
          <Button 
            variant={activeTab === 'preview' ? 'default' : 'outline'} 
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {activeTab === 'editor' ? (
          <div className="space-y-4">
            {form.fields.map((field) => (
              <FormField 
                key={field.id}
                field={field}
                onUpdate={updateField}
                onRemove={removeField}
              />
            ))}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={() => handleAddField('text')}>Add Text Field</Button>
              <Button onClick={() => handleAddField('textarea')}>Add Text Area</Button>
              <Button onClick={() => handleAddField('select')}>Add Select</Button>
              <Button onClick={() => handleAddField('checkbox')}>Add Checkbox</Button>
              <Button onClick={() => handleAddField('radio')}>Add Radio</Button>
            </div>
            
            {aiSuggestions.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">AI Suggestions</h3>
                <div className="space-y-2">
                  {aiSuggestions.map((suggestion, index) => (
                    <Card key={index} className="p-3">
                      <p>{suggestion}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => {
                          // Implementation for applying AI suggestion
                          console.log('Apply suggestion:', suggestion);
                        }}
                      >
                        Apply
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <FormPreview form={form} />
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} variant="default">Save Form</Button>
      </CardFooter>
    </Card>
  );
};

export default FormBuilder;