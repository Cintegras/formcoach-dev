
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import { Check } from 'lucide-react';

interface ExerciseItem {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  isCardio?: boolean;
  duration?: string;
  completed: boolean;
}

const WorkoutPlan = () => {
  const navigate = useNavigate();
  
  const [exercises, setExercises] = useState<ExerciseItem[]>([
    { 
      id: 'cardio-warmup',
      name: 'Cardio Warm-Up', 
      isCardio: true,
      duration: '5 minutes',
      completed: false 
    },
    { 
      id: 'leg-press', 
      name: 'Leg Press', 
      sets: 3, 
      reps: '10', 
      completed: false 
    },
    { 
      id: 'seated-leg-curl', 
      name: 'Seated Leg Curl', 
      sets: 3, 
      reps: '10', 
      completed: false 
    },
    { 
      id: 'leg-extension', 
      name: 'Leg Extension', 
      sets: 3, 
      reps: '10', 
      completed: false 
    },
    { 
      id: 'chest-press', 
      name: 'Chest Press', 
      sets: 3, 
      reps: '10', 
      completed: false 
    },
    { 
      id: 'lat-pulldown', 
      name: 'Lat Pulldown', 
      sets: 3, 
      reps: '10', 
      completed: false 
    },
    { 
      id: 'seated-row', 
      name: 'Seated Row', 
      sets: 3, 
      reps: '10', 
      completed: false 
    },
    { 
      id: 'triceps-pushdown', 
      name: 'Triceps Pushdown', 
      sets: 3, 
      reps: '10', 
      completed: false 
    },
    { 
      id: 'biceps-curl', 
      name: 'Biceps Curl', 
      sets: 3, 
      reps: '10', 
      completed: false 
    }
  ]);

  const toggleExercise = (id: string) => {
    setExercises(prevExercises => 
      prevExercises.map(exercise => 
        exercise.id === id 
          ? { ...exercise, completed: !exercise.completed } 
          : exercise
      )
    );
  };

  const startExercise = (id: string) => {
    if (id === 'cardio-warmup') {
      navigate('/cardio-warmup');
    } else {
      navigate(`/workout-tracking/${id}`);
    }
  };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#FFFFFF]">
          Today's Workout Plan
        </h1>
        <p className="font-normal text-[14px] text-[#9CA3AF] text-center mt-2">
          Start with a warm-up, then complete each exercise
        </p>
      </div>
      
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <div 
            key={exercise.id} 
            className="bg-[#1C1C1E] rounded-lg p-4 flex justify-between items-center"
            onClick={() => startExercise(exercise.id)}
          >
            <div>
              <h3 className="font-semibold text-[16px] text-[#FFFFFF]">
                {exercise.name}
              </h3>
              <p className="font-normal text-[14px] text-[#9CA3AF]">
                {exercise.isCardio
                  ? exercise.duration
                  : `${exercise.sets} sets × ${exercise.reps} reps`
                }
              </p>
            </div>
            
            <button 
              className={`w-6 h-6 rounded border ${
                exercise.completed 
                  ? 'bg-[#00C4B4] border-[#00C4B4]' 
                  : 'bg-transparent border-[#9CA3AF]'
              } flex items-center justify-center`}
              onClick={(e) => {
                e.stopPropagation();
                toggleExercise(exercise.id);
              }}
            >
              {exercise.completed && <Check size={16} className="text-black" />}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <PrimaryButton 
          onClick={() => navigate('/workout-review')}
          disabled={exercises.some(exercise => !exercise.completed)}
        >
          Complete Workout
        </PrimaryButton>
      </div>
    </PageContainer>
  );
};

export default WorkoutPlan;
