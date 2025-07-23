
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nodeService } from '../services/nodeService';
import { useToast } from './use-toast';
import type { CreateNodeRequest, UpdateNodeRequest } from '../types/node';

export const useNodes = () => {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: nodeService.getNodes,
  });
};

export const useNode = (nodeId: string) => {
  return useQuery({
    queryKey: ['node', nodeId],
    queryFn: () => nodeService.getNode(nodeId),
    enabled: !!nodeId,
  });
};

export const useNetworkTopology = () => {
  return useQuery({
    queryKey: ['network-topology'],
    queryFn: nodeService.getNetworkTopology,
  });
};

export const useCreateNode = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: CreateNodeRequest) => 
      nodeService.createNode(request),
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
      nodeService.updateNode(nodeId, request),
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
