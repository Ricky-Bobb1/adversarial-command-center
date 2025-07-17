import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Play } from "lucide-react";
import { useAppState } from "@/contexts/AppStateContext";
import { useNavigate } from "react-router-dom";

export const SimulationReadinessCheck = () => {
  const { state } = useAppState();
  const navigate = useNavigate();

  const checks = [
    {
      id: "nodes",
      label: "Hospital Network Nodes",
      description: "At least 3 nodes configured (Human, Software, Hardware)",
      status: state.hospitalNodes.length >= 3,
      count: state.hospitalNodes.length,
      action: () => navigate("/setup")
    },
    {
      id: "node-types",
      label: "Node Type Diversity",
      description: "Mix of Human, Software, and Hardware nodes",
      status: new Set(state.hospitalNodes.map(n => n.type)).size >= 2,
      count: new Set(state.hospitalNodes.map(n => n.type)).size,
      action: () => navigate("/setup")
    },
    {
      id: "vulnerabilities",
      label: "Security Vulnerabilities",
      description: "Nodes have defined vulnerabilities for simulation",
      status: state.hospitalNodes.some(n => n.vulnerabilities && n.vulnerabilities.length > 0),
      count: state.hospitalNodes.filter(n => n.vulnerabilities && n.vulnerabilities.length > 0).length,
      action: () => navigate("/setup")
    },
    {
      id: "red-agent",
      label: "Red Agent (Attacker)",
      description: "AI model and strategies configured",
      status: !!(state.agentConfig?.redAgent?.model && state.agentConfig?.redAgent?.strategy),
      count: state.agentConfig?.redAgent?.model ? 1 : 0,
      action: () => navigate("/agents")
    },
    {
      id: "blue-agent", 
      label: "Blue Agent (Defender)",
      description: "AI model and strategies configured",
      status: !!(state.agentConfig?.blueAgent?.model && state.agentConfig?.blueAgent?.strategy),
      count: state.agentConfig?.blueAgent?.model ? 1 : 0,
      action: () => navigate("/agents")
    }
  ];

  const allReady = checks.every(check => check.status);
  const readyCount = checks.filter(check => check.status).length;

  return (
    <Card className={`border-2 ${allReady ? 'border-green-200 bg-green-50/30' : 'border-orange-200 bg-orange-50/30'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {allReady ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-orange-600" />
          )}
          Simulation Readiness Check
        </CardTitle>
        <CardDescription>
          Verify your hospital network and AI agents are properly configured for cybersecurity simulation
        </CardDescription>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant={allReady ? "default" : "secondary"} className={allReady ? "bg-green-100 text-green-800" : ""}>
            {readyCount}/{checks.length} Ready
          </Badge>
          {allReady && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              ✓ Backend API Compatible
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {checks.map((check) => (
            <div key={check.id} className="flex items-center justify-between p-3 rounded-lg border bg-white">
              <div className="flex items-center gap-3">
                {check.status ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <div>
                  <div className="font-medium text-sm">{check.label}</div>
                  <div className="text-xs text-gray-500">{check.description}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {check.count}
                </Badge>
                {!check.status && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={check.action}
                    className="text-xs"
                  >
                    Configure
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {allReady && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-green-800">🎯 Ready for Simulation!</div>
                <div className="text-sm text-green-600 mt-1">
                  Your hospital network and AI agents are configured. Start an adversarial simulation now.
                </div>
              </div>
              <Button onClick={() => navigate("/run")} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Run Simulation
              </Button>
            </div>
          </div>
        )}

        {!allReady && (
          <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="font-medium text-orange-800">⚠️ Configuration Incomplete</div>
            <div className="text-sm text-orange-600 mt-1">
              Complete the missing configurations above to enable simulation execution.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};