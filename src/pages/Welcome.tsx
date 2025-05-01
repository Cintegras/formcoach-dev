
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="mb-10">
          <h1 className="font-bold text-[32px] text-center text-[#FFFFFF]">
            Welcome to FormCoach
          </h1>
          <p className="font-normal text-[16px] text-[#9CA3AF] text-center mt-4 mb-8">
            Your personalized AI fitness coach for better form, 
            safer workouts, and meaningful progress
          </p>
          
          <div className="bg-[#1C1C1E] rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-[20px] text-[#FFFFFF] mb-4">
              FormCoach helps you:
            </h2>
            
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-[#00C4B4] mr-2">•</span>
                <span className="font-normal text-[14px] text-[#FFFFFF]">
                  Perfect your exercise form to prevent injuries
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00C4B4] mr-2">•</span>
                <span className="font-normal text-[14px] text-[#FFFFFF]">
                  Track your progress with detailed workout logs
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00C4B4] mr-2">•</span>
                <span className="font-normal text-[14px] text-[#FFFFFF]">
                  Get customized workouts that adapt to your abilities
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#00C4B4] mr-2">•</span>
                <span className="font-normal text-[14px] text-[#FFFFFF]">
                  Receive guidance for chronic conditions & injuries
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-full">
          <PrimaryButton onClick={() => navigate('/medical-disclaimer')}>
            Let's Get Started
          </PrimaryButton>
        </div>
      </div>
    </PageContainer>
  );
};

export default Welcome;
