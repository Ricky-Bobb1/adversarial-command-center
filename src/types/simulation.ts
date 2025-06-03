
export interface SimulationResult {
  id: string;
  name: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  scenario: string;
  agents: string[];
  network_nodes: string[];
  results?: {
    summary: string;
    vulnerabilities_found: number;
    attacks_successful: number;
    defenses_triggered: number;
    duration_seconds: number;
  };
  logs: Array<{
    timestamp: string;
    agent_id: string;
    action: string;
    outcome: string;
    severity: 'info' | 'warning' | 'error';
  }>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface SimulationStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress_percentage: number;
  current_phase: string;
  estimated_completion?: string;
  error_message?: string;
}

export interface CreateSimulationRequest {
  name: string;
  description?: string;
  scenario: string;
  agent_ids: string[];
  network_node_ids: string[];
  config?: {
    duration_limit?: number;
    auto_stop_conditions?: string[];
  };
}

export interface CreateSimulationResponse {
  id: string;
  status: SimulationStatus['status'];
  message: string;
}
