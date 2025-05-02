
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordValues) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    
    // Show success toast
    toast({
      title: "Reset link sent",
      description: "Please check your email for the password reset link.",
      duration: 5000,
    });
    
    // Navigate back to login after showing the toast
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-inter">
        <div className="mb-10">
          <h1 className="font-bold text-[32px] text-center text-[#A4B1B7]">
            Reset Password
          </h1>
          <p className="text-[16px] text-[#A4B1B7] text-center mt-2">
            Enter your email to receive a reset link
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
                            backgroundColor: "rgba(176, 232, 227, 0.12)", // #B0E8E3 @ 12%
                            color: "rgba(209, 235, 233, 0.62)"           // #D1EBE9 @ 62%
                          }}
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A4B1B7]" size={20} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#FF4D4F]" />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3">
                <PrimaryButton type="submit" disabled={isLoading} className="hover:scale-[1.02] transition-transform duration-200">
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </PrimaryButton>
                
                <SecondaryButton 
                  type="button" 
                  onClick={() => navigate('/login')}
                  className="hover:scale-[1.02] transition-transform duration-200"
                >
                  Back to Login
                </SecondaryButton>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </PageContainer>
  );
};

export default ForgotPassword;
