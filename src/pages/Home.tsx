
import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import { Calendar } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d, yyyy');

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center mt-8">
        <div className="flex items-center mb-6">
          <Calendar size={24} className="text-[#00C4B4] mr-2" />
          <h2 className="text-lg font-medium text-[#A4B1B7]">{formattedDate}</h2>
        </div>

        <div className="w-full max-w-[300px] mx-auto mt-12 text-center">
          <h1 className="font-bold text-[32px] text-[#B0E8E3] mb-3">Welcome Back</h1>
          <p className="text-[#A4B1B7] mb-8">Ready for your workout today?</p>
          
          <PrimaryButton 
            onClick={() => navigate('/workout-category-select')}
            className="w-full py-4 text-lg"
          >
            Start Workout
          </PrimaryButton>
        </div>

        <div className="mt-16 bg-[rgba(176,232,227,0.12)] rounded-lg w-full max-w-[300px] p-4">
          <h3 className="text-[#B0E8E3] font-medium mb-2">Quick Tips</h3>
          <ul className="text-[#A4B1B7] text-sm">
            <li className="mb-2">• Drink plenty of water before and after your workout</li>
            <li className="mb-2">• Warm up properly to prevent injuries</li>
            <li>• Track your progress in the Trends section</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
};

export default Home;
