import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

const DemoToggle = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    // Check if demo data exists in localStorage
    const demoNodes = localStorage.getItem('demo-hospital-nodes');
    const demoAgents = localStorage.getItem('demo-agent-config');
    setIsDemoMode(!!demoNodes && !!demoAgents);
  }, []);

  const handleToggleDemo = (enabled: boolean) => {
    setIsDemoMode(enabled);
    
    if (enabled) {
      // Load demo data
      const demoNodes = {
        nodes: [
          {
            id: "demo_001",
            name: "EMR Database Server", 
            type: "Asset",
            services: ["MySQL", "Apache", "EMR System"],
            vulnerabilities: "CVE-2024-1234, SQL injection vulnerability",
            capabilities: "Stores patient records, medical histories, treatment plans"
          },
          {
            id: "demo_002",
            name: "MRI Machine Workstation",
            type: "Asset", 
            services: ["DICOM", "Windows 10", "Remote Desktop"],
            vulnerabilities: "CVE-2024-2345, Unpatched RDP vulnerability",
            capabilities: "Controls MRI operations, accesses imaging data"
          },
          {
            id: "demo_003",
            name: "Dr. Sarah Wilson",
            type: "Human",
            services: ["Email", "VPN Access", "Clinical Systems"],
            vulnerabilities: "Social engineering susceptible",
            capabilities: "Senior physician with elevated privileges"
          },
          {
            id: "demo_004",
            name: "Pharmacy Management System",
            type: "Asset",
            services: ["Pharmacy DB", "Prescription System"],
            vulnerabilities: "CVE-2024-3456, Default credentials",
            capabilities: "Manages drug inventory and prescriptions"
          },
          {
            id: "demo_005",
            name: "Network Firewall Gateway",
            type: "Asset",
            services: ["Firewall", "VPN Gateway", "IDS"],
            vulnerabilities: "Misconfigured firewall rules",
            capabilities: "Network traffic control and monitoring"
          },
          {
            id: "demo_006",
            name: "Patient Portal Web Server",
            type: "Asset",
            services: ["Web Server", "API Service", "Authentication"],
            vulnerabilities: "CVE-2024-7890, Cross-site scripting",
            capabilities: "Patient portal and mobile API access"
          }
        ]
      };

      const demoAgents = {
        redAgent: {
          model: "Advanced Persistent Threat Simulator",
          strategies: ["SQL Injection", "Social Engineering", "Privilege Escalation", "Lateral Movement", "Data Exfiltration"],
          description: "Sophisticated red team agent for multi-stage attacks"
        },
        blueAgent: {
          model: "Cyber Defense Coordinator", 
          strategies: ["Anomaly Detection", "Incident Response", "Threat Hunting", "System Hardening", "Recovery Coordination"],
          description: "Advanced blue team agent for threat detection and response"
        },
        humanInTheLoop: true
      };

      // Save to localStorage with demo prefixes
      localStorage.setItem('demo-hospital-nodes', JSON.stringify(demoNodes));
      localStorage.setItem('demo-agent-config', JSON.stringify(demoAgents));
      
      // Also set as current config for immediate use
      localStorage.setItem('hospital-nodes', JSON.stringify(demoNodes));
      localStorage.setItem('agent-config', JSON.stringify(demoAgents));
      
    } else {
      // Remove demo data
      localStorage.removeItem('demo-hospital-nodes');
      localStorage.removeItem('demo-agent-config');
      
      // Keep user's original config if it exists
      const originalNodes = localStorage.getItem('original-hospital-nodes');
      const originalAgents = localStorage.getItem('original-agent-config');
      
      if (originalNodes) {
        localStorage.setItem('hospital-nodes', originalNodes);
      } else {
        localStorage.removeItem('hospital-nodes');
      }
      
      if (originalAgents) {
        localStorage.setItem('agent-config', originalAgents);
      } else {
        localStorage.removeItem('agent-config');
      }
    }
    
    // Refresh page to load new configuration
    window.location.reload();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Demo Mode</CardTitle>
            <Badge variant={isDemoMode ? "default" : "secondary"}>
              {isDemoMode ? "Active" : "Inactive"}
            </Badge>
          </div>
          <Switch
            checked={isDemoMode}
            onCheckedChange={handleToggleDemo}
            aria-label="Toggle demo mode"
          />
        </div>
        <CardDescription>
          Use pre-configured healthcare simulation scenarios with 6 nodes and advanced AI agents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            {isDemoMode ? (
              <div className="space-y-2">
                <p><strong>Demo environment loaded:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>6 healthcare network nodes (EMR, MRI, Pharmacy, etc.)</li>
                  <li>Advanced red & blue AI agents with realistic strategies</li>
                  <li>Pre-configured vulnerabilities and attack scenarios</li>
                  <li>Ready-to-run simulation scenarios</li>
                </ul>
              </div>
            ) : (
              <p>
                Enable demo mode to load a complete healthcare cybersecurity simulation environment. 
                Perfect for testing the platform or demonstrating capabilities.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoToggle;
