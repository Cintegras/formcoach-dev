
import React, {useMemo, useState, useEffect} from 'react';
import PageContainer from '@/components/PageContainer';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card} from '@/components/ui/card';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis
} from 'recharts';
import {Activity, ChartLine, ChartBar} from 'lucide-react';
import {useProgressMetrics} from '@/hooks/useProgressMetrics';
import {useWorkoutSessions} from '@/hooks/useWorkoutSessions';
import {safeFormat} from '@/utils/dateUtils';

const TrendsPage = () => {
    const [activeTab, setActiveTab] = useState('weight');
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

    useEffect(() => {
        getWeightHistory('weight', 30);
    }, [getWeightHistory]);

    useEffect(() => {
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
                <div className="bg-[#020D0C] p-3 rounded-md border border-[#333] shadow-lg">
                    <p className="text-white font-medium">{label}</p>
                    <p className="text-[#00C4B4] text-lg">
                        {payload[0].value} {payload[0].name === 'duration' ? 'mins' : 'lbs'}
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderContent = () => {
        if (activeTab === 'weight') {
            return renderWeightContent();
        } else if (activeTab === 'measurements') {
            return renderMeasurementsContent();
        } else {
            return renderWorkoutsContent();
        }
    };

    const renderWeightContent = () => {
        if (weightLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-10 w-10 border-4 border-[#00C4B4] rounded-full border-t-transparent"></div>
                </div>
            );
        }

        if (weightError) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-red-500">Error loading weight data</p>
                </div>
            );
        }

        if (weightData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <ChartLine size={48} className="text-[#666] mb-4" />
                    <p className="text-white text-lg">No weight data available</p>
                </div>
            );
        }

        return (
            <div className="mt-4">
                <div className="flex justify-end mb-2">
                    <select
                        className="bg-[#1A1F2C] text-white rounded-md p-1 border border-[#333]"
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip content={renderCustomTooltip} />
                        <Line type="monotone" dataKey="value" stroke="#00C4B4" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderMeasurementsContent = () => {
        if (measurementLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-10 w-10 border-4 border-[#00C4B4] rounded-full border-t-transparent"></div>
                </div>
            );
        }

        if (measurementError) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-red-500">Error loading measurement data</p>
                </div>
            );
        }

        if (measurementData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <Activity size={48} className="text-[#666] mb-4" />
                    <p className="text-white text-lg">No measurement data available</p>
                </div>
            );
        }

        return (
            <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                    <select
                        className="bg-[#1A1F2C] text-white rounded-md p-1 border border-[#333]"
                        value={metricType}
                        onChange={(e) => setMetricType(e.target.value)}
                    >
                        <option value="chest">Chest</option>
                        <option value="waist">Waist</option>
                        <option value="hips">Hips</option>
                    </select>
                    <select
                        className="bg-[#1A1F2C] text-white rounded-md p-1 border border-[#333]"
                        value={measurementTimeFrame}
                        onChange={(e) => setMeasurementTimeFrame(e.target.value)}
                    >
                        <option value="7d">7 Days</option>
                        <option value="30d">30 Days</option>
                        <option value="90d">90 Days</option>
                    </select>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={measurementData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip content={renderCustomTooltip} />
                        <Line type="monotone" dataKey="value" stroke="#00C4B4" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };

    const renderWorkoutsContent = () => {
        if (workoutLoading) {
            return (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-10 w-10 border-4 border-[#00C4B4] rounded-full border-t-transparent"></div>
                </div>
            );
        }

        if (workoutError) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <p className="text-red-500">Error loading workout data</p>
                </div>
            );
        }

        if (workoutData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <ChartBar size={48} className="text-[#666] mb-4" />
                    <p className="text-white text-lg">No workout data available</p>
                </div>
            );
        }

        return (
            <div className="mt-4">
                <div className="flex justify-end mb-2">
                    <select
                        className="bg-[#1A1F2C] text-white rounded-md p-1 border border-[#333]"
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="date" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip content={renderCustomTooltip} />
                        <Bar dataKey="duration" fill="#00C4B4" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    };

    return (
        <PageContainer hideBottomNav={false}>
            <div className="flex flex-col items-center">
                <h1 className="text-2xl font-bold text-white mb-6">Trends</h1>
                
                <div className="w-full max-w-md bg-[#1A1F2C] rounded-lg p-1 mb-6">
                    <div className="flex">
                        <button 
                            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md ${activeTab === 'weight' ? 'bg-[#00C4B4] text-black' : 'text-white'}`}
                            onClick={() => setActiveTab('weight')}
                        >
                            <ChartLine className="mr-2 h-4 w-4" />
                            <span>Weight</span>
                        </button>
                        <button 
                            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md ${activeTab === 'measurements' ? 'bg-[#00C4B4] text-black' : 'text-white'}`}
                            onClick={() => setActiveTab('measurements')}
                        >
                            <Activity className="mr-2 h-4 w-4" />
                            <span>Measurements</span>
                        </button>
                        <button 
                            className={`flex-1 flex items-center justify-center py-2 px-3 rounded-md ${activeTab === 'workouts' ? 'bg-[#00C4B4] text-black' : 'text-white'}`}
                            onClick={() => setActiveTab('workouts')}
                        >
                            <ChartBar className="mr-2 h-4 w-4" />
                            <span>Workouts</span>
                        </button>
                    </div>
                </div>

                <div className="w-full">
                    {renderContent()}
                </div>
            </div>
        </PageContainer>
    );
};

export default TrendsPage;
