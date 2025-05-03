import React from "react";
import {Toaster} from "@/components/ui/toaster";
import {Toaster as Sonner} from "@/components/ui/sonner";
import {TooltipProvider} from "@/components/ui/tooltip";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {AuthProvider} from "./features/auth";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import Welcome from "./pages/Welcome";
import MedicalDisclaimer from "./pages/MedicalDisclaimer";
import LogWorkout from "./pages/LogWorkout";
import WorkoutPlan from "./pages/WorkoutPlan";
import WorkoutCategorySelect from "./pages/WorkoutCategorySelect";
import CardioTypeSelect from "./pages/CardioTypeSelect";
import WorkoutConfirmation from "./pages/WorkoutConfirmation";
import CardioWarmUp from "./pages/CardioWarmUp";
import WorkoutReview from "./pages/WorkoutReview";
import TrendsPage from "./pages/TrendsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  }
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
              <AuthProvider>
                  <Routes>
                      {/* Splash and Home */}
                      <Route path="/splash" element={<Splash/>}/>
                      <Route path="/" element={<Home/>}/>

                      {/* Auth Routes */}
                      <Route path="/login" element={<Login/>}/>
                      <Route path="/signup" element={<Signup/>}/>
                      <Route path="/forgot-password" element={<ForgotPassword/>}/>
                      <Route path="/profile-setup" element={<ProfileSetupPage/>}/>

                      {/* Onboarding Routes */}
                      <Route path="/welcome" element={<Welcome/>}/>
                      <Route path="/medical-disclaimer" element={<MedicalDisclaimer/>}/>

                      {/* Workout Routes */}
                      <Route path="/workout-category-select" element={<WorkoutCategorySelect/>}/>
                      <Route path="/cardio-type-select" element={<CardioTypeSelect/>}/>
                      <Route path="/workout-plan" element={<WorkoutPlan/>}/>
                      <Route path="/workout-confirmation" element={<WorkoutConfirmation/>}/>
                      <Route path="/cardio-warmup" element={<CardioWarmUp/>}/>
                      <Route path="/workout-tracking/:exercise" element={<LogWorkout/>}/>
                      <Route path="/workout-review" element={<WorkoutReview/>}/>

                      {/* Main App Routes */}
                      <Route path="/trends" element={<TrendsPage/>}/>
                      <Route path="/profile" element={<ProfilePage/>}/>

                      {/* Catch-all 404 page */}
                      <Route path="*" element={<NotFound/>}/>
                  </Routes>
              </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
