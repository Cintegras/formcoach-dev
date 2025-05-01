
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically navigate to login after 3 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageContainer className="flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-bold text-[40px] text-[#FFFFFF] mb-4">
          FormCoach
        </h1>
        <div className="animate-pulse">
          <p className="font-normal text-[16px] text-[#00C4B4]">
            Your AI Fitness Partner
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default Splash;
