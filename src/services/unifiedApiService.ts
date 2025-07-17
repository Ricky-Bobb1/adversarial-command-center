import { environment } from '../utils/environment';
import { logger } from '../utils/logger';
import { ApiError, apiClient } from './api';
import type { Agent, CreateAgentRequest, UpdateAgentRequest } from '../types/agent';
import type { NetworkNode, CreateNodeRequest, UpdateNodeRequest } from '../types/node';
import type { 
  SimulationResult, 
  SimulationStatus, 
  CreateSimulationRequest, 
  CreateSimulationResponse 
} from '../types/simulation';

/**
 * Unified API Service
 * Handles both mock and real API endpoints with proper environment switching
 * Consolidates all API calls into a single service layer
 */
class UnifiedApiService {
  private get isMockMode(): boolean {
    return environment.enableMockApi;
  }

  private get isRealMode(): boolean {
    return !environment.enableMockApi;
  }

  /**
   * Makes a request with proper endpoint mapping based on environment
   */
  private async makeRequest<T>(
    mockEndpoint: string,
    realEndpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    requestId?: string
  ): Promise<T> {
    const endpoint = this.isMockMode ? mockEndpoint : realEndpoint;
    const fullRequestId = requestId || `${method.toLowerCase()}-${Date.now()}`;

    logger.debug(`[API] ${method} ${endpoint} (${this.isMockMode ? 'MOCK' : 'REAL'} mode)`, 'UnifiedApiService');

    switch (method) {
      case 'GET':
        return apiClient.get<T>(endpoint, { requestId: fullRequestId });
      case 'POST':
        return apiClient.post<T>(endpoint, data, { requestId: fullRequestId });
      case 'PUT':
        return apiClient.put<T>(endpoint, data, { requestId: fullRequestId });
      case 'DELETE':
        return apiClient.delete<T>(endpoint, { requestId: fullRequestId });
      default:
        throw new ApiError(`Unsupported HTTP method: ${method}`);
    }
  }

  // ============================================
  // AGENT ENDPOINTS
  // ============================================

  async getAgents(): Promise<Agent[]> {
    return this.makeRequest<Agent[]>(
      '/api/agents',           // Mock endpoint
      '/aaa/agents',          // Real endpoint
      'GET',
      undefined,
      'list-agents'
    );
  }

  async getAgent(agentId: string): Promise<Agent> {
    return this.makeRequest<Agent>(
      `/api/agents/${agentId}`,
      `/aaa/agents/${agentId}`,
      'GET',
      undefined,
      `agent-${agentId}`
    );
  }

  async createAgent(request: CreateAgentRequest): Promise<Agent> {
    return this.makeRequest<Agent>(
      '/api/agents',
      '/aaa/agents',
      'POST',
      request,
      `create-agent-${Date.now()}`
    );
  }

  async updateAgent(agentId: string, request: UpdateAgentRequest): Promise<Agent> {
    return this.makeRequest<Agent>(
      `/api/agents/${agentId}`,
      `/aaa/agents/${agentId}`,
      'PUT',
      request,
      `update-agent-${agentId}`
    );
  }

  async deleteAgent(agentId: string): Promise<void> {
    return this.makeRequest<void>(
      `/api/agents/${agentId}`,
      `/aaa/agents/${agentId}`,
      'DELETE',
      undefined,
      `delete-agent-${agentId}`
    );
  }

  async getAgentsBySimulation(simulationId: string): Promise<Agent[]> {
    return this.makeRequest<Agent[]>(
      `/api/simulations/${simulationId}/agents`,
      `/aaa/sim/detail/${simulationId}/agents`,
      'GET',
      undefined,
      `agents-simulation-${simulationId}`
    );
  }

  // ============================================
  // NODE ENDPOINTS
  // ============================================

  async getNodes(): Promise<NetworkNode[]> {
    return this.makeRequest<NetworkNode[]>(
      '/api/nodes',
      '/aaa/nodes',
      'GET',
      undefined,
      'list-nodes'
    );
  }

  async getNode(nodeId: string): Promise<NetworkNode> {
    return this.makeRequest<NetworkNode>(
      `/api/nodes/${nodeId}`,
      `/aaa/nodes/${nodeId}`,
      'GET',
      undefined,
      `node-${nodeId}`
    );
  }

  async createNode(request: CreateNodeRequest): Promise<NetworkNode> {
    return this.makeRequest<NetworkNode>(
      '/api/nodes',
      '/aaa/nodes',
      'POST',
      request,
      `create-node-${Date.now()}`
    );
  }

  async updateNode(nodeId: string, request: UpdateNodeRequest): Promise<NetworkNode> {
    return this.makeRequest<NetworkNode>(
      `/api/nodes/${nodeId}`,
      `/aaa/nodes/${nodeId}`,
      'PUT',
      request,
      `update-node-${nodeId}`
    );
  }

  async deleteNode(nodeId: string): Promise<void> {
    return this.makeRequest<void>(
      `/api/nodes/${nodeId}`,
      `/aaa/nodes/${nodeId}`,
      'DELETE',
      undefined,
      `delete-node-${nodeId}`
    );
  }

  async getNetworkTopology(): Promise<{ nodes: NetworkNode[]; connections: Array<{ from: string; to: string }> }> {
    return this.makeRequest(
      '/api/network/topology',
      '/aaa/network/topology',
      'GET',
      undefined,
      'network-topology'
    );
  }

  // ============================================
  // SIMULATION ENDPOINTS
  // ============================================

  async createSimulation(request: CreateSimulationRequest): Promise<CreateSimulationResponse> {
    // For real API, we need to create the model first, then load it, then run simulation
    if (this.isRealMode) {
      try {
        // Load nodes from localStorage
        const savedNodes = localStorage.getItem('hospital-nodes');
        const savedAgents = localStorage.getItem('agent-config');
        
        if (!savedNodes) {
          throw new ApiError('No nodes configured! Please set up nodes first.');
        }

        if (!savedAgents) {
          throw new ApiError('No agents configured! Please set up agents first.');
        }

        const nodes = JSON.parse(savedNodes);
        const agents = JSON.parse(savedAgents);

        logger.debug('[SIMULATION] Creating simulation model', 'UnifiedApiService', {
          nodeCount: nodes.nodes?.length || 0,
          hasRedAgent: !!agents.redAgent,
          hasBlueAgent: !!agents.blueAgent
        });

        // First, create the SimModel if it doesn't exist
        const modelPayload = {
          name: request.scenario,
          description: `Healthcare cybersecurity simulation model: ${request.scenario}`,
          nodes: (nodes.nodes || []).map((node: any) => ({
            id: node.id,
            name: node.name,
            node_type: node.type === 'Human' ? 'Person' : 'Asset',
            properties: [
              { key: 'type', value: node.type },
              { key: 'services', value: node.services?.join(', ') || 'none' },
              { key: 'capabilities', value: node.capabilities || 'none' },
              { key: 'vulnerabilities', value: node.vulnerabilities || 'none' }
            ],
            services: (node.services || []).map((service: string) => ({ name: service })),
            resources: [],
            constraints: null,
            children: [],
            vulnerabilities: node.vulnerabilities ? [{
              id: `vuln-${node.id}`,
              type: 'software',
              subtype: 'Misconfiguration',
              description: node.vulnerabilities,
              vclass: 'configured',
              outcome_type: 'ProbeSucceeded',
              cost: 1.0,
              granted_access: 'user'
            }] : [],
            firewalls: [],
            importance_score: 1.0,
            reward_score: null,
            credentials: null
          }))
        };

        let modelId: string;

        try {
          // Try to create the model
          logger.debug('[SIMULATION] Creating new SimModel', 'UnifiedApiService', modelPayload);
          const createModelResponse = await this.makeRequest<{id: string}>(
            '/api/simulations/model', // Mock endpoint
            '/aaa/sim/models', // Real API endpoint
            'POST',
            modelPayload,
            `create-model-${Date.now()}`
          );
          
          modelId = createModelResponse.id || request.scenario;
          logger.debug('[SIMULATION] Created SimModel with ID:', modelId);
          
        } catch (modelCreateError: any) {
          // If model creation fails, try to use existing model or fall back
          logger.warn('[SIMULATION] Model creation failed, trying to use existing model', 'UnifiedApiService', {
            error: modelCreateError.message,
            modelName: request.scenario
          });
          modelId = request.scenario;
        }

        // Then, load the model
        const loadPayload = {
          model_id: modelId
        };

        const loadResponse = await this.makeRequest<{sim_id: string}>(
          '/api/simulations/load', // Mock endpoint
          '/aaa/sim/model/load', // Real API endpoint
          'POST',
          loadPayload,
          `load-model-${Date.now()}`
        );

        logger.debug('[SIMULATION] Model loaded successfully', 'UnifiedApiService', loadResponse);

        // Finally, run the simulation
        const runResponse = await this.makeRequest<CreateSimulationResponse>(
          `/api/simulations/run`,
          `/aaa/sim/run`,
          'POST',
          { 
            sim_id: loadResponse.sim_id,
            step_mode: false,
            timestamp: new Date().toISOString()
          },
          `run-simulation-${Date.now()}`
        );

        return {
          id: loadResponse.sim_id,
          status: {
            status: "running" as const,
            progress: 0,
            message: "Simulation started successfully"
          },
          createdAt: new Date().toISOString()
        };
        
      } catch (error: any) {
        // If any step fails, fall back to mock simulation
        logger.warn('[SIMULATION] Backend simulation failed, falling back to mock', 'UnifiedApiService', {
          scenario: request.scenario,
          error: error.message,
          status: error.status
        });
        
        // Generate mock response
        return {
          id: `mock-sim-${Date.now()}`,
          status: {
            status: "running" as const,
            progress: 0,
            message: "Backend unavailable - running local simulation"
          },
          createdAt: new Date().toISOString()
        };
      }
    }

    // Mock API - simple creation
    return this.makeRequest<CreateSimulationResponse>(
      '/api/simulations',
      '/aaa/sim/model/load',
      'POST',
      request,
      `create-simulation-${Date.now()}`
    );
  }

  async getSimulationStatus(simulationId: string): Promise<SimulationStatus> {
    return this.makeRequest<SimulationStatus>(
      `/api/simulations/${simulationId}/status`,
      `/aaa/sim/status/${simulationId}`,
      'GET',
      undefined,
      `status-${simulationId}`
    );
  }

  async getSimulationResult(simulationId: string): Promise<SimulationResult> {
    return this.makeRequest<SimulationResult>(
      `/api/simulations/${simulationId}`,
      `/aaa/sim/detail/${simulationId}`,
      'GET',
      undefined,
      `result-${simulationId}`
    );
  }

  async listSimulations(): Promise<SimulationResult[]> {
    return this.makeRequest<SimulationResult[]>(
      '/api/simulations',
      '/aaa/sim/list',
      'GET',
      undefined,
      'list-simulations'
    );
  }

  async deleteSimulation(simulationId: string): Promise<void> {
    return this.makeRequest<void>(
      `/api/simulations/${simulationId}`,
      `/aaa/sim/${simulationId}`,
      'DELETE',
      undefined,
      `delete-${simulationId}`
    );
  }

  async startSimulation(simulationId: string): Promise<SimulationStatus> {
    // For the new API, simulations are already started when run, so this is a no-op
    // But we return the current status
    return this.getSimulationStatus(simulationId);
  }

  async stopSimulation(simulationId: string): Promise<SimulationStatus> {
    return this.makeRequest<SimulationStatus>(
      `/api/simulations/${simulationId}/stop`,
      `/aaa/sim/stop/${simulationId}`,
      'POST',
      undefined,
      `stop-${simulationId}`
    );
  }

