
import { apiClient } from './api';
import { environment } from '../utils/environment';
import { logger } from '../utils/logger';
import type { 
  SimulationResult, 
  SimulationStatus, 
  CreateSimulationRequest, 
  CreateSimulationResponse 
} from '../types/simulation';

class AdversaApiService {
  private baseUrl: string;

  constructor() {
    // Use the configured API base URL or fallback to localhost for development
    this.baseUrl = environment.apiBaseUrl || 'http://localhost:8000';
    
    logger.info('Adversa API Service initialized', 'AdversaApiService', {
      baseUrl: this.baseUrl,
      environment: environment.isDevelopment ? 'development' : 'production'
    });
  }

  // Get API documentation endpoints
  getDocsUrl(): string {
    return `${this.baseUrl}/docs`;
  }

  getRedocUrl(): string {
    return `${this.baseUrl}/redoc`;
  }

  getOpenApiUrl(): string {
    return `${this.baseUrl}/openapi.json`;
  }

  // Health check endpoint
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return apiClient.get(`${this.baseUrl}/health`, {
      requestId: 'health-check',
    });
  }

  // Simulation management endpoints
  async createSimulation(request: CreateSimulationRequest): Promise<CreateSimulationResponse> {
    return apiClient.post(`${this.baseUrl}/api/v1/simulations`, request, {
      requestId: `create-simulation-${Date.now()}`,
    });
  }

  async getSimulation(simulationId: string): Promise<SimulationResult> {
    return apiClient.get(`${this.baseUrl}/api/v1/simulations/${simulationId}`, {
      requestId: `get-simulation-${simulationId}`,
    });
  }

  async listSimulations(): Promise<SimulationResult[]> {
    return apiClient.get(`${this.baseUrl}/api/v1/simulations`, {
      requestId: 'list-simulations',
    });
  }

  async startSimulation(simulationId: string): Promise<SimulationStatus> {
    return apiClient.post(`${this.baseUrl}/api/v1/simulations/${simulationId}/start`, undefined, {
      requestId: `start-simulation-${simulationId}`,
    });
  }

  async stopSimulation(simulationId: string): Promise<SimulationStatus> {
    return apiClient.post(`${this.baseUrl}/api/v1/simulations/${simulationId}/stop`, undefined, {
      requestId: `stop-simulation-${simulationId}`,
    });
  }

  async getSimulationStatus(simulationId: string): Promise<SimulationStatus> {
    return apiClient.get(`${this.baseUrl}/api/v1/simulations/${simulationId}/status`, {
      requestId: `status-${simulationId}`,
    });
  }

  async deleteSimulation(simulationId: string): Promise<void> {
    return apiClient.delete(`${this.baseUrl}/api/v1/simulations/${simulationId}`, {
      requestId: `delete-${simulationId}`,
    });
  }

  // Agent management endpoints
  async getAgents(): Promise<any[]> {
    return apiClient.get(`${this.baseUrl}/api/v1/agents`, {
      requestId: 'list-agents',
    });
  }

  async createAgent(agentData: any): Promise<any> {
    return apiClient.post(`${this.baseUrl}/api/v1/agents`, agentData, {
      requestId: `create-agent-${Date.now()}`,
    });
  }

  // Network topology endpoints
  async getNetworkTopology(): Promise<any> {
    return apiClient.get(`${this.baseUrl}/api/v1/network/topology`, {
      requestId: 'network-topology',
    });
  }

  // Scenarios endpoints
  async getScenarios(): Promise<string[]> {
    const response = await apiClient.get(`${this.baseUrl}/api/v1/scenarios`, {
      requestId: 'list-scenarios',
    });
    return response.scenarios || [];
  }

  // Real-time simulation logs (if supported by the API)
  async getSimulationLogs(simulationId: string): Promise<any[]> {
    return apiClient.get(`${this.baseUrl}/api/v1/simulations/${simulationId}/logs`, {
      requestId: `logs-${simulationId}`,
    });
  }
}

export const adversaApiService = new AdversaApiService();
