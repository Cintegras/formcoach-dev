
import React from 'react';
import WheelSelector from '@/components/WheelSelector';
import { Calendar } from 'lucide-react';

interface AgeStepProps {
  age: number;
  onChange: (value: number) => void;
}

const AgeStep: React.FC<AgeStepProps> = ({ age, onChange }) => {
  const ageValues = Array.from({ length: 73 }, (_, i) => i + 18); // 18 to 90 years

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-center mb-2">
        <Calendar size={24} className="text-[#00C4B4] mr-2" />
        <h1 className="text-2xl font-bold text-center text-white">
          What's your age?
        </h1>
      </div>

      <div className="flex justify-center mt-8 mb-4">
        <div className="text-3xl font-bold text-[#00C4B4]">
          {age} years
        </div>
      </div>
      
      <div className="flex justify-center">
        <div className="w-1/2">
          <WheelSelector 
            values={ageValues}
            initialValue={age}
            onChange={(value) => onChange(Number(value))}
            height={240}
          />
        </div>
      </div>
    </div>
  );
};

export default AgeStep;
