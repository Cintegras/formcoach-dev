
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
  selected: boolean;
}

const WorkoutPlan = () => {
  const navigate = useNavigate();
  
  const [exercises, setExercises] = useState<ExerciseItem[]>([
    { 
      id: 'cardio-warmup',
      name: 'Cardio Warm-Up', 
      isCardio: true,
      duration: '5 minutes',
      completed: false,
      selected: true
    },
    { 
      id: 'leg-press', 
      name: 'Leg Press', 
      sets: 3, 
      reps: '10', 
      completed: false,
      selected: true
    },
    { 
      id: 'seated-leg-curl', 
      name: 'Seated Leg Curl', 
      sets: 3, 
      reps: '10', 
      completed: false,
      selected: true
    },
    { 
      id: 'leg-extension', 
      name: 'Leg Extension', 
      sets: 3, 
      reps: '10', 
      completed: false,
      selected: true
    },
    { 
      id: 'chest-press', 
      name: 'Chest Press', 
      sets: 3, 
      reps: '10', 
      completed: false,
      selected: true
    },
    { 
      id: 'lat-pulldown', 
      name: 'Lat Pulldown', 
      sets: 3, 
      reps: '10', 
      completed: false,
      selected: true
    },
    { 
      id: 'seated-row', 
      name: 'Seated Row', 
      sets: 3, 
      reps: '10', 
      completed: false,
      selected: true
    },
    { 
      id: 'triceps-pushdown', 
      name: 'Triceps Pushdown', 
      sets: 3, 
      reps: '10', 
      completed: false,
      selected: true
    },
    { 
      id: 'biceps-curl', 
      name: 'Biceps Curl', 
      sets: 3, 
      reps: '10', 
      completed: false,
      selected: true
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

  const toggleExerciseSelection = (id: string) => {
    setExercises(prevExercises => 
      prevExercises.map(exercise => 
        exercise.id === id 
          ? { ...exercise, selected: !exercise.selected } 
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

  const handleContinue = () => {
    const selectedExercises = exercises.filter(exercise => exercise.selected);
    
    if (selectedExercises.length > 0) {
      // Pass the selected exercises to the confirmation page
      navigate('/workout-confirmation', { 
        state: { selectedExercises } 
      });
    } else {
      // If no exercises are selected, show an error or feedback
      alert('Please select at least one exercise');
    }
  };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
          Today's Workout
        </h1>
        <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
          Select exercises for your workout
        </p>
      </div>
      
      <div className="space-y-4">
        {exercises.map((exercise) => (
          <div 
            key={exercise.id} 
            className="bg-[#1C1C1E] rounded-lg p-4 flex justify-between items-center"
            style={{
              backgroundColor: "rgba(176, 232, 227, 0.12)",
            }}
            onClick={() => toggleExerciseSelection(exercise.id)}
          >
            <div>
              <h3 className="font-semibold text-[16px] text-[#A4B1B7]">
                {exercise.name}
              </h3>
              <p className="font-normal text-[14px] text-[#A4B1B7]">
                {exercise.isCardio
                  ? exercise.duration
                  : `${exercise.sets} sets × ${exercise.reps} reps`
                }
              </p>
            </div>
            
            <button 
              className={`w-6 h-6 rounded border ${
                exercise.selected 
                  ? 'bg-[#00C4B4] border-[#00C4B4]' 
                  : 'bg-transparent border-[#9CA3AF]'
              } flex items-center justify-center`}
              onClick={(e) => {
                e.stopPropagation();
                toggleExerciseSelection(exercise.id);
              }}
            >
              {exercise.selected && <Check size={16} className="text-black" />}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <PrimaryButton 
          onClick={handleContinue}
          disabled={!exercises.some(exercise => exercise.selected)}
          className="bg-[#00C4B4] text-[#000000]"
        >
          Continue
        </PrimaryButton>
      </div>
    </PageContainer>
  );
};

export default WorkoutPlan;
