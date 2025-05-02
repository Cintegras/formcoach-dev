
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { ArrowLeft } from 'lucide-react';

const CardioTypeSelect = () => {
  const navigate = useNavigate();

  const handleCardioSelect = (type: string) => {
    navigate('/cardio-warmup', { 
      state: { 
        cardioType: type,
        exercises: [
          { 
            id: 'cardio-workout',
            name: `${type} Workout`, 
            isCardio: true,
            duration: '30 minutes',
            completed: false,
            selected: true
          }
        ],
        currentIndex: 0 
      } 
    });
  };

  const goBack = () => {
    navigate('/workout-category-select');
  };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
          Select Cardio Type
        </h1>
        <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
          Choose your preferred cardio activity
        </p>
      </div>
      
      <div className="space-y-3 mt-6">
        <button
          onClick={() => handleCardioSelect('Treadmill')}
          className="w-full bg-[rgba(176,232,227,0.12)] p-4 rounded-lg text-left"
        >
          <h3 className="font-semibold text-[18px] text-[#A4B1B7]">Treadmill</h3>
          <p className="text-[14px] text-[#A4B1B7]">Walking, jogging or running</p>
        </button>

        <button
          onClick={() => handleCardioSelect('Swimming')}
          className="w-full bg-[rgba(176,232,227,0.12)] p-4 rounded-lg text-left"
        >
          <h3 className="font-semibold text-[18px] text-[#A4B1B7]">Swimming</h3>
          <p className="text-[14px] text-[#A4B1B7]">Laps or water exercises</p>
        </button>

        <button
          onClick={() => handleCardioSelect('Cycling')}
          className="w-full bg-[rgba(176,232,227,0.12)] p-4 rounded-lg text-left"
        >
          <h3 className="font-semibold text-[18px] text-[#A4B1B7]">Cycling</h3>
          <p className="text-[14px] text-[#A4B1B7]">Stationary bike or outdoor</p>
        </button>
      </div>

      <div className="mt-8">
        <button 
          onClick={goBack}
          className="w-full flex items-center justify-center text-[#A4B1B7] mt-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Workout Types</span>
        </button>
      </div>
    </PageContainer>
  );
};

export default CardioTypeSelect;
