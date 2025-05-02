
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { useToast } from "@/hooks/use-toast";
import { Play, Pause, Stop, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

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
  const { toast } = useToast();
  
  // Get the exercises array, current index, and cardio type from location state
  const exercises: ExerciseItem[] = location.state?.exercises || [];
  const currentIndex: number = location.state?.currentIndex || 0;
  const cardioType: string = location.state?.cardioType || "Treadmill";
  
  // Determine if this is a dedicated cardio workout or a warm-up
  const isDedicatedCardio = cardioType && currentIndex === 0 && exercises.length === 1;
  
  // Timer states
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(isDedicatedCardio ? 1800 : 300); // 30 mins for dedicated, 5 mins for warm-up
  const [timerCompleted, setTimerCompleted] = useState(false);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [customMinutes, setCustomMinutes] = useState("30");
  const [progress, setProgress] = useState(0);
  
  // Duration selection for dedicated cardio (only shown for dedicated cardio workouts)
  const [selectedDuration, setSelectedDuration] = useState(isDedicatedCardio ? 30 : 5);
  const [initialDuration, setInitialDuration] = useState(isDedicatedCardio ? 1800 : 300);

  useEffect(() => {
    // Update timer when duration changes
    setTimeRemaining(selectedDuration * 60);
    setInitialDuration(selectedDuration * 60);
  }, [selectedDuration]);

  useEffect(() => {
    // Calculate progress percentage
    if (initialDuration > 0) {
      const progressValue = ((initialDuration - timeRemaining) / initialDuration) * 100;
      setProgress(progressValue);
    }
  }, [timeRemaining, initialDuration]);

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

  const stopTimer = () => {
    setIsTimerRunning(false);
    setTimerCompleted(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeRemaining(selectedDuration * 60);
    setTimerCompleted(false);
    setProgress(0);
  };

  const handleCustomDuration = () => {
    const minutes = parseInt(customMinutes);
    if (!isNaN(minutes) && minutes > 0 && minutes <= 120) {
      setSelectedDuration(minutes);
      setTimeRemaining(minutes * 60);
      setInitialDuration(minutes * 60);
      setIsCustomDialogOpen(false);
    } else {
      toast({
        title: "Invalid duration",
        description: "Please enter a duration between 1 and 120 minutes",
        variant: "destructive"
      });
    }
  };

  const nextExercise = () => {
    toast({
      title: "Cardio completed",
      description: isDedicatedCardio ? `${cardioType} workout has been logged` : "Cardio warm-up has been logged",
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
          {isDedicatedCardio ? `${cardioType} Workout` : "Cardio Warm-Up"}
        </h1>
        <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
          {isDedicatedCardio 
            ? `Track your ${cardioType.toLowerCase()} workout` 
            : "5 minute warm-up to prepare your muscles"}
        </p>
        {exercises.length > 0 && (
          <div className="mt-4">
            <Progress value={((currentIndex + 1) / exercises.length) * 100} className="h-2 bg-[#1C1C1E]" />
            <p className="font-normal text-[12px] text-[#A4B1B7] text-center mt-1">
              Exercise {currentIndex + 1} of {exercises.length}
            </p>
          </div>
        )}
      </div>

      {isDedicatedCardio && (
        <div className="mb-6 w-full rounded-lg p-4" style={{ backgroundColor: "rgba(176, 232, 227, 0.12)" }}>
          <p className="font-semibold text-[16px] text-[#A4B1B7] mb-3">
            Select Duration
          </p>
          <div className="grid grid-cols-4 gap-2 mb-2">
            <button 
              className={`p-3 rounded ${selectedDuration === 15 ? "bg-[#00C4B4] text-black" : "bg-[#1C1C1E] text-[#A4B1B7]"}`}
              onClick={() => {
                setSelectedDuration(15);
                if (!isTimerRunning) {
                  setTimeRemaining(15 * 60);
                  setInitialDuration(15 * 60);
                }
              }}
            >
              15 min
            </button>
            <button 
              className={`p-3 rounded ${selectedDuration === 30 ? "bg-[#00C4B4] text-black" : "bg-[#1C1C1E] text-[#A4B1B7]"}`}
              onClick={() => {
                setSelectedDuration(30);
                if (!isTimerRunning) {
                  setTimeRemaining(30 * 60);
                  setInitialDuration(30 * 60);
                }
              }}
            >
              30 min
            </button>
            <button 
              className={`p-3 rounded ${selectedDuration === 45 ? "bg-[#00C4B4] text-black" : "bg-[#1C1C1E] text-[#A4B1B7]"}`}
              onClick={() => {
                setSelectedDuration(45);
                if (!isTimerRunning) {
                  setTimeRemaining(45 * 60);
                  setInitialDuration(45 * 60);
                }
              }}
            >
              45 min
            </button>
            <button 
              className={`p-3 rounded ${selectedDuration === 60 ? "bg-[#00C4B4] text-black" : "bg-[#1C1C1E] text-[#A4B1B7]"}`}
              onClick={() => {
                setSelectedDuration(60);
                if (!isTimerRunning) {
                  setTimeRemaining(60 * 60);
                  setInitialDuration(60 * 60);
                }
              }}
            >
              60 min
            </button>
          </div>
          <button 
            className="w-full p-3 rounded bg-[#1C1C1E] text-[#A4B1B7] flex items-center justify-center"
            onClick={() => setIsCustomDialogOpen(true)}
          >
            <Clock size={16} className="mr-2" /> Custom
          </button>
        </div>
      )}

      <div 
        className="w-full rounded-lg p-6 flex flex-col items-center"
        style={{ backgroundColor: "rgba(176, 232, 227, 0.12)" }}
      >
        {/* Progress circle */}
        <div className="w-64 h-64 rounded-full flex items-center justify-center bg-[#1C1C1E] border-4 border-[#00C4B4] mb-6 relative">
          {/* Progress overlay */}
          <div 
            className="absolute top-0 left-0 w-full h-full rounded-full"
            style={{
              background: `conic-gradient(#00C4B4 ${progress}%, transparent ${progress}%)`,
              opacity: 0.3
            }}
          />
          <div className="text-center z-10">
            <div className="text-[40px] font-bold text-[#A4B1B7]">
              {formatTime(timeRemaining)}
            </div>
            {!isTimerRunning && !timerCompleted && (
              <button 
                onClick={toggleTimer}
                className="flex items-center justify-center mt-4 text-[#00C4B4] text-lg py-2 px-4 bg-[#1C1C1E] rounded-full border border-[#00C4B4]"
              >
                <Play size={24} className="mr-2" />
                <span>Start</span>
              </button>
            )}
            {isTimerRunning && (
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={toggleTimer}
                  className="flex items-center justify-center text-[#00C4B4] text-lg py-2 px-4 bg-[#1C1C1E] rounded-full border border-[#00C4B4]"
                >
                  <Pause size={24} />
                </button>
                <button 
                  onClick={stopTimer}
                  className="flex items-center justify-center text-red-500 text-lg py-2 px-4 bg-[#1C1C1E] rounded-full border border-red-500"
                >
                  <Stop size={24} />
                </button>
              </div>
            )}
            {timerCompleted && (
              <div className="text-[#00C4B4] text-lg mt-4">Complete!</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 space-y-2">
        <PrimaryButton 
          onClick={nextExercise}
          disabled={!timerCompleted && timeRemaining > 0 && !isTimerRunning}
        >
          Complete & Continue
        </PrimaryButton>
        
        {!isDedicatedCardio && (
          <SecondaryButton onClick={skipWarmUp}>
            Skip Warm-Up
          </SecondaryButton>
        )}
        
        {(timerCompleted || timeRemaining === 0) && (
          <button 
            onClick={resetTimer}
            className="w-full text-[#A4B1B7] mt-2"
          >
            Reset Timer
          </button>
        )}
      </div>

      {/* Custom Duration Dialog */}
      <Dialog open={isCustomDialogOpen} onOpenChange={setIsCustomDialogOpen}>
        <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
          <DialogHeader>
            <DialogTitle className="text-[#B0E8E3]">Custom Duration</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm text-[#A4B1B7]">Enter minutes (1-120):</label>
              <Input 
                type="number" 
                min="1"
                max="120"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="bg-[rgba(176,232,227,0.12)] border-0 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsCustomDialogOpen(false)}
              className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCustomDuration}
              className="bg-[#00C4B4] text-black hover:bg-[#00C4B4]/80"
            >
              Set Duration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default CardioWarmUp;
