
export interface LogEntry {
  timestamp: string;
  agent: "Red" | "Blue" | "System";
  action: string;
  outcome: string;
}

export interface SimulationConfig {
  scenario: string;
  duration?: number;
  intensity?: "low" | "medium" | "high";
}

export interface SimulationMetrics {
  totalLogs: number;
  redActions: number;
  blueActions: number;
  systemEvents: number;
  duration: number;
  successfulBlocks: number;
  successfulAttacks: number;
}

export interface SimulationState {
  isRunning: boolean;
  logs: LogEntry[];
  selectedScenario: string;
  scenarios: string[];
  isLoadingScenarios: boolean;
  error: string | null;
  metrics?: SimulationMetrics;
}

export type AgentType = "Red" | "Blue" | "System";

export interface SimulationLogTemplate {
  agent: AgentType;
  action: string;
  outcome: string;
}

export interface SimulationValidationResult {
  isValid: boolean;
  errors: string[];
}

// API related types for simulation service
export interface CreateSimulationRequest {
  scenario: string;
  config?: SimulationConfig;
}

export interface CreateSimulationResponse {
  id: string;
  status: SimulationStatus;
  createdAt: string;
}

export interface SimulationResult {
  id: string;
  scenario: string;
  status: SimulationStatus;
  logs: LogEntry[];
  metrics?: SimulationMetrics;
  createdAt: string;
  completedAt?: string;
}

export interface SimulationStatus {
  status: "pending" | "running" | "completed" | "failed";
  progress?: number;
  message?: string;
}
