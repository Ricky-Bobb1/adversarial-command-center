
import { SIMULATION_CONSTANTS } from "@/constants/simulation";
import type { SimulationValidationResult } from "@/types/simulation";

export const validateScenario = (scenario: string): SimulationValidationResult => {
  const errors: string[] = [];
  
  if (!scenario || typeof scenario !== "string") {
    errors.push("Scenario is required");
  } else {
    const trimmedScenario = scenario.trim();
    
    if (trimmedScenario.length < SIMULATION_CONSTANTS.MIN_SCENARIO_NAME_LENGTH) {
      errors.push("Scenario name cannot be empty");
    }
    
    if (trimmedScenario.length > SIMULATION_CONSTANTS.MAX_SCENARIO_NAME_LENGTH) {
      errors.push(`Scenario name cannot exceed ${SIMULATION_CONSTANTS.MAX_SCENARIO_NAME_LENGTH} characters`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateLogEntry = (log: any): log is import("@/types/simulation").LogEntry => {
  return (
    log &&
    typeof log.timestamp === "string" &&
    typeof log.action === "string" &&
    typeof log.outcome === "string" &&
    ["Red", "Blue", "System"].includes(log.agent)
  );
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, "");
};
