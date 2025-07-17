
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unifiedApiService } from '../services/unifiedApiService';
import { useToast } from './use-toast';
import { useErrorHandler } from './useErrorHandler';
import { cacheService, cacheKeys } from '../services/cacheService';
import { requestCancellation } from '../services/api';
import type { CreateSimulationRequest } from '../types/simulation';

export const useSimulations = () => {
  const { handleError } = useErrorHandler({ showToast: false });

  return useQuery({
    queryKey: ['simulations'],
    queryFn: async () => {
      return cacheService.getOrFetch(
        cacheKeys.simulations(),
        () => unifiedApiService.listSimulations(),
        2 * 60 * 1000 // 2 minutes cache
      );
    },
    meta: {
      onError: (error: Error) => handleError(error, 'fetching simulations'),
    },
  });
};

export const useSimulation = (simulationId: string) => {
  const { handleError } = useErrorHandler({ showToast: false });

  return useQuery({
    queryKey: ['simulation', simulationId],
    queryFn: async () => {
      return cacheService.getOrFetch(
        cacheKeys.simulation(simulationId),
        () => unifiedApiService.getSimulationResult(simulationId),
        5 * 60 * 1000 // 5 minutes cache
      );
    },
    enabled: !!simulationId,
    meta: {
      onError: (error: Error) => handleError(error, 'fetching simulation'),
    },
  });
};

export const useSimulationStatus = (simulationId: string, enabled = true) => {
  const { handleError } = useErrorHandler({ showToast: false });

  return useQuery({
    queryKey: ['simulation-status', simulationId],
    queryFn: () => unifiedApiService.getSimulationStatus(simulationId),
    enabled: !!simulationId && enabled,
    refetchInterval: (query) => {
      // Poll every 2 seconds if simulation is running
      return query.state.data?.status === 'running' ? 2000 : false;
    },
    meta: {
      onError: (error: Error) => handleError(error, 'fetching simulation status'),
    },
  });
};

export const useCreateSimulation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationFn: (request: CreateSimulationRequest) => 
      unifiedApiService.createSimulation(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      cacheService.invalidatePattern('simulation');
      toast({
        title: "Simulation Created",
        description: "Your simulation has been created successfully.",
      });
    },
    onError: (error: Error) => {
      handleError(error, 'creating simulation');
    },
  });
};

export const useStartSimulation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  return useMutation({
    mutationFn: (simulationId: string) => 
      unifiedApiService.startSimulation(simulationId),
    onSuccess: (_, simulationId) => {
      queryClient.invalidateQueries({ queryKey: ['simulation-status', simulationId] });
      cacheService.delete(cacheKeys.simulationStatus(simulationId));
      toast({
        title: "Simulation Started",
        description: "Your simulation is now running.",
      });
    },
    onError: (error: Error) => {
      handleError(error, 'starting simulation');
    },
  });
};

// Cleanup function to cancel pending requests
export const useSimulationCleanup = () => {
  return () => {
    requestCancellation.cancelAll();
    console.log('Cancelled all pending simulation requests');
  };
};
