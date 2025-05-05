import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import {ArrowLeft, Check, Clock, Pause, Play, RotateCcw} from 'lucide-react';
import {useWorkoutSessions} from '@/hooks/useWorkoutSessions';

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
    const [sessionStarted, setSessionStarted] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    // Use the workout sessions hook
    const {
        activeSession,
        startSession,
        endSession,
        loading
    } = useWorkoutSessions();

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

      // Check if there's an active session
      if (activeSession) {
          setSessionStarted(true);

          // Calculate elapsed time
          const startTime = new Date(activeSession.created_at).getTime();
          const currentTime = new Date().getTime();
          const elapsed = Math.floor((currentTime - startTime) / 1000);
          setElapsedTime(elapsed);

          // Start the timer
          startTimer();
      }
  }, [category, navigate, activeSession]);

    // Timer functions
    const startTimer = () => {
        if (timerInterval) clearInterval(timerInterval);

        const interval = setInterval(() => {
            setElapsedTime(prev => prev + 1);
        }, 1000);

        setTimerInterval(interval);
        setIsPaused(false);
    };

    const pauseTimer = () => {
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
        setIsPaused(true);
    };

    const resetTimer = () => {
        setElapsedTime(0);
        if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
        setIsPaused(false);
    };

    // Format elapsed time
    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hours > 0 ? `${hours}:` : ''}${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (timerInterval) clearInterval(timerInterval);
        };
    }, [timerInterval]);

  const toggleExerciseSelection = (id: string) => {
    setExercises(prevExercises => 
      prevExercises.map(exercise => 
        exercise.id === id 
          ? { ...exercise, selected: !exercise.selected } 
          : exercise
      )
    );
  };

    const handleStartSession = async () => {
        const selectedExercises = exercises.filter(exercise => exercise.selected);

        if (selectedExercises.length > 0) {
            // Create a workout plan ID (in a real app, this would be a proper ID)
            const workoutPlanId = `${category}-${Date.now()}`;

            // Start the workout session
            const session = await startSession(workoutPlanId);

            if (session) {
                setSessionStarted(true);
                startTimer();

                // Store selected exercises in localStorage for use in other screens
                localStorage.setItem('currentWorkoutExercises', JSON.stringify(selectedExercises));
            }
        } else {
            // If no exercises are selected, show an error or feedback
            alert('Please select at least one exercise');
        }
    };

    const handlePauseResumeSession = () => {
        if (isPaused) {
            startTimer();
        } else {
            pauseTimer();
        }
    };

    const handleEndSession = async () => {
        if (window.confirm('Are you sure you want to end this workout session?')) {
            await endSession('Workout completed', 'Good');
            resetTimer();
            setSessionStarted(false);
            navigate('/workout-review');
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
            {sessionStarted ? "Workout in progress" : "Select exercises for your workout"}
        </p>
      </div>

        {/* Session Timer */}
        {sessionStarted && (
            <div className="mb-6 bg-[rgba(176,232,227,0.12)] rounded-lg p-4 flex flex-col items-center">
                <div className="flex items-center mb-2">
                    <Clock size={18} className="text-[#00C4B4] mr-2"/>
                    <h3 className="text-[#B0E8E3] font-medium">Session Time</h3>
                </div>
                <p className="text-[32px] font-bold text-[#00C4B4] mb-3">
                    {formatTime(elapsedTime)}
                </p>
                <div className="flex space-x-3">
                    <button
                        onClick={handlePauseResumeSession}
                        className="bg-[rgba(176,232,227,0.2)] text-[#B0E8E3] p-2 rounded-full"
                    >
                        {isPaused ? <Play size={20}/> : <Pause size={20}/>}
                    </button>
                    <button
                        onClick={handleEndSession}
                        className="bg-[rgba(255,100,100,0.2)] text-[#FF6464] p-2 rounded-full"
                    >
                        <RotateCcw size={20}/>
                    </button>
                </div>
            </div>
        )}

      <div className="space-y-4">
        {exercises.map((exercise) => (
          <div 
            key={exercise.id} 
            className="bg-[#1C1C1E] rounded-lg p-4 flex justify-between items-center"
            style={{
              backgroundColor: "rgba(176, 232, 227, 0.12)",
            }}
            onClick={() => !sessionStarted && toggleExerciseSelection(exercise.id)}
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

              {!sessionStarted && (
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
                      {exercise.selected && <Check size={16} className="text-black"/>}
                  </button>
              )}

              {sessionStarted && (
                  <button
                      className="text-[#00C4B4] text-sm font-medium"
                      onClick={() => navigate(`/workout-tracking/${exercise.id}`)}
                  >
                      {exercise.completed ? 'Edit' : 'Start'}
                  </button>
              )}
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-3">
          {!sessionStarted ? (
              <>
                  <PrimaryButton
                      onClick={handleStartSession}
                      disabled={!exercises.some(exercise => exercise.selected) || loading}
                      className="bg-[#00C4B4] text-[#000000]"
                  >
                      {loading ? 'Starting...' : 'Start Workout'}
                  </PrimaryButton>

                  <button
                      onClick={goBack}
                      className="w-full flex items-center justify-center text-[#A4B1B7] mt-4"
                  >
                      <ArrowLeft size={16} className="mr-1"/>
                      <span>Back to Workout Types</span>
                  </button>
              </>
          ) : (
              <PrimaryButton
                  onClick={handleEndSession}
                  className="bg-[#00C4B4] text-[#000000]"
              >
                  Complete Workout
              </PrimaryButton>
          )}
      </div>
    </PageContainer>
  );
};

export default WorkoutPlan;
