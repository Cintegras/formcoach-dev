
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { Input } from '@/components/ui/input';

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
        return 'Cybex'; // Changed to match the image
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
      <div className="mt-12 mb-6 text-center">
        <h1 className="text-2xl font-semibold mb-1">
          {`${formattedExerciseName} (${getMachineName()})`}
        </h1>
        <p className="text-formcoach-subtext text-base">
          Log your sets below
        </p>
      </div>

      <div className="bg-formcoach-card rounded-xl p-4 mb-6">
        {sets.map((set, index) => (
          <div key={index} className="mb-5 last:mb-0">
            <div className="flex justify-between items-center mb-2">
              <p className="text-white text-base">
                {set.label}
              </p>
              <span className="text-formcoach-subtext text-sm">(Recommended)</span>
            </div>

            <div className="flex space-x-3">
              <div className="flex-1">
                <label className="text-formcoach-subtext text-xs mb-1 block">Reps</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSet(index, 'reps', e.target.value)}
                    className="bg-black/40 border border-white/20 rounded-lg p-3 w-full text-white"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="flex flex-col">
                      <button className="text-white text-xs opacity-50 pointer-events-auto" onClick={() => updateSet(index, 'reps', String(Number(set.reps) + 1))}>▲</button>
                      <button className="text-white text-xs opacity-50 pointer-events-auto" onClick={() => updateSet(index, 'reps', String(Math.max(1, Number(set.reps) - 1)))}>▼</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <label className="text-formcoach-subtext text-xs mb-1 block">Weight (lbs)</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={set.weight}
                    onChange={(e) => updateSet(index, 'weight', e.target.value)}
                    className="bg-black/40 border border-white/20 rounded-lg p-3 w-full text-white"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <div className="flex flex-col">
                      <button className="text-white text-xs opacity-50 pointer-events-auto" onClick={() => updateSet(index, 'weight', String(Number(set.weight) + 5))}>▲</button>
                      <button className="text-white text-xs opacity-50 pointer-events-auto" onClick={() => updateSet(index, 'weight', String(Math.max(5, Number(set.weight) - 5)))}>▼</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PrimaryButton onClick={nextExercise} className="mb-3">
        Save and Continue
      </PrimaryButton>

      <SecondaryButton onClick={nextExercise} className="bg-gray-500/30 text-white border-0">
        Skip to Next Exercise
      </SecondaryButton>
    </PageContainer>
  );
};

export default LogWorkout;
