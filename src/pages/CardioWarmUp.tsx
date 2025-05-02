
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { toast } from "@/hooks/use-toast";
import { Play } from 'lucide-react';

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

const CardioWarmUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the exercises array and current index from location state
  const exercises: ExerciseItem[] = location.state?.exercises || [];
  const currentIndex: number = location.state?.currentIndex || 0;

  // Timer states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [timerCompleted, setTimerCompleted] = useState(false);

  // Warm-up intensity state
  const [intensity, setIntensity] = useState("Medium");

  useEffect(() => {
    let timer: number;
    if (isTimerRunning && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          if (prevTime <= 1) {
            setIsTimerRunning(false);
            setTimerCompleted(true);
            clearInterval(timer);
            // Alert user with sound or vibration
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeRemaining(300); // Reset to 5 minutes
    setTimerCompleted(false);
  };

  const nextExercise = () => {
    toast({
      title: "Cardio completed",
      description: "Cardio warm-up has been logged",
    });
    
    // If we have custom exercises and there's a next exercise in the array
    if (exercises.length > 0 && currentIndex < exercises.length - 1) {
      // Go to the next exercise in the custom order
      const nextIndex = currentIndex + 1;
      const nextExerciseData = exercises[nextIndex];
      
      navigate(`/workout-tracking/${nextExerciseData.id}`, { 
        state: { exercises, currentIndex: nextIndex } 
      });
    } else {
      // If this was the last exercise or we don't have custom order data, go to the review page
      navigate('/workout-review');
    }
  };

  const skipWarmUp = () => {
    // If we have custom exercises, find the first non-cardio exercise
    if (exercises.length > 0) {
      let nextIndex = currentIndex + 1;
      
      // If there's no next exercise, go to review
      if (nextIndex >= exercises.length) {
        navigate('/workout-review');
        return;
      }
      
      navigate(`/workout-tracking/${exercises[nextIndex].id}`, { 
        state: { exercises, currentIndex: nextIndex } 
      });
    } else {
      // If we don't have custom exercises, go to the default next exercise
      navigate('/workout-tracking/leg-press');
    }
  };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#A4B1B7]">
          Cardio Warm-Up
        </h1>
        <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
          5 minute warm-up to prepare your muscles
        </p>
        {exercises.length > 0 && (
          <p className="font-normal text-[12px] text-[#A4B1B7] text-center mt-1">
            Exercise {currentIndex + 1} of {exercises.length}
          </p>
        )}
      </div>

      <div 
        className="w-full rounded-lg p-6 flex flex-col items-center"
        style={{ backgroundColor: "rgba(176, 232, 227, 0.12)" }}
      >
        <div className="w-48 h-48 rounded-full flex items-center justify-center bg-[#1C1C1E] border-4 border-[#00C4B4] mb-6">
          <div className="text-center">
            <div className="text-[40px] font-bold text-[#A4B1B7]">
              {formatTime(timeRemaining)}
            </div>
            {!isTimerRunning && !timerCompleted && (
              <button 
                onClick={toggleTimer}
                className="flex items-center justify-center mt-2 text-[#00C4B4]"
              >
                <Play size={24} className="mr-1" />
                <span>Start</span>
              </button>
            )}
            {isTimerRunning && (
              <button 
                onClick={toggleTimer}
                className="mt-2 text-[#00C4B4]"
              >
                Pause
              </button>
            )}
            {timerCompleted && (
              <div className="text-[#00C4B4] mt-2">Complete!</div>
            )}
          </div>
        </div>
        
        <div className="w-full">
          <div className="mb-4">
            <p className="font-semibold text-[16px] text-[#A4B1B7] mb-2">
              Intensity
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={`p-2 rounded ${intensity === "Low" ? "bg-[#00C4B4] text-black" : "bg-[#1C1C1E] text-[#A4B1B7]"}`}
                onClick={() => setIntensity("Low")}
              >
                Low
              </button>
              <button 
                className={`p-2 rounded ${intensity === "Medium" ? "bg-[#00C4B4] text-black" : "bg-[#1C1C1E] text-[#A4B1B7]"}`}
                onClick={() => setIntensity("Medium")}
              >
                Medium
              </button>
              <button 
                className={`p-2 rounded ${intensity === "High" ? "bg-[#00C4B4] text-black" : "bg-[#1C1C1E] text-[#A4B1B7]"}`}
                onClick={() => setIntensity("High")}
              >
                High
              </button>
            </div>
          </div>
          
          <div>
            <p className="font-semibold text-[16px] text-[#A4B1B7] mb-2">
              Equipment
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                className="p-2 rounded bg-[#00C4B4] text-black"
              >
                Treadmill
              </button>
              <button 
                className="p-2 rounded bg-[#1C1C1E] text-[#A4B1B7]"
              >
                Elliptical
              </button>
              <button 
                className="p-2 rounded bg-[#1C1C1E] text-[#A4B1B7]"
              >
                Bike
              </button>
              <button 
                className="p-2 rounded bg-[#1C1C1E] text-[#A4B1B7]"
              >
                Rowing
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 space-y-2">
        <PrimaryButton 
          onClick={nextExercise}
          disabled={!timerCompleted && timeRemaining > 0}
        >
          Complete & Continue
        </PrimaryButton>
        
        <SecondaryButton onClick={skipWarmUp}>
          Skip Warm-Up
        </SecondaryButton>
        
        {(timerCompleted || timeRemaining === 0) && (
          <button 
            onClick={resetTimer}
            className="w-full text-[#A4B1B7] mt-2"
          >
            Reset Timer
          </button>
        )}
      </div>
    </PageContainer>
  );
};

export default CardioWarmUp;
