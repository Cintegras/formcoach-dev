import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {AlertCircle, Clock, Dumbbell, Edit, Flame, ThumbsUp, Video} from 'lucide-react';
import {useExerciseLogs} from '@/hooks/useExerciseLogs';
import {useWorkoutSessions} from '@/hooks/useWorkoutSessions';
import {differenceInMinutes} from 'date-fns';
import {safeParseDate} from '@/utils/dateUtils';

interface ExerciseDisplay {
    id: string;
    name: string;
    sets: number;
    reps: number[];
    weights: number[];
    isCardio?: boolean;
    duration?: string;
    feedback?: string | null; // Update to allow null
    videoUrl?: string | null; // Update to allow null
}

const WorkoutReview = () => {
  const navigate = useNavigate();
    const [exercises, setExercises] = useState<ExerciseDisplay[]>([]);
    const [workoutDuration, setWorkoutDuration] = useState<number>(0);
    const [caloriesBurned, setCaloriesBurned] = useState<number>(0);
    const [selectedExercise, setSelectedExercise] = useState<ExerciseDisplay | null>(null);
    const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);

    // Use hooks for workout sessions and exercise logs
    const {activeSession, sessions} = useWorkoutSessions(1);
    const {logs} = useExerciseLogs(activeSession?.id || sessions[0]?.id || null, true);

    // Load exercise data from logs
    useEffect(() => {
        if (logs.length > 0) {
            const exerciseData: ExerciseDisplay[] = logs
                .filter(log => log.exercise_id !== null) // Filter out logs with null exercise_id
                .map(log => {
                    // Parse JSON data safely
                    const repsCompleted = log.reps_completed ? 
                        (typeof log.reps_completed === 'string' ? 
                            JSON.parse(log.reps_completed) as number[] : 
                            log.reps_completed as number[]) : 
                        [];

                    const weightsUsed = log.weights_used ? 
                        (typeof log.weights_used === 'string' ? 
                            JSON.parse(log.weights_used) as number[] : 
                            log.weights_used as number[]) : 
                        [];

                    // Get exercise name from ID
                    const exerciseId = log.exercise_id || '';
                    const exerciseName = exerciseId
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                    return {
                        id: exerciseId,
                        name: exerciseName,
                        sets: repsCompleted.length,
                        reps: repsCompleted,
                        weights: weightsUsed,
                        feedback: log.form_feedback,
                        videoUrl: log.video_url
                    };
                });

            setExercises(exerciseData);

            // Add cardio warmup if not in logs
            if (!exerciseData.some(ex => ex.id === 'cardio-warmup')) {
                setExercises(prev => [
                    {
                        id: 'cardio-warmup',
                        name: 'Cardio Warm-Up',
                        sets: 1,
                        reps: [],
                        weights: [],
                        isCardio: true,
                        duration: '5 minutes'
                    },
                    ...prev
                ]);
            }
        }
    }, [logs]);

    // Calculate workout stats
    useEffect(() => {
        if (sessions.length > 0) {
            const session = sessions[0];

            // Calculate duration
            if (session.end_time) {
                const startTime = safeParseDate(session.created_at);
                const endTime = safeParseDate(session.end_time);
                const duration = differenceInMinutes(endTime, startTime);
                setWorkoutDuration(duration);

                // Estimate calories burned (very rough estimate)
                // Assuming moderate intensity: ~5-7 calories per minute
                const calories = Math.round(duration * 6);
                setCaloriesBurned(calories);
            }
        }
    }, [sessions]);

  useEffect(() => {
    // This would be where you'd trigger a real confetti animation
    console.log('Celebration animation triggered!');
  }, []);

  const handleSaveWorkout = () => {
    // This would save the workout to a database
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleEditExercise = (exercise: string) => {
    navigate(`/workout-tracking/${exercise.toLowerCase().replace(/ /g, '-')}`);
  };

    const showFeedback = (exercise: ExerciseDisplay) => {
        setSelectedExercise(exercise);
        setShowFeedbackModal(true);
    };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[32px] text-center text-[#00C4B4]">
          Great Job! 🎉
        </h1>
        <p className="font-normal text-[16px] text-[#A4B1B7] text-center mt-2">
          You've completed today's workout!
        </p>
      </div>

      {/* Simple confetti animation */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full">
          <div className="flex justify-center">
            <div className="animate-confetti-slow bg-[#00C4B4] w-2 h-2 rounded-full"></div>
            <div className="animate-confetti-medium bg-white w-2 h-2 rounded-full ml-4"></div>
            <div className="animate-confetti-fast bg-[#00C4B4] w-2 h-2 rounded-full ml-4"></div>
          </div>
        </div>
      </div>

      <div
        className="w-full rounded-lg p-6 border-2 border-[#00C4B4]"
        style={{ backgroundColor: "rgba(176, 232, 227, 0.12)" }}
      >
        <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[20px] text-[#00C4B4] flex items-center">
                <Dumbbell size={18} className="mr-2"/>
            Workout Summary
          </h2>
        </div>
        <div className="space-y-3">
            <p className="font-bold text-[16px] text-[#A4B1B7] flex items-center">
                <Clock size={16} className="mr-2 text-[#00C4B4]"/>
                Duration: {workoutDuration > 0 ? `${workoutDuration} minutes` : 'In progress'}
          </p>
            <p className="font-bold text-[16px] text-[#A4B1B7] flex items-center">
                <Dumbbell size={16} className="mr-2 text-[#00C4B4]"/>
                Exercises Completed: {exercises.length}
          </p>
            <p className="font-bold text-[16px] text-[#A4B1B7] flex items-center">
                <Flame size={16} className="mr-2 text-[#00C4B4]"/>
                Calories Burned: {caloriesBurned > 0 ? `${caloriesBurned} kcal` : 'Calculating...'}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#2D2D2F]">
          <h3 className="font-semibold text-[16px] text-[#00C4B4] mb-3">
              Exercise Log & Form Analysis
          </h3>

          <div className="space-y-3">
              {exercises.map((exercise) => (
                  <div key={exercise.id} className="bg-[rgba(176,232,227,0.08)] p-3 rounded-lg">
                      {exercise.isCardio ? (
                          <div className="flex justify-between items-center">
                              <p className="font-medium text-[15px] text-[#A4B1B7]">
                                  {exercise.name}
                              </p>
                              <p className="font-normal text-[14px] text-[#A4B1B7]">
                                  {exercise.duration}
                              </p>
                          </div>
                      ) : (
                          <>
                              <div className="flex justify-between items-center mb-1">
                                  <p className="font-medium text-[15px] text-[#A4B1B7]">
                                      {exercise.name}
                                  </p>
                                  <div className="flex items-center">
                                      {exercise.feedback && (
                                          <button
                                              onClick={() => showFeedback(exercise)}
                                              className="font-normal text-[12px] text-[#00C4B4] mr-3"
                                          >
                                              <AlertCircle size={12} className="inline mr-1"/> Form
                                          </button>
                                      )}
                                      {exercise.videoUrl && (
                                          <button
                                              onClick={() => showFeedback(exercise)}
                                              className="font-normal text-[12px] text-[#00C4B4] mr-3"
                                          >
                                              <Video size={12} className="inline mr-1"/> Video
                                          </button>
                                      )}
                                      <button
                                          onClick={() => handleEditExercise(exercise.name)}
                                          className="font-normal text-[12px] text-[#00C4B4]"
                                      >
                                          <Edit size={12} className="inline mr-1"/> Edit
                                      </button>
                                  </div>
                              </div>
                              <p className="font-normal text-[13px] text-[#A4B1B7] opacity-80">
                                  {exercise.sets > 0 && exercise.reps.length > 0 ? (
                                      <>
                                          {exercise.reps.map((rep, idx) => (
                                              <span key={idx}>
                              {idx === 0 && exercise.sets > 1 ?
                                  `${rep} reps @ ${exercise.weights[idx]} lbs (warm-up)` :
                                  `${rep} reps @ ${exercise.weights[idx]} lbs`}
                                                  {idx < exercise.reps.length - 1 ? ', ' : ''}
                            </span>
                                          ))}
                                      </>
                                  ) : (
                                      'No data recorded'
                                  )}
                              </p>
                          </>
                      )}
                  </div>
              ))}
          </div>
        </div>
      </div>

        {/* Form Feedback Modal */}
        {showFeedbackModal && selectedExercise && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-[#1C1C1E] rounded-lg p-6 max-w-md w-full">
                    <h3 className="font-bold text-[18px] text-[#00C4B4] mb-4">
                        {selectedExercise.name} - Form Analysis
                    </h3>

                    {selectedExercise.feedback && (
                        <div className="mb-4 p-3 rounded-lg bg-[rgba(0,196,180,0.1)]">
                            <div className="flex items-start">
                                <ThumbsUp size={16} className="text-[#00C4B4] mr-2 mt-0.5"/>
                                <p className="text-[14px] text-[#A4B1B7]">{selectedExercise.feedback}</p>
                            </div>
                        </div>
                    )}

                    {selectedExercise.videoUrl && (
                        <div className="mb-4">
                            <p className="text-[14px] text-[#A4B1B7] mb-2">Exercise Video:</p>
                            <div className="bg-[rgba(0,0,0,0.2)] rounded-lg p-4 flex items-center justify-center h-40">
                                <Video size={32} className="text-[#00C4B4]"/>
                            </div>
                            <p className="text-[12px] text-[#A4B1B7] mt-2 italic">
                                Video playback would be available in the actual app
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => setShowFeedbackModal(false)}
                        className="w-full bg-[#00C4B4] text-black font-medium py-2 rounded-md mt-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        )}

      <div className="mt-8 space-y-2">
        <PrimaryButton onClick={handleSaveWorkout}>
          Save Workout
        </PrimaryButton>

          <SecondaryButton onClick={handleBackToHome}>
          Back to Home
        </SecondaryButton>
      </div>
    </PageContainer>
  );
};

export default WorkoutReview;
