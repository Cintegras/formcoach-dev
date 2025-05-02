import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, UserCircle, Scale, Calendar, Ruler } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  heightFeet: z.number().min(4, { message: 'Height feet must be at least 4' }).max(7, { message: 'Height feet must be at most 7' }),
  heightInches: z.number().min(0, { message: 'Height inches must be at least 0' }).max(11, { message: 'Height inches must be at most 11' }),
  weight: z.string().min(1, { message: 'Weight is required' }),
  age: z.string().min(1, { message: 'Age is required' }).refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) < 120, 
    { message: 'Age must be a valid number between 1 and 120' }
  ),
  sex: z.enum(["male", "female", "other"], { message: 'Please select your sex' }),
});

type ProfileValues = z.infer<typeof profileSchema>;

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  
  // Keep track of form completion
  const [formCompletion, setFormCompletion] = useState({
    firstName: false,
    height: false,
    weight: false,
    age: false,
    sex: false
  });

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      heightFeet: 5,
      heightInches: 10,
      weight: '',
      age: '',
      sex: undefined,
    },
    mode: 'onChange'
  });

  // Watch form values to update progress
  const formValues = form.watch();
  
  useEffect(() => {
    const newFormCompletion = {
      firstName: !!formValues.firstName,
      height: true, // Height is pre-filled with defaults
      weight: !!formValues.weight,
      age: !!formValues.age,
      sex: !!formValues.sex
    };
    
    setFormCompletion(newFormCompletion);
    
    // Calculate progress percentage
    const completedFields = Object.values(newFormCompletion).filter(Boolean).length;
    const totalFields = Object.keys(newFormCompletion).length;
    setProgress((completedFields / totalFields) * 100);
  }, [formValues]);

  const onSubmit = async (values: ProfileValues) => {
    setIsLoading(true);

    // Simulate API call - would save to backend in a real app
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save user data to localStorage for now
    const userData = {
      firstName: values.firstName,
      email: localStorage.getItem('userEmail') || 'user@example.com',
      height: {
        feet: values.heightFeet,
        inches: values.heightInches
      },
      weight: values.weight,
      age: values.age,
      sex: values.sex,
      weightHistory: [{ date: new Date().toISOString(), weight: values.weight }]
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsLoading(false);
    
    // Animated welcome toast with user's name
    const profileImage = document.createElement('div');
    profileImage.className = "w-8 h-8 rounded-full bg-[#00C4B4] flex items-center justify-center text-black text-xl font-bold";
    profileImage.textContent = values.firstName.charAt(0);
    
    toast({
      title: (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#00C4B4] flex items-center justify-center text-black text-xl font-bold">
            {values.firstName.charAt(0)}
          </div>
          <span>Welcome, {values.firstName}!</span>
        </div>
      ),
      description: "Your profile has been set up successfully.",
      duration: 3000,
    });

    // Redirect to home after profile setup
    navigate('/');
  };

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-inter">
        <div className="mb-4">
          <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
            Complete Your Profile
          </h1>
          <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
            Help us personalize your fitness experience
          </p>
        </div>

        <div className="w-full mb-6">
          <Progress value={progress} className="h-2 bg-[#1C1C1E]" />
        </div>

        <div className="w-full rounded-lg p-6" style={{ backgroundColor: "rgba(176, 232, 227, 0.12)" }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              {/* Height Field with Feet and Inches */}
              <div className="space-y-2">
                <FormLabel className="text-[#A4B1B7] text-[17px] font-normal">Height</FormLabel>
                <div className="flex items-center justify-center mb-2">
                  <div className="text-2xl font-bold text-[#B0E8E3]">
                    {form.getValues("heightFeet")}' {form.getValues("heightInches")}"
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs text-[#A4B1B7]">Feet</label>
                      <span className="text-xs text-[#A4B1B7]">{form.getValues("heightFeet")}</span>
                    </div>
                    <FormField
                      control={form.control}
                      name="heightFeet"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormControl>
                            <Slider
                              min={4}
                              max={7} 
                              step={1}
                              defaultValue={[value]}
                              onValueChange={(vals) => onChange(vals[0])}
                              className="bg-[#1C1C1E]"
                              {...field}
                            />
                          </FormControl>
                          <div className="flex justify-between text-xs text-[#A4B1B7]">
                            <span>4'</span>
                            <span>7'</span>
                          </div>
                          <FormMessage className="text-[#FF4D4F]" />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs text-[#A4B1B7]">Inches</label>
                      <span className="text-xs text-[#A4B1B7]">{form.getValues("heightInches")}</span>
                    </div>
                    <FormField
                      control={form.control}
                      name="heightInches"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormControl>
                            <Slider
                              min={0} 
                              max={11}
                              step={1}
                              defaultValue={[value]}
                              onValueChange={(vals) => onChange(vals[0])}
                              className="bg-[#1C1C1E]"
                              {...field}
                            />
                          </FormControl>
                          <div className="flex justify-between text-xs text-[#A4B1B7]">
                            <span>0"</span>
                            <span>11"</span>
                          </div>
                          <FormMessage className="text-[#FF4D4F]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Weight with Slider */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#A4B1B7] text-[17px] font-normal">Weight (lbs)</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {field.value && (
                          <div className="text-center text-2xl font-bold text-[#B0E8E3]">
                            {field.value} lbs
                          </div>
                        )}
                        <Slider
                          min={80} 
                          max={300}
                          step={1}
                          defaultValue={[150]}
                          onValueChange={(vals) => field.onChange(String(vals[0]))}
                          className="bg-[#1C1C1E]"
                        />
                        <div className="flex justify-between text-xs text-[#A4B1B7]">
                          <span>80 lbs</span>
                          <span>300 lbs</span>
                        </div>
                        <Input
                          {...field}
                          placeholder="150"
                          type="number"
                          className="rounded-md w-full h-auto px-3 py-[13px] border-0 text-[17px] font-normal mt-2"
                          style={{
                            backgroundColor: "rgba(176, 232, 227, 0.12)",
                            color: "rgba(209, 235, 233, 0.62)"
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#FF4D4F]" />
                  </FormItem>
                )}
              />

              {/* Age with Slider */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#A4B1B7] text-[17px] font-normal">Age</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {field.value && (
                          <div className="text-center text-2xl font-bold text-[#B0E8E3]">
                            {field.value} years
                          </div>
                        )}
                        <Slider
                          min={18} 
                          max={90}
                          step={1}
                          defaultValue={[30]}
                          onValueChange={(vals) => field.onChange(String(vals[0]))}
                          className="bg-[#1C1C1E]"
                        />
                        <div className="flex justify-between text-xs text-[#A4B1B7]">
                          <span>18</span>
                          <span>90</span>
                        </div>
                        <Input
                          {...field}
                          placeholder="30"
                          type="number"
                          className="rounded-md w-full h-auto px-3 py-[13px] border-0 text-[17px] font-normal mt-2"
                          style={{
                            backgroundColor: "rgba(176, 232, 227, 0.12)",
                            color: "rgba(209, 235, 233, 0.62)"
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#FF4D4F]" />
                  </FormItem>
                )}
              />

              {/* Sex buttons instead of dropdown */}
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#A4B1B7] text-[17px] font-normal">Sex</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => field.onChange("male")}
                          className={`p-3 rounded ${field.value === "male" ? "bg-[#00C4B4] text-black" : "bg-[rgba(176,232,227,0.12)] text-[#A4B1B7]"}`}
                        >
                          Male
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange("female")}
                          className={`p-3 rounded ${field.value === "female" ? "bg-[#00C4B4] text-black" : "bg-[rgba(176,232,227,0.12)] text-[#A4B1B7]"}`}
                        >
                          Female
                        </button>
                        <button
                          type="button"
                          onClick={() => field.onChange("other")}
                          className={`p-3 rounded ${field.value === "other" ? "bg-[#00C4B4] text-black" : "bg-[rgba(176,232,227,0.12)] text-[#A4B1B7]"}`}
                        >
                          Other
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-[#FF4D4F]" />
                  </FormItem>
                )}
              />

              <PrimaryButton type="submit" disabled={isLoading} className="w-full mt-6 hover:scale-[1.02] transition-transform duration-200">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-t-transparent border-[#00C4B4] rounded-full mr-2"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Complete Profile'
                )}
              </PrimaryButton>
            </form>
          </Form>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProfileSetupPage;
