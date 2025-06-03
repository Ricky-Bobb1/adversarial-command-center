
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { simulationService } from '../services/simulationService';
import { useToast } from './use-toast';
import type { CreateSimulationRequest } from '../types/simulation';

export const useSimulations = () => {
  return useQuery({
    queryKey: ['simulations'],
    queryFn: simulationService.listSimulations,
  });
};

export const useSimulation = (simulationId: string) => {
  return useQuery({
    queryKey: ['simulation', simulationId],
    queryFn: () => simulationService.getSimulationResult(simulationId),
    enabled: !!simulationId,
  });
};

export const useSimulationStatus = (simulationId: string, enabled = true) => {
  return useQuery({
    queryKey: ['simulation-status', simulationId],
    queryFn: () => simulationService.getSimulationStatus(simulationId),
    enabled: !!simulationId && enabled,
    refetchInterval: (query) => {
      // Poll every 2 seconds if simulation is running
      return query.state.data?.status === 'running' ? 2000 : false;
    },
  });
};

export const useCreateSimulation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: CreateSimulationRequest) => 
      simulationService.createSimulation(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      toast({
        title: "Simulation Created",
        description: "Your simulation has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create simulation: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useStartSimulation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (simulationId: string) => 
      simulationService.startSimulation(simulationId),
    onSuccess: (_, simulationId) => {
      queryClient.invalidateQueries({ queryKey: ['simulation-status', simulationId] });
      toast({
        title: "Simulation Started",
        description: "Your simulation is now running.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to start simulation: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
