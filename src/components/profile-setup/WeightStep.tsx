
import React from 'react';
import WheelSelector from '@/components/WheelSelector';
import { Scale } from 'lucide-react';

interface WeightStepProps {
  weight: number;
  onChange: (value: number) => void;
}

const WeightStep: React.FC<WeightStepProps> = ({ weight, onChange }) => {
  const weightValues = Array.from({ length: 221 }, (_, i) => i + 80); // 80 to 300 lbs

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-center mb-2">
        <Scale size={24} className="text-[#00C4B4] mr-2" />
        <h1 className="text-2xl font-bold text-center text-white">
          What's your weight?
        </h1>
      </div>

      <div className="flex justify-center mt-8 mb-4">
        <div className="text-3xl font-bold text-[#00C4B4]">
          {weight} lbs
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="w-1/2">
          <WheelSelector 
            values={weightValues}
            initialValue={weight}
            onChange={(value) => onChange(Number(value))}
            height={240}
          />
        </div>
      </div>
    </div>
  );
};

export default WeightStep;
