
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';

interface SetData {
  label: string;
  reps: string;
  weight: string;
  isWarmup?: boolean;
}

const LogWorkout = () => {
  const navigate = useNavigate();
  const { exercise } = useParams<{ exercise: string }>();

  const exerciseName = exercise ? exercise.replace(/-/g, ' ') : 'Leg Press';

  // Format the exercise name to look nicer
  const formattedExerciseName = exerciseName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Get the machine name based on the exercise
  const getMachineName = () => {
    switch (exerciseName.toLowerCase()) {
      case 'leg press':
        return 'Matrix';
      case 'seated leg curl':
        return 'Matrix';
      case 'leg extension':
        return 'Matrix';
      case 'chest press':
        return 'Matrix';
      case 'lat pulldown':
        return 'Cybex'; 
      case 'seated row':
        return 'Cable';
      case 'triceps pushdown':
        return 'Matrix';
      case 'biceps curl':
        return 'Matrix';
      default:
        return 'Matrix';
    }
  };

  const [sets, setSets] = useState<SetData[]>([
    {
      label: 'Warm-up Set',
      reps: '10',
      weight: '20',
      isWarmup: true
    },
    {
      label: 'Set 1',
      reps: '10',
      weight: '30'
    },
    {
      label: 'Set 2',
      reps: '10',
      weight: '30'
    },
    {
      label: 'Set 3',
      reps: '10',
      weight: '30'
    }
  ]);

  const updateSet = (index: number, field: 'reps' | 'weight', value: string) => {
    setSets(prev => {
      const newSets = [...prev];
      newSets[index] = { ...newSets[index], [field]: value };
      return newSets;
    });
  };

  const nextExercise = () => {
    // Logic to determine next exercise based on current one
    switch (exerciseName.toLowerCase()) {
      case 'leg press':
        navigate('/workout-tracking/seated-leg-curl');
        break;
      case 'seated leg curl':
        navigate('/workout-tracking/chest-press');
        break;
      case 'chest press':
        navigate('/workout-tracking/lat-pulldown');
        break;
      case 'lat pulldown':
        navigate('/workout-review');
        break;
      default:
        navigate('/workout-review');
    }
  };

  const skipExercise = () => {
    nextExercise();
  };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#A4B1B7]">
          {`${formattedExerciseName} (${getMachineName()})`}
        </h1>
        <p className="font-normal text-[14px] text-[#9CA3AF] text-center mt-2">
          Log your sets below
        </p>
      </div>
      
      <div className="bg-[#1C1C1E] rounded-lg p-4 mb-6">
        {sets.map((set, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <p className="font-normal text-[16px] text-[#A4B1B7 mb-2">
              {set.label} – {set.reps} reps @ {set.weight} lbs (Recommended)
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-normal text-[14px] text-[#A4B1B7] mb-1">Weight</label>
                <Input
                  type="text"
                  value={set.weight}
                  onChange={(e) => updateSet(index, 'weight', e.target.value)}
                  placeholder="Weight"
                  className="bg-[#000F0E] border-0 rounded-md text-[#B0BEE3] py-[13px] px-[13.5px] w-full h-auto font-semibold text-[18px]"
                />
              </div>
              <div>
                <label className="block font-normal text-[14px] text-[#A4B1B7] mb-1">Reps</label>
                <Input
                  type="text"
                  value={set.reps}
                  onChange={(e) => updateSet(index, 'reps', e.target.value)}
                  placeholder="Reps"
                  className="bg-[#000F0E] border-0 rounded-md text-[#B0BEE3] py-[13px] px-[13.5px] w-full h-auto font-semibold text-[18px]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-2">
        <PrimaryButton onClick={nextExercise}>
          Save and Continue
        </PrimaryButton>
        
        <SecondaryButton onClick={skipExercise}>
          Skip to Next Exercise
        </SecondaryButton>
      </div>
    </PageContainer>
  );
};

export default LogWorkout;
