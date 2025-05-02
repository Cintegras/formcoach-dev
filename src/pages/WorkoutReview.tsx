
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { Edit } from 'lucide-react';

const WorkoutReview = () => {
  const navigate = useNavigate();
  
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
          <h2 className="font-semibold text-[20px] text-[#00C4B4]">
            Workout Summary
          </h2>
        </div>
        <div className="space-y-3">
          <p className="font-bold text-[16px] text-[#A4B1B7]">
            Duration: 45 minutes
          </p>
          <p className="font-bold text-[16px] text-[#A4B1B7]">
            Exercises Completed: 8
          </p>
          <p className="font-bold text-[16px] text-[#A4B1B7]">
            Calories Burned: 250 kcal
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#2D2D2F]">
          <h3 className="font-semibold text-[16px] text-[#00C4B4] mb-3">
            Exercise Log
          </h3>

          <div className="space-y-3">
            <div className="bg-[rgba(176,232,227,0.08)] p-3 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium text-[15px] text-[#A4B1B7]">
                  Cardio Warm-Up
                </p>
                <p className="font-normal text-[14px] text-[#A4B1B7]">
                  5 minutes
                </p>
              </div>
            </div>

            <div className="bg-[rgba(176,232,227,0.08)] p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium text-[15px] text-[#A4B1B7]">
                  Leg Press
                </p>
                <button
                  onClick={() => handleEditExercise('Leg Press')}
                  className="font-normal text-[12px] text-[#00C4B4]"
                >
                  <Edit size={12} className="inline mr-1" /> Edit
                </button>
              </div>
              <p className="font-normal text-[13px] text-[#A4B1B7] opacity-80">
                10 reps @ 20 lbs (warm-up), 3 sets × 10 reps @ 30 lbs
              </p>
            </div>

            <div className="bg-[rgba(176,232,227,0.08)] p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium text-[15px] text-[#A4B1B7]">
                  Seated Leg Curl
                </p>
                <button
                  onClick={() => handleEditExercise('Seated Leg Curl')}
                  className="font-normal text-[12px] text-[#00C4B4]"
                >
                  <Edit size={12} className="inline mr-1" /> Edit
                </button>
              </div>
              <p className="font-normal text-[13px] text-[#A4B1B7] opacity-80">
                10 reps @ 15 lbs (warm-up), 3 sets × 10 reps @ 25 lbs
              </p>
            </div>

            <div className="bg-[rgba(176,232,227,0.08)] p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium text-[15px] text-[#A4B1B7]">
                  Chest Press
                </p>
                <button
                  onClick={() => handleEditExercise('Chest Press')}
                  className="font-normal text-[12px] text-[#00C4B4]"
                >
                  <Edit size={12} className="inline mr-1" /> Edit
                </button>
              </div>
              <p className="font-normal text-[13px] text-[#A4B1B7] opacity-80">
                10 reps @ 20 lbs (warm-up), 2 sets × 10 reps @ 30 lbs, 1 set × 8 reps @ 35 lbs
              </p>
            </div>
          </div>
        </div>
      </div>

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
