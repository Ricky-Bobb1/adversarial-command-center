
import { apiClient } from './api';
import type { NetworkNode, CreateNodeRequest, UpdateNodeRequest } from '../types/node';

export const nodeService = {
  // Get all network nodes
  async getNodes(): Promise<NetworkNode[]> {
    return apiClient.get<NetworkNode[]>('/api/nodes');
  },

  // Get a specific node
  async getNode(nodeId: string): Promise<NetworkNode> {
    return apiClient.get<NetworkNode>(`/api/nodes/${nodeId}`);
  },

  // Create a new node
  async createNode(request: CreateNodeRequest): Promise<NetworkNode> {
    return apiClient.post<NetworkNode>('/api/nodes', request);
  },

  // Update a node
  async updateNode(nodeId: string, request: UpdateNodeRequest): Promise<NetworkNode> {
    return apiClient.put<NetworkNode>(`/api/nodes/${nodeId}`, request);
  },

  // Delete a node
  async deleteNode(nodeId: string): Promise<void> {
    return apiClient.delete<void>(`/api/nodes/${nodeId}`);
  },

  // Get network topology
  async getNetworkTopology(): Promise<{ nodes: NetworkNode[]; connections: Array<{ from: string; to: string }> }> {
    return apiClient.get('/api/network/topology');
  },
};
