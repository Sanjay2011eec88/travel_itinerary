import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import Landing from "./pages/Landing";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import PlanTrip from "./pages/PlanTrip";
import TripDetail from "./pages/TripDetail";
import SharedTrip from "./pages/SharedTrip";
import Settings from "./pages/Settings";
import Destinations from "./pages/Destinations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Theme wrapper component to apply dark mode
function AppContent() {
  useTheme(); // This will apply dark mode based on user profile
  
  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/plan" element={<PlanTrip />} />
          <Route path="/trip/:id" element={<TripDetail />} />
          <Route path="/shared/:shareToken" element={<SharedTrip />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;