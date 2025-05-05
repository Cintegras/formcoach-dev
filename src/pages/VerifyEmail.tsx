
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import PrimaryButton from '@/components/PrimaryButton';

const VerifyEmail = () => {
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        setVerifying(true);
        
        // The auth state change listener in AuthProvider will handle the session update
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Verification error:', error);
          toast({
            title: "Verification failed",
            description: error.message,
            variant: "destructive",
          });
          setSuccess(false);
        } else {
          setSuccess(true);
          toast({
            title: "Email verified",
            description: "Your email has been successfully verified!",
          });
          
          // After successful verification, redirect after a short delay
          setTimeout(() => {
            navigate('/');
          }, 3000);
        }
      } catch (error) {
        console.error('Error during verification:', error);
        setSuccess(false);
      } finally {
        setVerifying(false);
      }
    };

    handleEmailConfirmation();
  }, [navigate, toast]);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-inter">
        <div className="max-w-md w-full p-6 rounded-lg" style={{ backgroundColor: "rgba(176, 232, 227, 0.12)" }}>
          <h1 className="text-2xl font-bold text-center text-[#B0E8E3] mb-6">
            Email Verification
          </h1>
          
          {verifying ? (
            <div className="text-center">
              <p className="text-[#A4B1B7] mb-4">Verifying your email...</p>
              <div className="w-8 h-8 border-4 border-t-[#00C4B4] border-r-[#00C4B4] border-b-[#00C4B4] border-l-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : success ? (
            <div className="text-center">
              <p className="text-[#A4B1B7] mb-4">Email verified successfully!</p>
              <p className="text-[#A4B1B7] mb-6">You will be redirected to the home page shortly.</p>
              <PrimaryButton onClick={() => navigate('/')}>
                Go to Home Page
              </PrimaryButton>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-[#A4B1B7] mb-4">We couldn't verify your email. The link might have expired.</p>
              <p className="text-[#A4B1B7] mb-6">Please try again or contact support if the problem persists.</p>
              <PrimaryButton onClick={() => navigate('/login')}>
                Back to Login
              </PrimaryButton>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default VerifyEmail;
