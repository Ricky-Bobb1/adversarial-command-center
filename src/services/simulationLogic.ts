
interface LogEntry {
  timestamp: string;
  agent: "Red" | "Blue" | "System";
  action: string;
  outcome: string;
}

const sampleLogs: Omit<LogEntry, 'timestamp'>[] = [
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

  static createLogEntry(logTemplate: Omit<LogEntry, 'timestamp'>): LogEntry {
    return {
      ...logTemplate,
      timestamp: this.generateTimestamp()
    };
  }

  static getSampleLogs(): Omit<LogEntry, 'timestamp'>[] {
    return [...sampleLogs];
  }

  static validateScenario(scenario: string): boolean {
    return scenario.trim().length > 0;
  }

  static calculateSimulationDuration(logs: LogEntry[]): number {
    if (logs.length < 2) return 0;
    
    const firstLog = logs[0];
    const lastLog = logs[logs.length - 1];
    
    const firstTime = new Date(`2000-01-01 ${firstLog.timestamp}`);
    const lastTime = new Date(`2000-01-01 ${lastLog.timestamp}`);
    
    return Math.abs(lastTime.getTime() - firstTime.getTime()) / 1000; // in seconds
  }

  static getSimulationProgress(currentLogIndex: number, totalLogs: number): number {
    return Math.round((currentLogIndex / totalLogs) * 100);
  }
}
