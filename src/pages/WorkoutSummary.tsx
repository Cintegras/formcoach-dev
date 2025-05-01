
import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { CardGradient, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card-gradient';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { Check, BarChart2 } from 'lucide-react';

const WorkoutSummary = () => {
  const navigate = useNavigate();
  
  // Sample workout summary - in a real app these would come from logged data
  const completedExercises = [
    { 
      name: "Leg Press", 
      sets: [
        { reps: 10, weight: 150 },
        { reps: 10, weight: 170 },
        { reps: 8, weight: 180 },
      ] 
    },
    { 
      name: "Seated Leg Curl", 
      sets: [
        { reps: 12, weight: 80 },
        { reps: 10, weight: 90 },
        { reps: 10, weight: 90 },
      ] 
    },
    { 
      name: "Chest Press", 
      sets: [
        { reps: 10, weight: 120 },
        { reps: 8, weight: 130 },
        { reps: 8, weight: 130 },
      ] 
    },
    { 
      name: "Lat Pulldown", 
      sets: [
        { reps: 10, weight: 100 },
        { reps: 10, weight: 110 },
        { reps: 8, weight: 120 },
      ] 
    },
  ];

  return (
    <PageContainer>
      <div className="mb-6 text-center">
        <div className="mx-auto bg-teal-500/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-3">
          <Check className="w-8 h-8 text-teal-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Workout Complete!</h1>
        <p className="text-gray-300 mt-2">Great job today!</p>
      </div>
      
      <CardGradient>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-teal-400" />
            Workout Summary
          </CardTitle>
          <CardDescription className="text-gray-300">
            Here's what you accomplished today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {completedExercises.map((exercise, index) => (
              <div key={index} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium text-white mb-2">{exercise.name}</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-gray-400">Set</div>
                  <div className="text-gray-400">Reps</div>
                  <div className="text-gray-400">Weight</div>
                  
                  {exercise.sets.map((set, setIndex) => (
                    <React.Fragment key={setIndex}>
                      <div className="text-white">{setIndex + 1}</div>
                      <div className="text-white">{set.reps}</div>
                      <div className="text-white">{set.weight} lbs</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <PrimaryButton onClick={() => navigate('/')}>
            Finish
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/start-workout')}>
            Start New Workout
          </SecondaryButton>
        </CardFooter>
      </CardGradient>
    </PageContainer>
  );
};

export default WorkoutSummary;
