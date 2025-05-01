
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
        <h1 className="font-bold text-[32px] text-center text-[#D7E4E3]">
          Great Job! 🎉
        </h1>
        <p className="font-normal text-[16px] text-[#9CA3AF] text-center mt-2">
          You've completed today's workout!
        </p>
      </div>

      {/* Confetti animation would go here */}
      <div className="relative">
        <div className="absolute top-0 left-0 w-full">
          <div className="flex justify-center">
            <div className="animate-confetti-slow bg-[#00C4B4] w-2 h-2 rounded-full"></div>
            <div className="animate-confetti-medium bg-white w-2 h-2 rounded-full ml-4"></div>
            <div className="animate-confetti-fast bg-[#00C4B4] w-2 h-2 rounded-full ml-4"></div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#1C1C1E] rounded-lg p-4 mb-6 border-2 border-[#00C4B4]">
        <div className="space-y-3">
          <p className="font-bold text-[16px] text-[#D7E4E3]">
            Duration: 45 minutes
          </p>
          <p className="font-bold text-[16px] text-[#D7E4E3]">
            Exercises Completed: 8
          </p>
          <p className="font-bold text-[16px] text-[#D7E4E3]">
            Calories Burned: 250 kcal
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-[#2D2D2F]">
          <h3 className="font-semibold text-[16px] text-[#D7E4E3] mb-2">
            Exercise Log
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="font-normal text-[14px] text-[#9CA3AF]">
                Cardio Warm-Up: 5 minutes
              </p>
              <button
                onClick={() => handleEditExercise('Cardio Warm-Up')}
                className="font-normal text-[12px] text-[#00C4B4]"
              >
                <Edit size={12} className="inline mr-1" /> Edit
              </button>
            </div>

            <div className="flex justify-between">
              <p className="font-normal text-[14px] text-[#9CA3AF]">
                Leg Press: Warm-up 10 reps @ 20 lbs, Set 1: 10 reps @ 30 lbs, Set 2: 10 reps @ 30 lbs, Set 3: 10 reps @ 30 lbs
              </p>
              <button
                onClick={() => handleEditExercise('Leg Press')}
                className="font-normal text-[12px] text-[#00C4B4] ml-2 shrink-0"
              >
                <Edit size={12} className="inline mr-1" /> Edit
              </button>
            </div>

            <div className="flex justify-between">
              <p className="font-normal text-[14px] text-[#9CA3AF]">
                Seated Leg Curl: Warm-up 10 reps @ 15 lbs, Set 1: 10 reps @ 25 lbs, Set 2: 10 reps @ 25 lbs, Set 3: 10 reps @ 25 lbs
              </p>
              <button
                onClick={() => handleEditExercise('Seated Leg Curl')}
                className="font-normal text-[12px] text-[#00C4B4] ml-2 shrink-0"
              >
                <Edit size={12} className="inline mr-1" /> Edit
              </button>
            </div>

            <div className="flex justify-between">
              <p className="font-normal text-[14px] text-[#9CA3AF]">
                Chest Press: Warm-up 10 reps @ 20 lbs, Set 1: 10 reps @ 30 lbs, Set 2: 10 reps @ 30 lbs, Set 3: 8 reps @ 35 lbs
              </p>
              <button
                onClick={() => handleEditExercise('Chest Press')}
                className="font-normal text-[12px] text-[#00C4B4] ml-2 shrink-0"
              >
                <Edit size={12} className="inline mr-1" /> Edit
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="font-normal text-[16px] text-[#9CA3AF] text-center my-6">
        You're making amazing progress—keep it up!
      </p>

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
