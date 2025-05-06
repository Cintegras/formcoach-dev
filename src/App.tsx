
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from '@/features/auth/components/AuthProvider';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import RequireProfile from '@/features/auth/components/RequireProfile';
import RedirectIfProfileExists from '@/features/auth/components/RedirectIfProfileExists';
import AdminRoute from '@/features/auth/components/AdminRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetupPage from './pages/ProfileSetupPage';
import ProfilePage from './pages/ProfilePage';
import WorkoutCategorySelect from './pages/WorkoutCategorySelect';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import WorkoutPlan from './pages/WorkoutPlan';
import WorkoutConfirmation from './pages/WorkoutConfirmation';
import MedicalDisclaimer from './pages/MedicalDisclaimer';
import Welcome from './pages/Welcome';
import TestOptionsPage from './pages/TestOptionsPage';

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
                  <RequireProfile>
                      <Home/>
                  </RequireProfile>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                  <RedirectIfProfileExists>
                      <ProfileSetupPage/>
                  </RedirectIfProfileExists>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-category-select"
            element={
              <ProtectedRoute>
                  <RequireProfile>
                      <WorkoutCategorySelect/>
                  </RequireProfile>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-plan"
            element={
              <ProtectedRoute>
                  <RequireProfile>
                      <WorkoutPlan/>
                  </RequireProfile>
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout-confirmation"
            element={
              <ProtectedRoute>
                  <RequireProfile>
                      <WorkoutConfirmation/>
                  </RequireProfile>
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify"
            element={<VerifyEmail />}
          />
            <Route
                path="/welcome"
                element={
                    <ProtectedRoute>
                        <RequireProfile>
                            <Welcome/>
                        </RequireProfile>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/medical-disclaimer"
                element={
                    <ProtectedRoute>
                        <RequireProfile>
                            <MedicalDisclaimer/>
                        </RequireProfile>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <RequireProfile>
                            <ProfilePage/>
                        </RequireProfile>
                    </ProtectedRoute>
                }
            />
            <Route
                path="/test-options"
                element={
                    <ProtectedRoute>
                        <RequireProfile>
                            <AdminRoute>
                                <TestOptionsPage/>
                            </AdminRoute>
                        </RequireProfile>
                    </ProtectedRoute>
                }
            />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
