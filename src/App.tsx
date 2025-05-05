import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from '@/features/auth/components/AuthProvider';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import WorkoutCategorySelect from './pages/WorkoutCategorySelect';
import ExerciseSelect from './pages/ExerciseSelect';
import WorkoutTracking from './pages/WorkoutTracking';
import Trends from './pages/Trends';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-category-select"
            element={
              <ProtectedRoute>
                <WorkoutCategorySelect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exercise-select/:categoryId"
            element={
              <ProtectedRoute>
                <ExerciseSelect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-tracking"
            element={
              <ProtectedRoute>
                <WorkoutTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trends"
            element={
              <ProtectedRoute>
                <Trends />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify"
            element={<VerifyEmail />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
