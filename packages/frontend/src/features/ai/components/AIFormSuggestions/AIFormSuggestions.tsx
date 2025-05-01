import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAIFormSuggestions } from '../../hooks/useAIFormSuggestions';
import { FormFieldType } from '@/features/forms';

interface AIFormSuggestionsProps {
  onApplySuggestion?: (suggestion: Omit<FormFieldType, 'id'>) => void;
  onApplyCompleteForm?: (form: {
    title: string;
    description: string;
    fields: Omit<FormFieldType, 'id'>[];
  }) => void;
  existingFields?: FormFieldType[];
}

/**
 * AI Form Suggestions component
 * 
 * This component provides AI-generated suggestions for form fields and improvements.
 * 
 * @example
 * ```tsx
 * <AIFormSuggestions 
 *   onApplySuggestion={handleApplySuggestion}
 *   onApplyCompleteForm={handleApplyCompleteForm}
 *   existingFields={form.fields}
 * />
 * ```
 */
export const AIFormSuggestions: React.FC<AIFormSuggestionsProps> = ({
  onApplySuggestion,
  onApplyCompleteForm,
  existingFields = []
}) => {
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'suggestions'>('generate');
  
  const {
    suggestions,
    fieldSuggestions,
    completeForm,
    isLoading,
    error,
    generateSuggestions,
    resetSuggestions
  } = useAIFormSuggestions();
  
  const handleGenerateSuggestions = () => {
    if (input.trim()) {
      generateSuggestions(input);
      setActiveTab('suggestions');
    }
  };
  
  const handleGenerateImprovements = () => {
    if (existingFields.length > 0) {
      generateSuggestions(existingFields);
      setActiveTab('suggestions');
    }
  };
  
  const handleApplySuggestion = (index: number) => {
    if (onApplySuggestion && fieldSuggestions.length > 0) {
      const suggestion = fieldSuggestions[index];
      if (suggestion) {
        onApplySuggestion(suggestion);
      }
    }
  };
  
  const handleApplyCompleteForm = () => {
    if (onApplyCompleteForm && completeForm) {
      onApplyCompleteForm(completeForm);
    }
  };
  
  const handleReset = () => {
    setInput('');
    resetSuggestions();
    setActiveTab('generate');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Form Suggestions</CardTitle>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'generate' | 'suggestions')}>
          <TabsList>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="suggestions" disabled={suggestions.length === 0}>
              Suggestions {suggestions.length > 0 && `(${suggestions.length})`}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <TabsContent value="generate" className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="form-description" className="text-sm font-medium">
              Form Title or Description
            </label>
            <Textarea
              id="form-description"
              placeholder="Enter a title or description for your form (e.g., 'Contact Form' or 'A form to collect user feedback about our product')"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          {existingFields.length > 0 && (
            <div className="pt-4">
              <Button 
                variant="outline" 
                onClick={handleGenerateImprovements}
                disabled={isLoading}
              >
                Generate Improvement Suggestions
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="suggestions">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner size="lg" />
              <span className="ml-2">Generating suggestions...</span>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          ) : suggestions.length > 0 ? (
            <div className="space-y-4">
              {completeForm ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Form Suggestion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Title:</span> {completeForm.title}
                      </div>
                      <div>
                        <span className="font-medium">Description:</span> {completeForm.description}
                      </div>
                      <div>
                        <span className="font-medium">Fields:</span> {completeForm.fields.length}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleApplyCompleteForm}>Apply Complete Form</Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <Card key={index}>
                      <CardContent className="py-4">
                        <div className="flex justify-between items-center">
                          <div>{suggestion}</div>
                          {fieldSuggestions[index] && onApplySuggestion && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApplySuggestion(index)}
                            >
                              Apply
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No suggestions yet. Try generating some!
            </div>
          )}
        </TabsContent>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
        <Button 
          onClick={handleGenerateSuggestions} 
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" className="mr-2" />
              Generating...
            </>
          ) : (
            'Generate Suggestions'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AIFormSuggestions;