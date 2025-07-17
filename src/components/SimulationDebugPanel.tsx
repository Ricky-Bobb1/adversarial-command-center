import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { SimulationStatus } from "@/types/simulation";

interface SimulationDebugPanelProps {
  simulationId: string | null;
  status: SimulationStatus | null;
  error: string | null;
  isRunning: boolean;
  logs: any[];
}

export const SimulationDebugPanel = ({ 
  simulationId, 
  status, 
  error, 
  isRunning, 
  logs 
}: SimulationDebugPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'running':
      case 'in_progress':
        return 'bg-blue-500';
      case 'completed':
      case 'finished':
      case 'success':
        return 'bg-green-500';
      case 'failed':
      case 'error':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <Card className="border-dashed border-gray-300">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50">
            <CardTitle className="flex items-center gap-2 text-sm">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Debug Panel
              <Badge variant="outline" className="text-xs">
                Development Only
              </Badge>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            {/* Simulation Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Simulation ID</label>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {simulationId || 'None'}
                  </code>
                  {simulationId && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => copyToClipboard(simulationId)}
                      className="h-6 px-2 text-xs"
                    >
                      Copy
                    </Button>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-500">Running State</label>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <span className="text-xs">{isRunning ? 'Running' : 'Stopped'}</span>
                </div>
              </div>
            </div>

            {/* API Status */}
            {status && (
              <div>
                <label className="text-xs font-medium text-gray-500">API Status Response</label>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(status.status)}`} />
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {status.status || 'Unknown'}
                  </code>
                  {status.progress && (
                    <span className="text-xs text-gray-500">({status.progress}%)</span>
                  )}
                </div>
                {status.message && (
                  <p className="text-xs text-gray-600 mt-1">{status.message}</p>
                )}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div>
                <label className="text-xs font-medium text-gray-500">Error</label>
                <div className="bg-red-50 border border-red-200 rounded p-2">
                  <code className="text-xs text-red-700">{error}</code>
                </div>
              </div>
            )}

            {/* Logs Section */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500">
                  Logs ({logs.length} entries)
                </label>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setShowLogs(!showLogs)}
                  className="h-6 px-2 text-xs"
                >
                  {showLogs ? 'Hide' : 'Show'}
                </Button>
              </div>
              
              {showLogs && (
                <div className="bg-gray-50 border rounded p-2 max-h-40 overflow-y-auto">
                  {logs.length === 0 ? (
                    <p className="text-xs text-gray-500">No logs available</p>
                  ) : (
                    logs.slice(-10).map((log, index) => (
                      <div key={index} className="text-xs mb-1">
                        <span className="text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                        {' '}
                        <span className="font-medium">{log.agent}:</span>
                        {' '}
                        <span>{log.action}</span>
                        {log.outcome !== 'No outcome specified' && (
                          <span className="text-gray-600"> → {log.outcome}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => console.log('Current simulation state:', { simulationId, status, error, isRunning, logs })}
                className="text-xs"
              >
                Log State to Console
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => window.open('/api/v1/simulations', '_blank')}
                className="text-xs"
              >
                Open API Docs
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};