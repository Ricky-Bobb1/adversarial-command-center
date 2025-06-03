
export interface SimulationConfig {
  scenario: string;
  duration_minutes: number;
  agent_count: number;
  network_topology: 'star' | 'mesh' | 'ring' | 'tree';
  attack_intensity: 'low' | 'medium' | 'high';
  defense_enabled: boolean;
}

export interface SimulationStatus {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  start_time?: string;
  end_time?: string;
  message?: string;
}

export interface SimulationResult {
  id: string;
  config: SimulationConfig;
  status: SimulationStatus;
  metrics: {
    attacks_detected: number;
    attacks_blocked: number;
    false_positives: number;
    system_performance: number;
    network_latency: number;
  };
  timeline: Array<{
    timestamp: string;
    event_type: 'attack' | 'defense' | 'system';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }>;
  created_at: string;
}

export interface CreateSimulationRequest {
  config: SimulationConfig;
}

export interface CreateSimulationResponse {
  simulation_id: string;
  status: SimulationStatus;
}
