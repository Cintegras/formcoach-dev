
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Lock, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PrimaryButton from '@/components/PrimaryButton';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/features/auth/hooks/useAuth';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onVerification: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onVerification }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  // Get the redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { data, error } = await signIn(values.email, values.password);

      if (error) {
        // Check if the error is related to email confirmation
        if (error.message.includes('Email not confirmed')) {
          onVerification(values.email);
          toast({
            title: "Email not verified",
            description: "Please verify your email before logging in",
          });
          return;
        }

        // Show error in the UI
        setAuthError(error.message);
        return;
      }

      // If successful, navigate to the redirect path
      navigate(from);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in";
      setAuthError(errorMessage);
      toast({
        title: "Authentication error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="w-full max-w-md rounded-lg p-6" style={{ backgroundColor: "rgba(176, 232, 227, 0.12)" }}>
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Failed</AlertTitle>
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#A4B1B7] text-[17px] font-normal font-inter">
                  Email
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="yourname@example.com"
                      type="email"
                      autoComplete="username"
                      className="rounded-md w-full h-auto pl-[42px] pr-[13.5px] py-[13px] border-0 text-[17px] font-normal font-inter"
                      style={{
                        backgroundColor: "rgba(176, 232, 227, 0.12)", 
                        color: "rgba(209, 235, 233, 0.62)"
                      }}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A4B1B7]" size={20} />
                  </div>
                </FormControl>
                <FormMessage className="text-[#FF4D4F]" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#A4B1B7] text-[17px] font-normal font-inter">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      autoComplete="current-password"
                      className="rounded-md w-full h-auto pl-[42px] pr-[13.5px] py-[13px] border-0 text-[17px] font-normal font-inter"
                      style={{
                        backgroundColor: "rgba(176, 232, 227, 0.12)",
                        color: "rgba(209, 235, 233, 0.62)"
                      }}
                    />
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A4B1B7]" size={20} />
                  </div>
                </FormControl>
                <FormMessage className="text-[#FF4D4F]" />
              </FormItem>
            )}
          />

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#A4B1B7] text-[14px] hover:underline transition-all duration-200"
            >
              Forgot Password?
            </button>
          </div>

          <PrimaryButton type="submit" disabled={isLoading} className="hover:scale-[1.02] transition-transform duration-200">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </PrimaryButton>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <p className="text-[14px] text-[#A4B1B7]">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-[#A4B1B7] hover:underline transition-all duration-200"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
