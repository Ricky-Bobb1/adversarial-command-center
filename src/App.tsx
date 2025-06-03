
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Setup from "./pages/Setup";
import Agents from "./pages/Agents";
import RunSimulation from "./pages/RunSimulation";
import Results from "./pages/Results";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
              <Route path="/setup" element={<AppLayout><Setup /></AppLayout>} />
              <Route path="/agents" element={<AppLayout><Agents /></AppLayout>} />
              <Route path="/run" element={<AppLayout><RunSimulation /></AppLayout>} />
              <Route path="/results" element={<AppLayout><Results /></AppLayout>} />
              <Route path="/logs" element={<AppLayout><Logs /></AppLayout>} />
              <Route path="/settings" element={<AppLayout><Settings /></AppLayout>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
