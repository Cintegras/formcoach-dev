
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from '@/features/auth/components/AuthProvider';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetupPage from './pages/ProfileSetupPage';
import WorkoutCategorySelect from './pages/WorkoutCategorySelect';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import WorkoutPlan from './pages/WorkoutPlan';
import WorkoutConfirmation from './pages/WorkoutConfirmation';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
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
                <ProfileSetupPage />
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
            path="/workout-plan"
            element={
              <ProtectedRoute>
                <WorkoutPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-confirmation"
            element={
              <ProtectedRoute>
                <WorkoutConfirmation />
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
