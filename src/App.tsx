
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashScreen from "./pages/SplashScreen";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Disclaimer from "./pages/Disclaimer";
import ProfileComplete from "./pages/ProfileComplete";
import MachineSelection from "./pages/MachineSelection";
import StartWorkout from "./pages/StartWorkout";
import LogWorkout from "./pages/LogWorkout";
import WorkoutSummary from "./pages/WorkoutSummary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/index" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/profile-complete" element={<ProfileComplete />} />
          <Route path="/machine-selection" element={<MachineSelection />} />
          <Route path="/start-workout" element={<StartWorkout />} />
          <Route path="/workout-tracking/:exercise" element={<LogWorkout />} />
          <Route path="/workout-review" element={<WorkoutSummary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
