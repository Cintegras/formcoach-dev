import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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

interface ExerciseItem {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  isCardio?: boolean;
  duration?: string;
  completed: boolean;
  selected: boolean;
}

const LogWorkout = () => {
  const navigate = useNavigate();
  const { exercise } = useParams<{ exercise: string }>();
  const location = useLocation();
  
  // Get the exercises array and current index from location state
  const exercises: ExerciseItem[] = location.state?.exercises || [];
  const currentIndex: number = location.state?.currentIndex || 0;

  // Make sure we have a default exercise and properly format it
  const exerciseName = exercise ? decodeURIComponent(exercise).replace(/-/g, ' ') : 'Leg Press';

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
    // If we have custom exercises and there's a next exercise in the array
    if (exercises.length > 0 && currentIndex < exercises.length - 1) {
      // Go to the next exercise in the custom order
      const nextIndex = currentIndex + 1;
      const nextExerciseData = exercises[nextIndex];
      
      if (nextExerciseData.isCardio) {
        navigate('/cardio-warmup', { 
          state: { exercises, currentIndex: nextIndex } 
        });
      } else {
        navigate(`/workout-tracking/${nextExerciseData.id}`, { 
          state: { exercises, currentIndex: nextIndex } 
        });
      }
    } else {
      // If this was the last exercise or we don't have custom order data, go to the review page
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
          Log Workout
        </h1>
        <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
          {formattedExerciseName}
        </p>
        {exercises.length > 0 && (
          <p className="font-normal text-[12px] text-[#A4B1B7] text-center mt-1">
            Exercise {currentIndex + 1} of {exercises.length}
          </p>
        )}
      </div>
      
      <div className="w-full rounded-lg p-6" style={{ backgroundColor: "rgba(176, 232, 227, 0.12)" }}>
        {sets.map((set, index) => (
          <div key={index} className="mb-6 last:mb-0">
            <p className="font-normal text-[16px] text-[#A4B1B7] mb-2">
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
                  className="rounded-md w-full h-auto px-[13.5px] py-[13px] border-0 text-[17px] font-normal font-inter"
                  style={{
                    backgroundColor: "rgba(176, 232, 227, 0.12)", // #B0E8E3 @ 12%
                    color: "rgba(209, 235, 233, 0.62)"           // #D1EBE9 @ 62%
                  }}
                />
              </div>
              <div>
                <label className="block font-normal text-[14px] text-[#A4B1B7] mb-1">Reps</label>
                <Input
                  type="text"
                  value={set.reps}
                  onChange={(e) => updateSet(index, 'reps', e.target.value)}
                  placeholder="Reps"
                  className="rounded-md w-full h-auto px-[13.5px] py-[13px] border-0 text-[17px] font-normal font-inter"
                  style={{
                    backgroundColor: "rgba(176, 232, 227, 0.12)", // #B0E8E3 @ 12%
                    color: "rgba(209, 235, 233, 0.62)"           // #D1EBE9 @ 62%
                  }}
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
