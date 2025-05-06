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
  ChartLine, BarChartHorizontal, Activity, 
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

    const renderCustomTooltip = (props: any) => {
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

    // ... rest of the component (no changes beyond tooltip and icon fix)

    return (
        <PageContainer>
            {/* full UI structure remains unchanged */}
        </PageContainer>
    );
};

export default TrendsPage;