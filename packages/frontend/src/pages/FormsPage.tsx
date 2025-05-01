import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FormBuilder, formApi, FormType } from '@/features/forms';
import { useAIFormSuggestions } from '@/features/ai/hooks/useAIFormSuggestions';

/**
 * Forms page component
 * 
 * This page allows users to view, create, and edit forms.
 */
const FormsPage: React.FC = () => {
  const [forms, setForms] = useState<FormType[]>([]);
  const [activeForm, setActiveForm] = useState<FormType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-forms');
  
  const navigate = useNavigate();
  const { suggestions, generateSuggestions } = useAIFormSuggestions();
  
  // Fetch forms on component mount
  useEffect(() => {
    const fetchForms = async () => {
      try {
        setIsLoading(true);
        const fetchedForms = await formApi.getForms();
        setForms(fetchedForms);
      } catch (error) {
        console.error('Error fetching forms:', error);
        // Handle error (e.g., show toast notification)
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchForms();
  }, []);
  
  // Handle form creation
  const handleCreateForm = () => {
    setActiveForm(null); // Reset active form
    setActiveTab('create-form');
  };
  
  // Handle form editing
  const handleEditForm = (form: FormType) => {
    setActiveForm(form);
    setActiveTab('create-form');
  };
  
  // Handle form deletion
  const handleDeleteForm = async (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      try {
        await formApi.deleteForm(formId);
        setForms(forms.filter(form => form.id !== formId));
        // Show success notification
      } catch (error) {
        console.error('Error deleting form:', error);
        // Show error notification
      }
    }
  };
  
  // Handle form save
  const handleSaveForm = async (form: FormType) => {
    try {
      let savedForm: FormType;
      
      if (activeForm) {
        // Update existing form
        savedForm = await formApi.updateForm(activeForm.id, form);
        setForms(forms.map(f => f.id === savedForm.id ? savedForm : f));
      } else {
        // Create new form
        savedForm = await formApi.createForm(form);
        setForms([...forms, savedForm]);
      }
      
      // Show success notification
      setActiveTab('my-forms');
    } catch (error) {
      console.error('Error saving form:', error);
      // Show error notification
    }
  };
  
  // Handle form view
  const handleViewForm = (formId: string) => {
    navigate(`/forms/${formId}`);
  };
  
  // Generate AI suggestions for the form
  const handleGenerateSuggestions = () => {
    generateSuggestions(activeForm?.title || 'New Form');
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forms</h1>
        <Button onClick={handleCreateForm}>Create Form</Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="my-forms">My Forms</TabsTrigger>
          <TabsTrigger value="create-form">
            {activeForm ? 'Edit Form' : 'Create Form'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-forms">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading forms...</p>
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center p-8">
              <p className="mb-4">You don't have any forms yet.</p>
              <Button onClick={handleCreateForm}>Create your first form</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {forms.map((form) => (
                <Card key={form.id}>
                  <CardHeader>
                    <CardTitle>{form.title}</CardTitle>
                    <CardDescription>
                      {form.fields.length} fields • Last updated: {new Date(form.updatedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2">{form.description || 'No description'}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => handleViewForm(form.id)}>
                      View
                    </Button>
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => handleEditForm(form)}>
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => handleDeleteForm(form.id)}>
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create-form">
          <div className="mb-4 flex justify-end">
            <Button variant="outline" onClick={handleGenerateSuggestions}>
              Generate AI Suggestions
            </Button>
          </div>
          
          <FormBuilder
            initialForm={activeForm || undefined}
            onSave={handleSaveForm}
            aiSuggestions={suggestions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormsPage;