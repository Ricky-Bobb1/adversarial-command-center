
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square, RotateCcw, Settings } from "lucide-react";

const RunSimulation = () => {
  const runningSimulations = [
    { id: 1, name: "Adversarial Training Scenario #234", status: "Running", progress: 67, duration: "15:32" },
    { id: 2, name: "Defense Stress Test #445", status: "Running", progress: 23, duration: "5:12" },
    { id: 3, name: "Multi-Agent Coordination Test", status: "Queued", progress: 0, duration: "0:00" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Run Simulation</h1>
          <p className="text-gray-600 mt-2">Execute and monitor adversarial AI simulations</p>
        </div>
        <Button className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          New Simulation
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Simulations</CardTitle>
            <CardDescription>Currently running and queued simulations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {runningSimulations.map((sim) => (
              <div key={sim.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{sim.name}</h3>
                  <Badge 
                    variant={sim.status === "Running" ? "default" : "secondary"}
                    className={sim.status === "Running" ? "bg-green-100 text-green-800" : ""}
                  >
                    {sim.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span>Duration: {sim.duration}</span>
                  <span>Progress: {sim.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${sim.progress}%` }}
                  ></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Square className="h-3 w-3 mr-1" />
                    Stop
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="h-3 w-3 mr-1" />
                    Configure
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common simulation tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start">
                <Play className="h-4 w-4 mr-2" />
                Start Standard Test
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart Last Simulation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Custom Configuration
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Resources</CardTitle>
              <CardDescription>Current usage and availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>CPU Usage</span>
                  <span>72%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "72%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Memory</span>
                  <span>45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "45%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Network</span>
                  <span>28%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RunSimulation;
