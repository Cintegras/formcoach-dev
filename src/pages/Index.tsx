
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Files } from "lucide-react";
import { useState } from "react";
import PageContainer from '@/components/PageContainer';

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
    <PageContainer>
      <div className="min-h-[80vh] p-6 flex flex-col items-center font-inter">
        <header className="w-full max-w-4xl mb-8">
          <h1 className="font-bold text-[28px] text-center text-[#A4B1B7] mb-2">FormCoach Project</h1>
          <p className="font-normal text-[16px] text-[#A4B1B7] text-center">
            Project files successfully synchronized from GitHub
          </p>
        </header>

        <div className="w-full max-w-4xl rounded-lg" style={{ backgroundColor: "rgba(176, 232, 227, 0.12)" }}>
          <div className="p-4 border-b border-[#A4B1B7] border-opacity-20">
            <h2 className="font-bold text-[20px] text-[#A4B1B7] flex items-center gap-2">
              <Check className="text-[#00C4B4]" />
              GitHub Sync Complete
            </h2>
            <p className="font-normal text-[14px] text-[#A4B1B7]">
              This project was updated with new files from GitHub
            </p>
          </div>
          <div className="p-6">
            <h3 className="font-semibold text-[18px] text-[#A4B1B7] mb-4 flex items-center gap-2">
              <Files size={18} className="text-[#A4B1B7]" />
              Recently Added Files
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentFiles.map((file) => (
                <div 
                  key={file.name}
                  className="p-3 rounded-md flex flex-col"
                  style={{ backgroundColor: "rgba(176, 232, 227, 0.08)" }}
                >
                  <span className="font-medium text-[#A4B1B7]">{file.name}</span>
                  <span className="text-[12px] text-[#A4B1B7] opacity-80">{file.path}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Index;
