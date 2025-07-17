
import { apiClient } from './api';
import { adversaApiService } from './adversaApiService';
import { environment } from '../utils/environment';
import type { 
  SimulationResult, 
  SimulationStatus, 
  CreateSimulationRequest, 
  CreateSimulationResponse 
} from '../types/simulation';

// Determine if we should use the Adversa API or mock API
const useAdversaApi = !environment.enableMockApi;

export const simulationService = {
  // Create a new simulation
  async createSimulation(request: CreateSimulationRequest): Promise<CreateSimulationResponse> {
    if (useAdversaApi) {
      return adversaApiService.createSimulation(request);
    }
    
    // Mock API fallback
    return apiClient.post<CreateSimulationResponse>('/api/simulations', request, {
      requestId: `create-simulation-${Date.now()}`,
    });
  },

  // Get simulation status
  async getSimulationStatus(
    simulationId: string, 
    options?: { requestId?: string }
  ): Promise<SimulationStatus> {
    if (useAdversaApi) {
      return adversaApiService.getSimulationStatus(simulationId);
    }
    
    return apiClient.get<SimulationStatus>(`/api/simulations/${simulationId}/status`, {
      requestId: options?.requestId || `status-${simulationId}`,
    });
  },

  // Get simulation results
  async getSimulationResult(simulationId: string): Promise<SimulationResult> {
    if (useAdversaApi) {
      return adversaApiService.getSimulation(simulationId);
    }
    
    return apiClient.get<SimulationResult>(`/api/simulations/${simulationId}`, {
      requestId: `result-${simulationId}`,
    });
  },

  // List all simulations
  async listSimulations(): Promise<SimulationResult[]> {
    if (useAdversaApi) {
      return adversaApiService.listSimulations();
    }
    
    return apiClient.get<SimulationResult[]>('/api/simulations', {
      requestId: 'list-simulations',
    });
  },

  // Delete a simulation
  async deleteSimulation(simulationId: string): Promise<void> {
    if (useAdversaApi) {
      return adversaApiService.deleteSimulation(simulationId);
    }
    
    return apiClient.delete<void>(`/api/simulations/${simulationId}`, {
      requestId: `delete-${simulationId}`,
    });
  },

  // Start a simulation
  async startSimulation(simulationId: string): Promise<SimulationStatus> {
    if (useAdversaApi) {
      return adversaApiService.startSimulation(simulationId);
    }
    
    return apiClient.post<SimulationStatus>(`/api/simulations/${simulationId}/start`, undefined, {
      requestId: `start-${simulationId}`,
    });
  },

  // Stop a simulation
  async stopSimulation(simulationId: string): Promise<SimulationStatus> {
    if (useAdversaApi) {
      return adversaApiService.stopSimulation(simulationId);
    }
    
    return apiClient.post<SimulationStatus>(`/api/simulations/${simulationId}/stop`, undefined, {
      requestId: `stop-${simulationId}`,
    });
  },

  // Get simulation logs (new feature for Adversa API)
  async getSimulationLogs(simulationId: string): Promise<any[]> {
    if (useAdversaApi) {
      return adversaApiService.getSimulationLogs(simulationId);
    }
    
    // Fallback for mock API
    return [];
  },

  // Get API documentation URLs
  getApiDocumentation() {
    if (useAdversaApi) {
      return {
        swagger: adversaApiService.getDocsUrl(),
        redoc: adversaApiService.getRedocUrl(),
        openapi: adversaApiService.getOpenApiUrl(),
      };
    }
    
    return null;
  },
};
