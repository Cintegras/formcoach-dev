
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { Check, ArrowLeft } from 'lucide-react';

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

// Define exercise sets by category
const exerciseSets = {
  cardioWarmup: { 
    id: 'cardio-warmup',
    name: 'Cardio Warm-Up', 
    isCardio: true,
    duration: '5 minutes',
    completed: false,
    selected: true
  },
  upper: [
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
  ],
  lower: [
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
      id: 'calf-raises', 
      name: 'Calf Raises', 
      sets: 3, 
      reps: '15', 
      completed: false,
      selected: true
    }
  ]
};

const WorkoutPlan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category || 'full';
  
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);

  // Set up exercises based on selected category
  useEffect(() => {
    let selectedExercises: ExerciseItem[] = [];
    
    // Handle cardio category separately
    if (category === 'cardio') {
      navigate('/cardio-type-select');
      return;
    }
    
    // Add cardio warmup to all non-cardio workouts
    selectedExercises.push({...exerciseSets.cardioWarmup});
    
    // Add appropriate exercises based on category
    if (category === 'upper' || category === 'full') {
      selectedExercises = [...selectedExercises, ...exerciseSets.upper];
    }
    
    if (category === 'lower' || category === 'full') {
      selectedExercises = [...selectedExercises, ...exerciseSets.lower];
    }
    
    setExercises(selectedExercises);
  }, [category, navigate]);

  const toggleExerciseSelection = (id: string) => {
    setExercises(prevExercises => 
      prevExercises.map(exercise => 
        exercise.id === id 
          ? { ...exercise, selected: !exercise.selected } 
          : exercise
      )
    );
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

  const goBack = () => {
    navigate('/workout-category-select');
  };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
          {category === 'upper' ? "Upper Body Workout" : 
           category === 'lower' ? "Lower Body Workout" : 
           "Full Body Workout"}
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

      <div className="mt-8 space-y-3">
        <PrimaryButton 
          onClick={handleContinue}
          disabled={!exercises.some(exercise => exercise.selected)}
          className="bg-[#00C4B4] text-[#000000]"
        >
          Continue
        </PrimaryButton>

        <button 
          onClick={goBack}
          className="w-full flex items-center justify-center text-[#A4B1B7] mt-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Workout Types</span>
        </button>
      </div>
    </PageContainer>
  );
};

export default WorkoutPlan;
