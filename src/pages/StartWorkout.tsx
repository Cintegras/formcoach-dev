
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { CardGradient, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card-gradient';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { Calendar, Play } from 'lucide-react';

const StartWorkout = () => {
  const navigate = useNavigate();
  
  // Today's date formatted nicely
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Sample workout plan - in a real app these would come from the selected machines
  const workoutPlan = [
    { id: "leg-press", name: "Leg Press", sets: 3 },
    { id: "seated-leg-curl", name: "Seated Leg Curl", sets: 3 },
    { id: "chest-press", name: "Chest Press", sets: 3 },
    { id: "lat-pulldown", name: "Lat Pulldown", sets: 3 },
  ];

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Today's Workout</h1>
        <div className="flex items-center mt-2 text-gray-300">
          <Calendar className="w-5 h-5 mr-2" />
          <span>{today}</span>
        </div>
      </div>
      
      <CardGradient>
        <CardHeader>
          <CardTitle>Your Workout Plan</CardTitle>
          <CardDescription className="text-gray-300">
            Here's what you'll be doing today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workoutPlan.map((exercise, index) => (
              <div key={exercise.id} className="flex items-center justify-between bg-gray-800/50 p-4 rounded-lg">
                <div>
                  <h3 className="font-medium text-white">{exercise.name}</h3>
                  <p className="text-sm text-gray-400">{exercise.sets} sets</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <PrimaryButton 
            onClick={() => navigate('/workout-tracking/leg-press')}
            className="flex items-center justify-center"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Logging
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/machine-selection')}>
            Modify Workout
          </SecondaryButton>
        </CardFooter>
      </CardGradient>
    </PageContainer>
  );
};

export default StartWorkout;
