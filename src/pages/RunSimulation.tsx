
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, Square, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LogConsole from "@/components/LogConsole";

interface LogEntry {
  timestamp: string;
  agent: "Red" | "Blue" | "System";
  action: string;
  outcome: string;
}

const RunSimulation = () => {
  const { toast } = useToast();
  const [selectedScenario, setSelectedScenario] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sample scenarios (would normally come from saved configurations)
  const scenarios = [
    "Hospital Network Security Assessment",
    "Emergency Response System Test",
    "Patient Data Protection Scenario",
    "Medical Device Network Penetration Test",
    "Pharmacy System Security Evaluation"
  ];

  // Sample log data for simulation
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

  const startSimulation = () => {
    if (!selectedScenario) {
      toast({
        title: "Scenario Required",
        description: "Please select a scenario before running the simulation",
        variant: "destructive",
      });
      return;
    }

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Run Simulation</h1>
        <p className="text-gray-600 mt-2">Execute adversarial AI simulations against your infrastructure</p>
      </div>

      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Simulation Configuration</CardTitle>
          <CardDescription>Select and configure your simulation scenario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Scenario</label>
              <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a simulation scenario" />
                </SelectTrigger>
                <SelectContent>
                  {scenarios.map((scenario) => (
                    <SelectItem key={scenario} value={scenario}>
                      {scenario}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant={isRunning ? "default" : "secondary"}>
                  {isRunning ? "Running" : "Ready"}
                </Badge>
                {selectedScenario && (
                  <span className="text-sm text-gray-600">
                    {selectedScenario}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={startSimulation} 
              disabled={isRunning || !selectedScenario}
              size="lg"
              className="flex-1 md:flex-none"
            >
              <Play className="h-5 w-5 mr-2" />
              {isRunning ? "Simulation Running..." : "Run Simulation"}
            </Button>
            
            <Button 
              onClick={stopSimulation} 
              disabled={!isRunning}
              variant="destructive"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
            
            <Button 
              onClick={resetSimulation} 
              disabled={isRunning}
              variant="outline"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Log Console */}
      <LogConsole logs={logs} isRunning={isRunning} />
    </div>
  );
};

export default RunSimulation;
