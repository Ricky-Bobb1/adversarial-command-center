
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { postToMockApi, mockApiEndpoints } from "@/utils/mockApi";
import { useSimulationContext } from "@/contexts/SimulationContext";
import { SimulationLogic } from "@/services/simulationLogic";
import { validateScenario } from "@/utils/validation";
import { SIMULATION_CONSTANTS, TOAST_MESSAGES } from "@/constants/simulation";
import { simulationResultsService } from "@/services/simulationResultsService";

export const useSimulationExecution = () => {
  const { toast } = useToast();
  const { state, dispatch } = useSimulationContext();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentLogsRef = useRef<any[]>([]);

  const startSimulation = async (selectedScenario: string) => {
    const validation = validateScenario(selectedScenario);
    
    if (!validation.isValid) {
      toast({
        title: TOAST_MESSAGES.SCENARIO_REQUIRED,
        description: validation.errors.join(", "),
        variant: "destructive",
      });
      return;
    }

    try {
      await postToMockApi(mockApiEndpoints.runSimulation, {
        scenario: selectedScenario,
        timestamp: new Date().toISOString()
      });

      dispatch({ type: 'SET_RUNNING', payload: true });
      dispatch({ type: 'CLEAR_LOGS' });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Reset the logs ref
      currentLogsRef.current = [];
      
      toast({
        title: TOAST_MESSAGES.SIMULATION_STARTED,
        description: `Running scenario: ${selectedScenario}`,
      });

      const sampleLogs = SimulationLogic.getSampleLogs();
      let logIndex = 0;
      
      intervalRef.current = setInterval(() => {
        if (logIndex < sampleLogs.length) {
          const newLog = SimulationLogic.createLogEntry(sampleLogs[logIndex]);
          currentLogsRef.current.push(newLog);
          dispatch({ type: 'ADD_LOG', payload: newLog });
          logIndex++;
        } else {
          dispatch({ type: 'SET_RUNNING', payload: false });
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          
          console.log('Simulation complete, saving results with logs:', currentLogsRef.current.length);
          
          // Save simulation results when complete using the ref
          const metrics = simulationResultsService.calculateMetrics(currentLogsRef.current);
          simulationResultsService.saveResults({
            logs: currentLogsRef.current,
            metrics,
            timestamp: new Date().toISOString(),
            scenario: selectedScenario,
          });
          
          toast({
            title: TOAST_MESSAGES.SIMULATION_COMPLETE,
            description: "The adversarial simulation has finished successfully",
          });
        }
      }, SIMULATION_CONSTANTS.LOG_INTERVAL_MS);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to start simulation' });
      toast({
        title: TOAST_MESSAGES.FAILED_TO_START,
        description: "Could not start the simulation",
        variant: "destructive",
      });
    }
  };

  const stopSimulation = () => {
    dispatch({ type: 'SET_RUNNING', payload: false });
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
    dispatch({ type: 'RESET_SIMULATION' });
    currentLogsRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    toast({
      title: "Simulation Reset",
      description: "Ready to run a new simulation",
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isRunning: state.isRunning,
    logs: state.logs,
    startSimulation,
    stopSimulation,
    resetSimulation
  };
};
