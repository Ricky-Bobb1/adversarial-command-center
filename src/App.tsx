
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { SettingsProvider } from "@/contexts/SettingsContext";
import AppLayout from "@/components/AppLayout";
import Index from "@/pages/Index";
import Setup from "@/pages/Setup";
import Agents from "@/pages/Agents";
import RunSimulation from "@/pages/RunSimulation";
import Results from "@/pages/Results";
import Logs from "@/pages/Logs";
import Settings from "@/pages/Settings";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <SettingsProvider>
          <Router>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/setup" element={<Setup />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/run" element={<RunSimulation />} />
                <Route path="/results" element={<Results />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </Router>
        </SettingsProvider>
      </ThemeProvider>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
