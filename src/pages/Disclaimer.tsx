
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { CardGradient, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card-gradient';
import PrimaryButton from '@/components/PrimaryButton';

const Disclaimer = () => {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  return (
    <PageContainer>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          Medical Disclaimer
        </h1>
      </div>
      
      <CardGradient>
        <CardHeader>
          <CardTitle>Before You Begin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4 text-gray-300">
            <p>
              FormCoach is designed to help with workout tracking and form guidance, but is not a replacement for professional medical advice.
            </p>
            <p>
              Before starting any exercise program, please consult with your healthcare provider, especially if you have any medical conditions or injuries.
            </p>
            <p>
              By proceeding, you acknowledge that you are using FormCoach at your own risk and that we are not liable for any injuries that may occur during your workouts.
            </p>
            
            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                id="disclaimer-accept"
                checked={accepted}
                onChange={() => setAccepted(!accepted)}
                className="mt-1 mr-3"
              />
              <label htmlFor="disclaimer-accept" className="text-sm text-gray-300">
                I understand and accept these terms
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <PrimaryButton 
            onClick={() => navigate('/profile-complete')} 
            disabled={!accepted}
          >
            Accept & Continue
          </PrimaryButton>
        </CardFooter>
      </CardGradient>
    </PageContainer>
  );
};

export default Disclaimer;
