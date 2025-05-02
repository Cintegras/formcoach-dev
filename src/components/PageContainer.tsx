
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`min-h-screen px-5 py-8 bg-[#000000] text-white ${className}`}
    >
      <div className="max-w-[400px] mx-auto">{children}</div>
    </div>
  );
};

export default PageContainer;
