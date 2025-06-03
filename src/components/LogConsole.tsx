
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

interface LogEntry {
  timestamp: string;
  agent: "Red" | "Blue" | "System";
  action: string;
  outcome: string;
}

interface LogConsoleProps {
  logs: LogEntry[];
  isRunning: boolean;
}

const LogConsole = ({ logs, isRunning }: LogConsoleProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs]);

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case "Red":
        return "bg-red-100 text-red-800 border-red-200";
      case "Blue":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "System":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getOutcomeColor = (outcome: string, agent: string) => {
    // Determine if outcome is positive or negative based on context
    const positiveKeywords = ["blocked", "detected", "prevented", "isolated", "ready", "complete"];
    const negativeKeywords = ["exploited", "gained", "accessed", "compromised"];
    
    const isPositive = positiveKeywords.some(keyword => 
      outcome.toLowerCase().includes(keyword)
    );
    const isNegative = negativeKeywords.some(keyword => 
      outcome.toLowerCase().includes(keyword)
    );

    if (agent === "Red" && isNegative) {
      return "text-red-600";
    } else if (agent === "Blue" && isPositive) {
      return "text-green-600";
    } else if (agent === "System") {
      return "text-gray-600";
    }
    return "text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Live Simulation Console</CardTitle>
            <CardDescription>Real-time log output from the running simulation</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isRunning && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 font-medium">Live</span>
              </div>
            )}
            <Badge variant="outline">
              {logs.length} entries
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-900 rounded-lg p-4 min-h-[400px]">
          <ScrollArea className="h-[400px]" ref={scrollAreaRef}>
            <div className="space-y-2 font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-400 text-center py-8">
                  No simulation logs yet. Start a simulation to see live output.
                </div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 hover:bg-gray-800 rounded">
                    <span className="text-gray-400 text-xs min-w-[80px]">
                      {log.timestamp}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`min-w-[80px] justify-center text-xs ${getAgentColor(log.agent)}`}
                    >
                      {log.agent}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-xs mb-1">
                        {log.action}
                      </div>
                      <div className={`text-xs ${getOutcomeColor(log.outcome, log.agent)}`}>
                        → {log.outcome}
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isRunning && (
                <div className="flex items-center gap-2 p-2 text-gray-400 text-xs">
                  <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Simulation in progress...</span>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogConsole;
