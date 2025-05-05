
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface EmailVerificationProps {
  email: string;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ email }) => {
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [secondsLeft]);

  const handleResendEmail = async () => {
    if (isResending || secondsLeft > 0) return;
    
    setIsResending(true);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Verification email resent!",
        description: `We've sent another verification email to ${email}`,
      });
      
      setSecondsLeft(60); // Set cooldown for 60 seconds
    } catch (error: any) {
      toast({
        title: "Error resending verification email",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    navigate('/signup');
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg" 
         style={{ backgroundColor: "rgba(176, 232, 227, 0.12)" }}>
      <AlertCircle size={48} className="text-yellow-500 mb-4" />
      
      <h2 className="text-xl font-semibold text-[#A4B1B7] mb-2">
        Verify your email address
      </h2>
      
      <p className="text-center text-[#A4B1B7] mb-6">
        We've sent a verification email to <span className="font-bold">{email}</span>. 
        Click the link in the email to activate your account.
      </p>
      
      <div className="space-y-4 w-full">
        <button
          onClick={handleResendEmail}
          disabled={isResending || secondsLeft > 0}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
            isResending || secondsLeft > 0 
              ? 'bg-[#00C4B480] cursor-not-allowed' 
              : 'bg-[#00C4B4] hover:bg-[#00A396]'
          }`}
        >
          {isResending 
            ? 'Sending...' 
            : secondsLeft > 0 
              ? `Resend in ${secondsLeft}s` 
              : 'Resend verification email'
          }
        </button>
        
        <button
          onClick={handleChangeEmail}
          className="w-full py-3 px-4 bg-transparent border border-[#00C4B4] text-[#00C4B4] rounded-md font-medium hover:bg-[#00C4B410] transition-colors"
        >
          Use a different email
        </button>
      </div>
    </div>
  );
};
