
import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`min-h-screen px-4 py-8 bg-[#020D0C] text-white font-poppins ${className}`}
    >
      <div className="max-w-[375px] mx-auto">{children}</div>
    </div>
  );
};

export default PageContainer;
