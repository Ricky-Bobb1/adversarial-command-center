
import { apiClient } from './api';
import type { 
  SimulationResult, 
  SimulationStatus, 
  CreateSimulationRequest, 
  CreateSimulationResponse 
} from '../types/simulation';

export const simulationService = {
  // Create a new simulation
  async createSimulation(request: CreateSimulationRequest): Promise<CreateSimulationResponse> {
    return apiClient.post<CreateSimulationResponse>('/api/simulations', request, {
      requestId: `create-simulation-${Date.now()}`,
    });
  },

  // Get simulation status
  async getSimulationStatus(
    simulationId: string, 
    options?: { requestId?: string }
  ): Promise<SimulationStatus> {
    return apiClient.get<SimulationStatus>(`/api/simulations/${simulationId}/status`, {
      requestId: options?.requestId || `status-${simulationId}`,
    });
  },

  // Get simulation results
  async getSimulationResult(simulationId: string): Promise<SimulationResult> {
    return apiClient.get<SimulationResult>(`/api/simulations/${simulationId}`, {
      requestId: `result-${simulationId}`,
    });
  },

  // List all simulations
  async listSimulations(): Promise<SimulationResult[]> {
    return apiClient.get<SimulationResult[]>('/api/simulations', {
      requestId: 'list-simulations',
    });
  },

  // Delete a simulation
  async deleteSimulation(simulationId: string): Promise<void> {
    return apiClient.delete<void>(`/api/simulations/${simulationId}`, {
      requestId: `delete-${simulationId}`,
    });
  },

  // Start a simulation
  async startSimulation(simulationId: string): Promise<SimulationStatus> {
    return apiClient.post<SimulationStatus>(`/api/simulations/${simulationId}/start`, undefined, {
      requestId: `start-${simulationId}`,
    });
  },

  // Stop a simulation
  async stopSimulation(simulationId: string): Promise<SimulationStatus> {
    return apiClient.post<SimulationStatus>(`/api/simulations/${simulationId}/stop`, undefined, {
      requestId: `stop-${simulationId}`,
    });
  },
};
