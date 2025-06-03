
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchMockData } from "@/utils/mockApi";
import { useSimulationContext } from "@/contexts/SimulationContext";

interface ScenariosData {
  scenarios: string[];
}

export const useScenarios = () => {
  const { toast } = useToast();
  const { state, dispatch } = useSimulationContext();

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        dispatch({ type: 'SET_LOADING_SCENARIOS', payload: true });
        const data = await fetchMockData<ScenariosData>('scenarios');
        dispatch({ type: 'SET_SCENARIOS', payload: data.scenarios });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load scenarios' });
        toast({
          title: "Failed to Load Scenarios",
          description: "Could not load available scenarios",
          variant: "destructive",
        });
      } finally {
        dispatch({ type: 'SET_LOADING_SCENARIOS', payload: false });
      }
    };

    loadScenarios();
  }, [toast, dispatch]);

  return { 
    scenarios: state.scenarios, 
    isLoading: state.isLoadingScenarios,
    error: state.error
  };
};
