
import React, { useState } from 'react';
import PageContainer from '@/components/PageContainer';
import { EmailVerification } from '@/features/auth/components/EmailVerification';
import AuthHeader from '@/features/auth/components/AuthHeader';
import LoginForm from '@/features/auth/components/LoginForm';

const Login = () => {
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);

  // If we're in verification state, show the verification component
  if (verificationEmail) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[80vh] font-inter">
          <AuthHeader 
            title="Verify Your Email" 
            subtitle="You need to verify your email before logging in" 
          />
          <EmailVerification email={verificationEmail} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-inter">
        <AuthHeader 
          title="FormCoach" 
          subtitle="Sign in to continue your fitness journey" 
        />
        <LoginForm onVerification={setVerificationEmail} />
      </div>
    </PageContainer>
  );
};

export default Login;
