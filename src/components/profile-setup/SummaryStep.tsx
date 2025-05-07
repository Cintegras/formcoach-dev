import React from 'react';
import {Calendar, Info, Ruler, Scale, User} from 'lucide-react';

interface SummaryStepProps {
  firstName: string;
  height: { feet: number; inches: number };
  weight: number;
  age: number;
  sex: "male" | "female" | "other" | undefined;
  bmi: number;
}

const SummaryStep: React.FC<SummaryStepProps> = ({
  firstName,
  height,
  weight,
  age,
  sex,
  bmi
}) => {
  const getBmiCategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal weight";
    if (bmi < 30) return "Overweight";
    return "Obesity";
  };

  const getBmiCategoryColor = (bmi: number): string => {
    if (bmi < 18.5) return "text-yellow-400";
    if (bmi < 25) return "text-green-400";
    if (bmi < 30) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <h1 className="font-bold text-[32px] text-center text-[#A4B1B7]">
        Your Profile Summary
      </h1>

      <div className="mt-8 space-y-6">
        <div className="flex items-center">
          <User size={20} className="text-[#00C4B4] mr-3" />
          <span className="text-[#A4B1B7]">Name:</span>
            <span className="ml-2 text-[#A4B1B7]">{firstName}</span>
        </div>

        <div className="flex items-center">
          <Ruler size={20} className="text-[#00C4B4] mr-3" />
          <span className="text-[#A4B1B7]">Height:</span>
            <span className="ml-2 text-[#A4B1B7]">{height.feet}'{height.inches}"</span>
        </div>

        <div className="flex items-center">
          <Scale size={20} className="text-[#00C4B4] mr-3" />
          <span className="text-[#A4B1B7]">Weight:</span>
            <span className="ml-2 text-[#A4B1B7]">{weight} lbs</span>
        </div>

          <div className="flex items-center">
          <Calendar size={20} className="text-[#00C4B4] mr-3" />
          <span className="text-[#A4B1B7]">Age:</span>
              <span className="ml-2 text-[#A4B1B7]">{age} years</span>
        </div>

          <div className="flex items-center">
          <span className="text-[#A4B1B7] ml-8">Sex:</span>
              <span className="ml-2 text-[#A4B1B7] capitalize">{sex}</span>
        </div>

          <div className="mt-8 p-4 rounded-lg" style={{backgroundColor: "rgba(176, 232, 227, 0.12)"}}>
          <div className="flex items-center justify-between">
            <span className="text-[#A4B1B7]">Your BMI:</span>
            <span className="text-2xl font-bold text-[#00C4B4]">{bmi.toFixed(1)}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[#A4B1B7]">Status:</span>
            <span className={`font-semibold ${getBmiCategoryColor(bmi)}`}>
              {getBmiCategory(bmi)}
            </span>
          </div>
          <div className="flex items-center mt-4 text-xs text-[#A4B1B7] text-center">
            <Info size={14} className="mr-1 flex-shrink-0" />
            <span>
              BMI is a basic health indicator and may not be accurate for athletes or those with high muscle mass.
            </span>
          </div>
          <div className="mt-2 text-xs text-[#A4B1B7] text-center">
            AI-calculated based on your height and weight
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryStep;
