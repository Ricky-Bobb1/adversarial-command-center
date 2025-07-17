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
  const pollingStartTime = useRef<number | null>(null);
  
  // Timeout after 5 minutes
  const POLLING_TIMEOUT_MS = 5 * 60 * 1000;

  // Poll simulation status
  const pollStatus = useCallback(async (id: string) => {
    if (!isComponentMounted.current) return;
    
    // Check for timeout
    if (pollingStartTime.current && Date.now() - pollingStartTime.current > POLLING_TIMEOUT_MS) {
      console.log('[DEBUG] Polling timeout reached, stopping polling');
      
      if (statusPollingRef.current) {
        clearInterval(statusPollingRef.current);
        statusPollingRef.current = null;
      }
      
      if (logsPollingRef.current) {
        clearInterval(logsPollingRef.current);
        logsPollingRef.current = null;
      }
      
      setIsRunning(false);
      setError('Simulation timeout - took longer than expected');
      
      toast({
        title: 'Simulation Timeout',
        description: 'The simulation may have completed but failed to return a status. Check the Results page manually.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      console.log(`[DEBUG] Polling status for simulation ${id}...`);
      const statusResponse = await simulationService.getSimulationStatus(id);
      console.log('[DEBUG] Status response:', statusResponse);
      
      if (!isComponentMounted.current) return;
      
      setStatus(statusResponse);
      
      // Handle different status formats from API
      const currentStatus = statusResponse.status || (statusResponse as any).state;
      console.log(`[DEBUG] Current status: ${currentStatus}`);
      
      // Update running state based on status - handle various status formats
      const isCurrentlyRunning = ['running', 'in_progress', 'pending'].includes(currentStatus);
      setIsRunning(isCurrentlyRunning);
      
      // If simulation completed or failed, stop polling
      if (['completed', 'failed', 'error', 'finished', 'success'].includes(currentStatus)) {
        console.log(`[DEBUG] Simulation finished with status: ${currentStatus}`);
        
        if (statusPollingRef.current) {
          clearInterval(statusPollingRef.current);
          statusPollingRef.current = null;
        }
        
        if (logsPollingRef.current) {
          clearInterval(logsPollingRef.current);
          logsPollingRef.current = null;
        }
        
        pollingStartTime.current = null;
        
        const isSuccess = ['completed', 'finished', 'success'].includes(currentStatus);
        
        toast({
          title: isSuccess ? 'Simulation Completed' : 'Simulation Failed',
          description: isSuccess
            ? 'The simulation has finished successfully'
            : `The simulation encountered an error: ${statusResponse.message || 'Unknown error'}`,
          variant: isSuccess ? 'default' : 'destructive',
        });
      }
    } catch (error: any) {
      console.error('[DEBUG] Status polling error:', error);
      logger.error('Failed to poll simulation status', 'useRealTimeSimulation', error);
      setError(`Status polling failed: ${error.message}`);
      
      // Show user-facing error
      toast({
        title: 'Status Check Failed',
        description: `Unable to check simulation status: ${error.message}`,
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Poll simulation logs
  const pollLogs = useCallback(async (id: string) => {
    if (!isComponentMounted.current) return;
    
    try {
      console.log(`[DEBUG] Polling logs for simulation ${id}...`);
      const logsResponse = await simulationService.getSimulationLogs(id);
      console.log('[DEBUG] Logs response:', logsResponse);
      
      if (!isComponentMounted.current) return;
      
      // Handle empty or null logs response
      if (!logsResponse || !Array.isArray(logsResponse)) {
        console.log('[DEBUG] No logs available or invalid format');
        return;
      }
      
      // Transform logs to match our interface
      const transformedLogs: LogEntry[] = logsResponse.map((log: any, index: number) => ({
        id: log.id || `log-${Date.now()}-${index}`,
        timestamp: log.timestamp || new Date().toISOString(),
        agent: log.agent || log.source || 'System',
        action: log.action || log.message || log.event || 'Unknown action',
        outcome: log.outcome || log.result || log.status || 'No outcome specified',
      }));
      
      console.log(`[DEBUG] Transformed ${transformedLogs.length} logs`);
      setLogs(transformedLogs);
    } catch (error: any) {
      console.error('[DEBUG] Logs polling error:', error);
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
      console.log('[DEBUG] Creating simulation with request:', request);
      const response = await simulationService.createSimulation(request);
      console.log('[DEBUG] Create simulation response:', response);
      
      const newSimulationId = response.id || (response as any).simulation_id || (response as any).simulationId;
      
      if (!newSimulationId) {
        console.error('[DEBUG] No simulation ID found in response:', response);
        throw new Error('No simulation ID returned from API');
      }
      
      console.log(`[DEBUG] Created simulation with ID: ${newSimulationId}`);
      setSimulationId(newSimulationId);
      
      // Start the simulation
      console.log(`[DEBUG] Starting simulation ${newSimulationId}`);
      const startResponse = await simulationService.startSimulation(newSimulationId);
      console.log('[DEBUG] Start simulation response:', startResponse);
      
      setIsRunning(true);
      
      // Start polling for status and logs immediately
      console.log('[DEBUG] Starting polling intervals');
      pollingStartTime.current = Date.now();
      
      // Do initial status check
      await pollStatus(newSimulationId);
      await pollLogs(newSimulationId);
      
      // Start polling for status and logs
      statusPollingRef.current = setInterval(() => {
        pollStatus(newSimulationId);
      }, 3000); // Poll every 3 seconds to avoid overwhelming the API
      
      logsPollingRef.current = setInterval(() => {
        pollLogs(newSimulationId);
      }, 2000); // Poll logs every 2 seconds
      
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