import type { LogEntry, SimulationMetrics } from '../types/simulation';

interface SimulationResultData {
  logs: LogEntry[];
  metrics?: SimulationMetrics;
  timestamp: string;
  scenario: string;
}

class SimulationResultsService {
  private storageKey = 'simulation-results';
  
  // Save simulation results to localStorage
  saveResults(data: SimulationResultData): void {
    try {
      console.log('Saving simulation results:', {
        logsCount: data.logs.length,
        scenario: data.scenario,
        timestamp: data.timestamp,
        metrics: data.metrics
      });
      
      const existingResults = this.getAllResults();
      const newResults = [data, ...existingResults.slice(0, 9)]; // Keep last 10 results
      localStorage.setItem(this.storageKey, JSON.stringify(newResults));
      
      console.log('Successfully saved simulation results. Total saved:', newResults.length);
    } catch (error) {
      console.error('Failed to save simulation results:', error);
    }
  }

  // Get all saved simulation results
  getAllResults(): SimulationResultData[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      const results = data ? JSON.parse(data) : [];
      console.log('Loaded simulation results from storage:', results.length);
      return results;
    } catch (error) {
      console.error('Failed to load simulation results:', error);
      return [];
    }
  }

  // Get the latest simulation result
  getLatestResult(): SimulationResultData | null {
    const results = this.getAllResults();
    const latest = results.length > 0 ? results[0] : null;
    console.log('Latest simulation result:', latest ? `${latest.logs.length} logs from ${latest.scenario}` : 'none');
    return latest;
  }

  // Calculate metrics from logs
  calculateMetrics(logs: LogEntry[]): SimulationMetrics {
    const redActions = logs.filter(log => log.agent === 'Red').length;
    const blueActions = logs.filter(log => log.agent === 'Blue').length;
    const systemEvents = logs.filter(log => log.agent === 'System').length;
    
    // Simple success calculation based on log outcomes
    const successfulAttacks = logs.filter(log => 
      log.agent === 'Red' && log.outcome.toLowerCase().includes('success')
    ).length;
    const successfulBlocks = logs.filter(log => 
      log.agent === 'Blue' && log.outcome.toLowerCase().includes('success')
    ).length;

    return {
      totalLogs: logs.length,
      redActions,
      blueActions,
      systemEvents,
      duration: logs.length * 2, // Rough duration calculation
      successfulAttacks,
      successfulBlocks,
    };
  }
}

export const simulationResultsService = new SimulationResultsService();
