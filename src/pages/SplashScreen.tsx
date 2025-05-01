
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect after 2 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageContainer className="flex items-center justify-center" withPadding={false}>
      <div className="flex flex-col items-center justify-center h-screen w-full animate-fade-in">
        <div className="text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent mb-3">
            FormCoach
          </h1>
          <p className="text-gray-300 text-xl">Perfect your form, maximize results</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default SplashScreen;
