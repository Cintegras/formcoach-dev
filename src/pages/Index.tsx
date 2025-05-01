
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Files } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  // This could be expanded to fetch actual file changes from an API
  const [recentFiles, setRecentFiles] = useState([
    { name: "AIFormSuggestions.tsx", path: "features/ai/components/AIFormSuggestions" },
    { name: "FormBuilder.tsx", path: "features/forms/components/FormBuilder" },
    { name: "aiFormService.ts", path: "features/ai/services" },
    { name: "formApi.ts", path: "features/forms/services" },
    { name: "forms.ts", path: "features/forms/types" },
    { name: "FormTypes.ts", path: "features/forms/types" },
    { name: "useAIFormSuggestions.ts", path: "features/ai/hooks" },
    { name: "useFormBuilder.ts", path: "features/forms/hooks" },
    { name: "form.py", path: "packages/backend/app/db/models" },
    { name: "forms.py", path: "packages/backend/app/services" },
    { name: "project-structure.md", path: "docs" },
    { name: "summary.md", path: "docs" },
    { name: "feature-example.md", path: "docs" },
    { name: "ai-integration-example.md", path: "docs" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6 flex flex-col items-center">
      <header className="w-full max-w-4xl mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">FormCoach Project</h1>
        <p className="text-muted-foreground text-center">
          Project files successfully synchronized from GitHub
        </p>
      </header>

      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Check className="text-green-500" />
            GitHub Sync Complete
          </CardTitle>
          <CardDescription>
            This project was updated with new files from GitHub
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Files size={18} />
            Recently Added Files
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recentFiles.map((file) => (
              <div 
                key={file.name}
                className="p-3 rounded-md bg-card hover:bg-accent transition-colors border flex flex-col"
              >
                <span className="font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground">{file.path}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
