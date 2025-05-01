
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

interface SetData {
  label: string;
  reps: string;
  weight: string;
  isWarmup?: boolean;
}

const LogWorkout = () => {
  const navigate = useNavigate();
  const { exercise } = useParams<{ exercise: string }>();

  const exerciseName = exercise ? exercise.replace(/-/g, ' ') : '';

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
        return 'Cable Pulley';
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
    },
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

  return (
    <PageContainer>
      <div className="mt-12 mb-6">
        <h1 className="formcoach-heading">{`${formattedExerciseName} (${getMachineName()})`}</h1>
        <p className="formcoach-subheading">
          Log your sets below
        </p>
      </div>

      <div className="formcoach-card mb-6">
        {sets.map((set, index) => (
          <div key={index} className="mb-4 last:mb-0">
            <p className="text-formcoach-text text-[16px] mb-2">
              {set.label} – <span className="text-formcoach-subtext text-[14px]">(Recommended)</span>
            </p>

            <div className="flex space-x-3">
              <div className="flex-1">
                <label className="text-formcoach-subtext text-[12px] mb-1 block">Reps</label>
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => updateSet(index, 'reps', e.target.value)}
                  className="bg-formcoach-background border border-formcoach-subtext rounded-lg p-2 w-full text-formcoach-text"
                />
              </div>

              <div className="flex-1">
                <label className="text-formcoach-subtext text-[12px] mb-1 block">Weight (lbs)</label>
                <input
                  type="number"
                  value={set.weight}
                  onChange={(e) => updateSet(index, 'weight', e.target.value)}
                  className="bg-formcoach-background border border-formcoach-subtext rounded-lg p-2 w-full text-formcoach-text"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <PrimaryButton onClick={nextExercise} className="mb-3">
        Save and Continue
      </PrimaryButton>

      <SecondaryButton onClick={nextExercise}>
        Skip to Next Exercise
      </SecondaryButton>
    </PageContainer>
  );
};

export default LogWorkout;
