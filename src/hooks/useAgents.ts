
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentService } from '../services/agentService';
import { useToast } from './use-toast';
import type { CreateAgentRequest, UpdateAgentRequest } from '../types/agent';

export const useAgents = () => {
  return useQuery({
    queryKey: ['agents'],
    queryFn: agentService.getAgents,
  });
};

export const useAgent = (agentId: string) => {
  return useQuery({
    queryKey: ['agent', agentId],
    queryFn: () => agentService.getAgent(agentId),
    enabled: !!agentId,
  });
};

export const useAgentsBySimulation = (simulationId: string) => {
  return useQuery({
    queryKey: ['agents', 'simulation', simulationId],
    queryFn: () => agentService.getAgentsBySimulation(simulationId),
    enabled: !!simulationId,
  });
};

export const useCreateAgent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: CreateAgentRequest) => 
      agentService.createAgent(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      toast({
        title: "Agent Created",
        description: "New agent has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create agent: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAgent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ agentId, request }: { agentId: string; request: UpdateAgentRequest }) =>
      agentService.updateAgent(agentId, request),
    onSuccess: (_, { agentId }) => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['agent', agentId] });
      toast({
        title: "Agent Updated",
        description: "Agent has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update agent: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
