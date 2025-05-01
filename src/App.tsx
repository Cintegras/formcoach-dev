
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Welcome from "./pages/Welcome";
import MedicalDisclaimer from "./pages/MedicalDisclaimer";
import LogWorkout from "./pages/LogWorkout";
import WorkoutPlan from "./pages/WorkoutPlan";
import CardioWarmUp from "./pages/CardioWarmUp";
import WorkoutReview from "./pages/WorkoutReview";
import NotFound from "./pages/NotFound";

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
            <Routes>
              {/* Splash */}
              <Route path="/" element={<Splash />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Onboarding Routes */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/medical-disclaimer" element={<MedicalDisclaimer />} />
              
              {/* Workout Routes */}
              <Route path="/workout-plan" element={<WorkoutPlan />} />
              <Route path="/cardio-warmup" element={<CardioWarmUp />} />
              <Route path="/workout-tracking/:exercise" element={<LogWorkout />} />
              <Route path="/workout-review" element={<WorkoutReview />} />
              
              {/* Catch-all 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
