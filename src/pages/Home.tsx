import React, {useEffect, useState} from 'react';
import {format} from 'date-fns';
import {useNavigate} from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import PrimaryButton from '@/components/PrimaryButton';
import {Activity, Calendar, Clock, TrendingUp} from 'lucide-react';
import {useWorkoutSessions} from '@/hooks/useWorkoutSessions';
import {useProgressMetrics} from '@/hooks/useProgressMetrics';
import {useProfile} from '@/hooks/useProfile';
import {safeParseDate} from '@/utils/dateUtils';

const Home = () => {
  const navigate = useNavigate();
  const today = new Date();
  const formattedDate = format(today, 'EEEE, MMMM d, yyyy');
  const [firstName, setFirstName] = useState('');

    // Use hooks for workout data and progress metrics
    const {sessions, activeSession, loading: sessionsLoading} = useWorkoutSessions(5);
    const {metrics, loading: metricsLoading} = useProgressMetrics();
    const {profile, loading: profileLoading} = useProfile();
    const [weightData, setWeightData] = useState<{ value: number | null }>({value: null});

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      setFirstName(user.firstName || '');
    } else {
      // If no user data, check if we need to redirect to profile setup
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        navigate('/profile-setup');
      }
    }
  }, [navigate]);

    // Get weight from latest progress metric
    useEffect(() => {
        if (metrics && metrics.length > 0) {
            // Find the latest weight metric
            const weightMetrics = metrics
                .filter(metric => metric.metric_type === 'weight')
                .sort((a, b) => {
                    const dateA = new Date(a.recorded_date || a.created_at || '');
                    const dateB = new Date(b.recorded_date || b.created_at || '');
                    return dateB.getTime() - dateA.getTime();
                });

            if (weightMetrics.length > 0) {
                setWeightData({value: weightMetrics[0].metric_value});
            }
        }
    }, [metrics]);

    // Calculate workout stats
    const totalWorkouts = sessions.length;
    const lastWorkoutDate = sessions.length > 0 ? safeParseDate(sessions[0].created_at) : null;
    const lastWorkoutFormatted = lastWorkoutDate ? format(lastWorkoutDate, 'MMM d, yyyy') : 'No workouts yet';

    // Check if there's an active session
    const hasActiveSession = activeSession !== null;

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center mt-8">
        <div className="flex items-center mb-6">
          <Calendar size={24} className="text-[#00C4B4] mr-2" />
          <h2 className="text-lg font-medium text-[#A4B1B7]">{formattedDate}</h2>
        </div>

          <div className="w-full max-w-[300px] mx-auto mt-8 text-center">
          <h1 className="font-bold text-[32px] text-[#B0E8E3] mb-3">
            {firstName ? `Welcome, ${firstName}!` : 'Welcome Back'}
          </h1>
              <p className="text-[#A4B1B7] mb-6">Ready for your workout today?</p>

              {hasActiveSession ? (
                  <PrimaryButton
                      onClick={() => navigate('/workout-tracking')}
                      className="w-full py-4 text-lg"
                  >
                      Continue Workout
                  </PrimaryButton>
              ) : (
                  <PrimaryButton
                      onClick={() => navigate('/workout-category-select')}
                      className="w-full py-4 text-lg"
                  >
                      Start Workout
                  </PrimaryButton>
              )}
          </div>

          {/* Workout Summary Section */}
          <div className="mt-8 bg-[rgba(176,232,227,0.12)] rounded-lg w-full max-w-[300px] p-4">
              <h3 className="text-[#B0E8E3] font-medium mb-3 flex items-center">
                  <Activity size={18} className="mr-2"/>
                  Workout Summary
              </h3>

              {sessionsLoading ? (
                  <p className="text-[#A4B1B7] text-sm">Loading workout data...</p>
              ) : (
                  <div className="space-y-2">
                      <div className="flex justify-between">
                          <p className="text-[#A4B1B7] text-sm">Total Workouts:</p>
                          <p className="text-[#B0E8E3] text-sm font-medium">{totalWorkouts}</p>
                      </div>
                      <div className="flex justify-between">
                          <p className="text-[#A4B1B7] text-sm">Last Workout:</p>
                          <p className="text-[#B0E8E3] text-sm font-medium">{lastWorkoutFormatted}</p>
                      </div>
                      {hasActiveSession && (
                          <div className="flex justify-between">
                              <p className="text-[#A4B1B7] text-sm">Active Session:</p>
                              <p className="text-[#00C4B4] text-sm font-medium">In Progress</p>
                          </div>
                      )}
                  </div>
              )}
          </div>

          {/* Progress Metrics Section */}
          <div className="mt-4 bg-[rgba(176,232,227,0.12)] rounded-lg w-full max-w-[300px] p-4">
              <h3 className="text-[#B0E8E3] font-medium mb-3 flex items-center">
                  <TrendingUp size={18} className="mr-2"/>
                  Progress Metrics
              </h3>

              {metricsLoading || profileLoading ? (
                  <p className="text-[#A4B1B7] text-sm">Loading metrics...</p>
              ) : (
                  <div className="space-y-2">
                      {weightData.value ? (
                          <div className="flex justify-between">
                              <p className="text-[#A4B1B7] text-sm">Current Weight:</p>
                              <p className="text-[#B0E8E3] text-sm font-medium">{weightData.value} lbs</p>
                          </div>
                      ) : (
                          <p className="text-[#A4B1B7] text-sm">No weight data recorded</p>
                      )}
                      <div className="flex justify-between">
                          <p className="text-[#A4B1B7] text-sm">Metrics Tracked:</p>
                          <p className="text-[#B0E8E3] text-sm font-medium">{metrics.length}</p>
                      </div>
                      <button
                          onClick={() => navigate('/trends')}
                          className="text-[#00C4B4] text-sm font-medium mt-1 flex items-center"
                      >
                          View All Metrics
                      </button>
                  </div>
              )}
        </div>

          {/* Quick Tips Section */}
          <div className="mt-4 bg-[rgba(176,232,227,0.12)] rounded-lg w-full max-w-[300px] p-4 mb-8">
              <h3 className="text-[#B0E8E3] font-medium mb-2 flex items-center">
                  <Clock size={18} className="mr-2"/>
                  Quick Tips
              </h3>
          <ul className="text-[#A4B1B7] text-sm">
            <li className="mb-2">• Drink plenty of water before and after your workout</li>
            <li className="mb-2">• Warm up properly to prevent injuries</li>
            <li>• Track your progress in the Trends section</li>
          </ul>
        </div>
      </div>
    </PageContainer>
  );
};

export default Home;
