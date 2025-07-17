import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { simulationService } from '@/services/simulationService';
import { environment } from '@/utils/environment';
import { logger } from '@/utils/logger';
import type { SimulationStatus, CreateSimulationRequest } from '@/types/simulation';

interface LogEntry {
  timestamp: string;
  agent: "Red" | "Blue" | "System";
  action: string;
  outcome: string;
  id?: string;
}

interface UseRealTimeSimulationReturn {
  isRunning: boolean;
  logs: LogEntry[];
  simulationId: string | null;
  status: SimulationStatus | null;
  error: string | null;
  startSimulation: (scenario: string, config?: any) => Promise<void>;
  stopSimulation: () => Promise<void>;
  resetSimulation: () => void;
}

export const useRealTimeSimulation = (): UseRealTimeSimulationReturn => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [simulationId, setSimulationId] = useState<string | null>(null);
  const [status, setStatus] = useState<SimulationStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const statusPollingRef = useRef<NodeJS.Timeout | null>(null);
  const logsPollingRef = useRef<NodeJS.Timeout | null>(null);
  const isComponentMounted = useRef(true);

  // Poll simulation status
  const pollStatus = useCallback(async (id: string) => {
    if (!isComponentMounted.current) return;
    
    try {
      const statusResponse = await simulationService.getSimulationStatus(id);
      
      if (!isComponentMounted.current) return;
      
      setStatus(statusResponse);
      
      // Update running state based on status
      const isCurrentlyRunning = statusResponse.status === 'running';
      setIsRunning(isCurrentlyRunning);
      
      // If simulation completed or failed, stop polling
      if (statusResponse.status === 'completed' || statusResponse.status === 'failed') {
        if (statusPollingRef.current) {
          clearInterval(statusPollingRef.current);
          statusPollingRef.current = null;
        }
        
        toast({
          title: statusResponse.status === 'completed' ? 'Simulation Completed' : 'Simulation Failed',
          description: statusResponse.status === 'completed' 
            ? 'The simulation has finished successfully'
            : 'The simulation encountered an error',
          variant: statusResponse.status === 'completed' ? 'default' : 'destructive',
        });
      }
    } catch (error: any) {
      logger.error('Failed to poll simulation status', 'useRealTimeSimulation', error);
      setError(`Status polling failed: ${error.message}`);
    }
  }, [toast]);

  // Poll simulation logs
  const pollLogs = useCallback(async (id: string) => {
    if (!isComponentMounted.current) return;
    
    try {
      const logsResponse = await simulationService.getSimulationLogs(id);
      
      if (!isComponentMounted.current) return;
      
      // Transform logs to match our interface
      const transformedLogs: LogEntry[] = logsResponse.map((log: any, index: number) => ({
        id: log.id || `log-${Date.now()}-${index}`,
        timestamp: log.timestamp || new Date().toISOString(),
        agent: log.agent || 'System',
        action: log.action || log.message || 'Unknown action',
        outcome: log.outcome || log.result || 'No outcome specified',
      }));
      
      setLogs(transformedLogs);
    } catch (error: any) {
      logger.error('Failed to poll simulation logs', 'useRealTimeSimulation', error);
      // Don't set error state for logs polling failures as they're less critical
    }
  }, []);

  // Start simulation
  const startSimulation = useCallback(async (scenario: string, config?: any) => {
    if (!scenario) {
      toast({
        title: 'Scenario Required',
        description: 'Please select a scenario before starting the simulation',
        variant: 'destructive',
      });
      return;
    }

    try {
      setError(null);
      setLogs([]);
      
      // Create simulation request
      const request: CreateSimulationRequest = {
        scenario,
        config: config || {},
      };
      
      // If using mock API, fall back to legacy behavior
      if (environment.enableMockApi) {
        setIsRunning(true);
        setSimulationId(`mock-${Date.now()}`);
        toast({
          title: 'Simulation Started (Mock Mode)',
          description: `Running scenario: ${scenario}`,
        });
        return;
      }
      
      // Create simulation via real API
      const response = await simulationService.createSimulation(request);
      const newSimulationId = response.id || (response as any).simulation_id;
      
      if (!newSimulationId) {
        throw new Error('No simulation ID returned from API');
      }
      
      setSimulationId(newSimulationId);
      
      // Start the simulation
      await simulationService.startSimulation(newSimulationId);
      
      setIsRunning(true);
      
      // Start polling for status and logs
      statusPollingRef.current = setInterval(() => {
        pollStatus(newSimulationId);
      }, 2000); // Poll every 2 seconds
      
      logsPollingRef.current = setInterval(() => {
        pollLogs(newSimulationId);
      }, 1000); // Poll logs more frequently
      
      toast({
        title: 'Simulation Started',
        description: `Running scenario: ${scenario}`,
      });
      
    } catch (error: any) {
      logger.error('Failed to start simulation', 'useRealTimeSimulation', error);
      setError(`Failed to start simulation: ${error.message}`);
      setIsRunning(false);
      
      toast({
        title: 'Failed to Start Simulation',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [toast, pollStatus, pollLogs]);

  // Stop simulation
  const stopSimulation = useCallback(async () => {
    if (!simulationId) return;
    
    try {
      if (!environment.enableMockApi) {
        await simulationService.stopSimulation(simulationId);
      }
      
      setIsRunning(false);
      
      // Clear polling intervals
      if (statusPollingRef.current) {
        clearInterval(statusPollingRef.current);
        statusPollingRef.current = null;
      }
      
      if (logsPollingRef.current) {
        clearInterval(logsPollingRef.current);
        logsPollingRef.current = null;
      }
      
      toast({
        title: 'Simulation Stopped',
        description: 'The simulation has been manually stopped',
        variant: 'destructive',
      });
      
    } catch (error: any) {
      logger.error('Failed to stop simulation', 'useRealTimeSimulation', error);
      setError(`Failed to stop simulation: ${error.message}`);
      
      toast({
        title: 'Failed to Stop Simulation',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [simulationId, toast]);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setLogs([]);
    setSimulationId(null);
    setStatus(null);
    setError(null);
    
    // Clear all polling intervals
    if (statusPollingRef.current) {
      clearInterval(statusPollingRef.current);
      statusPollingRef.current = null;
    }
    
    if (logsPollingRef.current) {
      clearInterval(logsPollingRef.current);
      logsPollingRef.current = null;
    }
    
    toast({
      title: 'Simulation Reset',
      description: 'Ready to run a new simulation',
    });
  }, [toast]);

  // Cleanup on unmount
  useEffect(() => {
    isComponentMounted.current = true;
    
    return () => {
      isComponentMounted.current = false;
      
      if (statusPollingRef.current) {
        clearInterval(statusPollingRef.current);
      }
      
      if (logsPollingRef.current) {
        clearInterval(logsPollingRef.current);
      }
    };
  }, []);

  return {
    isRunning,
    logs,
    simulationId,
    status,
    error,
    startSimulation,
    stopSimulation,
    resetSimulation,
  };
};