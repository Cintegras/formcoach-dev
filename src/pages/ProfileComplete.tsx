
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { CardGradient, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card-gradient';
import { Check } from 'lucide-react';

const ProfileComplete = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto navigate after showing completion screen
    const timer = setTimeout(() => {
      navigate('/machine-selection');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <PageContainer className="flex items-center justify-center" withPadding={false}>
      <div className="w-full px-4">
        <CardGradient className="text-center">
          <CardHeader>
            <div className="mx-auto bg-teal-500/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <Check className="w-12 h-12 text-teal-400" />
            </div>
            <CardTitle className="text-2xl">Profile Setup Complete!</CardTitle>
            <CardDescription className="text-gray-300">
              You're all set to start your fitness journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mt-2">
              Redirecting you to select your machines...
            </p>
          </CardContent>
        </CardGradient>
      </div>
    </PageContainer>
  );
};

export default ProfileComplete;
