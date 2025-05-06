
import React, { useState, useMemo } from 'react';
import PageContainer from '@/components/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';
import { 
  ChartLine, ChartBarHorizontal, Activity, 
  Loader2, ArrowLeft 
} from 'lucide-react';
import { useProgressMetrics } from '@/hooks/useProgressMetrics';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import { safeFormat, safeParseDate } from '@/utils/dateUtils';
import BottomNav from '@/components/BottomNav';
import { useNavigate } from 'react-router-dom';

interface Measurement {
    date: string;
    value: number;
}

const TrendsPage = () => {
    const navigate = useNavigate();
    const [weightTimeFrame, setWeightTimeFrame] = useState('7d');
    const [measurementTimeFrame, setMeasurementTimeFrame] = useState('7d');
    const [workoutTimeFrame, setWorkoutTimeFrame] = useState('7d');
    const [metricType, setMetricType] = useState('chest');

    // Weight Data
    const {
        metrics: weightMetrics,
        loading: weightLoading,
        error: weightError,
        getHistory: getWeightHistory
    } = useProgressMetrics('weight');

    // Measurement Data
    const {
        metrics: measurementMetrics,
        loading: measurementLoading,
        error: measurementError,
        getHistory: getMeasurementHistory
    } = useProgressMetrics(metricType);

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
        getMeasurementHistory(metricType, 30);
    }, [getMeasurementHistory, metricType]);

    const weightData = useMemo(() => {
        return weightMetrics.map(metric => ({
            date: safeFormat(metric.recorded_date, 'MMM dd'),
            value: metric.metric_value || 0
        }));
    }, [weightMetrics]);

    const workoutData = useMemo(() => {
        return sessions.map(session => {
            const start = session.start_time ? new Date(session.start_time) : null;
            const end = session.end_time ? new Date(session.end_time) : null;
            const duration = start && end ? Math.round((end.getTime() - start.getTime()) / (1000 * 60)) : 60;
            
            return {
                date: safeFormat(session.created_at, 'MMM dd'),
                duration: duration
            };
        });
    }, [sessions]);

    const measurementData = useMemo(() => {
        return measurementMetrics.map(metric => ({
            date: safeFormat(metric.recorded_date, 'MMM dd'),
            value: metric.metric_value || 0
        }));
    }, [measurementMetrics]);

    const renderCustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-formcoach-card p-3 rounded-md border border-formcoach-comingsoon shadow-lg">
                    <p className="text-formcoach-text font-medium">{label}</p>
                    <p className="text-formcoach-primary text-lg">
                        {payload[0].value} {payload[0].name === 'duration' ? 'mins' : 'lbs'}
                    </p>
                </div>
            );
        }
        return null;
    };

    const WeightTab = () => (
        <Card className="bg-formcoach-card border-formcoach-comingsoon">
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-formcoach-text flex items-center">
                        <ChartLine className="mr-2 h-5 w-5 text-formcoach-primary" />
                        Weight Progress
                    </h3>
                    <select
                        value={weightTimeFrame}
                        onChange={(e) => setWeightTimeFrame(e.target.value)}
                        className="bg-formcoach-background border border-formcoach-comingsoon rounded-md px-3 py-1 text-sm text-formcoach-text"
                    >
                        <option value="7d">7 Days</option>
                        <option value="30d">30 Days</option>
                        <option value="90d">90 Days</option>
                    </select>
                </div>
                {weightLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="text-formcoach-primary animate-spin h-8 w-8"/>
                    </div>
                ) : weightError ? (
                    <div className="text-center py-12">
                        <p className="text-red-500">Error loading weight data</p>
                        <Button onClick={() => getWeightHistory('weight')} variant="outline" className="mt-2">
                            Try Again
                        </Button>
                    </div>
                ) : weightData.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <p className="text-formcoach-subtext mb-2">No weight data available</p>
                        <p className="text-formcoach-subtext text-sm mb-4">
                            Track your weight to see progress over time
                        </p>
                    </div>
                ) : (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={weightData} margin={{top: 5, right: 20, left: 10, bottom: 20}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 45, 47, 0.6)"/>
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#A4B1B7" 
                                    tick={{ fontSize: 12 }}
                                    angle={-30}
                                    textAnchor="end"
                                    height={50}
                                />
                                <YAxis 
                                    stroke="#A4B1B7" 
                                    tick={{ fontSize: 12 }}
                                    width={40}
                                    domain={['dataMin - 5', 'dataMax + 5']}
                                />
                                <Tooltip 
                                    content={renderCustomTooltip}
                                    cursor={{ stroke: '#A4B1B7', strokeWidth: 1, strokeDasharray: '5 5' }}
                                />
                                <Legend />
                                <Line 
                                    name="Weight (lbs)" 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#00C4B4" 
                                    strokeWidth={3}
                                    activeDot={{r: 8, fill: '#00C4B4', stroke: '#020D0C', strokeWidth: 2}}
                                    dot={{ stroke: '#020D0C', strokeWidth: 1, fill: '#00C4B4', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </Card>
    );

    const MeasurementsTab = () => (
        <Card className="bg-formcoach-card border-formcoach-comingsoon">
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-formcoach-text flex items-center">
                        <Activity className="mr-2 h-5 w-5 text-formcoach-primary" />
                        Body Measurements
                    </h3>
                    <select
                        value={measurementTimeFrame}
                        onChange={(e) => setMeasurementTimeFrame(e.target.value)}
                        className="bg-formcoach-background border border-formcoach-comingsoon rounded-md px-3 py-1 text-sm text-formcoach-text"
                    >
                        <option value="7d">7 Days</option>
                        <option value="30d">30 Days</option>
                        <option value="90d">90 Days</option>
                    </select>
                </div>
                
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-formcoach-comingsoon scrollbar-track-transparent">
                    {['chest', 'waist', 'hips', 'biceps', 'thighs'].map(type => (
                        <Button
                            key={type}
                            onClick={() => setMetricType(type)}
                            variant={metricType === type ? "default" : "outline"}
                            className={`px-3 py-1 h-8 ${metricType === type ? 'bg-formcoach-primary text-black' : 'border-formcoach-comingsoon'}`}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Button>
                    ))}
                </div>
                
                {measurementLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="text-formcoach-primary animate-spin h-8 w-8"/>
                    </div>
                ) : measurementError ? (
                    <div className="text-center py-12">
                        <p className="text-red-500">Error loading measurement data</p>
                        <Button onClick={() => getMeasurementHistory(metricType)} variant="outline" className="mt-2">
                            Try Again
                        </Button>
                    </div>
                ) : measurementData.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <p className="text-formcoach-subtext mb-2">No {metricType} measurements available</p>
                        <p className="text-formcoach-subtext text-sm mb-4">
                            Record your body measurements to track changes
                        </p>
                    </div>
                ) : (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={measurementData} margin={{top: 5, right: 20, left: 10, bottom: 20}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 45, 47, 0.6)"/>
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#A4B1B7" 
                                    tick={{ fontSize: 12 }}
                                    angle={-30}
                                    textAnchor="end"
                                    height={50}
                                />
                                <YAxis 
                                    stroke="#A4B1B7" 
                                    tick={{ fontSize: 12 }}
                                    width={40}
                                    domain={['dataMin - 1', 'dataMax + 1']}
                                />
                                <Tooltip 
                                    content={renderCustomTooltip}
                                    cursor={{ stroke: '#A4B1B7', strokeWidth: 1, strokeDasharray: '5 5' }}
                                />
                                <Legend />
                                <Line 
                                    name={`${metricType.charAt(0).toUpperCase() + metricType.slice(1)} (in)`}
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#00C4B4"
                                    strokeWidth={3}
                                    activeDot={{r: 8, fill: '#00C4B4', stroke: '#020D0C', strokeWidth: 2}}
                                    dot={{ stroke: '#020D0C', strokeWidth: 1, fill: '#00C4B4', r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </Card>
    );

    const WorkoutTab = () => (
        <Card className="bg-formcoach-card border-formcoach-comingsoon">
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-formcoach-text flex items-center">
                        <ChartBarHorizontal className="mr-2 h-5 w-5 text-formcoach-primary" />
                        Workout Duration
                    </h3>
                    <select
                        value={workoutTimeFrame}
                        onChange={(e) => setWorkoutTimeFrame(e.target.value)}
                        className="bg-formcoach-background border border-formcoach-comingsoon rounded-md px-3 py-1 text-sm text-formcoach-text"
                    >
                        <option value="7d">7 Days</option>
                        <option value="30d">30 Days</option>
                        <option value="90d">90 Days</option>
                    </select>
                </div>
                {workoutLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="text-formcoach-primary animate-spin h-8 w-8"/>
                    </div>
                ) : workoutError ? (
                    <div className="text-center py-12">
                        <p className="text-red-500">Error loading workout data</p>
                        <Button variant="outline" className="mt-2">
                            Try Again
                        </Button>
                    </div>
                ) : workoutData.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <p className="text-formcoach-subtext mb-2">No workout data available</p>
                        <p className="text-formcoach-subtext text-sm mb-4">
                            Complete workouts to track your activity over time
                        </p>
                    </div>
                ) : (
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workoutData} margin={{top: 5, right: 20, left: 10, bottom: 20}}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(45, 45, 47, 0.6)"/>
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#A4B1B7" 
                                    tick={{ fontSize: 12 }}
                                    angle={-30}
                                    textAnchor="end"
                                    height={50}
                                />
                                <YAxis 
                                    stroke="#A4B1B7" 
                                    tick={{ fontSize: 12 }}
                                    label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#A4B1B7' } }}
                                    width={50}
                                />
                                <Tooltip 
                                    content={renderCustomTooltip}
                                    cursor={{ fill: 'rgba(0, 196, 180, 0.1)' }}
                                />
                                <Legend />
                                <Bar 
                                    name="Duration (mins)"
                                    dataKey="duration" 
                                    fill="#00C4B4"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </Card>
    );

    return (
        <PageContainer>
            <div className="p-4">
                <div className="flex items-center mb-4">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate('/profile')}
                        className="mr-2 text-formcoach-text hover:text-formcoach-primary"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-formcoach-text">
                        Your Progress
                    </h1>
                </div>
                
                <p className="text-formcoach-subtext mb-6">
                    Track your fitness journey and see how far you've come
                </p>

                <Tabs defaultValue="weight" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-6 bg-formcoach-background border border-formcoach-comingsoon">
                        <TabsTrigger value="weight" className="data-[state=active]:bg-formcoach-primary data-[state=active]:text-black">
                            Weight
                        </TabsTrigger>
                        <TabsTrigger value="measurements" className="data-[state=active]:bg-formcoach-primary data-[state=active]:text-black">
                            Measurements
                        </TabsTrigger>
                        <TabsTrigger value="workouts" className="data-[state=active]:bg-formcoach-primary data-[state=active]:text-black">
                            Workouts
                        </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="weight" className="mt-0">
                        <WeightTab/>
                    </TabsContent>
                    
                    <TabsContent value="measurements" className="mt-0">
                        <MeasurementsTab/>
                    </TabsContent>
                    
                    <TabsContent value="workouts" className="mt-0">
                        <WorkoutTab/>
                    </TabsContent>
                </Tabs>
            </div>
            <BottomNav/>
        </PageContainer>
    );
};

export default TrendsPage;
