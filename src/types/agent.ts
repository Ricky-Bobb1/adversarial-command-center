
export interface Agent {
  id: string;
  name: string;
  type: 'attacker' | 'defender' | 'neutral';
  capabilities: string[];
  status: 'active' | 'inactive' | 'compromised';
  position: {
    x: number;
    y: number;
  };
  config: {
    aggression_level?: number;
    detection_threshold?: number;
    response_time?: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateAgentRequest {
  name: string;
  type: Agent['type'];
  capabilities: string[];
  config: Agent['config'];
  position?: Agent['position'];
}

export interface UpdateAgentRequest extends Partial<CreateAgentRequest> {
  status?: Agent['status'];
}
