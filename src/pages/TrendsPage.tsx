import React, {useEffect, useState} from 'react';
import PageContainer from '@/components/PageContainer';
import {Calendar} from '@/components/ui/calendar';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {ChartContainer, ChartTooltip, ChartTooltipContent} from '@/components/ui/chart';
import {Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis} from 'recharts';

// Metric types for filtering
const METRIC_TYPES = {
    STRENGTH: {
        BENCH_PRESS: 'bench_press',
        SQUAT: 'squat',
        DEADLIFT: 'deadlift',
    },
    BODY: {
        WEIGHT: 'weight',
        BODY_FAT: 'body_fat',
        WAIST: 'waist',
        CHEST: 'chest',
    }
};

// Workout types for calendar
const WORKOUT_TYPES = {
    STRENGTH: 'strength',
    CARDIO: 'cardio',
    FLEXIBILITY: 'flexibility',
};

const TrendsPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [firstName, setFirstName] = useState('');

    useEffect(() => {
    // Get user data for personalization
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setFirstName(user.firstName || '');
    }
  }, []);

    // Function to check if a date has a workout and its type
  const getWorkoutType = (day: Date) => {
    const foundWorkout = sampleWorkoutData.find(
      workout => workout.date.getDate() === day.getDate() &&
                 workout.date.getMonth() === day.getMonth() &&
                 workout.date.getFullYear() === day.getFullYear()
    );

      return foundWorkout?.type;
  };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
          {firstName ? `${firstName}'s Trends` : 'Trends'}
        </h1>
        <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
          Track your workout progress over time
        </p>
      </div>

      <Tabs defaultValue="strength" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[rgba(176,232,227,0.12)]">
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

          <TabsContent value="strength" className="mt-6">
          <div className="bg-[rgba(176,232,227,0.08)] p-4 rounded-lg">
            <h3 className="text-[#B0E8E3] text-lg mb-4">Strength Progress</h3>
            <div className="h-[300px] w-full">
              <ChartContainer
                config={{
                  bench: { color: "#00C4B4", label: "Bench Press" },
                  squat: { color: "#B0E8E3", label: "Squat" },
                  deadlift: { color: "#A4B1B7", label: "Deadlift" }
                }}
              >
                <LineChart data={strengthData}>
                  <XAxis dataKey="month" stroke="#A4B1B7" />
                  <YAxis stroke="#A4B1B7" />
                  <CartesianGrid stroke="#1C1C1E" />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent />
                    }
                  />
                  <Line type="monotone" dataKey="bench" stroke="#00C4B4" />
                  <Line type="monotone" dataKey="squat" stroke="#B0E8E3" />
                  <Line type="monotone" dataKey="deadlift" stroke="#A4B1B7" />
                </LineChart>
              </ChartContainer>
            </div>
          </div>
        </TabsContent>

          <TabsContent value="activity" className="mt-6">
          <div className="bg-[rgba(176,232,227,0.08)] p-4 rounded-lg">
            <h3 className="text-[#B0E8E3] text-lg mb-4">Weekly Activity</h3>
            <div className="h-[300px] w-full">
              <ChartContainer
                config={{
                  minutes: { color: "#00C4B4", label: "Minutes" }
                }}
              >
                <BarChart data={workoutData}>
                  <XAxis dataKey="day" stroke="#A4B1B7" />
                  <YAxis stroke="#A4B1B7" />
                  <CartesianGrid stroke="#1C1C1E" />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent />
                    }
                  />
                  <Bar dataKey="minutes" fill="#00C4B4" />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </TabsContent>

          <TabsContent value="calendar" className="mt-6">
          <div className="bg-[rgba(176,232,227,0.08)] p-4 rounded-lg">
            <h3 className="text-[#B0E8E3] text-lg mb-4">Workout Calendar</h3>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-3 pointer-events-auto bg-[#020D0C] text-white rounded-md"
                modifiers={{
                  strength: (date) => getWorkoutType(date) === 'strength',
                  cardio: (date) => getWorkoutType(date) === 'cardio',
                }}
                modifiersStyles={{
                  strength: { backgroundColor: '#FFDEE2', color: '#020D0C', fontWeight: 'bold' }, // Soft pink for strength
                  cardio: { backgroundColor: '#F2FCE2', color: '#020D0C', fontWeight: 'bold' }    // Soft green for cardio
                }}
              />
            </div>

              {/* Calendar legend */}
            <div className="flex justify-center mt-4 gap-4 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#FFDEE2] mr-2"></div>
                <span className="text-[#A4B1B7]">Strength</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#F2FCE2] mr-2"></div>
                <span className="text-[#A4B1B7]">Cardio</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default TrendsPage;
