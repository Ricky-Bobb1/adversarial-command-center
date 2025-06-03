
import { SIMULATION_CONSTANTS, OUTCOME_INDICATORS } from "@/constants/simulation";
import { validateLogEntry } from "@/utils/validation";
import type { 
  LogEntry, 
  SimulationLogTemplate, 
  SimulationMetrics, 
  AgentType 
} from "@/types/simulation";

const sampleLogs: SimulationLogTemplate[] = [
  { agent: "System", action: "Simulation initialized", outcome: "Ready" },
  { agent: "Red", action: "Network reconnaissance", outcome: "Discovered 15 active hosts" },
  { agent: "Blue", action: "Anomaly detection activated", outcome: "Monitoring network traffic" },
  { agent: "Red", action: "Port scanning target", outcome: "Found open ports 22, 80, 443" },
  { agent: "Blue", action: "Port scan detected", outcome: "Alert triggered" },
  { agent: "Red", action: "SQL injection attempt", outcome: "Vulnerability exploited" },
  { agent: "Blue", action: "Database monitoring", outcome: "Suspicious queries detected" },
  { agent: "Red", action: "Privilege escalation", outcome: "Admin access gained" },
  { agent: "Blue", action: "User behavior analysis", outcome: "Unusual activity flagged" },
  { agent: "Red", action: "Data exfiltration", outcome: "Patient records accessed" },
  { agent: "Blue", action: "Data loss prevention", outcome: "Transfer blocked" },
  { agent: "Red", action: "Lateral movement", outcome: "Accessed medical devices" },
  { agent: "Blue", action: "Network segmentation", outcome: "Critical systems isolated" },
  { agent: "System", action: "Simulation completed", outcome: "Report generated" }
];

export class SimulationLogic {
  static generateTimestamp(): string {
    return new Date().toLocaleTimeString();
  }

  static createLogEntry(logTemplate: SimulationLogTemplate): LogEntry {
    const entry: LogEntry = {
      ...logTemplate,
      timestamp: this.generateTimestamp()
    };
    
    if (!validateLogEntry(entry)) {
      throw new Error("Invalid log entry created");
    }
    
    return entry;
  }

  static getSampleLogs(): SimulationLogTemplate[] {
    return [...sampleLogs];
  }

  static validateScenario(scenario: string): boolean {
    return scenario.trim().length >= SIMULATION_CONSTANTS.MIN_SCENARIO_NAME_LENGTH;
  }

  static calculateSimulationDuration(logs: LogEntry[]): number {
    if (logs.length < 2) return 0;
    
    const firstLog = logs[0];
    const lastLog = logs[logs.length - 1];
    
    const firstTime = new Date(`2000-01-01 ${firstLog.timestamp}`);
    const lastTime = new Date(`2000-01-01 ${lastLog.timestamp}`);
    
    return Math.abs(lastTime.getTime() - firstTime.getTime()) / 1000;
  }

  static getSimulationProgress(currentLogIndex: number, totalLogs: number): number {
    if (totalLogs === 0) return 0;
    return Math.round((currentLogIndex / totalLogs) * 100);
  }

  static calculateMetrics(logs: LogEntry[]): SimulationMetrics {
    const redActions = logs.filter(log => log.agent === "Red").length;
    const blueActions = logs.filter(log => log.agent === "Blue").length;
    const systemEvents = logs.filter(log => log.agent === "System").length;
    
    const successfulBlocks = logs.filter(log => 
      log.agent === "Blue" && 
      OUTCOME_INDICATORS.POSITIVE.some(keyword => 
        log.outcome.toLowerCase().includes(keyword)
      )
    ).length;
    
    const successfulAttacks = logs.filter(log => 
      log.agent === "Red" && 
      OUTCOME_INDICATORS.NEGATIVE.some(keyword => 
        log.outcome.toLowerCase().includes(keyword)
      )
    ).length;
    
    return {
      totalLogs: logs.length,
      redActions,
      blueActions,
      systemEvents,
      duration: this.calculateSimulationDuration(logs),
      successfulBlocks,
      successfulAttacks,
    };
  }

  static isOutcomePositive(outcome: string, agent: AgentType): boolean {
    const lowerOutcome = outcome.toLowerCase();
    
    if (agent === "Red") {
      return OUTCOME_INDICATORS.NEGATIVE.some(keyword => 
        lowerOutcome.includes(keyword)
      );
    } else if (agent === "Blue") {
      return OUTCOME_INDICATORS.POSITIVE.some(keyword => 
        lowerOutcome.includes(keyword)
      );
    }
    
    return false;
  }
}
