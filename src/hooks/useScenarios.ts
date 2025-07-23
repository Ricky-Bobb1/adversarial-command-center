
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchMockData } from "@/utils/mockApi";
import { adversaApiService } from "@/services/adversaApiService";
import { environment } from "@/utils/environment";
import { useSimulationContext } from "@/contexts/SimulationContext";

interface ScenariosData {
  scenarios: string[];
}

export const useScenarios = () => {
  const { toast } = useToast();
  const { state, dispatch } = useSimulationContext();
  const useAdversaApi = !environment.enableMockApi && environment.apiBaseUrl;

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        dispatch({ type: 'SET_LOADING_SCENARIOS', payload: true });
        
        let scenarios: string[];
        
        if (useAdversaApi) {
          // Use the Adversa API
          scenarios = await adversaApiService.getScenarios();
        } else {
          // Use mock data
          const data = await fetchMockData<ScenariosData>('scenarios');
          scenarios = data.scenarios;
        }
        
        dispatch({ type: 'SET_SCENARIOS', payload: scenarios });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load scenarios' });
        toast({
          title: "Failed to Load Scenarios",
          description: useAdversaApi 
            ? "Could not connect to Adversa API. Check your API configuration."
            : "Could not load available scenarios",
          variant: "destructive",
        });
      } finally {
        dispatch({ type: 'SET_LOADING_SCENARIOS', payload: false });
      }
    };

    loadScenarios();
  }, [toast, dispatch, useAdversaApi]);

  return { 
    scenarios: state.scenarios, 
    isLoading: state.isLoadingScenarios,
    error: state.error
  };
};
