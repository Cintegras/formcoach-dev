
import React from "react";
import BottomNav from "./BottomNav";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  hideBottomNav?: boolean;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = "",
  hideBottomNav = false
}) => {
  return (
    <div
      className={`min-h-screen px-4 py-8 bg-[#020D0C] text-white font-inter ${className}`}
    >
      <div className="max-w-[375px] mx-auto pb-20">{children}</div>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

export default PageContainer;
