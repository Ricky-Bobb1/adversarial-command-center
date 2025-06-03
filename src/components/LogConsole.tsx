
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AgentBadge } from "@/components/ui/agent-badge";
import { LiveIndicator } from "@/components/ui/live-indicator";
import { useEffect, useRef } from "react";
import { OUTCOME_INDICATORS } from "@/constants/simulation";
import { SimulationLogic } from "@/services/simulationLogic";
import type { LogEntry, AgentType } from "@/types/simulation";

interface LogConsoleProps {
  logs: LogEntry[];
  isRunning: boolean;
}

const LogConsole = ({ logs, isRunning }: LogConsoleProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [logs]);

  const getOutcomeColor = (outcome: string, agent: AgentType): string => {
    if (SimulationLogic.isOutcomePositive(outcome, agent)) {
      return agent === "Red" ? "text-red-600" : "text-green-600";
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
            <LiveIndicator isLive={isRunning} />
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
                    <AgentBadge agent={log.agent} />
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
