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
    // For real API, we need to load the model first, then run simulation
    if (this.isRealMode) {
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

      logger.debug('[SIMULATION] Loading model with nodes and agents', 'UnifiedApiService', {
        nodeCount: nodes.nodes?.length || 0,
        hasRedAgent: !!agents.redAgent,
        hasBlueAgent: !!agents.blueAgent
      });

      // First, load the model
      const loadPayload = {
        model_id: request.scenario,  // API expects model_id, not model_name
        model_name: request.scenario,
        nodes: nodes.nodes || [],
        red_agent: agents.redAgent || {},
        blue_agent: agents.blueAgent || {}
      };

      await this.makeRequest(
        '/api/simulations',  // Mock would create simulation directly
        '/aaa/sim/model/load',  // Real API loads model first
        'POST',
        loadPayload,
        `load-model-${Date.now()}`
      );

      // Then run the simulation
      const runResponse = await this.makeRequest<CreateSimulationResponse>(
        `/api/simulations/run`,
        `/aaa/sim/run`,
        'POST',
        { 
          model_id: request.scenario,
          model_name: request.scenario 
        },
        `run-simulation-${Date.now()}`
      );

      return runResponse;
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
    return this.makeRequest<SimulationStatus>(
      `/api/simulations/${simulationId}/start`,
      `/aaa/sim/start/${simulationId}`,
      'POST',
      undefined,
      `start-${simulationId}`
    );
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