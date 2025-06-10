
import { simulationResultsService } from './simulationResultsService';

interface NodeConfig {
  id: string;
  name: string;
  type: string;
  services: string[];
  vulnerabilities: string;
  capabilities: string;
}

interface AgentConfig {
  redAgent: {
    model: string;
    strategies: string[];
  };
  blueAgent: {
    model: string;
    strategies: string[];
  };
  humanInTheLoop: boolean;
}

class SimulationConfigService {
  // Get configured nodes from localStorage
  getConfiguredNodes(): NodeConfig[] {
    try {
      const data = localStorage.getItem('nodes-configuration');
      if (data) {
        const parsed = JSON.parse(data);
        return parsed.nodes || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to load node configuration:', error);
      return [];
    }
  }

  // Get configured agents from localStorage
  getConfiguredAgents(): AgentConfig | null {
    try {
      const data = localStorage.getItem('agent-configuration');
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch (error) {
      console.error('Failed to load agent configuration:', error);
      return null;
    }
  }

  // Generate dynamic simulation logs based on configured nodes and agents
  generateDynamicLogs(scenario: string): any[] {
    const nodes = this.getConfiguredNodes();
    const agents = this.getConfiguredAgents();
    
    if (nodes.length === 0) {
      console.warn('No nodes configured, using fallback logs');
      return this.getFallbackLogs();
    }

    const logs: any[] = [];
    const redStrategies = agents?.redAgent.strategies || ['Generic Attack'];
    const blueStrategies = agents?.blueAgent.strategies || ['Generic Defense'];
    
    // Generate initial reconnaissance logs
    logs.push({
      id: `log-${Date.now()}-1`,
      timestamp: new Date().toISOString(),
      agent: 'Red',
      action: 'Network Reconnaissance',
      target: 'Hospital Network',
      outcome: `Discovered ${nodes.length} nodes: ${nodes.map(n => n.name).join(', ')}`,
      severity: 'info'
    });

    // Generate logs targeting specific configured nodes
    nodes.forEach((node, index) => {
      const strategy = redStrategies[index % redStrategies.length];
      const vulnerability = node.vulnerabilities || 'Unknown vulnerabilities';
      
      // Red team attack
      logs.push({
        id: `log-${Date.now()}-${index * 2 + 2}`,
        timestamp: new Date().toISOString(),
        agent: 'Red',
        action: strategy,
        target: node.name,
        outcome: `Targeting ${node.type} running ${node.services.join(', ')}. ${vulnerability}`,
        severity: Math.random() > 0.3 ? 'high' : 'medium'
      });

      // Blue team response
      const blueStrategy = blueStrategies[index % blueStrategies.length];
      logs.push({
        id: `log-${Date.now()}-${index * 2 + 3}`,
        timestamp: new Date().toISOString(),
        agent: 'Blue',
        action: blueStrategy,
        target: node.name,
        outcome: `Implementing ${blueStrategy} on ${node.name}`,
        severity: 'info'
      });
    });

    return logs;
  }

  // Fallback logs when no configuration is available
  private getFallbackLogs(): any[] {
    return [
      {
        id: `log-${Date.now()}-fallback-1`,
        timestamp: new Date().toISOString(),
        agent: 'System',
        action: 'Configuration Warning',
        target: 'Simulation',
        outcome: 'No nodes or agents configured. Please configure infrastructure in Setup and agents in Agents pages.',
        severity: 'warning'
      }
    ];
  }

  // Check if system is properly configured
  isSystemConfigured(): { configured: boolean; missingItems: string[] } {
    const nodes = this.getConfiguredNodes();
    const agents = this.getConfiguredAgents();
    const missingItems: string[] = [];

    if (nodes.length === 0) {
      missingItems.push('Hospital infrastructure nodes (Setup page)');
    }

    if (!agents || !agents.redAgent.model || !agents.blueAgent.model) {
      missingItems.push('Agent models (Agents page)');
    }

    return {
      configured: missingItems.length === 0,
      missingItems
    };
  }
}

export const simulationConfigService = new SimulationConfigService();
