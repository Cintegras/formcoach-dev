
import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import {Input} from '@/components/ui/input';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import {Lock, Mail} from 'lucide-react';
import {useToast} from '@/components/ui/use-toast';
import {useAuth} from '@/features/auth/hooks/useAuth';
import { EmailVerification } from '@/features/auth/components/EmailVerification';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {signIn, loading: authLoading} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState<string | null>(null);
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

    try {
      const {error} = await signIn(values.email, values.password);

      if (error) {
        // Check if the error is related to email confirmation
        if (error.message.includes('Email not confirmed')) {
          setVerificationEmail(values.email);
          toast({
            title: "Email not verified",
            description: "Please verify your email before logging in",
          });
          return;
        }
        
        toast({
          title: "Authentication error",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // If successful, navigate to the redirect path
      navigate(from);
    } catch (error) {
      toast({
        title: "Authentication error",
        description: error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  // If we're in verification state, show the verification component
  if (verificationEmail) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[80vh] font-inter">
          <div className="mb-10">
            <h1 className="font-bold text-[32px] text-center text-[#A4B1B7]">
              Verify Your Email
            </h1>
            <p className="font-normal text-[16px] text-[#A4B1B7] text-center mt-2">
              You need to verify your email before logging in
            </p>
          </div>

          <EmailVerification email={verificationEmail} />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-inter">
        <div className="mb-10">
          <h1 className="font-bold text-[32px] text-center text-[#A4B1B7]">
            FormCoach
          </h1>
          <p className="text-[16px] text-[#A4B1B7] text-center mt-2">
            Sign in to continue your fitness journey
          </p>
        </div>

        <div className="w-full rounded-lg p-6" style={{ backgroundColor: "rgba(176, 232, 227, 0.12)" }}>
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
      </div>
    </PageContainer>
  );
};

export default Login;
