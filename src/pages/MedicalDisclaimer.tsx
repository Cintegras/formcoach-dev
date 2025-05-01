
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { Check } from 'lucide-react';

const MedicalDisclaimer = () => {
  const navigate = useNavigate();
  const [isAgreed, setIsAgreed] = useState(false);

  const handleAgree = () => {
    navigate('/workout-frequency');
  };

  const handleBack = () => {
    navigate('/welcome');
  };

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="mb-6">
          <h1 className="font-bold text-[28px] text-center text-[#FFFFFF]">
            Medical Disclaimer
          </h1>
          <p className="font-normal text-[14px] text-[#9CA3AF] text-center mt-2">
            Please read before continuing
          </p>
        </div>
        
        <div className="bg-[#1C1C1E] rounded-lg p-6 mb-8">
          <p className="font-normal text-[14px] text-[#FFFFFF] mb-4">
            FormCoach is designed to assist with workout guidance but is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          
          <p className="font-normal text-[14px] text-[#FFFFFF] mb-4">
            Before beginning any exercise program:
          </p>
          
          <ul className="space-y-3 mb-6">
            <li className="flex items-start">
              <span className="text-[#00C4B4] mr-2">•</span>
              <span className="font-normal text-[14px] text-[#FFFFFF]">
                Consult with your healthcare provider, especially if you have chronic conditions, injuries, or health concerns
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00C4B4] mr-2">•</span>
              <span className="font-normal text-[14px] text-[#FFFFFF]">
                Stop exercising immediately if you experience pain, dizziness, or discomfort
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-[#00C4B4] mr-2">•</span>
              <span className="font-normal text-[14px] text-[#FFFFFF]">
                Always prioritize your safety during workouts
              </span>
            </li>
          </ul>
          
          <div 
            className="flex items-center mb-4 cursor-pointer"
            onClick={() => setIsAgreed(!isAgreed)}
          >
            <div className={`w-6 h-6 rounded border mr-3 flex items-center justify-center ${
              isAgreed ? 'bg-[#00C4B4] border-[#00C4B4]' : 'bg-transparent border-[#9CA3AF]'
            }`}>
              {isAgreed && <Check size={16} className="text-black" />}
            </div>
            <span className="font-normal text-[14px] text-[#FFFFFF]">
              I understand and agree to these terms
            </span>
          </div>
        </div>

        <div className="w-full space-y-2">
          <PrimaryButton onClick={handleAgree} disabled={!isAgreed}>
            Continue
          </PrimaryButton>
          
          <SecondaryButton onClick={handleBack}>
            Back
          </SecondaryButton>
        </div>
      </div>
    </PageContainer>
  );
};

export default MedicalDisclaimer;
