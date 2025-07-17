
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchMockData } from "@/utils/mockApi";
import { unifiedApiService } from "@/services/unifiedApiService";
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
        console.log('[DEBUG] Loading scenarios...');
        dispatch({ type: 'SET_LOADING_SCENARIOS', payload: true });
        
        let scenarios: string[];
        
        if (useAdversaApi) {
          // Use the Unified API
          console.log('[DEBUG] Using Unified API for scenarios');
          scenarios = await unifiedApiService.getScenarios();
          console.log('[DEBUG] Received scenarios from API:', scenarios);
        } else {
          // Use mock data
          console.log('[DEBUG] Using mock data for scenarios');
          const data = await fetchMockData<ScenariosData>('scenarios');
          scenarios = data.scenarios;
        }
        
        // Ensure we have at least some scenarios
        if (!scenarios || scenarios.length === 0) {
          console.log('[DEBUG] No scenarios received, using fallbacks');
          scenarios = ['default-scenario', 'enterprise-network', 'cloud-infrastructure'];
        }
        
        console.log('[DEBUG] Final scenarios set:', scenarios);
        dispatch({ type: 'SET_SCENARIOS', payload: scenarios });
      } catch (error) {
        console.error('[DEBUG] Failed to load scenarios:', error);
        
        // Set fallback scenarios
        const fallbackScenarios = ['default-scenario', 'enterprise-network', 'cloud-infrastructure'];
        dispatch({ type: 'SET_SCENARIOS', payload: fallbackScenarios });
        
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load scenarios - using defaults' });
        toast({
          title: "Scenarios Loaded",
          description: useAdversaApi 
            ? "Could not connect to Adversa API. Using default scenarios."
            : "Using default scenarios",
          variant: "default",
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
