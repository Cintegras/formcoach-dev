import React, {useMemo, useState} from 'react';
import {format, isWithinInterval, subDays} from 'date-fns';
import PageContainer from '@/components/PageContainer';
import {useWorkoutSessions} from '@/hooks/useWorkoutSessions';
import {ChevronRight, Clock, Filter, Loader2, X} from 'lucide-react';
import { safeFormat, safeParseDate } from '@/utils/dateUtils';

// Workout types for filtering
const WORKOUT_TYPES = {
    ALL: 'all',
    STRENGTH: 'strength',
    CARDIO: 'cardio',
    FLEXIBILITY: 'flexibility',
};

// Time ranges for filtering
const TIME_RANGES = {
    WEEK: '7',
    MONTH: '30',
    THREE_MONTHS: '90',
    SIX_MONTHS: '180',
    YEAR: '365',
    ALL: 'all',
};

const WorkoutHistoryPage = () => {
    // Fetch workout sessions
    const {sessions, loading, error} = useWorkoutSessions('500'); // Get up to 500 sessions

    // Filter state
    const [selectedType, setSelectedType] = useState(WORKOUT_TYPES.ALL);
    const [selectedTimeRange, setSelectedTimeRange] = useState(TIME_RANGES.MONTH);
    const [showFilters, setShowFilters] = useState(false);

    // Apply filters to sessions
    const filteredSessions = useMemo(() => {
        if (!sessions.length) return [];

        return sessions.filter(session => {
            // Filter by workout type
            if (selectedType !== WORKOUT_TYPES.ALL) {
                const sessionType = session.workout_plan_id?.toLowerCase() || '';
                if (selectedType === WORKOUT_TYPES.STRENGTH && !sessionType.includes('strength') && !sessionType.includes('upper') && !sessionType.includes('lower')) {
                    return false;
                }
                if (selectedType === WORKOUT_TYPES.CARDIO && !sessionType.includes('cardio')) {
                    return false;
                }
                if (selectedType === WORKOUT_TYPES.FLEXIBILITY && !sessionType.includes('flexibility')) {
                    return false;
                }
            }

            // Filter by time range
            if (selectedTimeRange !== TIME_RANGES.ALL) {
                const days = parseInt(selectedTimeRange);
                const startDate = subDays(new Date(), days);
                const sessionDate = safeParseDate(session.created_at);

                if (!isWithinInterval(sessionDate, {start: startDate, end: new Date()})) {
                    return false;
                }
            }

            return true;
        }).sort((a, b) => {
            // Sort by date (newest first)
            const dateA = safeParseDate(a.created_at, new Date(0));
            const dateB = safeParseDate(b.created_at, new Date(0));
            return dateB.getTime() - dateA.getTime();
        });
    }, [sessions, selectedType, selectedTimeRange]);

    // Group sessions by date
    const groupedSessions = useMemo(() => {
        const groups: Record<string, any[]> = {};

        filteredSessions.forEach(session => {
            const dateKey = safeFormat(session.created_at, 'yyyy-MM-dd');
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(session);
        });

        return groups;
    }, [filteredSessions]);

    // Calculate workout duration in minutes
    const getWorkoutDuration = (session: any) => {
        if (!session.completed_at) return 'In progress';

        const startTime = new Date(session.created_at).getTime();
        const endTime = new Date(session.completed_at).getTime();
        const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));

        if (durationMinutes < 60) {
            return `${durationMinutes} min`;
        } else {
            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;
            return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
        }
    };

    // Format workout type for display
    const formatWorkoutType = (session: any) => {
        const planId = session.workout_plan_id?.toLowerCase() || '';

        if (planId.includes('cardio')) return 'Cardio';
        if (planId.includes('flexibility')) return 'Flexibility';
        if (planId.includes('upper')) return 'Upper Body';
        if (planId.includes('lower')) return 'Lower Body';
        if (planId.includes('full')) return 'Full Body';

        return 'Workout';
    };

    return (
        <PageContainer>
            <div className="mt-8 mb-6">
                <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
                    Workout History
                </h1>
                <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
                    View and filter your past workouts
                </p>
            </div>

            {/* Filter button */}
            <div className="mb-4 flex justify-between items-center">
                <div className="text-[#A4B1B7] text-sm">
                    {filteredSessions.length} {filteredSessions.length === 1 ? 'workout' : 'workouts'} found
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center text-[#00C4B4] text-sm"
                >
                    <Filter size={16} className="mr-1"/>
                    Filters
                </button>
            </div>

            {/* Filters panel */}
            {showFilters && (
                <div className="mb-6 bg-[rgba(176,232,227,0.12)] rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-[#B0E8E3] font-medium">Filters</h3>
                        <button
                            onClick={() => setShowFilters(false)}
                            className="text-[#A4B1B7]"
                        >
                            <X size={16}/>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Workout type filter */}
                        <div>
                            <label className="block text-[#A4B1B7] text-sm mb-2">Workout Type</label>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(WORKOUT_TYPES).map(([key, value]) => (
                                    <button
                                        key={value}
                                        onClick={() => setSelectedType(value)}
                                        className={`px-3 py-1 rounded-full text-xs ${
                                            selectedType === value
                                                ? 'bg-[#00C4B4] text-[#020D0C]'
                                                : 'bg-[rgba(176,232,227,0.2)] text-[#A4B1B7]'
                                        }`}
                                    >
                                        {key === 'ALL' ? 'All Types' : key.charAt(0) + key.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Time range filter */}
                        <div>
                            <label className="block text-[#A4B1B7] text-sm mb-2">Time Range</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedTimeRange(TIME_RANGES.WEEK)}
                                    className={`px-3 py-1 rounded-full text-xs ${
                                        selectedTimeRange === TIME_RANGES.WEEK
                                            ? 'bg-[#00C4B4] text-[#020D0C]'
                                            : 'bg-[rgba(176,232,227,0.2)] text-[#A4B1B7]'
                                    }`}
                                >
                                    Last Week
                                </button>
                                <button
                                    onClick={() => setSelectedTimeRange(TIME_RANGES.MONTH)}
                                    className={`px-3 py-1 rounded-full text-xs ${
                                        selectedTimeRange === TIME_RANGES.MONTH
                                            ? 'bg-[#00C4B4] text-[#020D0C]'
                                            : 'bg-[rgba(176,232,227,0.2)] text-[#A4B1B7]'
                                    }`}
                                >
                                    Last Month
                                </button>
                                <button
                                    onClick={() => setSelectedTimeRange(TIME_RANGES.THREE_MONTHS)}
                                    className={`px-3 py-1 rounded-full text-xs ${
                                        selectedTimeRange === TIME_RANGES.THREE_MONTHS
                                            ? 'bg-[#00C4B4] text-[#020D0C]'
                                            : 'bg-[rgba(176,232,227,0.2)] text-[#A4B1B7]'
                                    }`}
                                >
                                    3 Months
                                </button>
                                <button
                                    onClick={() => setSelectedTimeRange(TIME_RANGES.SIX_MONTHS)}
                                    className={`px-3 py-1 rounded-full text-xs ${
                                        selectedTimeRange === TIME_RANGES.SIX_MONTHS
                                            ? 'bg-[#00C4B4] text-[#020D0C]'
                                            : 'bg-[rgba(176,232,227,0.2)] text-[#A4B1B7]'
                                    }`}
                                >
                                    6 Months
                                </button>
                                <button
                                    onClick={() => setSelectedTimeRange(TIME_RANGES.YEAR)}
                                    className={`px-3 py-1 rounded-full text-xs ${
                                        selectedTimeRange === TIME_RANGES.YEAR
                                            ? 'bg-[#00C4B4] text-[#020D0C]'
                                            : 'bg-[rgba(176,232,227,0.2)] text-[#A4B1B7]'
                                    }`}
                                >
                                    1 Year
                                </button>
                                <button
                                    onClick={() => setSelectedTimeRange(TIME_RANGES.ALL)}
                                    className={`px-3 py-1 rounded-full text-xs ${
                                        selectedTimeRange === TIME_RANGES.ALL
                                            ? 'bg-[#00C4B4] text-[#020D0C]'
                                            : 'bg-[rgba(176,232,227,0.2)] text-[#A4B1B7]'
                                    }`}
                                >
                                    All Time
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-[#00C4B4] animate-spin"/>
                    <p className="mt-4 text-[#A4B1B7]">Loading workout history...</p>
                </div>
            )}

            {/* Error state */}
            {error && !loading && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 p-4 rounded-lg">
                    <p>{error.message || 'Failed to load workout history'}</p>
                </div>
            )}

            {/* Empty state */}
            {!loading && !error && filteredSessions.length === 0 && (
                <div className="bg-[rgba(176,232,227,0.12)] rounded-lg p-8 text-center">
                    <p className="text-[#A4B1B7] mb-2">No workouts found.</p>
                    {sessions.length > 0 ? (
                        <p className="text-[#A4B1B7] text-sm">Try adjusting your filters to see more results.</p>
                    ) : (
                        <p className="text-[#A4B1B7] text-sm">Complete workouts to see them in your history.</p>
                    )}
                </div>
            )}

            {/* Workout history list */}
            {!loading && !error && filteredSessions.length > 0 && (
                <div className="space-y-6">
                    {Object.entries(groupedSessions).map(([dateKey, dateSessions]) => (
                        <div key={dateKey}>
                            <h3 className="text-[#B0E8E3] font-medium mb-2">
                                {safeFormat(dateKey, 'EEEE, MMMM d, yyyy')}
                            </h3>

                            <div className="space-y-3">
                                {dateSessions.map(session => (
                                    <div
                                        key={session.id}
                                        className="bg-[rgba(176,232,227,0.12)] rounded-lg p-4"
                                        onClick={() => {
                                            // Navigate to workout details page (if implemented)
                                            // navigate(`/workout-details/${session.id}`);
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-semibold text-[16px] text-[#B0E8E3]">
                                                    {formatWorkoutType(session)}
                                                </h4>
                                                <div className="flex items-center text-[#A4B1B7] text-sm mt-1">
                                                    <Clock size={14} className="mr-1"/>
                                                    <span>{safeFormat(session.created_at, 'h:mm a')}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{getWorkoutDuration(session)}</span>
                                                </div>
                                            </div>
                                            <ChevronRight size={18} className="text-[#A4B1B7]"/>
                                        </div>

                                        {session.notes && (
                                            <p className="text-[#A4B1B7] text-sm mt-2 italic">
                                                "{session.notes}"
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </PageContainer>
    );
};

export default WorkoutHistoryPage;
