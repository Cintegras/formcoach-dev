
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { CardGradient, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card-gradient';
import PrimaryButton from '@/components/PrimaryButton';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          Welcome to FormCoach
        </h1>
      </div>
      
      <CardGradient>
        <CardHeader>
          <CardTitle>Your Personal Fitness Guide</CardTitle>
          <CardDescription className="text-gray-300">
            We're excited to help you track and improve your workout form
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-teal-400">What FormCoach offers:</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-300">
              <li>Personalized workout tracking</li>
              <li>Form improvement suggestions</li>
              <li>Progress analytics</li>
              <li>Machine-specific guidance</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <PrimaryButton onClick={() => navigate('/disclaimer')}>
            Continue
          </PrimaryButton>
        </CardFooter>
      </CardGradient>
    </PageContainer>
  );
};

export default Welcome;
