
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
      reps: '12-15',
      weight: '',
      isWarmup: true
    },
    {
      label: 'Set 1',
      reps: '10',
      weight: ''
    },
    {
      label: 'Set 2',
      reps: '10',
      weight: ''
    },
    {
      label: 'Set 3',
      reps: '8-10',
      weight: ''
    },
    {
      label: 'Cool-down Set',
      reps: '12',
      weight: '',
      isWarmup: true
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

  return (
    <PageContainer>
      <div className="mt-8 mb-4">
        <h1 className="text-xl font-normal mb-4 text-gray-400">
          Today's Workout
        </h1>
      </div>
      
      <div className="bg-[#1C1C1E] rounded-lg p-5 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/lovable-uploads/76e71100-67b3-4ed4-a2c1-931ef7648e6f.png')] bg-cover opacity-20 z-0"></div>
        
        <div className="relative z-10">
          <p className="text-gray-400 text-sm">
            {`{MachineType} (ex: ${getMachineName()} ${formattedExerciseName})`}
          </p>
          <h2 className="text-4xl font-bold my-2 text-white">
            {`{ExerciseName}`}
          </h2>
          
          <button className="bg-white text-black px-6 py-2 rounded-full mt-2">
            Start Exercise
          </button>
        </div>
      </div>

      <div className="bg-[#1C1C1E] rounded-lg p-5">
        <h3 className="text-xl font-semibold mb-4">Set Logging</h3>
        
        {sets.map((set, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <p className="text-white mb-2">
              {set.label} — {set.reps} reps
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="text"
                  value={set.weight}
                  onChange={(e) => updateSet(index, 'weight', e.target.value)}
                  placeholder="Weight"
                  className="bg-[#121212] border-0 rounded-md text-gray-300 p-3 w-full"
                />
              </div>
              <div>
                <Input
                  type="text"
                  value={set.reps}
                  onChange={(e) => updateSet(index, 'reps', e.target.value)}
                  placeholder="Reps"
                  className="bg-[#121212] border-0 rounded-md text-gray-300 p-3 w-full"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="mt-8 space-y-3">
          <PrimaryButton onClick={nextExercise}>
            Next Exercise
          </PrimaryButton>
          
          <SecondaryButton onClick={nextExercise}>
            Skip Exercise
          </SecondaryButton>
        </div>
      </div>
    </PageContainer>
  );
};

export default LogWorkout;
