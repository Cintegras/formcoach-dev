import React, { useState, useMemo } from 'react';
import PageContainer from '@/components/PageContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend,
  TooltipProps
} from 'recharts';
import { 
  ChartLine, BarChartHorizontal, Activity, 
  Loader2, ArrowLeft 
} from 'lucide-react';
import { useProgressMetrics } from '@/hooks/useProgressMetrics';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import { safeFormat } from '@/utils/dateUtils';
import BottomNav from '@/components/BottomNav';
import { useNavigate } from 'react-router-dom';

const TrendsPage = () => {
    const navigate = useNavigate();
    const [weightTimeFrame, setWeightTimeFrame] = useState('7d');
    const [measurementTimeFrame, setMeasurementTimeFrame] = useState('7d');
    const [workoutTimeFrame, setWorkoutTimeFrame] = useState('7d');
    const [metricType, setMetricType] = useState('chest');

    const {
        metrics: weightMetrics,
        loading: weightLoading,
        error: weightError,
        getHistory: getWeightHistory
    } = useProgressMetrics('weight');

    const {
        metrics: measurementMetrics,
        loading: measurementLoading,
        error: measurementError,
        getHistory: getMeasurementHistory
    } = useProgressMetrics(metricType);

    const {
        sessions,
        loading: workoutLoading,
        error: workoutError
    } = useWorkoutSessions();

    React.useEffect(() => {
        getWeightHistory('weight', 30);
    }, [getWeightHistory]);

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

    // Fix the type for the tooltip function to match Recharts' expected types
    const renderCustomTooltip = (props: TooltipProps<number, string>) => {
        const { active, payload, label } = props;
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
        <Card className="bg-formcoach-card p-4">
            <h3 className="text-lg font-semibold mb-4 text-formcoach-text">Weight Trend</h3>
            <div className="flex justify-end mb-2">
                <select
                    className="bg-formcoach-comingsoon text-formcoach-text rounded-md p-1"
                    value={weightTimeFrame}
                    onChange={(e) => setWeightTimeFrame(e.target.value)}
                >
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="90d">90 Days</option>
                </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#D7E4E3" />
                    <YAxis stroke="#D7E4E3" />
                    <Tooltip content={renderCustomTooltip} />
                    <Line type="monotone" dataKey="value" stroke="#00C4B4" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );

    const MeasurementsTab = () => (
        <Card className="bg-formcoach-card p-4">
            <h3 className="text-lg font-semibold mb-4 text-formcoach-text">Measurements Trend</h3>
            <div className="flex justify-between items-center mb-2">
                <select
                    className="bg-formcoach-comingsoon text-formcoach-text rounded-md p-1"
                    value={measurementTimeFrame}
                    onChange={(e) => setMeasurementTimeFrame(e.target.value)}
                >
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="90d">90 Days</option>
                </select>
                <select
                    className="bg-formcoach-comingsoon text-formcoach-text rounded-md p-1"
                    value={metricType}
                    onChange={(e) => setMetricType(e.target.value)}
                >
                    <option value="chest">Chest</option>
                    <option value="waist">Waist</option>
                    <option value="hips">Hips</option>
                    {/* Add more options as needed */}
                </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={measurementData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#D7E4E3" />
                    <YAxis stroke="#D7E4E3" />
                    <Tooltip content={renderCustomTooltip} />
                    <Line type="monotone" dataKey="value" stroke="#00C4B4" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );

    const WorkoutTab = () => (
        <Card className="bg-formcoach-card p-4">
            <h3 className="text-lg font-semibold mb-4 text-formcoach-text">Workout Duration</h3>
            <div className="flex justify-end mb-2">
                <select
                    className="bg-formcoach-comingsoon text-formcoach-text rounded-md p-1"
                    value={workoutTimeFrame}
                    onChange={(e) => setWorkoutTimeFrame(e.target.value)}
                >
                    <option value="7d">7 Days</option>
                    <option value="30d">30 Days</option>
                    <option value="90d">90 Days</option>
                </select>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={workoutData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis dataKey="date" stroke="#D7E4E3" />
                    <YAxis stroke="#D7E4E3" />
                    <Tooltip content={renderCustomTooltip} />
                    <Bar dataKey="duration" fill="#00C4B4" />
                    <Legend />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );

    return (
        <PageContainer>
            <Button variant="ghost" className="absolute top-4 left-4 md:left-8" onClick={() => navigate(-1)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            <h1 className="text-2xl font-bold text-center mb-6">Trends</h1>
            <Tabs defaultvalue="weight">
                <TabsList className="w-full flex justify-center mb-4">
                    <TabsTrigger value="weight" className="data-[state=active]:bg-formcoach-primary data-[state=active]:text-formcoach-background">
                        <ChartLine className="mr-2 h-4 w-4" />
                        Weight
                    </TabsTrigger>
                    <TabsTrigger value="measurements" className="data-[state=active]:bg-formcoach-primary data-[state=active]:text-formcoach-background">
                        <Activity className="mr-2 h-4 w-4" />
                        Measurements
                    </TabsTrigger>
                    <TabsTrigger value="workouts" className="data-[state=active]:bg-formcoach-primary data-[state=active]:text-formcoach-background">
                        <BarChartHorizontal className="mr-2 h-4 w-4" />
                        Workouts
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="weight">
                    {weightLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        </div>
                    ) : weightError ? (
                        <p className="text-red-500">Error: {weightError.message}</p>
                    ) : (
                        <WeightTab />
                    )}
                </TabsContent>
                <TabsContent value="measurements">
                    {measurementLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        </div>
                    ) : measurementError ? (
                        <p className="text-red-500">Error: {measurementError.message}</p>
                    ) : (
                        <MeasurementsTab />
                    )}
                </TabsContent>
                <TabsContent value="workouts">
                    {workoutLoading ? (
                        <div className="flex justify-center items-center h-48">
                            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                        </div>
                    ) : workoutError ? (
                        <p className="text-red-500">Error: {workoutError.message}</p>
                    ) : (
                        <WorkoutTab />
                    )}
                </TabsContent>
            </Tabs>
            <BottomNav/>
        </PageContainer>
    );
};

export default TrendsPage;
