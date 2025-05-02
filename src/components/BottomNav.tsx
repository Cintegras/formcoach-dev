
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Activity, TrendingUp, UserRound } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/workout-category-select', label: 'Workout', icon: Activity },
    { path: '/trends', label: 'Trends', icon: TrendingUp },
    { path: '/profile', label: 'Profile', icon: UserRound },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#020D0C] border-t border-[#1C1C1E] px-4 py-2">
      <div className="max-w-[375px] mx-auto flex justify-between items-center">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center p-2 w-16"
          >
            <item.icon
              size={24}
              className={`mb-1 ${
                isActive(item.path) ? 'text-[#00C4B4]' : 'text-[#A4B1B7]'
              }`}
            />
            <span
              className={`text-xs ${
                isActive(item.path) ? 'text-[#00C4B4]' : 'text-[#A4B1B7]'
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
