import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import ServiceSelection from "./pages/ServiceSelection";
import Dashboard from "./pages/Dashboard";
import ProviderWizard from "./pages/ProviderWizard";
import ProfilePreview from "./pages/ProfilePreview";
import PublicProfile from "./pages/PublicProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient(); // Query client for React Query

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/p/:slug" element={<PublicProfile />} />
          <Route path="/service-selection" element={
            <ProtectedRoute><ServiceSelection /></ProtectedRoute>
          } />
          <Route path="/provider-wizard" element={
            <ProtectedRoute><ProviderWizard /></ProtectedRoute>
          } />
          <Route path="/profile-preview" element={
            <ProtectedRoute><ProfilePreview /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
