
import { apiClient } from './api';
import type { Agent, CreateAgentRequest, UpdateAgentRequest } from '../types/agent';

export const agentService = {
  // Get all agents
  async getAgents(): Promise<Agent[]> {
    return apiClient.get<Agent[]>('/api/agents', {
      requestId: 'list-agents',
    });
  },

  // Get a specific agent
  async getAgent(agentId: string): Promise<Agent> {
    return apiClient.get<Agent>(`/api/agents/${agentId}`, {
      requestId: `agent-${agentId}`,
    });
  },

  // Create a new agent
  async createAgent(request: CreateAgentRequest): Promise<Agent> {
    return apiClient.post<Agent>('/api/agents', request, {
      requestId: `create-agent-${Date.now()}`,
    });
  },

  // Update an agent
  async updateAgent(agentId: string, request: UpdateAgentRequest): Promise<Agent> {
    return apiClient.put<Agent>(`/api/agents/${agentId}`, request, {
      requestId: `update-agent-${agentId}`,
    });
  },

  // Delete an agent
  async deleteAgent(agentId: string): Promise<void> {
    return apiClient.delete<void>(`/api/agents/${agentId}`, {
      requestId: `delete-agent-${agentId}`,
    });
  },

  // Get agents by simulation
  async getAgentsBySimulation(simulationId: string): Promise<Agent[]> {
    return apiClient.get<Agent[]>(`/api/simulations/${simulationId}/agents`, {
      requestId: `agents-simulation-${simulationId}`,
    });
  },
};
