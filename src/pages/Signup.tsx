
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const signupSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: SignupValues) => {
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);

    // Redirect to welcome screen after signup
    navigate('/welcome');
  };

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-inter">
        <div className="mb-10">
          <h1 className="font-bold text-[32px] text-center text-[#A4B1B7]">
            Create Account
          </h1>
          <p className="font-normal text-[16px] text-[#A4B1B7] text-center mt-2">
            Join FormCoach to start your fitness journey
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
                    <FormLabel className="text-[#A4B1B7] text-[17px] font-normal font-inter">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="yourname@example.com"
                        type="email"
                        className="rounded-md w-full h-auto px-[13.5px] py-[13px] border-0 text-[17px] font-normal font-inter"
                        style={{
                          backgroundColor: "rgba(176, 232, 227, 0.12)",
                          color: "rgba(209, 235, 233, 0.62)"
                        }}
                      />
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
                    <FormLabel className="text-[#A4B1B7] text-[17px] font-normal font-inter">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        className="rounded-md w-full h-auto px-[13.5px] py-[13px] border-0 text-[17px] font-normal font-inter"
                        style={{
                          backgroundColor: "rgba(176, 232, 227, 0.12)",
                          color: "rgba(209, 235, 233, 0.62)"
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[#FF4D4F]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#A4B1B7] text-[17px] font-normal font-inter">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        className="rounded-md w-full h-auto px-[13.5px] py-[13px] border-0 text-[17px] font-normal font-inter"
                        style={{
                          backgroundColor: "rgba(176, 232, 227, 0.12)",
                          color: "rgba(209, 235, 233, 0.62)"
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[#FF4D4F]" />
                  </FormItem>
                )}
              />

              <PrimaryButton type="submit" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </PrimaryButton>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="font-normal text-[14px] text-[#A4B1B7]">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')}
                className="text-[#A4B1B7] hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Signup;
