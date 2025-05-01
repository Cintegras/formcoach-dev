
import React from 'react';
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  withPadding?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = "", 
  withPadding = true
}) => {
  return (
    <div className={cn(
      "w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white",
      withPadding && "px-4 py-6 md:px-8 md:py-10",
      className
    )}>
      <div className="max-w-md mx-auto">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
