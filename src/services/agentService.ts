
import { apiClient } from './api';
import type { Agent, CreateAgentRequest, UpdateAgentRequest } from '../types/agent';

export const agentService = {
  // Get all agents
  async getAgents(): Promise<Agent[]> {
    return apiClient.get<Agent[]>('/api/agents');
  },

  // Get a specific agent
  async getAgent(agentId: string): Promise<Agent> {
    return apiClient.get<Agent>(`/api/agents/${agentId}`);
  },

  // Create a new agent
  async createAgent(request: CreateAgentRequest): Promise<Agent> {
    return apiClient.post<Agent>('/api/agents', request);
  },

  // Update an agent
  async updateAgent(agentId: string, request: UpdateAgentRequest): Promise<Agent> {
    return apiClient.put<Agent>(`/api/agents/${agentId}`, request);
  },

  // Delete an agent
  async deleteAgent(agentId: string): Promise<void> {
    return apiClient.delete<void>(`/api/agents/${agentId}`);
  },

  // Get agents by simulation
  async getAgentsBySimulation(simulationId: string): Promise<Agent[]> {
    return apiClient.get<Agent[]>(`/api/simulations/${simulationId}/agents`);
  },
};
