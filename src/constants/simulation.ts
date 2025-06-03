
export const SIMULATION_CONSTANTS = {
  LOG_INTERVAL_MS: 1500,
  MAX_SCENARIO_NAME_LENGTH: 100,
  MIN_SCENARIO_NAME_LENGTH: 1,
  DEFAULT_LOG_COUNT: 14,
  POLLING_INTERVAL_MS: 2000,
} as const;

export const AGENT_COLORS = {
  Red: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
  },
  Blue: {
    bg: "bg-blue-100", 
    text: "text-blue-800",
    border: "border-blue-200",
  },
  System: {
    bg: "bg-gray-100",
    text: "text-gray-800", 
    border: "border-gray-200",
  },
} as const;

export const OUTCOME_INDICATORS = {
  POSITIVE: ["blocked", "detected", "prevented", "isolated", "ready", "complete"],
  NEGATIVE: ["exploited", "gained", "accessed", "compromised"],
} as const;

export const TOAST_MESSAGES = {
  SIMULATION_STARTED: "Simulation Started",
  SIMULATION_COMPLETE: "Simulation Complete", 
  SIMULATION_STOPPED: "Simulation Stopped",
  SIMULATION_RESET: "Simulation Reset",
  SCENARIO_REQUIRED: "Scenario Required",
  FAILED_TO_START: "Failed to Start Simulation",
  FAILED_TO_LOAD_SCENARIOS: "Failed to Load Scenarios",
} as const;
