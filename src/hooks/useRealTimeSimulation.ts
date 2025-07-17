import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { unifiedApiService } from '@/services/unifiedApiService';
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
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Timeout after 5 minutes
  const POLLING_TIMEOUT_MS = 5 * 60 * 1000;

  // Poll simulation status
  const pollStatus = useCallback(async (id: string) => {
    if (!isComponentMounted.current || abortControllerRef.current?.signal.aborted) return;
    
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
      const statusResponse = await unifiedApiService.getSimulationStatus(id);
      console.log('[DEBUG] Status response:', statusResponse);
      
      if (!isComponentMounted.current || abortControllerRef.current?.signal.aborted) return;
      
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
    if (!isComponentMounted.current || abortControllerRef.current?.signal.aborted) return;
    
    try {
      console.log(`[DEBUG] Polling logs for simulation ${id}...`);
      const logsResponse = await unifiedApiService.getSimulationLogs(id);
      console.log('[DEBUG] Logs response:', logsResponse);
      
      if (!isComponentMounted.current || abortControllerRef.current?.signal.aborted) return;
      
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

  // Start mock simulation with generated logs
  const startMockSimulation = useCallback((mockId: string) => {
    console.log('[DEBUG] Starting mock simulation with ID:', mockId);
    
    // Generate some mock logs periodically
    const mockLogTemplates = [
      { agent: "Red" as const, action: "Port scan initiated", outcome: "Discovered open ports 22, 80, 443" },
      { agent: "Blue" as const, action: "Intrusion detection triggered", outcome: "Suspicious activity detected from 192.168.1.100" },
      { agent: "Red" as const, action: "SSH brute force attempt", outcome: "Failed - strong credentials detected" },
      { agent: "Blue" as const, action: "Firewall rule updated", outcome: "Blocked suspicious IP range" },
      { agent: "Red" as const, action: "Phishing email sent", outcome: "1 out of 50 users clicked malicious link" },
      { agent: "Blue" as const, action: "Email security scan", outcome: "Malicious email quarantined" },
      { agent: "System" as const, action: "Security alert generated", outcome: "Alert sent to security team" },
      { agent: "Red" as const, action: "Privilege escalation attempt", outcome: "Success - gained admin access to workstation" },
      { agent: "Blue" as const, action: "Endpoint detection response", outcome: "Malicious process terminated" },
      { agent: "System" as const, action: "Compliance check", outcome: "HIPAA compliance verified" }
    ];
    
    let logIndex = 0;
    const mockInterval = setInterval(() => {
      if (!isComponentMounted.current || logIndex >= mockLogTemplates.length) {
        clearInterval(mockInterval);
        
        // End simulation after all logs
        setTimeout(() => {
          if (isComponentMounted.current) {
            setIsRunning(false);
            toast({
              title: 'Mock Simulation Completed',
              description: 'Local simulation finished successfully. Check Results page for analysis.',
            });
          }
        }, 2000);
        return;
      }
      
      const template = mockLogTemplates[logIndex];
      const newLog: LogEntry = {
        id: `mock-log-${Date.now()}-${logIndex}`,
        timestamp: new Date().toISOString(),
        ...template
      };
      
      setLogs(prev => [...prev, newLog]);
      logIndex++;
    }, 3000); // New log every 3 seconds
    
  }, [toast]);

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
      
      // Create new AbortController for this simulation
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();
      
      // Debug: Log frontend state before simulation starts
      const savedNodes = localStorage.getItem('hospital-nodes');
      const savedAgents = localStorage.getItem('agent-config');
      
      console.log('[DEBUG] ========== SIMULATION START DEBUG ==========');
      console.log('[DEBUG] Selected scenario:', scenario);
      console.log('[DEBUG] Additional config:', config);
      console.log('[DEBUG] Saved nodes in localStorage:', savedNodes);
      console.log('[DEBUG] Saved agents in localStorage:', savedAgents);
      
      let nodeData = null;
      let agentData = null;
      
      if (savedNodes) {
        try {
          nodeData = JSON.parse(savedNodes);
          console.log('[DEBUG] Parsed node data:', nodeData);
        } catch (error) {
          console.warn('[DEBUG] Failed to parse saved nodes:', error);
        }
      }
      
      if (savedAgents) {
        try {
          agentData = JSON.parse(savedAgents);
          console.log('[DEBUG] Parsed agent data:', agentData);
        } catch (error) {
          console.warn('[DEBUG] Failed to parse saved agents:', error);
        }
      }
      
      // Validate state before proceeding
      if (!nodeData || !nodeData.nodes || nodeData.nodes.length === 0) {
        console.warn('[DEBUG] No nodes configured! Please set up nodes first.');
        toast({
          title: 'Setup Required',
          description: 'Please configure nodes in the Setup page before running simulations.',
          variant: 'destructive',
        });
        return;
      }
      
      if (!agentData || !agentData.redAgent.model || !agentData.blueAgent.model) {
        console.warn('[DEBUG] Agents not fully configured!');
        toast({
          title: 'Agent Configuration Required', 
          description: 'Please configure both Red and Blue agents before running simulations.',
          variant: 'destructive',
        });
        return;
      }
      
      console.log('[DEBUG] ========== STATE VALIDATION PASSED ==========');
      
      // Create simulation request with full debug logging
      const request: CreateSimulationRequest = {
        scenario,
        config: {
          ...config,
          nodes: nodeData?.nodes || [],
          agents: agentData,
          timestamp: new Date().toISOString(),
          debug: true
        }
      };
      
      console.log('[DEBUG] ========== SIMULATION REQUEST PAYLOAD ==========');
      console.log('[DEBUG] Full request object:', JSON.stringify(request, null, 2));
      console.log('[DEBUG] ===============================================');
      
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
      const response = await unifiedApiService.createSimulation(request);
      console.log('[DEBUG] Create simulation response:', response);
      
      // Check if this is a mock fallback response
      const newSimulationId = response.id;
      if (newSimulationId.startsWith('mock-sim-')) {
        console.log('[DEBUG] Using mock simulation fallback');
        setSimulationId(newSimulationId);
        setIsRunning(true);
        toast({
          title: 'Simulation Started (Mock Mode)',
          description: `Backend model not available. Running local simulation: ${scenario}`,
          variant: 'default',
        });
        
        // Start mock simulation with generated logs
        startMockSimulation(newSimulationId);
        return;
      }
      
      const actualSimulationId = newSimulationId || (response as any).simulation_id || (response as any).simulationId;
      
      if (!actualSimulationId) {
        console.error('[DEBUG] No simulation ID found in response:', response);
        throw new Error('No simulation ID returned from API');
      }
      
      console.log(`[DEBUG] Created simulation with ID: ${actualSimulationId}`);
      setSimulationId(actualSimulationId);
      
      // Start the simulation
      console.log(`[DEBUG] Starting simulation ${actualSimulationId}`);
      const startResponse = await unifiedApiService.startSimulation(actualSimulationId);
      console.log('[DEBUG] Start simulation response:', startResponse);
      
      setIsRunning(true);
      
      // Start polling for status and logs immediately
      console.log('[DEBUG] Starting polling intervals');
      pollingStartTime.current = Date.now();
      
      // Do initial status check
      await pollStatus(actualSimulationId);
      await pollLogs(actualSimulationId);
      
      // Start polling for status and logs
      statusPollingRef.current = setInterval(() => {
        pollStatus(actualSimulationId);
      }, 3000); // Poll every 3 seconds to avoid overwhelming the API
      
      logsPollingRef.current = setInterval(() => {
        pollLogs(actualSimulationId);
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
        await unifiedApiService.stopSimulation(simulationId);
      }
      
      setIsRunning(false);
      
      // Clear polling intervals and abort ongoing requests
      if (statusPollingRef.current) {
        clearInterval(statusPollingRef.current);
        statusPollingRef.current = null;
      }
      
      if (logsPollingRef.current) {
        clearInterval(logsPollingRef.current);
        logsPollingRef.current = null;
      }
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
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
    
    // Clear all polling intervals and abort requests
    if (statusPollingRef.current) {
      clearInterval(statusPollingRef.current);
      statusPollingRef.current = null;
    }
    
    if (logsPollingRef.current) {
      clearInterval(logsPollingRef.current);
      logsPollingRef.current = null;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
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
      
      // Clear all intervals and abort any ongoing requests
      if (statusPollingRef.current) {
        clearInterval(statusPollingRef.current);
      }
      
      if (logsPollingRef.current) {
        clearInterval(logsPollingRef.current);
      }
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
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