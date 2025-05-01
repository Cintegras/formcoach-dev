import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginValues) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    navigate('/workout-plan');
  };

  const handleForgotPassword = () => {
    alert("Forgot password functionality would be implemented here");
  };

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-poppins">
        <div className="mb-10">
          <h1 className="font-bold text-[32px] text-center text-[#D7E4E3]">
            FormCoach
          </h1>
          <p className="text-[16px] text-[#9CA3AF] text-center mt-2">
            Sign in to continue your fitness journey
          </p>
        </div>

        <div className="w-full max-w-md bg-[#1C1C1E] rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#D7E4E3] text-[14px] font-normal">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="yourname@example.com"
                        type="email"
                        className="rounded-md w-full h-auto px-[13.5px] py-[13px] border-0 font-semibold text-[18px]"
                        style={{
                          backgroundColor: "rgba(176, 232, 227, 0.12)", // #B0E8E3 @ 12%
                          color: "rgba(209, 235, 233, 0.62)"           // #D1EBE9 @ 62%
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
                    <FormLabel className="text-[#D7E4E3] text-[14px] font-normal">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        className="rounded-md w-full h-auto px-[13.5px] py-[13px] border-0 font-semibold text-[18px]"
                        style={{
                          backgroundColor: "rgba(176, 232, 227, 0.12)", // #B0E8E3 @ 12%
                          color: "rgba(209, 235, 233, 0.62)"           // #D1EBE9 @ 62%
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-[#FF4D4F]" />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[#D7E4E3] text-[14px] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <PrimaryButton type="submit" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </PrimaryButton>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-[14px] text-[#9CA3AF]">
              Don’t have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-[#D7E4E3] hover:underline"
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