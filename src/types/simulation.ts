
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