  async getSimulationLogs(simulationId: string): Promise<any[]> {
    if (this.isMockMode) {
      return []; // Mock API doesn't have logs
    }

    return this.makeRequest<any[]>(
      `/api/simulations/${simulationId}/logs`,
      `/aaa/sim/detail/${simulationId}`,
      'GET',
      undefined,
      `logs-${simulationId}`
    );
  }

  // ============================================
  // SCENARIO & MODEL ENDPOINTS
  // ============================================

  async getScenarios(): Promise<string[]> {
    try {
      if (this.isMockMode) {
        // Return mock scenarios
        return ['default-scenario', 'enterprise-network', 'cloud-infrastructure', 'healthcare-network'];
      }

      // For real API, get models from /aaa/sim/models
      const response = await this.makeRequest<any>(
        '/api/scenarios',
        '/aaa/sim/models',
        'GET',
        undefined,
        'list-scenarios'
      );

      logger.debug('[SCENARIOS] Raw response from /aaa/sim/models:', 'UnifiedApiService', response);

      // Extract scenario names from models response
      const scenarios = Array.isArray(response) ? response : 
                       response.models ? response.models :
                       response.scenarios ? response.scenarios :
                       Object.keys(response).filter(key => typeof response[key] === 'object');

      // Add local setup scenario if nodes are configured
      const savedNodes = localStorage.getItem('hospital-nodes');
      if (savedNodes) {
        scenarios.unshift('local-hospital-setup');
      }

      logger.debug('[SCENARIOS] Processed scenarios:', 'UnifiedApiService', scenarios);
      return scenarios;

    } catch (error) {
      logger.error('[SCENARIOS] Failed to fetch scenarios, using fallback', 'UnifiedApiService', error);
      
      // Fallback scenarios
      const fallbackScenarios = ['default-scenario', 'enterprise-network', 'cloud-infrastructure'];
      
      // Add local setup if available
      const savedNodes = localStorage.getItem('hospital-nodes');
      if (savedNodes) {
        fallbackScenarios.unshift('local-hospital-setup');
      }
      
      return fallbackScenarios;
    }
  }

  async getSupportedModels(): Promise<string[]> {
    try {
      if (this.isMockMode) {
        return [
          'anthropic.claude-3-sonnet-20240229-v1:0',
          'cohere.command-r-plus',
          'anthropic.claude-3-haiku-20240307-v1:0'
        ];
      }

      const response = await this.makeRequest<string[]>(
        '/api/models',
        '/aaa/providers',
        'GET',
        undefined,
        'supported-models'
      );

      return Array.isArray(response) ? response : Object.keys(response);

    } catch (error) {
      logger.error('[MODELS] Failed to fetch supported models, using fallback', 'UnifiedApiService', error);
      
      // Return backend-supported models as fallback
      return [
        'anthropic.claude-3-sonnet-20240229-v1:0',
        'cohere.command-r-plus',
        'anthropic.claude-3-haiku-20240307-v1:0',
        'anthropic.claude-3-opus-20240229-v1:0'
      ];
    }
  }

  // ============================================
  // HEALTH & SYSTEM ENDPOINTS
  // ============================================

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest<{ status: string; timestamp: string }>(
      '/api/health',
      '/aaa/health',
      'GET',
      undefined,
      'health-check'
    );
  }

  // ============================================
  // API DOCUMENTATION
  // ============================================

  getApiDocumentation() {
    if (this.isMockMode) {
      return null;
    }

    return {
      swagger: `${environment.apiBaseUrl}/docs`,
      redoc: `${environment.apiBaseUrl}/redoc`,
      openapi: `${environment.apiBaseUrl}/openapi.json`,
    };
  }

  // ============================================
  // ENVIRONMENT INFO
  // ============================================

  getEnvironmentInfo() {
    return {
      mode: this.isMockMode ? 'mock' : 'real',
      apiBaseUrl: environment.apiBaseUrl,
      isDevelopment: environment.isDevelopment,
      isProduction: environment.isProduction
    };
  }
}

export const unifiedApiService = new UnifiedApiService();
export { UnifiedApiService };