
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
    return apiClient.post<CreateSimulationResponse>('/api/simulations', request);
  },

  // Get simulation status
  async getSimulationStatus(simulationId: string): Promise<SimulationStatus> {
    return apiClient.get<SimulationStatus>(`/api/simulations/${simulationId}/status`);
  },

  // Get simulation results
  async getSimulationResult(simulationId: string): Promise<SimulationResult> {
    return apiClient.get<SimulationResult>(`/api/simulations/${simulationId}`);
  },

  // List all simulations
  async listSimulations(): Promise<SimulationResult[]> {
    return apiClient.get<SimulationResult[]>('/api/simulations');
  },

  // Delete a simulation
  async deleteSimulation(simulationId: string): Promise<void> {
    return apiClient.delete<void>(`/api/simulations/${simulationId}`);
  },

  // Start a simulation
  async startSimulation(simulationId: string): Promise<SimulationStatus> {
    return apiClient.post<SimulationStatus>(`/api/simulations/${simulationId}/start`);
  },

  // Stop a simulation
  async stopSimulation(simulationId: string): Promise<SimulationStatus> {
    return apiClient.post<SimulationStatus>(`/api/simulations/${simulationId}/stop`);
  },
};
