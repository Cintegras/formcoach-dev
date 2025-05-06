import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Activity, ChevronUp, ClipboardList, History, Home, Lock, TrendingUp, UserRound} from 'lucide-react';
import {useAuth} from '@/features/auth/hooks/useAuth';
import {useFeatureToggles} from '@/hooks/useFeatureToggles';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
    const {user, isAuthenticated} = useAuth();
    const {formCoachEnabled, workoutCount, checkFormCoachEnabled} = useFeatureToggles();
    const [showWorkoutMenu, setShowWorkoutMenu] = useState(false);
    const [trendsEnabled, setTrendsEnabled] = useState(false);

    // Check if trends feature is enabled
    useEffect(() => {
        if (isAuthenticated) {
            checkFormCoachEnabled().then(enabled => {
                setTrendsEnabled(enabled);
            });
        }
    }, [isAuthenticated, checkFormCoachEnabled]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

    // Check if any workout-related path is active
    const isWorkoutActive = () => {
        return (
            isActive('/workout-category-select') ||
            isActive('/workout-plan') ||
            isActive('/workout-plans') ||
            isActive('/workout-plan-editor') ||
            isActive('/workout-history')
        );
    };

    const toggleWorkoutMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowWorkoutMenu(!showWorkoutMenu);
    };

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => {
            if (showWorkoutMenu) {
                setShowWorkoutMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showWorkoutMenu]);

    // Base nav items (always shown)
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
      {
          path: '/workout-category-select',
          label: 'Workout',
          icon: Activity,
          onClick: isAuthenticated ? toggleWorkoutMenu : undefined
      },
      {
          path: trendsEnabled ? '/trends' : '/',
          label: 'Trends',
          icon: trendsEnabled ? TrendingUp : Lock,
          disabled: !trendsEnabled,
          onClick: (e: React.MouseEvent) => {
              if (!trendsEnabled) {
                  e.preventDefault();
                  e.stopPropagation();
                  // Show a toast or alert about needing 3 workouts
                  alert(`Complete ${3 - workoutCount} more workout${workoutCount >= 2 ? '' : 's'} to unlock Trends`);
                  return;
              }
              navigate('/trends');
          }
      },
    { path: '/profile', label: 'Profile', icon: UserRound },
  ];

    // Workout submenu items (only shown when authenticated and menu is open)
    const workoutSubItems = [
        {path: '/workout-category-select', label: 'Start Workout', icon: Activity},
        {path: '/workout-plans', label: 'Workout Plans', icon: ClipboardList},
        {path: '/workout-history', label: 'History', icon: History},
    ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#020D0C] border-t border-[#1C1C1E] px-4 py-2">
        {/* Workout submenu (only shown when authenticated and menu is open) */}
        {isAuthenticated && showWorkoutMenu && (
            <div
                className="absolute bottom-full left-0 right-0 bg-[#020D0C] border-t border-[#1C1C1E] px-4 py-2 shadow-lg">
                <div className="max-w-[375px] mx-auto space-y-2">
                    {workoutSubItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => {
                                navigate(item.path);
                                setShowWorkoutMenu(false);
                            }}
                            className={`flex items-center w-full p-3 rounded-lg ${
                                isActive(item.path)
                                    ? 'bg-[rgba(176,232,227,0.12)] text-[#00C4B4]'
                                    : 'text-[#A4B1B7] hover:bg-[rgba(176,232,227,0.08)]'
                            }`}
                        >
                            <item.icon size={20} className="mr-3"/>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Main navigation */}
      <div className="max-w-[375px] mx-auto flex justify-between items-center">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={(e) => {
                if (item.onClick) {
                    item.onClick(e);
                } else {
                    navigate(item.path);
                }
            }}
            className="flex flex-col items-center justify-center p-2 w-16 relative"
          >
              {item.label === 'Workout' && showWorkoutMenu && (
                  <ChevronUp
                      size={16}
                      className="absolute -top-1 text-[#00C4B4]"
                  />
              )}
            <item.icon
              size={24}
              className={`mb-1 ${
                  item.label === 'Workout'
                      ? isWorkoutActive() || showWorkoutMenu ? 'text-[#00C4B4]' : 'text-[#A4B1B7]'
                      : item.label === 'Trends' && item.disabled
                          ? 'text-[#A4B1B7] opacity-50'
                          : isActive(item.path) ? 'text-[#00C4B4]' : 'text-[#A4B1B7]'
              }`}
            />
            <span
              className={`text-xs ${
                  item.label === 'Workout'
                      ? isWorkoutActive() || showWorkoutMenu ? 'text-[#00C4B4]' : 'text-[#A4B1B7]'
                      : item.label === 'Trends' && item.disabled
                          ? 'text-[#A4B1B7] opacity-50'
                          : isActive(item.path) ? 'text-[#00C4B4]' : 'text-[#A4B1B7]'
              }`}
            >
              {item.label}
                {item.label === 'Trends' && item.disabled && (
                    <span className="text-[10px] block">({3 - workoutCount} more)</span>
                )}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
