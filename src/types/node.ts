
export interface NetworkNode {
  id: string;
  name: string;
  type: 'server' | 'workstation' | 'router' | 'firewall' | 'database';
  ip_address: string;
  status: 'online' | 'offline' | 'compromised' | 'under_attack';
  security_level: 'low' | 'medium' | 'high';
  vulnerabilities: string[];
  connections: string[]; // Array of connected node IDs
  position: {
    x: number;
    y: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateNodeRequest {
  name: string;
  type: NetworkNode['type'];
  ip_address: string;
  security_level: NetworkNode['security_level'];
  vulnerabilities?: string[];
  position?: NetworkNode['position'];
}

export interface UpdateNodeRequest extends Partial<CreateNodeRequest> {
  status?: NetworkNode['status'];
  connections?: string[];
}
