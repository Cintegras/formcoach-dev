
import React, { useState } from 'react';
import PageContainer from '@/components/PageContainer';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend 
} from 'recharts';

// Mock data for charts
const strengthData = [
  { month: 'Jan', bench: 135, squat: 185, deadlift: 225 },
  { month: 'Feb', bench: 145, squat: 195, deadlift: 235 },
  { month: 'Mar', bench: 150, squat: 205, deadlift: 245 },
  { month: 'Apr', bench: 155, squat: 215, deadlift: 255 },
  { month: 'May', bench: 165, squat: 225, deadlift: 265 },
];

const workoutData = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 0 },
  { day: 'Wed', minutes: 60 },
  { day: 'Thu', minutes: 30 },
  { day: 'Fri', minutes: 0 },
  { day: 'Sat', minutes: 90 },
  { day: 'Sun', minutes: 45 },
];

// Mock workout days for calendar highlighting
const workoutDays = [1, 3, 5, 8, 10, 12, 15, 18, 22, 25, 28];

const TrendsPage = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  // Function to check if a date has a workout
  const hasWorkout = (day: Date) => {
    return workoutDays.includes(day.getDate());
  };

  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
          Trends
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
                  workout: (date) => hasWorkout(date),
                }}
                modifiersStyles={{
                  workout: { backgroundColor: '#00C4B4', color: 'black', fontWeight: 'bold' }
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default TrendsPage;
