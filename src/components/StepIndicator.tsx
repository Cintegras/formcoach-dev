
import React from 'react';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ totalSteps, currentStep }) => {
  return (
    <div className="w-full mb-6">
      <div className="h-1 bg-[#1C1C1E] rounded-full w-full overflow-hidden">
        <div 
          className="h-full bg-[#00C4B4] transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-[#A4B1B7]">
        <span>{`Step ${currentStep} of ${totalSteps}`}</span>
        <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
      </div>
    </div>
  );
};

export default StepIndicator;
