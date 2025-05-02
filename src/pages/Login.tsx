
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
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-sans">
        <div className="mb-10">
          <h1 className="font-bold text-[32px] text-center text-white">
            FormCoach
          </h1>
          <p className="text-[16px] text-[#8E8E93] text-center mt-2">
            Sign in to continue your fitness journey
          </p>
      </div>
        <div className="w-full space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-[15px] font-medium mb-1 block">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="yourname@example.com"
                        type="email"
                        className="rounded-xl w-full h-12"
                      />
                    </FormControl>
                    <FormMessage className="text-[#FF453A] mt-1 text-[13px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-[15px] font-medium mb-1 block">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          className="rounded-xl w-full h-12 pr-10"
                        />
                        <button 
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8E8E93]"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#FF453A] mt-1 text-[13px]" />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[#0A84FF] text-[14px] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <PrimaryButton type="submit" disabled={isLoading} className="mt-6">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </PrimaryButton>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-[15px] text-[#8E8E93]">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-[#0A84FF] hover:underline"
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
