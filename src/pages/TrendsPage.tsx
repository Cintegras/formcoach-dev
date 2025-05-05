import React, { useState, useMemo } from 'react';
import PageContainer from '@/components/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format } from 'date-fns';
import { Loader2, Calendar, ArrowRight } from 'lucide-react';
import { useProgressMetrics } from '@/hooks/useProgressMetrics';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import BottomNav from '@/components/BottomNav';

interface Measurement {
    date: string;
    value: number;
}

const TrendsPage = () => {
    const [weightTimeFrame, setWeightTimeFrame] = useState('7d');
    const [measurementTimeFrame, setMeasurementTimeFrame] = useState('7d');
    const [workoutTimeFrame, setWorkoutTimeFrame] = useState('7d');

    // Weight Data
    const {
        metrics: weightMetrics,
        loading: weightLoading,
        error: weightError,
        getHistory: getWeightHistory
    } = useProgressMetrics();

    // Measurement Data
    const {
        metrics: measurementMetrics,
        loading: measurementLoading,
        error: measurementError,
        getHistory: getMeasurementHistory
    } = useProgressMetrics();

    // Workout Data
    const {
        sessions,
        loading: workoutLoading,
        error: workoutError
    } = useWorkoutSessions();

    // Fetch initial data
    React.useEffect(() => {
        getWeightHistory('weight', 30);
    }, [getWeightHistory]);

    // Fetch initial data
    React.useEffect(() => {
        getMeasurementHistory('chest', 30);
    }, [getMeasurementHistory]);

    const weightData = useMemo(() => {
        return weightMetrics.map(metric => ({
            date: format(new Date(metric.date), 'MMM dd'),
            value: metric.value
        }));
    }, [weightMetrics]);

    const workoutData = useMemo(() => {
        return sessions.map(session => ({
            date: format(new Date(session.created_at), 'MMM dd'),
            duration: 60
        }));
    }, [sessions]);

    const measurementData = useMemo(() => {
        return measurementMetrics.map(metric => ({
            date: format(new Date(metric.date), 'MMM dd'),
            value: metric.value
        }));
    }, [measurementMetrics]);

    const WeightTab = () => (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#A4B1B7]">Weight Over Time</h3>
                <select
                    value={weightTimeFrame}
                    onChange={(e) => setWeightTimeFrame(e.target.value)}
                    className="bg-transparent border border-[#2D2D2F] rounded-md px-2 py-1 text-sm text-[#A4B1B7]"
                >
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="90d">90 Days</option>
                </select>
            </div>
            {weightLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="text-[#A4B1B7] animate-spin"/>
                </div>
            ) : weightError ? (
                <p className="text-red-500">Error: {weightError.message}</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weightData} margin={{top: 5, right: 20, left: 10, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2F"/>
                        <XAxis dataKey="date" stroke="#A4B1B7"/>
                        <YAxis stroke="#A4B1B7"/>
                        <Tooltip
                            contentStyle={{backgroundColor: '#1C1C1E', border: 'none', color: '#A4B1B7'}}
                            itemStyle={{color: '#A4B1B7'}}
                        />
                        <Line type="monotone" dataKey="value" stroke="#00C4B4" activeDot={{r: 8}}/>
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Card>
    );

    const MeasurementsTab = () => (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#A4B1B7]">Measurements Over Time</h3>
                <select
                    value={measurementTimeFrame}
                    onChange={(e) => setMeasurementTimeFrame(e.target.value)}
                    className="bg-transparent border border-[#2D2D2F] rounded-md px-2 py-1 text-sm text-[#A4B1B7]"
                >
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="90d">90 Days</option>
                </select>
            </div>
            {measurementLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="text-[#A4B1B7] animate-spin"/>
                </div>
            ) : measurementError ? (
                <p className="text-red-500">Error: {measurementError.message}</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={measurementData} margin={{top: 5, right: 20, left: 10, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2F"/>
                        <XAxis dataKey="date" stroke="#A4B1B7"/>
                        <YAxis stroke="#A4B1B7"/>
                        <Tooltip
                            contentStyle={{backgroundColor: '#1C1C1E', border: 'none', color: '#A4B1B7'}}
                            itemStyle={{color: '#A4B1B7'}}
                        />
                        <Line type="monotone" dataKey="value" stroke="#00C4B4" activeDot={{r: 8}}/>
                    </LineChart>
                </ResponsiveContainer>
            )}
        </Card>
    );

    const WorkoutTab = () => (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#A4B1B7]">Workout Duration</h3>
                <select
                    value={workoutTimeFrame}
                    onChange={(e) => setWorkoutTimeFrame(e.target.value)}
                    className="bg-transparent border border-[#2D2D2F] rounded-md px-2 py-1 text-sm text-[#A4B1B7]"
                >
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="90d">90 Days</option>
                </select>
            </div>
            {workoutLoading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="text-[#A4B1B7] animate-spin"/>
                </div>
            ) : workoutError ? (
                <p className="text-red-500">Error: {workoutError.message}</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={workoutData} margin={{top: 5, right: 20, left: 10, bottom: 5}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2F"/>
                        <XAxis dataKey="date" stroke="#A4B1B7"/>
                        <YAxis stroke="#A4B1B7"/>
                        <Tooltip
                            contentStyle={{backgroundColor: '#1C1C1E', border: 'none', color: '#A4B1B7'}}
                            itemStyle={{color: '#A4B1B7'}}
                        />
                        <Bar dataKey="duration" fill="#00C4B4"/>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Card>
    );

    return (
        <PageContainer>
            <div className="mt-8 mb-6">
                <h1 className="font-bold text-[32px] text-center text-[#A4B1B7]">
                    Your Progress
                </h1>
                <p className="font-normal text-[16px] text-[#A4B1B7] text-center mt-2">
                    Track your fitness journey and see how far you've come.
                </p>
            </div>

            <Tabs defaultValue="weight" className="w-[400px] mx-auto">
                <TabsList>
                    <TabsTrigger value="weight">Weight</TabsTrigger>
                    <TabsTrigger value="measurements">Measurements</TabsTrigger>
                    <TabsTrigger value="workouts">Workouts</TabsTrigger>
                </TabsList>
                <TabsContent value="weight"><WeightTab/></TabsContent>
                <TabsContent value="measurements"><MeasurementsTab/></TabsContent>
                <TabsContent value="workouts"><WorkoutTab/></TabsContent>
            </Tabs>

            <BottomNav/>
        </PageContainer>
    );
};

export default TrendsPage;
