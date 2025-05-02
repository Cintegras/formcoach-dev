
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import { Dumbbell, Run, Body } from 'lucide-react';

const WorkoutCategorySelect = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (category: 'cardio' | 'upper' | 'lower' | 'full') => {
    navigate('/workout-plan', { state: { category } });
  };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
          Select Workout Type
        </h1>
        <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
          Choose the type of workout you want to do today
        </p>
      </div>
      
      <div className="space-y-4 mt-6">
        <div 
          className="bg-[rgba(176,232,227,0.12)] p-6 rounded-lg flex flex-col items-center cursor-pointer"
          onClick={() => handleCategorySelect('cardio')}
        >
          <Run size={48} className="text-[#00C4B4] mb-3" />
          <h2 className="font-bold text-[20px] text-[#A4B1B7]">Cardio</h2>
          <p className="text-[14px] text-[#A4B1B7] text-center mt-2">
            Treadmill, swimming, or cycling
          </p>
        </div>

        <div 
          className="bg-[rgba(176,232,227,0.12)] p-6 rounded-lg flex flex-col items-center cursor-pointer"
          onClick={() => handleCategorySelect('upper')}
        >
          <Dumbbell size={48} className="text-[#00C4B4] mb-3" />
          <h2 className="font-bold text-[20px] text-[#A4B1B7]">Upper Body</h2>
          <p className="text-[14px] text-[#A4B1B7] text-center mt-2">
            Chest, back, arms and shoulders
          </p>
        </div>

        <div 
          className="bg-[rgba(176,232,227,0.12)] p-6 rounded-lg flex flex-col items-center cursor-pointer"
          onClick={() => handleCategorySelect('lower')}
        >
          <Body size={48} className="text-[#00C4B4] mb-3" />
          <h2 className="font-bold text-[20px] text-[#A4B1B7]">Lower Body</h2>
          <p className="text-[14px] text-[#A4B1B7] text-center mt-2">
            Legs and core focused workout
          </p>
        </div>

        <div 
          className="bg-[rgba(176,232,227,0.12)] p-6 rounded-lg flex flex-col items-center cursor-pointer"
          onClick={() => handleCategorySelect('full')}
        >
          <Body size={48} className="text-[#00C4B4] mb-3" />
          <h2 className="font-bold text-[20px] text-[#A4B1B7]">Full Body</h2>
          <p className="text-[14px] text-[#A4B1B7] text-center mt-2">
            Complete workout targeting all muscle groups
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default WorkoutCategorySelect;
