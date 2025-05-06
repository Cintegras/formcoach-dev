import React, {useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {useToast} from '@/hooks/use-toast';
import {z} from 'zod';
import StepIndicator from '@/components/StepIndicator';
import NameStep from '@/components/profile-setup/NameStep';
import HeightStep from '@/components/profile-setup/HeightStep';
import WeightStep from '@/components/profile-setup/WeightStep';
import BirthdateStep from '@/components/profile-setup/BirthdateStep';
import SexStep from '@/components/profile-setup/SexStep';
import SummaryStep from '@/components/profile-setup/SummaryStep';
import {ArrowLeft} from 'lucide-react';
import {useProfile} from '@/hooks/useProfile';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {createProgressMetric} from '@/services/supabase/progress-metrics';
import {calculateAge} from '@/utils/date-utils';

const profileSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  heightFeet: z.number().min(4, { message: 'Height feet must be at least 4' }).max(7, { message: 'Height feet must be at most 7' }),
  heightInches: z.number().min(0, { message: 'Height inches must be at least 0' }).max(11, { message: 'Height inches must be at most 11' }),
  weight: z.number().min(80, { message: 'Weight must be at least 80 lbs' }).max(300, { message: 'Weight must be at most 300 lbs' }),
  birthdate: z.date({
    required_error: "Birthdate is required",
    invalid_type_error: "Birthdate must be a valid date",
  }),
  sex: z.enum(["male", "female", "other"], {message: 'Please select your sex'}).optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

const ProfileSetupPage = () => {
  const navigate = useNavigate();
  const {user} = useAuth();
  const {create, loading: profileLoading} = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6; // 5 input steps + 1 summary step

  const [formValues, setFormValues] = useState<ProfileValues>({
    firstName: '',
    heightFeet: 5,
    heightInches: 10,
    weight: 150,
    birthdate: new Date(new Date().setFullYear(new Date().getFullYear() - 30)), // Default to 30 years ago
    sex: undefined,
  });

  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});

  const updateFormValue = <K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }));

    // Clear error when field is updated
    if (errors[key]) {
      setErrors(prev => {
        const {[key]: _, ...rest} = prev;
        return rest;
      });
    }
  };

  // Calculate BMI
  const bmi = useMemo(() => {
    const heightInches = (formValues.heightFeet * 12) + formValues.heightInches;
    const heightMeters = heightInches * 0.0254;
    return formValues.weight * 0.453592 / (heightMeters * heightMeters);
  }, [formValues.heightFeet, formValues.heightInches, formValues.weight]);

  const validateCurrentStep = (): boolean => {
    try {
      switch (currentStep) {
        case 1:
          z.string().min(1, { message: 'First name is required' }).parse(formValues.firstName);
          break;
        case 2:
          // Height is pre-filled with valid values
          break;
        case 3:
          z.number().min(80, { message: 'Weight must be at least 80 lbs' }).max(300, { message: 'Weight must be at most 300 lbs' }).parse(formValues.weight);
          break;
        case 4:
          // Validate birthdate - ensure it's a valid date and user is between 18-90 years old
          const birthdate = formValues.birthdate;
          if (!birthdate) {
            throw new z.ZodError([{
              code: 'custom',
              path: ['birthdate'],
              message: 'Birthdate is required'
            }]);
          }

          const age = calculateAge(birthdate);
          if (age < 18) {
            throw new z.ZodError([{
              code: 'custom',
              path: ['birthdate'],
              message: 'You must be at least 18 years old'
            }]);
          }

          if (age > 90) {
            throw new z.ZodError([{
              code: 'custom',
              path: ['birthdate'],
              message: 'You must be at most 90 years old'
            }]);
          }
          break;
        case 5:
          z.enum(["male", "female", "other"], {message: 'Please select your sex'}).optional().parse(formValues.sex);
          break;
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach(err => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Final validation of the whole form
      // Create a submission schema that requires sex to be selected
      const submissionSchema = profileSchema.extend({
        sex: z.enum(["male", "female", "other"], {message: 'Please select your sex'})
      });
      submissionSchema.parse(formValues);

      setIsLoading(true);

      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to create a profile",
          variant: "destructive",
        });
        setIsLoading(false);
        navigate('/login');
        return;
      }

      // Create profile using the useProfile hook
      const profileData = {
        full_name: formValues.firstName, // Map firstName to full_name
        height: (formValues.heightFeet * 12) + formValues.heightInches, // Convert to total inches
        birthdate: formValues.birthdate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        // Note: weight is now stored in progress_metrics, not in profiles
      };

      const result = await create(profileData);

      // If profile creation was successful, add weight to progress_metrics
      if (result && user) {
        try {
          await createProgressMetric({
            user_id: user.id,
            metric_type: 'weight',
            metric_value: formValues.weight,
            notes: 'Initial weight in lbs',
            recorded_date: new Date().toISOString().split('T')[0]
          });
        } catch (err) {
          console.error('Error creating weight metric:', err);
          // Continue with profile setup even if weight metric creation fails
        }
      }

      setIsLoading(false);

      if (!result) {
        toast({
          title: "Error",
          description: "Failed to create profile. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Save profile data to localStorage to prevent redirect back to profile setup
      const userData = {
        firstName: formValues.firstName,
        email: user.email,
        weight: formValues.weight.toString(),
        height: {
          feet: formValues.heightFeet,
          inches: formValues.heightInches
        },
        age: formValues.age.toString(),
        sex: formValues.sex || ''
      };
      localStorage.setItem('userData', JSON.stringify(userData));

      toast({
        title: `Welcome, ${formValues.firstName}!`,
        description: "Your profile has been set up successfully.",
        duration: 3000,
      });

      // Redirect to home after profile setup
      navigate('/');

    } catch (error) {
      setIsLoading(false);
      if (error instanceof z.ZodError) {
        const newErrors = {};
        error.errors.forEach(err => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);

        // Navigate to the step with the first error
        if (error.errors[0]?.path[0] === 'firstName') setCurrentStep(1);
        else if (error.errors[0]?.path[0] === 'heightFeet' || error.errors[0]?.path[0] === 'heightInches') setCurrentStep(2);
        else if (error.errors[0]?.path[0] === 'weight') setCurrentStep(3);
        else if (error.errors[0]?.path[0] === 'age') setCurrentStep(4);
        else if (error.errors[0]?.path[0] === 'sex') setCurrentStep(5);
      }
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <NameStep 
            value={formValues.firstName}
            onChange={(value) => updateFormValue('firstName', value)}
            error={errors.firstName}
          />
        );
      case 2:
        return (
          <HeightStep 
            feet={formValues.heightFeet}
            inches={formValues.heightInches}
            onChangeFeet={(value) => updateFormValue('heightFeet', value)}
            onChangeInches={(value) => updateFormValue('heightInches', value)}
          />
        );
      case 3:
        return (
          <WeightStep 
            weight={formValues.weight}
            onChange={(value) => updateFormValue('weight', value)}
          />
        );
      case 4:
        return (
            <BirthdateStep
                birthdate={formValues.birthdate}
                onChange={(value) => updateFormValue('birthdate', value)}
                error={errors.birthdate}
          />
        );
      case 5:
        return (
          <SexStep 
            value={formValues.sex}
            onChange={(value) => updateFormValue('sex', value)}
          />
        );
      case 6:
        return (
          <SummaryStep 
            firstName={formValues.firstName}
            height={{ feet: formValues.heightFeet, inches: formValues.heightInches }}
            weight={formValues.weight}
            age={calculateAge(formValues.birthdate)}
            sex={formValues.sex}
            bmi={bmi}
          />
        );
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[80vh] font-inter">
        {/* Back button only appears after first step */}
        {currentStep > 1 && (
          <button 
            onClick={handlePreviousStep}
            className="absolute top-8 left-8 text-[#A4B1B7] flex items-center"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back
          </button>
        )}

        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="w-full px-4 py-8 rounded-lg" style={{ backgroundColor: "rgba(176, 232, 227, 0.08)" }}>
          {renderStep()}

          <div className="mt-12 space-y-4">
            {currentStep < totalSteps ? (
              <PrimaryButton onClick={handleNextStep} className="hover:scale-[1.02] transition-transform duration-200">
                Continue
              </PrimaryButton>
            ) : (
              <PrimaryButton 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="hover:scale-[1.02] transition-transform duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-t-transparent border-[#00C4B4] rounded-full mr-2"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  'Complete Profile'
                )}
              </PrimaryButton>
            )}

            {currentStep > 1 && currentStep < totalSteps && (
              <SecondaryButton onClick={handlePreviousStep}>
                Back
              </SecondaryButton>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProfileSetupPage;
