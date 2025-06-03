
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { postToMockApi, mockApiEndpoints } from "@/utils/mockApi";
import { useSimulationContext } from "@/contexts/SimulationContext";
import { SimulationLogic } from "@/services/simulationLogic";

export const useSimulationExecution = () => {
  const { toast } = useToast();
  const { state, dispatch } = useSimulationContext();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startSimulation = async (selectedScenario: string) => {
    if (!SimulationLogic.validateScenario(selectedScenario)) {
      toast({
        title: "Scenario Required",
        description: "Please select a scenario before running the simulation",
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
      
      toast({
        title: "Simulation Started",
        description: `Running scenario: ${selectedScenario}`,
      });

      const sampleLogs = SimulationLogic.getSampleLogs();
      let logIndex = 0;
      
      intervalRef.current = setInterval(() => {
        if (logIndex < sampleLogs.length) {
          const newLog = SimulationLogic.createLogEntry(sampleLogs[logIndex]);
          dispatch({ type: 'ADD_LOG', payload: newLog });
          logIndex++;
        } else {
          dispatch({ type: 'SET_RUNNING', payload: false });
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          toast({
            title: "Simulation Complete",
            description: "The adversarial simulation has finished successfully",
          });
        }
      }, 1500);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to start simulation' });
      toast({
        title: "Failed to Start Simulation",
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
