import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`min-h-screen px-4 py-8 bg-formcoach-background text-formcoach-text ${className}`}
    >
      <div className="max-w-3xl mx-auto">{children}</div>
    </div>
  );
};

export default PageContainer;