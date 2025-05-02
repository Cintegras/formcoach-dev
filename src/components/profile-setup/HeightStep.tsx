
import React from 'react';
import WheelSelector from '@/components/WheelSelector';
import { Ruler } from 'lucide-react';

interface HeightStepProps {
  feet: number;
  inches: number;
  onChangeFeet: (value: number) => void;
  onChangeInches: (value: number) => void;
}

const HeightStep: React.FC<HeightStepProps> = ({ feet, inches, onChangeFeet, onChangeInches }) => {
  const feetValues = [4, 5, 6, 7];
  const inchesValues = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-center mb-2">
        <Ruler size={24} className="text-[#00C4B4] mr-2" />
        <h1 className="text-2xl font-bold text-center text-white">
          What's your height?
        </h1>
      </div>

      <div className="flex justify-center mt-8 mb-4">
        <div className="text-3xl font-bold text-[#00C4B4]">
          {feet}'{inches}"
        </div>
      </div>
      
      <div className="flex justify-center space-x-6">
        <div className="w-1/2">
          <p className="text-center text-sm text-[#A4B1B7] mb-2">Feet</p>
          <WheelSelector 
            values={feetValues}
            initialValue={feet}
            onChange={(value) => onChangeFeet(Number(value))}
          />
        </div>
        
        <div className="w-1/2">
          <p className="text-center text-sm text-[#A4B1B7] mb-2">Inches</p>
          <WheelSelector 
            values={inchesValues}
            initialValue={inches}
            onChange={(value) => onChangeInches(Number(value))}
          />
        </div>
      </div>
    </div>
  );
};

export default HeightStep;
