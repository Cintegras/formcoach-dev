
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`min-h-screen px-4 py-8 bg-formcoach-background text-formcoach-text font-poppins ${className}`}
    >
      <div className="formcoach-container max-w-md mx-auto">{children}</div>
    </div>
  );
};

export default PageContainer;
