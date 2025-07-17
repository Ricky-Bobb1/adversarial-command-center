
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unifiedApiService } from '../services/unifiedApiService';
import { useToast } from './use-toast';
import type { CreateNodeRequest, UpdateNodeRequest } from '../types/node';

export const useNodes = () => {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: unifiedApiService.getNodes,
  });
};

export const useNode = (nodeId: string) => {
  return useQuery({
    queryKey: ['node', nodeId],
    queryFn: () => unifiedApiService.getNode(nodeId),
    enabled: !!nodeId,
  });
};

export const useNetworkTopology = () => {
  return useQuery({
    queryKey: ['network-topology'],
    queryFn: unifiedApiService.getNetworkTopology,
  });
};

export const useCreateNode = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: CreateNodeRequest) => 
      unifiedApiService.createNode(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      queryClient.invalidateQueries({ queryKey: ['network-topology'] });
      toast({
        title: "Node Created",
        description: "New network node has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to create node: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateNode = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ nodeId, request }: { nodeId: string; request: UpdateNodeRequest }) =>
      unifiedApiService.updateNode(nodeId, request),
    onSuccess: (_, { nodeId }) => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      queryClient.invalidateQueries({ queryKey: ['node', nodeId] });
      queryClient.invalidateQueries({ queryKey: ['network-topology'] });
      toast({
        title: "Node Updated",
        description: "Network node has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update node: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};
