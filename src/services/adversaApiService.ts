
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
    // Use the configured API base URL
    this.baseUrl = environment.apiBaseUrl;
    
    logger.info('Adversa API Service initialized', 'AdversaApiService', {
      baseUrl: this.baseUrl,
      environment: environment.isDevelopment ? 'development' : 'production',
      mockMode: environment.enableMockApi
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
    // Load model first, then we'll get sim_id for running
    const loadResponse = await apiClient.post(`${this.baseUrl}/aaa/sim/model/load`, {
      model_id: request.scenario, // Use scenario as model_id
      step_by_step: false // Run to completion
    }, {
      requestId: `load-simulation-${Date.now()}`,
    }) as any;
    
    console.log('[DEBUG] Load simulation response:', loadResponse);
    
    // Return response in expected format
    return {
      id: loadResponse.sim_id || `sim-${Date.now()}`,
      status: { status: (loadResponse.sim_status?.toLowerCase() || 'pending') as any },
      createdAt: new Date().toISOString()
    };
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
    // Run the simulation
    const runResponse = await apiClient.post(`${this.baseUrl}/aaa/sim/run`, {
      sim_id: simulationId,
      mode: "auto" // Run to completion
    }, {
      requestId: `start-simulation-${simulationId}`,
    }) as any;
    
    console.log('[DEBUG] Run simulation response:', runResponse);
    
    // Return status in expected format
    return {
      status: (runResponse.sim_status?.toLowerCase() || 'running') as any,
      message: runResponse.message
    };
  }

  async stopSimulation(simulationId: string): Promise<SimulationStatus> {
    return apiClient.post(`${this.baseUrl}/api/v1/simulations/${simulationId}/stop`, undefined, {
      requestId: `stop-simulation-${simulationId}`,
    });
  }

  async getSimulationStatus(simulationId: string): Promise<SimulationStatus> {
    const statusResponse = await apiClient.get(`${this.baseUrl}/aaa/sim/status/${simulationId}`, {
      requestId: `status-${simulationId}`,
    }) as any;
    
    console.log('[DEBUG] Status API response:', statusResponse);
    
    // Handle string response (like "Loaded", "Running", "Completed")
    if (typeof statusResponse === 'string') {
      // Map known statuses to our types
      const statusMap: Record<string, string> = {
        'loaded': 'pending',
        'running': 'running', 
        'completed': 'completed',
        'error': 'failed',
        'failed': 'failed'
      };
      
      return {
        status: (statusMap[statusResponse.toLowerCase()] || 'pending') as any,
        message: `Simulation is ${statusResponse}`
      };
    }
    
    // Handle object response
    const rawStatus = statusResponse.status?.toLowerCase() || statusResponse.sim_status?.toLowerCase() || 'pending';
    const statusMap: Record<string, string> = {
      'loaded': 'pending',
      'running': 'running', 
      'completed': 'completed',
      'error': 'failed',
      'failed': 'failed'
    };
    
    return {
      status: (statusMap[rawStatus] || 'pending') as any,
      message: statusResponse.message || `Status: ${rawStatus}`
    };
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

  // Scenarios endpoints (get simulation models as scenarios)
  async getScenarios(): Promise<string[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/aaa/sim/models/summary`, {
        requestId: 'list-scenarios',
      }) as any;
      
      console.log('[DEBUG] Scenarios/models response:', response);
      
      // Handle array of model summaries
      if (Array.isArray(response)) {
        return response.map((model: any) => model.id || model.name || 'Unknown Model');
      }
      
      // Handle single model object
      if (response && typeof response === 'object') {
        return [response.id || response.name || 'Default Model'];
      }
      
      // Fallback to default scenarios
      return ['default-scenario', 'enterprise-network', 'cloud-infrastructure'];
    } catch (error) {
      console.log('[DEBUG] Failed to fetch scenarios, using defaults:', error);
      return ['default-scenario', 'enterprise-network', 'cloud-infrastructure'];
    }
  }

  // Get simulation details/logs
  async getSimulationLogs(simulationId: string): Promise<any[]> {
    try {
      const detailResponse = await apiClient.get(`${this.baseUrl}/aaa/sim/detail/${simulationId}`, {
        requestId: `logs-${simulationId}`,
      }) as any;
      
      console.log('[DEBUG] Simulation detail response:', detailResponse);
      
      // Extract logs from the simulation detail response
      if (detailResponse && detailResponse.steps && Array.isArray(detailResponse.steps)) {
        return detailResponse.steps.map((step: any, index: number) => ({
          id: `step-${index}`,
          timestamp: step.timestamp || new Date().toISOString(),
          agent: step.agent_name || step.agent || 'System',
          action: step.action || step.description || 'Action executed',
          outcome: step.outcome || step.result || step.message || 'Action completed'
        }));
      }
      
      return [];
    } catch (error) {
      console.log('[DEBUG] No simulation details available yet');
      return [];
    }
  }
}

export const adversaApiService = new AdversaApiService();
