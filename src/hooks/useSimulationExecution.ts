
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { postToMockApi, mockApiEndpoints } from "@/utils/mockApi";

interface LogEntry {
  timestamp: string;
  agent: "Red" | "Blue" | "System";
  action: string;
  outcome: string;
}

const sampleLogs: Omit<LogEntry, 'timestamp'>[] = [
  { agent: "System", action: "Simulation initialized", outcome: "Ready" },
  { agent: "Red", action: "Network reconnaissance", outcome: "Discovered 15 active hosts" },
  { agent: "Blue", action: "Anomaly detection activated", outcome: "Monitoring network traffic" },
  { agent: "Red", action: "Port scanning target", outcome: "Found open ports 22, 80, 443" },
  { agent: "Blue", action: "Port scan detected", outcome: "Alert triggered" },
  { agent: "Red", action: "SQL injection attempt", outcome: "Vulnerability exploited" },
  { agent: "Blue", action: "Database monitoring", outcome: "Suspicious queries detected" },
  { agent: "Red", action: "Privilege escalation", outcome: "Admin access gained" },
  { agent: "Blue", action: "User behavior analysis", outcome: "Unusual activity flagged" },
  { agent: "Red", action: "Data exfiltration", outcome: "Patient records accessed" },
  { agent: "Blue", action: "Data loss prevention", outcome: "Transfer blocked" },
  { agent: "Red", action: "Lateral movement", outcome: "Accessed medical devices" },
  { agent: "Blue", action: "Network segmentation", outcome: "Critical systems isolated" },
  { agent: "System", action: "Simulation completed", outcome: "Report generated" }
];

export const useSimulationExecution = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSimulation = async (selectedScenario: string) => {
    if (!selectedScenario) {
      toast({
        title: "Scenario Required",
        description: "Please select a scenario before running the simulation",
        variant: "destructive",
      });
      return;
    }

    try {
      // Post simulation request to mock API
      await postToMockApi(mockApiEndpoints.runSimulation, {
        scenario: selectedScenario,
        timestamp: new Date().toISOString()
      });

      setIsRunning(true);
      setLogs([]);
      
      toast({
        title: "Simulation Started",
        description: `Running scenario: ${selectedScenario}`,
      });

      // Simulate streaming logs
      let logIndex = 0;
      intervalRef.current = setInterval(() => {
        if (logIndex < sampleLogs.length) {
          const newLog: LogEntry = {
            ...sampleLogs[logIndex],
            timestamp: new Date().toLocaleTimeString()
          };
          
          setLogs(prevLogs => [...prevLogs, newLog]);
          logIndex++;
        } else {
          // Simulation complete
          setIsRunning(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          toast({
            title: "Simulation Complete",
            description: "The adversarial simulation has finished successfully",
          });
        }
      }, 1500); // Add a new log every 1.5 seconds
    } catch (error) {
      toast({
        title: "Failed to Start Simulation",
        description: "Could not start the simulation",
        variant: "destructive",
      });
    }
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    toast({
      title: "Simulation Stopped",
      description: "The simulation has been manually stopped",
      variant: "destructive",
    });
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setLogs([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    toast({
      title: "Simulation Reset",
      description: "Ready to run a new simulation",
    });
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isRunning,
    logs,
    startSimulation,
    stopSimulation,
    resetSimulation
  };
};
