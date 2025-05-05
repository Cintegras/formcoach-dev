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
  const [selectedStrengthMetrics, setSelectedStrengthMetrics] = useState([
    METRIC_TYPES.STRENGTH.BENCH_PRESS,
    METRIC_TYPES.STRENGTH.SQUAT,
    METRIC_TYPES.STRENGTH.DEADLIFT
  ]);
  const [selectedBodyMetrics, setSelectedBodyMetrics] = useState([
    METRIC_TYPES.BODY.WEIGHT
  ]);
  const [timeRange, setTimeRange] = useState(30); // Days

  // Fetch progress metrics for strength
  const {
    metrics: strengthMetrics,
    loading: loadingStrength,
    error: strengthError,
    getHistory: getStrengthHistory
  } = useProgressMetrics();

  // Fetch progress metrics for body measurements
  const {
    metrics: bodyMetrics,
    loading: loadingBody,
    error: bodyError,
    getHistory: getBodyHistory
  } = useProgressMetrics();

  // Fetch workout sessions for calendar and activity
  const {
    sessions,
    loading: loadingSessions,
    error: sessionsError
  } = useWorkoutSessions(100); // Get last 100 sessions

  // Fetch strength metrics history
  const [strengthHistoryData, setStrengthHistoryData] = useState<Record<string, any[]>>({});
  const [loadingStrengthHistory, setLoadingStrengthHistory] = useState(false);

  // Fetch body metrics history
  const [bodyHistoryData, setBodyHistoryData] = useState<Record<string, any[]>>({});
  const [loadingBodyHistory, setLoadingBodyHistory] = useState(false);

  // Format workout sessions for activity chart
  const activityData = useMemo(() => {
    if (!sessions.length) return [];

    // Create a map of day -> minutes
    const last7Days = new Array(7).fill(0).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return format(d, 'EEE'); // Mon, Tue, etc.
    }).reverse();

    const dayMap: Record<string, number> = {};
    last7Days.forEach(day => {
      dayMap[day] = 0;
    });

    // Fill in workout durations
    sessions.forEach(session => {
      const sessionDate = new Date(session.created_at);
      const dayOfWeek = format(sessionDate, 'EEE');

      // Only include sessions from the last 7 days
      const now = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);

      if (sessionDate >= sevenDaysAgo && sessionDate <= now) {
        // Calculate duration in minutes
        const startTime = new Date(session.created_at).getTime();
        const endTime = session.completed_at
            ? new Date(session.completed_at).getTime()
            : new Date().getTime();

        const durationMinutes = Math.round((endTime - startTime) / (1000 * 60));
        dayMap[dayOfWeek] += durationMinutes;
      }
    });

    // Convert to array format for chart
    return last7Days.map(day => ({
      day,
      minutes: dayMap[day]
    }));
  }, [sessions]);

  // Load strength history data
  useEffect(() => {
    const fetchStrengthHistory = async () => {
      setLoadingStrengthHistory(true);

      try {
        const historyData: Record<string, any[]> = {};

        // Fetch history for each selected metric
        for (const metricType of selectedStrengthMetrics) {
          const history = await getStrengthHistory(metricType, timeRange);

          // Format data for chart
          historyData[metricType] = history.map(item => ({
            date: format(new Date(item.created_at), 'MMM dd'),
            value: item.value
          }));
        }

        setStrengthHistoryData(historyData);
      } catch (error) {
        console.error('Error fetching strength history:', error);
      } finally {
        setLoadingStrengthHistory(false);
      }
    };

    if (selectedStrengthMetrics.length > 0) {
      fetchStrengthHistory();
    }
  }, [selectedStrengthMetrics, timeRange, getStrengthHistory]);

  // Load body metrics history
  useEffect(() => {
    const fetchBodyHistory = async () => {
      setLoadingBodyHistory(true);

      try {
        const historyData: Record<string, any[]> = {};

        // Fetch history for each selected metric
        for (const metricType of selectedBodyMetrics) {
          const history = await getBodyHistory(metricType, timeRange);

          // Format data for chart
          historyData[metricType] = history.map(item => ({
            date: format(new Date(item.created_at), 'MMM dd'),
            value: item.value
          }));
        }

        setBodyHistoryData(historyData);
      } catch (error) {
        console.error('Error fetching body metrics history:', error);
      } finally {
        setLoadingBodyHistory(false);
      }
    };

    if (selectedBodyMetrics.length > 0) {
      fetchBodyHistory();
    }
  }, [selectedBodyMetrics, timeRange, getBodyHistory]);

  // Format strength data for chart
  const strengthChartData = useMemo(() => {
    if (Object.keys(strengthHistoryData).length === 0) return [];

    // Get all unique dates across all metrics
    const allDates = new Set<string>();
    Object.values(strengthHistoryData).forEach(metricData => {
      metricData.forEach(item => allDates.add(item.date));
    });

    // Sort dates
    const sortedDates = Array.from(allDates).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    // Create data points for each date
    return sortedDates.map(date => {
      const dataPoint: Record<string, any> = {date};

      // Add value for each metric if available for this date
      Object.entries(strengthHistoryData).forEach(([metricType, metricData]) => {
        const dataForDate = metricData.find(item => item.date === date);
        dataPoint[metricType] = dataForDate ? dataForDate.value : null;
      });

      return dataPoint;
    });
  }, [strengthHistoryData]);

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
    if (!sessions.length) return undefined;

    // Format the date to compare
    const dayStr = format(day, 'yyyy-MM-dd');

    // Find a session on this date
    const foundSession = sessions.find(session => {
      const sessionDate = format(new Date(session.created_at), 'yyyy-MM-dd');
      return sessionDate === dayStr;
    });

    if (!foundSession) return undefined;

    // Determine workout type based on session data
    // This is a simplification - in a real app, you'd have more detailed type information
    return foundSession.workout_plan_id?.includes('cardio')
        ? WORKOUT_TYPES.CARDIO
        : WORKOUT_TYPES.STRENGTH;
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
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#B0E8E3] text-lg">Strength Progress</h3>

              {/* Time range selector */}
              <div className="flex items-center space-x-2">
                <span className="text-[#A4B1B7] text-sm">Range:</span>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(Number(e.target.value))}
                    className="bg-[#020D0C] border border-[#1C1C1E] rounded text-[#A4B1B7] text-sm p-1"
                >
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={180}>6 months</option>
                </select>
              </div>
            </div>

            {/* Metric selector */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(METRIC_TYPES.STRENGTH).map(([key, value]) => (
                  <button
                      key={value}
                      onClick={() => {
                        if (selectedStrengthMetrics.includes(value)) {
                          setSelectedStrengthMetrics(prev => prev.filter(m => m !== value));
                        } else {
                          setSelectedStrengthMetrics(prev => [...prev, value]);
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-xs ${
                          selectedStrengthMetrics.includes(value)
                              ? 'bg-[#00C4B4] text-[#020D0C]'
                              : 'bg-[rgba(176,232,227,0.12)] text-[#A4B1B7]'
                      }`}
                  >
                    {key.replace('_', ' ')}
                  </button>
              ))}
            </div>

            {/* Loading state */}
            {loadingStrengthHistory && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-[#00C4B4] animate-spin"/>
                  <p className="mt-4 text-[#A4B1B7]">Loading strength data...</p>
                </div>
            )}

            {/* Error state */}
            {strengthError && !loadingStrengthHistory && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 p-4 rounded-lg">
                  <p>{strengthError.message || 'Failed to load strength data'}</p>
                </div>
            )}

            {/* Empty state */}
            {!loadingStrengthHistory && !strengthError && strengthChartData.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[#A4B1B7]">No strength data available.</p>
                  <p className="text-[#A4B1B7] mt-2">Track your lifts to see progress over time.</p>
                </div>
            )}

            {/* Chart */}
            {!loadingStrengthHistory && !strengthError && strengthChartData.length > 0 && (
                <div className="h-[300px] w-full">
                  <ChartContainer
                      config={{
                        [METRIC_TYPES.STRENGTH.BENCH_PRESS]: {color: "#00C4B4", label: "Bench Press"},
                        [METRIC_TYPES.STRENGTH.SQUAT]: {color: "#B0E8E3", label: "Squat"},
                        [METRIC_TYPES.STRENGTH.DEADLIFT]: {color: "#A4B1B7", label: "Deadlift"}
                      }}
                  >
                    <LineChart data={strengthChartData}>
                      <XAxis dataKey="date" stroke="#A4B1B7"/>
                      <YAxis stroke="#A4B1B7"/>
                      <CartesianGrid stroke="#1C1C1E"/>
                      <ChartTooltip
                          content={
                            <ChartTooltipContent/>
                          }
                      />
                      {selectedStrengthMetrics.includes(METRIC_TYPES.STRENGTH.BENCH_PRESS) && (
                          <Line
                              type="monotone"
                              dataKey={METRIC_TYPES.STRENGTH.BENCH_PRESS}
                              stroke="#00C4B4"
                              connectNulls
                          />
                      )}
                      {selectedStrengthMetrics.includes(METRIC_TYPES.STRENGTH.SQUAT) && (
                          <Line
                              type="monotone"
                              dataKey={METRIC_TYPES.STRENGTH.SQUAT}
                              stroke="#B0E8E3"
                              connectNulls
                          />
                      )}
                      {selectedStrengthMetrics.includes(METRIC_TYPES.STRENGTH.DEADLIFT) && (
                          <Line
                              type="monotone"
                              dataKey={METRIC_TYPES.STRENGTH.DEADLIFT}
                              stroke="#A4B1B7"
                              connectNulls
                          />
                      )}
                    </LineChart>
                  </ChartContainer>
                </div>
            )}
          </div>
        </TabsContent>

          <TabsContent value="activity" className="mt-6">
          <div className="bg-[rgba(176,232,227,0.08)] p-4 rounded-lg">
            <h3 className="text-[#B0E8E3] text-lg mb-4">Weekly Activity</h3>

            {/* Loading state */}
            {loadingSessions && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-[#00C4B4] animate-spin"/>
                  <p className="mt-4 text-[#A4B1B7]">Loading activity data...</p>
                </div>
            )}

            {/* Error state */}
            {sessionsError && !loadingSessions && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 p-4 rounded-lg">
                  <p>{sessionsError.message || 'Failed to load activity data'}</p>
                </div>
            )}

            {/* Empty state */}
            {!loadingSessions && !sessionsError && (!sessions.length || !activityData.some(d => d.minutes > 0)) && (
                <div className="text-center py-12">
                  <p className="text-[#A4B1B7]">No workout activity recorded in the last 7 days.</p>
                  <p className="text-[#A4B1B7] mt-2">Complete workouts to see your activity here.</p>
                </div>
            )}

            {/* Chart */}
            {!loadingSessions && !sessionsError && activityData.some(d => d.minutes > 0) && (
                <div className="h-[300px] w-full">
                  <ChartContainer
                      config={{
                        minutes: {color: "#00C4B4", label: "Minutes"}
                      }}
                  >
                    <BarChart data={activityData}>
                      <XAxis dataKey="day" stroke="#A4B1B7"/>
                      <YAxis stroke="#A4B1B7"/>
                      <CartesianGrid stroke="#1C1C1E"/>
                      <ChartTooltip
                          content={
                            <ChartTooltipContent/>
                          }
                      />
                      <Bar dataKey="minutes" fill="#00C4B4"/>
                    </BarChart>
                  </ChartContainer>
                </div>
            )}
          </div>
        </TabsContent>

          <TabsContent value="calendar" className="mt-6">
          <div className="bg-[rgba(176,232,227,0.08)] p-4 rounded-lg">
            <h3 className="text-[#B0E8E3] text-lg mb-4">Workout Calendar</h3>

            {/* Loading state */}
            {loadingSessions && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 text-[#00C4B4] animate-spin"/>
                  <p className="mt-4 text-[#A4B1B7]">Loading workout history...</p>
                </div>
            )}

            {/* Error state */}
            {sessionsError && !loadingSessions && (
                <div className="bg-red-500 bg-opacity-20 text-red-300 p-4 rounded-lg">
                  <p>{sessionsError.message || 'Failed to load workout history'}</p>
                </div>
            )}

            {/* Empty state */}
            {!loadingSessions && !sessionsError && !sessions.length && (
                <div className="text-center py-12">
                  <p className="text-[#A4B1B7]">No workout history available.</p>
                  <p className="text-[#A4B1B7] mt-2">Complete workouts to see them on your calendar.</p>
                </div>
            )}

            {/* Calendar */}
            {!loadingSessions && !sessionsError && sessions.length > 0 && (
                <>
                  <div className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="p-3 pointer-events-auto bg-[#020D0C] text-white rounded-md"
                        modifiers={{
                          strength: (date) => getWorkoutType(date) === WORKOUT_TYPES.STRENGTH,
                          cardio: (date) => getWorkoutType(date) === WORKOUT_TYPES.CARDIO,
                          flexibility: (date) => getWorkoutType(date) === WORKOUT_TYPES.FLEXIBILITY,
                        }}
                        modifiersStyles={{
                          strength: {backgroundColor: '#FFDEE2', color: '#020D0C', fontWeight: 'bold'}, // Soft pink for strength
                          cardio: {backgroundColor: '#F2FCE2', color: '#020D0C', fontWeight: 'bold'},   // Soft green for cardio
                          flexibility: {backgroundColor: '#E2F0FF', color: '#020D0C', fontWeight: 'bold'} // Soft blue for flexibility
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
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#E2F0FF] mr-2"></div>
                      <span className="text-[#A4B1B7]">Flexibility</span>
                    </div>
                  </div>

                  {/* Selected date details */}
                  {date && (
                      <div className="mt-6 bg-[rgba(176,232,227,0.12)] p-4 rounded-lg">
                        <h4 className="text-[#B0E8E3] font-medium mb-2">
                          {format(date, 'MMMM d, yyyy')}
                        </h4>

                        {/* Find workouts on selected date */}
                        {(() => {
                          const selectedDateStr = format(date, 'yyyy-MM-dd');
                          const workoutsOnDate = sessions.filter(session => {
                            const sessionDate = format(new Date(session.created_at), 'yyyy-MM-dd');
                            return sessionDate === selectedDateStr;
                          });

                          if (workoutsOnDate.length === 0) {
                            return (
                                <p className="text-[#A4B1B7] text-sm">No workouts on this date.</p>
                            );
                          }

                          return (
                              <div className="space-y-2">
                                {workoutsOnDate.map(workout => (
                                    <div key={workout.id} className="text-sm">
                                      <p className="text-[#A4B1B7]">
                                <span className="text-[#00C4B4] font-medium">
                                  {workout.workout_plan_id?.includes('cardio')
                                      ? 'Cardio'
                                      : workout.workout_plan_id?.includes('flexibility')
                                          ? 'Flexibility'
                                          : 'Strength'} Workout
                                </span>
                                        {' • '}
                                        {format(new Date(workout.created_at), 'h:mm a')}
                                      </p>
                                      {workout.notes && (
                                          <p className="text-[#A4B1B7] italic">"{workout.notes}"</p>
                                      )}
                                    </div>
                                ))}
                              </div>
                          );
                        })()}
                      </div>
                  )}
                </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default TrendsPage;
