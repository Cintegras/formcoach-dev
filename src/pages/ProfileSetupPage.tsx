
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, UserCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  height: z.string().min(1, { message: 'Height is required' }),
  weight: z.string().min(1, { message: 'Weight is required' }),
  age: z.string().min(1, { message: 'Age is required' }).refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) < 120, 
    { message: 'Age must be a valid number between 1 and 120' }
  ),
  sex: z.string().min(1, { message: 'Sex is required' }),
});

type ProfileValues = z.infer<typeof profileSchema>;

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      height: '',
      weight: '',
      age: '',
      sex: '',
    },
  });

  const onSubmit = async (values: ProfileValues) => {
    setIsLoading(true);

    // Simulate API call - would save to backend in a real app
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save user data to localStorage for now
    const userData = {
      ...values,
      email: localStorage.getItem('userEmail') || 'user@example.com',
      weightHistory: [{ date: new Date().toISOString(), weight: values.weight }]
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsLoading(false);
    
    toast({
      title: "Profile created",
      description: `Welcome, ${values.firstName}! Your profile has been set up.`,
    });

    // Redirect to home after profile setup
    navigate('/');
  };

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-inter">
        <div className="mb-6">
          <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
            Complete Your Profile
          </h1>
          <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
            Help us personalize your fitness experience
          </p>
        </div>

        <div className="w-full rounded-lg p-6" style={{ backgroundColor: "rgba(176, 232, 227, 0.12)" }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#A4B1B7] text-[17px] font-normal">First Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="John"
                          type="text"
                          className="rounded-md w-full h-auto pl-[42px] pr-[13.5px] py-[13px] border-0 text-[17px] font-normal"
                          style={{
                            backgroundColor: "rgba(176, 232, 227, 0.12)",
                            color: "rgba(209, 235, 233, 0.62)"
                          }}
                        />
                        <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A4B1B7]" size={20} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#FF4D4F]" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#A4B1B7] text-[17px] font-normal">Height (in)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="70"
                          type="number"
                          className="rounded-md w-full h-auto px-3 py-[13px] border-0 text-[17px] font-normal"
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
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#A4B1B7] text-[17px] font-normal">Weight (lbs)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="150"
                          type="number"
                          className="rounded-md w-full h-auto px-3 py-[13px] border-0 text-[17px] font-normal"
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#A4B1B7] text-[17px] font-normal">Age</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="25"
                          type="number"
                          className="rounded-md w-full h-auto px-3 py-[13px] border-0 text-[17px] font-normal"
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
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#A4B1B7] text-[17px] font-normal">Sex</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger
                            className="rounded-md w-full h-auto px-3 py-[13px] border-0 text-[17px] font-normal"
                            style={{
                              backgroundColor: "rgba(176, 232, 227, 0.12)",
                              color: field.value ? "rgba(209, 235, 233, 0.62)" : "rgba(209, 235, 233, 0.32)"
                            }}
                          >
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[#FF4D4F]" />
                    </FormItem>
                  )}
                />
              </div>

              <PrimaryButton type="submit" disabled={isLoading} className="w-full mt-6 hover:scale-[1.02] transition-transform duration-200">
                {isLoading ? 'Saving...' : 'Complete Profile'}
              </PrimaryButton>
            </form>
          </Form>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProfileSetupPage;
