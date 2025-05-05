import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import {Input} from '@/components/ui/input';
import {AlertCircle, Camera, Video} from 'lucide-react';
import {useExerciseLogs, useWorkoutSessions} from '@/hooks';

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
    const exerciseId = exercise || 'leg-press';

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

    // Use hooks for workout sessions and exercise logs
    const {activeSession} = useWorkoutSessions();
    const {
        logs,
        logCompletedExercise,
        loading: logsLoading
    } = useExerciseLogs(activeSession?.id || null, true);

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

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [formFeedback, setFormFeedback] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Check if this exercise has already been logged
    useEffect(() => {
        if (logs.length > 0) {
            const existingLog = logs.find(log => log.exercise_id === exerciseId);
            if (existingLog) {
              // If we have an existing log, populate the sets data
              try {
                  const repsCompleted = existingLog.reps_completed ? 
                      (typeof existingLog.reps_completed === 'string' ? 
                          JSON.parse(existingLog.reps_completed) as number[] : 
                          existingLog.reps_completed as number[]) : 
                      [];

                  const weightsUsed = existingLog.weights_used ? 
                      (typeof existingLog.weights_used === 'string' ? 
                          JSON.parse(existingLog.weights_used) as number[] : 
                          existingLog.weights_used as number[]) : 
                      [];

                  // Update sets with the logged data
                  const updatedSets = [...sets];
                  for (let i = 0; i < repsCompleted.length; i++) {
                      if (i === 0 && updatedSets[0].isWarmup) {
                          updatedSets[0].reps = repsCompleted[i].toString();
                          updatedSets[0].weight = weightsUsed[i].toString();
                      } else {
                          const setIndex = updatedSets[0].isWarmup ? i : i - 1;
                          if (updatedSets[setIndex + 1]) {
                              updatedSets[setIndex + 1].reps = repsCompleted[i].toString();
                              updatedSets[setIndex + 1].weight = weightsUsed[i].toString();
                          }
                      }
                  }

                  setSets(updatedSets);

                  // Set video URL if available
                  if (existingLog.video_url) {
                      setVideoUrl(existingLog.video_url);
                  }

                  // Set form feedback if available
                  if (existingLog.form_feedback) {
                      setFormFeedback(existingLog.form_feedback);
                  }
              } catch (error) {
                  console.error('Error parsing exercise log data:', error);
              }
          }
      }
  }, [logs, exerciseId]);

  const updateSet = (index: number, field: 'reps' | 'weight', value: string) => {
    setSets(prev => {
      const newSets = [...prev];
      newSets[index] = { ...newSets[index], [field]: value };
      return newSets;
    });
  };

    const startRecording = () => {
        // In a real app, this would access the camera and start recording
        setIsRecording(true);

        // Simulate recording for demo purposes
        setTimeout(() => {
            stopRecording();
        }, 3000);
    };

    const stopRecording = () => {
        setIsRecording(false);

        // In a real app, this would save the video and get the URL
        // For demo purposes, we'll use a placeholder URL
        setVideoUrl('https://example.com/exercise-video.mp4');

        // Simulate form feedback generation
        setTimeout(() => {
            generateFormFeedback();
        }, 1000);
    };

    const generateFormFeedback = () => {
        // In a real app, this would analyze the video and generate feedback
        // For demo purposes, we'll use placeholder feedback
        const feedbackOptions = [
            "Good form overall. Keep your back straight during the exercise.",
            "Try to maintain a steady pace throughout the movement.",
            "Watch your knee alignment - they should track over your toes.",
            "Great depth on the movement. Maintain this form for all sets."
        ];

        const randomFeedback = feedbackOptions[Math.floor(Math.random() * feedbackOptions.length)];
        setFormFeedback(randomFeedback);
    };

    const saveExercise = async () => {
        if (!activeSession) {
            alert('No active workout session found');
            return;
        }

        setIsSaving(true);

        try {
            // Prepare the data for logging
            const setsCompleted = sets.length;
            const repsCompleted = sets.map(set => parseInt(set.reps) || 0);
            const weightsUsed = sets.map(set => parseInt(set.weight) || 0);

            // Log the completed exercise - pass serialized arrays
            await logCompletedExercise(
                exerciseId,
                setsCompleted,
                JSON.stringify(repsCompleted),
                JSON.stringify(weightsUsed),
                videoUrl || undefined
            );

            // Mark the exercise as completed in the exercises array
            if (exercises.length > 0) {
                const updatedExercises = exercises.map((ex, idx) =>
                    idx === currentIndex ? {...ex, completed: true} : ex
                );

                // Store the updated exercises in localStorage
                localStorage.setItem('currentWorkoutExercises', JSON.stringify(updatedExercises));
            }

            // Navigate to the next exercise or review page
            nextExercise();
        } catch (error) {
            console.error('Error saving exercise:', error);
            alert('Failed to save exercise data');
        } finally {
            setIsSaving(false);
        }
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

        {/* Form Feedback Section */}
        {formFeedback && (
            <div className="mb-4 p-4 rounded-lg bg-[rgba(0,196,180,0.1)] border border-[#00C4B4]">
                <div className="flex items-start">
                    <AlertCircle size={18} className="text-[#00C4B4] mr-2 mt-0.5"/>
                    <div>
                        <h3 className="font-medium text-[16px] text-[#00C4B4] mb-1">Form Feedback</h3>
                        <p className="text-[14px] text-[#A4B1B7]">{formFeedback}</p>
                    </div>
                </div>
            </div>
        )}

        {/* Video Recording Section */}
        <div className="mb-4 p-4 rounded-lg" style={{backgroundColor: "rgba(176, 232, 227, 0.08)"}}>
            <h3 className="font-medium text-[16px] text-[#B0E8E3] mb-2 flex items-center">
                <Video size={18} className="mr-2"/>
                Record Your Form
            </h3>

            {videoUrl ? (
                <div className="bg-[rgba(0,0,0,0.2)] rounded-lg p-4 flex flex-col items-center justify-center">
                    <p className="text-[#A4B1B7] text-sm mb-2">Video recorded</p>
                    <button
                        onClick={() => setVideoUrl(null)}
                        className="text-[#00C4B4] text-sm font-medium"
                    >
                        Record Again
                    </button>
                </div>
            ) : (
                <button
                    onClick={startRecording}
                    disabled={isRecording}
                    className="w-full bg-[rgba(176,232,227,0.12)] rounded-lg p-4 flex flex-col items-center justify-center"
                >
                    <Camera size={24}
                            className={`${isRecording ? 'text-red-500 animate-pulse' : 'text-[#00C4B4]'} mb-2`}/>
                    <span className="text-[#A4B1B7] text-sm">
              {isRecording ? 'Recording...' : 'Tap to record your form'}
            </span>
                </button>
            )}
        </div>

        {/* Exercise Sets Section */}
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
          <PrimaryButton
              onClick={saveExercise}
              disabled={isSaving || logsLoading}
          >
              {isSaving ? 'Saving...' : 'Save and Continue'}
        </PrimaryButton>

          <SecondaryButton onClick={skipExercise}>
          Skip to Next Exercise
        </SecondaryButton>
      </div>
    </PageContainer>
  );
};

export default LogWorkout;
