
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

type TimerOption = '3' | '5' | '7' | 'custom';

const CardioWarmUp = () => {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<TimerOption>('5');
  const [customMinutes, setCustomMinutes] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [circumference] = useState(2 * Math.PI * 98); // Circle circumference (2πr)
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Set initial time based on selected option
    let initialTime = 300; // Default 5 minutes

    if (selectedOption === '3') initialTime = 180;
    else if (selectedOption === '7') initialTime = 420;
    else if (selectedOption === 'custom') initialTime = customMinutes * 60;

    setTimeLeft(initialTime);

    // Stop any running timer when component unmounts
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [selectedOption, customMinutes]);

  useEffect(() => {
    // Timer logic
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateStrokeDashoffset = () => {
    // Calculate the total duration in seconds
    let totalDuration = 300; // Default 5 minutes

    if (selectedOption === '3') totalDuration = 180;
    else if (selectedOption === '7') totalDuration = 420;
    else if (selectedOption === 'custom') totalDuration = customMinutes * 60;

    // Calculate the progress and offset
    const progress = timeLeft / totalDuration;
    return circumference - progress * circumference;
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const selectOption = (option: TimerOption) => {
    setSelectedOption(option);
    setIsRunning(false);

    // Reset timer based on selected option
    if (option === '3') setTimeLeft(180);
    else if (option === '5') setTimeLeft(300);
    else if (option === '7') setTimeLeft(420);
  };

  const skipToWorkout = () => {
    navigate('/workout-tracking/leg-press');
  };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#A4B1B7]">
          Cardio Warm-Up
        </h1>
        <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
          Complete a light cardio warm-up to prepare your body
        </p>
      </div>

      <div className="flex justify-center my-8">
        <div className="relative w-[200px] h-[200px] flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle 
              cx="100" 
              cy="100" 
              r="98" 
              fill="transparent" 
              stroke="#1C1C1E" 
              strokeWidth="4"
            />
            <circle 
              cx="100" 
              cy="100" 
              r="98" 
              fill="transparent" 
              stroke="#00C4B4" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeDasharray={circumference} 
              strokeDashoffset={calculateStrokeDashoffset()} 
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-bold text-[48px] text-[#A4B1B7]">
              {formatTime(timeLeft)}
            </span>
            <span className="font-normal text-[14px] text-[#A4B1B7]">
              Minutes Remaining
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <button 
          className={`py-2 rounded-lg ${selectedOption === '3' ? 'bg-[#00C4B4] text-[#000000]' : 'text-[#A4B1B7]'}`}
          onClick={() => selectOption('3')}
          style={{
            backgroundColor: selectedOption === '3' ? '#00C4B4' : "rgba(176, 232, 227, 0.12)"
          }}
        >
          3 min
        </button>
        <button 
          className={`py-2 rounded-lg ${selectedOption === '5' ? 'bg-[#00C4B4] text-[#000000]' : 'text-[#A4B1B7]'}`}
          onClick={() => selectOption('5')}
          style={{
            backgroundColor: selectedOption === '5' ? '#00C4B4' : "rgba(176, 232, 227, 0.12)"
          }}
        >
          5 min
        </button>
        <button 
          className={`py-2 rounded-lg ${selectedOption === '7' ? 'bg-[#00C4B4] text-[#000000]' : 'text-[#A4B1B7]'}`}
          onClick={() => selectOption('7')}
          style={{
            backgroundColor: selectedOption === '7' ? '#00C4B4' : "rgba(176, 232, 227, 0.12)"
          }}
        >
          7 min
        </button>
        <button 
          className={`py-2 rounded-lg ${selectedOption === 'custom' ? 'bg-[#00C4B4] text-[#000000]' : 'text-[#A4B1B7]'}`}
          onClick={() => selectOption('custom')}
          style={{
            backgroundColor: selectedOption === 'custom' ? '#00C4B4' : "rgba(176, 232, 227, 0.12)"
          }}
        >
          Custom
        </button>
      </div>

      <button 
        onClick={toggleTimer}
        className={`w-[100px] h-[40px] rounded-lg font-semibold mx-auto block mb-8 
          ${isRunning ? 'text-[#A4B1B7]' : 'bg-[#00C4B4] text-[#000000]'}`}
        style={{
          backgroundColor: isRunning ? "rgba(176, 232, 227, 0.12)" : "#00C4B4"
        }}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>

      <div className="mt-8 space-y-2">
        <PrimaryButton onClick={skipToWorkout}>
          Complete Warm-Up
        </PrimaryButton>

        <SecondaryButton onClick={skipToWorkout}>
          Skip Warm-Up
        </SecondaryButton>
      </div>
    </PageContainer>
  );
};

export default CardioWarmUp;
