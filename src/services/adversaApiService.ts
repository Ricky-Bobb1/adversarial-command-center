
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
    // Get node configuration from localStorage
    const savedNodes = localStorage.getItem('hospital-nodes');
    const savedAgents = localStorage.getItem('agent-config');
    
    let nodes = [];
    let agentConfig = null;
    
    if (savedNodes) {
      try {
        const nodeData = JSON.parse(savedNodes);
        nodes = nodeData.nodes || [];
        console.log('[DEBUG] Loaded nodes from storage:', nodes);
      } catch (error) {
        console.warn('[DEBUG] Failed to parse saved nodes:', error);
      }
    }
    
    if (savedAgents) {
      try {
        agentConfig = JSON.parse(savedAgents);
        console.log('[DEBUG] Loaded agent config from storage:', agentConfig);
      } catch (error) {
        console.warn('[DEBUG] Failed to parse saved agents:', error);
      }
    }
    
    // Prepare model load payload according to backend schema
    const loadPayload = {
      model_id: request.scenario, // Use scenario as model_id
      step_by_step: false, // Run to completion
      nodes: nodes, // Include nodes from Setup page
      agents: agentConfig, // Include agent configuration
      ...request.config // Include any additional config
    };
    
    console.log('[DEBUG] Loading model with payload:', loadPayload);
    
    // Load model first, then we'll get sim_id for running
    const loadResponse = await apiClient.post(`${this.baseUrl}/aaa/sim/model/load`, loadPayload, {
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

  // Scenarios endpoints (get simulation models as scenarios + local node configs)
  async getScenarios(): Promise<string[]> {
    try {
      console.log('[DEBUG] Fetching scenarios from /aaa/sim/models...');
      
      // Check for saved local node configuration
      const savedNodes = localStorage.getItem('hospital-nodes');
      const localScenarios: string[] = [];
      
      if (savedNodes) {
        try {
          const nodeData = JSON.parse(savedNodes);
          if (nodeData.nodes && nodeData.nodes.length > 0) {
            localScenarios.push('local-hospital-setup');
            console.log('[DEBUG] Added local hospital setup as scenario');
          }
        } catch (error) {
          console.warn('[DEBUG] Failed to parse saved nodes');
        }
      }
      
      const response = await apiClient.get(`${this.baseUrl}/aaa/sim/models`, {
        requestId: 'list-scenarios',
      }) as any;
      
      console.log('[DEBUG] Models response:', response);
      
      // Handle array of model objects
      if (Array.isArray(response)) {
        const scenarios = response.map((model: any) => model.id || model.name || 'Unknown Model');
        console.log('[DEBUG] Extracted scenarios:', scenarios);
        return [...localScenarios, ...scenarios];
      }
      
      // Fallback scenarios including local setup if available
      const fallbackScenarios = ['default-scenario', 'enterprise-network', 'cloud-infrastructure'];
      return [...localScenarios, ...fallbackScenarios];
    } catch (error) {
      console.error('[DEBUG] Failed to fetch scenarios:', error);
      return ['local-hospital-setup', 'default-scenario', 'enterprise-network'];
    }
  }

  // Get supported LLM providers and models
  async getSupportedModels(): Promise<string[]> {
    try {
      console.log('[DEBUG] Fetching supported LLM models...');
      const response = await apiClient.get(`${this.baseUrl}/aaa/providers`, {
        requestId: 'list-providers',
      }) as any;
      
      console.log('[DEBUG] Providers response:', response);
      
      // Extract model names from providers
      const supportedModels = [
        'anthropic.claude-3-sonnet-20240229-v1:0',
        'cohere.command-r-plus',
        'anthropic.claude-3-haiku-20240307-v1:0',
        'anthropic.claude-3-opus-20240229-v1:0'
      ];
      
      // If we got a response, try to extract models from it
      if (Array.isArray(response)) {
        const extractedModels = response.map((provider: any) => 
          provider.model_name || provider.name || provider.id
        ).filter(Boolean);
        
        if (extractedModels.length > 0) {
          console.log('[DEBUG] Using extracted models:', extractedModels);
          return extractedModels;
        }
      }
      
      console.log('[DEBUG] Using fallback supported models:', supportedModels);
      return supportedModels;
    } catch (error) {
      console.error('[DEBUG] Failed to fetch supported models:', error);
      // Return known supported models as fallback
      return [
        'anthropic.claude-3-sonnet-20240229-v1:0',
        'cohere.command-r-plus',
        'anthropic.claude-3-haiku-20240307-v1:0',
        'anthropic.claude-3-opus-20240229-v1:0'
      ];
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
